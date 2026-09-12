# Знак Astra Visuals. Рисуется по клеткам 16x16 — тем же приёмом, каким мод рисует
# свой пиксельный шрифт: сначала сетка, потом из неё и SVG, и PNG любого размера.
#
#   python tools/logo.py        — собрать всё в assets/logo/
#
import os

W = H = 16

# Краски знака: от светлого аметиста к тёмному + белый блик.
PAL = {
    "1": "#d3bcff",   # светлая грань
    "2": "#9d6bff",   # основной аметист
    "3": "#6d3cd6",   # тёмная грань
    "4": "#3f1f80",   # тень
    "5": "#ffffff",   # блик
}


def blank():
    return [["." for _ in range(W)] for _ in range(H)]


def put(g, x, y, c):
    if 0 <= x < W and 0 <= y < H:
        g[y][x] = c


# ---------- 1. Осколок аметиста: нарисован по клеткам, чтобы грани читались ----------
SHARD = [
    "................",
    ".......22.......",
    "......1223......",
    "......1223......",
    ".....112233.....",
    ".....112233.....",
    "....11222333....",
    "....11222333....",
    "....11222333....",
    "....11222333....",
    ".....112233.....",
    ".....112233.....",
    "......1223......",
    "......1223......",
    ".......22.......",
    "................",
]


def crystal():
    g = blank()
    for y, row in enumerate(SHARD):
        for x, c in enumerate(row):
            if c != ".":
                put(g, x, y, c)
    # блик на верхней левой грани
    put(g, 6, 2, "5")
    put(g, 5, 4, "5")
    # нижняя правая кромка уходит в тень — так осколок выглядит объёмным
    for y, x in [(9, 11), (10, 10), (11, 10), (12, 9), (13, 9), (14, 8)]:
        if g[y][x] != ".":
            g[y][x] = "4"
    return g


# ---------- 2. Буква А в плитке, как значок приложения ----------
LETTER_A = [
    "01110",
    "11011",
    "11011",
    "11111",
    "11011",
    "11011",
    "11011",
]


def tile_a():
    g = blank()
    for y in range(H):
        for x in range(W):
            # скруглённый квадрат: срезаем углы 3x3
            cx = min(x, W - 1 - x)
            cy = min(y, H - 1 - y)
            if cx + cy >= 2:
                g[y][x] = "2" if (x + y) % 14 else "2"
    # градиент по диагонали
    for y in range(H):
        for x in range(W):
            if g[y][x] != ".":
                t = (x + y) / (W + H - 2)
                g[y][x] = "1" if t < 0.28 else ("2" if t < 0.62 else "3")
    # буква вырезана белым
    ox, oy = 6, 5
    for j, row in enumerate(LETTER_A):
        for i, ch in enumerate(row):
            if ch == "1":
                put(g, ox - 1 + i, oy - 1 + j, "5")
    return g


# ---------- 3. Глаз: «визуалы» ----------
def eye():
    g = blank()
    for y in range(H):
        for x in range(W):
            dx = (x - 7.5) / 7.4
            dy = (y - 7.5) / 4.4
            r = dx * dx + dy * dy
            if r <= 1.0:
                g[y][x] = "3" if r > 0.62 else "2"
    for y in range(H):
        for x in range(W):
            if g[y][x] == "." :
                continue
            d = ((x - 7.5) ** 2 + (y - 7.5) ** 2) ** .5
            if d <= 2.6:
                g[y][x] = "1"
            if d <= 1.3:
                g[y][x] = "4"
    put(g, 6, 6, "5")
    return g


# ---------- 3. Луна и звёзды: выбранный знак, нарисован по клеткам ----------
# Формула из двух окружностей давала рваный месяц: в 16 пикселей он расплывался.
# Поэтому каждая строка задана руками — слева край ярче, внутрь уходит в тень.
MOON_ROWS = {
    1:  (7, 10), 2:  (4, 9), 3:  (3, 8), 4:  (2, 7),
    5:  (1, 6),  6:  (1, 6), 7:  (1, 6), 8:  (1, 6),
    9:  (1, 6),  10: (1, 6), 11: (2, 7), 12: (3, 8),
    13: (4, 9),  14: (7, 10),
}

MOON_STARS = [(12, 4), (14, 8), (12, 11)]


def moon():
    g = blank()
    for y, (x0, x1) in MOON_ROWS.items():
        for x in range(x0, x1 + 1):
            if x - x0 < 2:
                c = "1"          # яркая кромка света слева
            elif x == x1:
                c = "3"          # внутренний край уходит в тень
            else:
                c = "2"
            put(g, x, y, c)
    for x, y in MOON_STARS:
        put(g, x, y, "5")
    return g


# ---------- 4. Звезда: «Astra» и есть звезда ----------
def star():
    g = blank()
    for y in range(H):
        for x in range(W):
            dx, dy = x - 7.5, y - 7.5
            man = abs(dx) + abs(dy)
            ray = (abs(dx) <= 1 or abs(dy) <= 1) and man <= 7.5
            core = man <= 4.2
            if ray or core:
                if man <= 1.6:
                    c = "5"
                elif man <= 3.0:
                    c = "1"
                elif man <= 5.2:
                    c = "2"
                else:
                    c = "3"
                put(g, x, y, c)
    # маленькая звёздочка-спутник: крестик из пяти клеток
    put(g, 13, 2, "5")
    for x, y in [(12, 2), (14, 2), (13, 1), (13, 3)]:
        put(g, x, y, "1")
    return g


# ---------- 5. Прицел: тот самый прицел мода, который раскрывается при ударе ----------
def crosshair():
    g = blank()

    def band(d):
        return "1" if d <= 1 else ("2" if d <= 3 else "3")

    for k in range(5):
        d = 4 - k                      # ближе к центру — светлее
        for a in (7, 8):
            put(g, a, 1 + k, band(d))
            put(g, a, 14 - k, band(d))
            put(g, 1 + k, a, band(d))
            put(g, 14 - k, a, band(d))
    for a in (7, 8):
        for b in (7, 8):
            put(g, a, b, "5")          # точка в центре
    return g


# ---------- 6. Стекло: два стекла друг за другом ----------
def glass():
    g = blank()

    def pane(x0, y0, x1, y1, fill, edge):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                cx = min(x - x0, x1 - x)
                cy = min(y - y0, y1 - y)
                if cx + cy == 0:       # срезанный угол
                    continue
                put(g, x, y, edge if (cx == 0 or cy == 0) else fill)

    pane(1, 1, 10, 10, "4", "3")       # заднее стекло, в тени
    pane(5, 5, 14, 14, "2", "1")       # переднее, светлее
    put(g, 8, 7, "5")
    put(g, 9, 6, "5")                  # блик
    return g


MARKS = {"shard": crystal(), "star": star(), "crosshair": crosshair(),
         "glass": glass(), "tile-a": tile_a(), "moon": moon()}

# ---------- Пиксельные буквы для надписи: те же 5x7, что у мода ----------
GLYPHS = {
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    " ": ["00", "00", "00", "00", "00", "00", "00"],
}


def word_rects(text, ox=0, oy=0):
    """Клетки надписи: список (x, y) в единицах пикселя знака."""
    cells, x = [], ox
    for ch in text:
        g = GLYPHS[ch]
        for j, row in enumerate(g):
            for i, c in enumerate(row):
                if c == "1":
                    cells.append((x + i, oy + j))
        x += len(g[0]) + 1
    return cells, x - ox - 1


def svg_mark(grid, unit=1):
    rects = []
    for y in range(H):
        for x in range(W):
            c = grid[y][x]
            if c != ".":
                rects.append(f'<rect x="{x}" y="{y}" width="1" height="1" fill="{PAL[c]}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'shape-rendering="crispEdges">{"".join(rects)}</svg>')


def svg_lockup(grid, dark_bg=True):
    """Знак + надпись ASTRA VISUALS пиксельными буквами."""
    parts, gap = [], 4
    for y in range(H):
        for x in range(W):
            c = grid[y][x]
            if c != ".":
                parts.append(f'<rect x="{x}" y="{y}" width="1" height="1" fill="{PAL[c]}"/>')
    base_x = W + gap
    a_cells, a_w = word_rects("ASTRA VISUALS", base_x, 4)
    split = base_x + 6 * 6          # где кончается слово ASTRA
    for x, y in a_cells:
        base = "#ece9f5" if dark_bg else "#14111f"
        col = base if x < split else PAL["2"]
        parts.append(f'<rect x="{x}" y="{y}" width="1" height="1" fill="{col}"/>')
    total = base_x + a_w
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {H}" '
            f'shape-rendering="crispEdges">{"".join(parts)}</svg>')


def png(grid, path, scale):
    from PIL import Image
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = im.load()
    for y in range(H):
        for x in range(W):
            c = grid[y][x]
            if c != ".":
                h = PAL[c].lstrip("#")
                px[x, y] = (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)
    im.resize((W * scale, H * scale), Image.NEAREST).save(path)


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "logo")
    os.makedirs(out, exist_ok=True)
    for name, grid in MARKS.items():
        open(os.path.join(out, f"mark-{name}.svg"), "w", encoding="utf-8").write(svg_mark(grid))
        open(os.path.join(out, f"lockup-{name}.svg"), "w", encoding="utf-8").write(svg_lockup(grid))
        open(os.path.join(out, f"lockup-{name}-light.svg"), "w", encoding="utf-8").write(svg_lockup(grid, False))
        for s in (1, 2, 4, 16, 32):
            png(grid, os.path.join(out, f"mark-{name}-{W * s}.png"), s)
        print("готово:", name)
