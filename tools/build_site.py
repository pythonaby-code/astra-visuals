# -*- coding: utf-8 -*-
"""Собирает страницы для GitHub Pages из исходников в src/.

Зачем нужен этот шаг. Страницы написаны под артефакт claude.ai, а он сам
оборачивает файл в <!doctype html><html><head>…</head><body>. Обычному
браузеру такую заготовку отдавать нельзя: без <meta charset="utf-8"> он
угадывает кодировку и русский текст рассыпается в «Ð Ð°Ð·Ð´ÐµÐ»Ñ‹».
Поэтому исходник один, а оболочки две: артефакт берёт src/, GitHub — корень.

Запуск:  python tools/build_site.py
"""

import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Что из чего собирается: исходник → куда положить готовую страницу.
PAGES = [
    ("src/index.html", "index.html", "."),
    ("src/changes.html", "changes/index.html", ".."),
]

SHELL = """<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
{head}</head>
<body>
{body}</body>
</html>
"""

DESC = {
    "index.html": "Astra Visuals — клиентский мод для Minecraft 1.21.11 на Fabric: "
                  "свой главный экран, плашки HUD, предупреждения и метки по координатам.",
    "changes/index.html": "Что поменялось в моде Astra Visuals за 12 сентября 2026 года.",
}


def split(raw):
    """Делит исходник на то, что принадлежит <head>, и всё остальное.

    В <head> уходят строки до первого настоящего содержимого: заголовок
    страницы, значок, шрифты и <style>. Всё, что после, — тело страницы.
    """
    head, body, in_style = [], [], False
    for line in raw.splitlines(True):
        stripped = line.strip()
        if in_style:
            head.append(line)
            if "</style>" in stripped:
                in_style = False
            continue
        if not body and (stripped.startswith("<title")
                         or stripped.startswith("<link")
                         or stripped.startswith("<meta")
                         or stripped == ""):
            head.append(line)
            continue
        if not body and stripped.startswith("<style"):
            head.append(line)
            in_style = "</style>" not in stripped
            continue
        body.append(line)
    return "".join(head), "".join(body)


def build():
    for source, target, base in PAGES:
        raw = io.open(os.path.join(ROOT, source), encoding="utf-8").read()
        head, body = split(raw)
        title = re.search(r"<title>(.*?)</title>", head)
        # Пути в исходнике заданы от корня сайта, а страница изменений лежит
        # в своей папке — оттуда до картинок на шаг выше.
        if base != ".":
            head = head.replace('href="assets/', 'href="%s/assets/' % base)
            body = body.replace('src="assets/', 'src="%s/assets/' % base)
        out = SHELL.format(head=head, body=body,
                           title=title.group(1) if title else "Astra Visuals",
                           desc=DESC.get(target, ""))
        path = os.path.join(ROOT, target)
        folder = os.path.dirname(path)
        if folder and not os.path.isdir(folder):
            os.makedirs(folder)
        io.open(path, "w", encoding="utf-8", newline="\n").write(out)
        print("собрано:", target, len(out), "знаков")


if __name__ == "__main__":
    build()
