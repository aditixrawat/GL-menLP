# Local preview server that tells the browser not to cache, so edits always show on reload.
import http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1]) if len(sys.argv) > 1 else 5178), NoCache).serve_forever()
