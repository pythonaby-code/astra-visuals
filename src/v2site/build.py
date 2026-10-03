# -*- coding: utf-8 -*-
"""Собрать сайт: src/pages/*.html + общие куски (parts.py) -> готовые страницы в корне.

    python src/build.py
"""
import io
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import parts  # noqa: E402

for name, _ in parts.PAGES:
    body = io.open(os.path.join(HERE, 'pages', name), encoding='utf-8').read()
    title = re.search(r'<!--title: (.*?)-->', body).group(1)
    desc = re.search(r'<!--desc: (.*?)-->', body).group(1)
    body = re.sub(r'<!--(title|desc): .*?-->\n', '', body)
    html = parts.head(title, desc) + parts.nav(name) + body + parts.FOOT
    io.open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n').write(html)
    print('ok', name, len(html))

io.open(os.path.join(ROOT, 'v2', 'moon.svg'), 'w', encoding='utf-8').write(
    parts.MOON.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', 1))
