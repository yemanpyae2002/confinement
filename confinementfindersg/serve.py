#!/usr/bin/env python3
"""serve.py — local preview server with clean-URL routing (like Cloudflare
Pages / Netlify), so /costs/ resolves to site/costs/index.html and you can
click through the site the same way it'll behave once deployed.

Usage: python serve.py [port]   (default 8899)
"""
import sys
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit

SITE = Path(__file__).parent / "site"


class CleanURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        url_path = urlsplit(path).path
        fs_path = (SITE / url_path.lstrip("/")).resolve()

        # Prevent escaping the site/ directory
        if SITE not in fs_path.parents and fs_path != SITE:
            fs_path = SITE

        if fs_path.is_dir():
            fs_path = fs_path / "index.html"
        elif not fs_path.exists() and fs_path.suffix == "":
            # /costs -> /costs/index.html (folder-style clean URL, no trailing slash)
            candidate = fs_path / "index.html"
            if candidate.exists():
                fs_path = candidate
            elif fs_path.with_suffix(".html").exists():
                fs_path = fs_path.with_suffix(".html")

        return str(fs_path)

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            not_found = SITE / "404.html"
            if not_found.exists():
                body = not_found.read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        super().send_error(code, message, explain)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    handler = partial(CleanURLHandler, directory=str(SITE))
    httpd = HTTPServer(("127.0.0.1", port), handler)
    print(f"Serving {SITE} with clean URLs at http://127.0.0.1:{port}/")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
