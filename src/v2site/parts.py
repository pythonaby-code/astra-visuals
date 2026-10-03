# -*- coding: utf-8 -*-
"""Общие куски страниц сайта: голова, навигация, подвал.

Страницы собирает build.py: каждая страница в src/pages/*.html — это только
её середина, а шапка и подвал одни на все и живут здесь.
"""

LAUNCHER_URL = "https://pythonaby-code.github.io/astra-visuals/AstraClient.exe"

MOON = ('<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#c9b6ff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>'
        '<path d="M22.5 21.2A9.2 9.2 0 0 1 10.8 9.5a9.2 9.2 0 1 0 11.7 11.7Z" fill="url(#mg)"/>'
        '<circle cx="24.5" cy="8.5" r="1.6" fill="#c9b6ff"/><circle cx="20" cy="5" r="1" fill="#c9b6ff" opacity=".7"/></svg>')

PAGES = [
    ("index.html", "Главная"),
    ("features.html", "Возможности"),
    ("download.html", "Скачать"),
    ("profile.html", "Профиль"),
]


def head(title, desc):
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<link rel="icon" href="v2/moon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Onest:wght@300;400;500;600&amp;display=swap">
<link rel="stylesheet" href="v2/site.css">
</head>
<body>
'''


def nav(current):
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{href}"{cur if href == current else ""}>{name}</a>'
        for href, name in PAGES)
    return f'''<header class="nav"><div class="wrap"><div class="nav-in">
<a class="brand" href="index.html">{MOON}<span>ASTRA <b>VISUALS</b></span></a>
<nav class="nav-links" aria-label="Разделы">{links}</nav>
<a class="btn btn-main" href="download.html">Скачать</a>
</div></div></header>
'''


FOOT = f'''<footer><div class="wrap foot">
<div>© 2026 Astra Visuals · Не является официальным продуктом Minecraft. Не связан с Mojang и Microsoft.</div>
<nav aria-label="Внизу"><a href="features.html">Возможности</a><a href="download.html">Скачать</a><a href="profile.html">Профиль</a><a href="changes/">Что нового</a></nav>
</div></footer>
<script src="v2/site.js"></script>
</body>
</html>
'''
