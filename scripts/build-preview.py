#!/usr/bin/env python3
"""Build a claude.ai Artifact preview of a page.

- Strips the <!doctype>/<html>/<head>/<body> skeleton (the Artifact host adds its own).
- Injects dev/inspector.js (the Layout Inspector toggle) — preview only, never production.

Usage: python3 scripts/build-preview.py scheduling.html OUT_DIR
Then publish OUT_DIR/<page>.html with css/, js/, assets/ and dev/inspector.js as `files`.
"""
import pathlib, re, sys

src_path, out_dir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
src = src_path.read_text()
head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
body = re.search(r"<body>(.*?)</body>", src, re.S).group(1)
head = re.sub(r'\s*<meta (charset|name="viewport")[^>]*>', "", head)
inspector = '<script src="dev/inspector.js"></script>'
out = head.strip() + "\n" + body.strip() + "\n" + inspector + "\n"
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / src_path.name).write_text(out)
print(out_dir / src_path.name)
