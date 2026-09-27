#!/usr/bin/env bash
# Deploys the site and the API on the production server, from GitHub:
#   bash ~/mitec.team/server/scripts/deploy.sh [branch]      (default: main)
#
# 1. fast-forwards the checkout to origin/<branch> (refuses local changes)
# 2. backs up the database and uploads (scripts/backup.sh)
# 3. installs dependencies and runs migrations
# 4. restarts the API (pm2 "mitec-api") and waits for /health
# 5. copies the site to the web root, switched from mock data to the API
#
# Needs no sudo. Stops at the first failure; nothing after it runs.
set -euo pipefail

# Everything is inside main(): `git pull` below rewrites this very file, and
# bash reads a script as it runs it. Parsing the whole function first means
# the new version on disk can't change what this run does halfway through.
main() {
  local branch="${1:-main}"
  local repo="${REPO:-$HOME/mitec.team}"
  local web_root="${WEB_ROOT:-/var/www/portfolio}"
  local api="http://127.0.0.1:4000"
  step() { echo; echo "== $*"; }

  cd "$repo"
  step "1/5 code: origin/$branch"
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Local changes in $repo — commit or discard them first:" >&2
    git status --short >&2
    exit 1
  fi
  git fetch --quiet origin
  git checkout --quiet "$branch"
  local before after
  before=$(git rev-parse --short HEAD)
  git merge --ff-only --quiet "origin/$branch"
  after=$(git rev-parse --short HEAD)
  echo "$before -> $after"
  git log --oneline "$before..$after" | sed 's/^/   /'

  step "2/5 backup before migrating"
  bash "$repo/server/scripts/backup.sh"

  step "3/5 dependencies and migrations"
  cd "$repo/server"
  npm ci --omit=dev --no-audit --no-fund --loglevel=error
  npm run --silent migrate

  step "4/5 restart the API"
  pm2 restart mitec-api --update-env >/dev/null
  local ok=""
  for _ in $(seq 1 20); do
    if curl -fsS "$api/health" >/dev/null 2>&1; then ok=1; break; fi
    sleep 1
  done
  if [[ -z $ok ]]; then
    echo "The API did not come back on $api/health. Last log lines:" >&2
    pm2 logs mitec-api --lines 30 --nostream >&2 || true
    exit 1
  fi
  echo "healthy"

  step "5/5 site -> $web_root"
  rsync -a --delete --exclude='*.md' --exclude='*.dc.html' --exclude='uploads/' \
    "$repo/project/" "$web_root/"
  # The repository keeps the site on mock data; production talks to the API
  # through nginx's /api/.
  local config="$web_root/src/config/app.config.js"
  sed -i -E "s/(USE_MOCK:[[:space:]]*)true/\1false/" "$config"
  if ! grep -Eq "USE_MOCK:[[:space:]]*false" "$config" || ! grep -Eq "API_BASE_URL:[[:space:]]*'/api'" "$config"; then
    echo "$config is not set to USE_MOCK: false with API_BASE_URL '/api' — the site would not reach the API." >&2
    exit 1
  fi

  echo
  echo "Deployed $after."
}

main "$@"
