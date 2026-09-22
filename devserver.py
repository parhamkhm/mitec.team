"""Static dev server for the mitec site.

`python -m http.server` sends Last-Modified but no Cache-Control, so browsers
apply heuristic freshness and re-serve cached CSS/HTML without revalidating —
edits look like they never landed. This sends no-store instead.

Development only; it has nothing to do with how the site is served in production.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    handler = partial(NoCacheHandler, directory="project")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
