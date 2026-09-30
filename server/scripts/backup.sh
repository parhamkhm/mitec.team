#!/usr/bin/env bash
# Nightly backup of the mitec database and the uploaded files.
#
# Crontab line (run through `bash` explicitly, so a lost executable bit can't
# silently stop backups):
#   30 3 * * * bash /home/claude/mitec.team/server/scripts/backup.sh >> /home/claude/backups/mitec-backup.log 2>&1
#
# Reads DATABASE_URL and UPLOAD_DIR from server/.env. The password goes to
# pg_dump through PGPASSWORD, never on a command line other users could see.
# Backups hold customers' phone numbers, so they are written readable by
# this user only. Restore: see server/README.md.
set -euo pipefail

SERVER_DIR="${SERVER_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups}"
KEEP="${KEEP:-14}"
TS=$(date +%Y%m%d-%H%M%S)

env_value() { grep -E "^$1=" "$SERVER_DIR/.env" | tail -n 1 | cut -d= -f2- || true; }

DATABASE_URL=$(env_value DATABASE_URL)
url_re='^postgres(ql)?://([^:/@]+):([^@]+)@([^:/]+)(:([0-9]+))?/([^?]+)'
if [[ ! $DATABASE_URL =~ $url_re ]]; then
  echo "$(date -Is) ERROR: DATABASE_URL in $SERVER_DIR/.env is not postgres://user:password@host[:port]/db" >&2
  exit 1
fi
export PGUSER="${BASH_REMATCH[2]}" PGPASSWORD="${BASH_REMATCH[3]}" PGHOST="${BASH_REMATCH[4]}"
export PGPORT="${BASH_REMATCH[6]:-5432}" PGDATABASE="${BASH_REMATCH[7]}"

UPLOAD_DIR=$(env_value UPLOAD_DIR)
UPLOAD_DIR="${UPLOAD_DIR:-./uploads}"
[[ $UPLOAD_DIR = /* ]] || UPLOAD_DIR="$SERVER_DIR/$UPLOAD_DIR"

umask 077
mkdir -p "$BACKUP_DIR"
DB_FILE="$BACKUP_DIR/mitec-db-$TS.sql.gz"
UP_FILE="$BACKUP_DIR/mitec-uploads-$TS.tar.gz"
# Never leave a half-written file that looks like a good backup.
trap 'rm -f "$DB_FILE.tmp" "$UP_FILE.tmp"' EXIT

pg_dump --no-owner --no-privileges | gzip > "$DB_FILE.tmp"
gzip -t "$DB_FILE.tmp"
mv "$DB_FILE.tmp" "$DB_FILE"

tar -czf "$UP_FILE.tmp" -C "$UPLOAD_DIR" .
mv "$UP_FILE.tmp" "$UP_FILE"

# Keep the newest $KEEP of each.
for prefix in mitec-db- mitec-uploads-; do
  ls -1t "$BACKUP_DIR"/"$prefix"* 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f --
done

echo "$(date -Is) OK: $(basename "$DB_FILE") ($(du -h "$DB_FILE" | cut -f1)), $(basename "$UP_FILE") ($(du -h "$UP_FILE" | cut -f1)); keeping newest $KEEP of each"
