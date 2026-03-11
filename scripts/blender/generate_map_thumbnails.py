"""
Generate themed 2D thumbnails for the 5 maps.

Each map has a UNIQUE layout and decoration set so the thumbnail
tells a clear story (path, water/lava, tower, decorations).

Usage (from repo root):
  pip install pillow
  python tools/generate_map_thumbnails.py
"""

from pathlib import Path
from typing import Dict, List, Literal, Tuple

from PIL import Image, ImageDraw, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
KENNEY_DIR = ROOT / "kenney_tower-defense-kit" / "kenney_all"
OUTPUT_DIR = ROOT / "public" / "assets" / "images" / "maps"

CellKind = Literal["tile", "dirt", "water"]
Color = Tuple[int, int, int]


class Theme:
    def __init__(
        self,
        name: str,
        tile_color: Color,
        dirt_color: Color,
        water_color: Color,
        accent_color: Color,
        bg_color: Color,
        layout: List[List[CellKind]],
        decorations: List[Tuple[str, int, int]],
        tower_pos: Tuple[int, int],
        saturation: float = 1.0,
    ) -> None:
        self.name = name
        self.tile_color = tile_color
        self.dirt_color = dirt_color
        self.water_color = water_color
        self.accent_color = accent_color
        self.bg_color = bg_color
        self.layout = layout
        self.decorations = decorations
        self.tower_pos = tower_pos
        self.saturation = saturation


# Grid: 5x5. "tile"=ground, "dirt"=path, "water"=river/lava
# Layouts chosen so path reads as a route; water/lava borders or crosses it.
def _desert_layout() -> List[List[CellKind]]:
    # Path left-to-right middle; oasis water top-left; rest sand
    g = [["tile"] * 5 for _ in range(5)]
    for c in range(5):
        g[2][c] = "dirt"
    g[0][0] = "water"
    return g


def _cemetery_layout() -> List[List[CellKind]]:
    # L-shaped path: left column down, then bottom row right. Dark water right edge (not on path).
    g = [["tile"] * 5 for _ in range(5)]
    for r in range(5):
        g[r][0] = "dirt"
    for c in range(1, 5):
        g[4][c] = "dirt"
    for r in range(4):
        g[r][4] = "water"
    return g


def _garden_layout() -> List[List[CellKind]]:
    # Path diagonal; river along left column (where not path).
    g = [["tile"] * 5 for _ in range(5)]
    for i in range(5):
        g[i][i] = "dirt"
    for r in range(5):
        if g[r][0] != "dirt":
            g[r][0] = "water"
    return g


def _ice_layout() -> List[List[CellKind]]:
    # Straight path middle; frozen river top two rows.
    g = [["tile"] * 5 for _ in range(5)]
    for c in range(5):
        g[2][c] = "dirt"
    for c in range(5):
        g[0][c] = "water"
        g[1][c] = "water"
    return g


def _hell_layout() -> List[List[CellKind]]:
    # Path middle row; lava on both sides (cols 0 and 4).
    g = [["tile"] * 5 for _ in range(5)]
    for c in range(5):
        g[2][c] = "dirt"
    for r in range(5):
        g[r][0] = "water"
        g[r][4] = "water"
    return g


# Keep tile_color/dirt_color in sync with maps-assets.ts
THEMES: Dict[int, Theme] = {
    1: Theme(
        "desert",
        tile_color=(0xF2, 0xD7, 0xA0),
        dirt_color=(0xC5, 0x8B, 0x3A),
        water_color=(0x3A, 0x86, 0xB9),
        accent_color=(0xCC, 0x99, 0x50),
        bg_color=(0x4A, 0x3A, 0x28),
        layout=_desert_layout(),
        decorations=[("detail-rocks.png", 0, 4), ("detail-tree.png", 4, 2)],
        tower_pos=(2, 2),
        saturation=1.15,
    ),
    2: Theme(
        "cemetery",
        tile_color=(0x6A, 0x7A, 0x6B),
        dirt_color=(0x4C, 0x4F, 0x52),
        water_color=(0x2A, 0x35, 0x40),
        accent_color=(0x5A, 0x62, 0x58),
        bg_color=(0x22, 0x26, 0x24),
        layout=_cemetery_layout(),
        decorations=[("detail-rocks.png", 1, 2), ("detail-tree.png", 3, 3)],
        tower_pos=(2, 2),
        saturation=0.85,
    ),
    3: Theme(
        "garden",
        tile_color=(0x88, 0xC9, 0x6B),
        dirt_color=(0x5E, 0x8F, 0x43),
        water_color=(0x34, 0xA8, 0xE0),
        accent_color=(0xFF, 0xD7, 0x3A),
        bg_color=(0x28, 0x48, 0x30),
        layout=_garden_layout(),
        decorations=[("detail-tree.png", 1, 3), ("detail-crystal.png", 3, 1)],
        tower_pos=(2, 2),
        saturation=1.2,
    ),
    4: Theme(
        "ice",
        tile_color=(0xC8, 0xE8, 0xFF),
        dirt_color=(0x7F, 0xB2, 0xFF),
        water_color=(0x5A, 0x9E, 0xCC),
        accent_color=(0xE8, 0xF8, 0xFF),
        bg_color=(0x30, 0x50, 0x68),
        layout=_ice_layout(),
        decorations=[("detail-crystal.png", 4, 1), ("detail-rocks.png", 4, 3)],
        tower_pos=(2, 2),
        saturation=1.05,
    ),
    5: Theme(
        "hell",
        tile_color=(0x80, 0x30, 0x30),
        dirt_color=(0xFF, 0x7A, 0x3C),
        water_color=(0xCC, 0x30, 0x10),
        accent_color=(0xFF, 0xC0, 0x5A),
        bg_color=(0x28, 0x10, 0x10),
        layout=_hell_layout(),
        decorations=[("detail-rocks.png", 1, 2), ("detail-crystal.png", 1, 3)],
        tower_pos=(2, 2),
        saturation=1.2,
    ),
}


def load_sprite(name: str) -> Image.Image:
    path = KENNEY_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Sprite not found: {path}")
    return Image.open(path).convert("RGBA")


def recolor_sprite(base: Image.Image, color: Color, saturation: float = 1.0) -> Image.Image:
    gray = ImageOps.grayscale(base)
    gray = ImageEnhance.Contrast(gray).enhance(1.1)
    dark = tuple(max(0, int(c * 0.35)) for c in color)
    light = color
    colored = ImageOps.colorize(gray, black=dark, white=light)
    alpha = base.split()[-1]
    if saturation != 1.0:
        colored = ImageEnhance.Color(colored).enhance(saturation)
    colored.putalpha(alpha)
    return colored


def compose_map_thumbnail(map_id: int, theme: Theme) -> Image.Image:
    canvas_size = 512
    grid_rows = len(theme.layout)
    grid_cols = len(theme.layout[0])

    canvas = Image.new("RGBA", (canvas_size, canvas_size), (*theme.bg_color, 255))
    draw = ImageDraw.Draw(canvas)

    base_tile = load_sprite("tile.png")
    dirt_tile = load_sprite("tile-dirt.png")
    water_tile = load_sprite("tile-river-straight.png")
    tower_base = load_sprite("tower-square-bottom-c.png")

    tile_img = recolor_sprite(base_tile, theme.tile_color, theme.saturation)
    dirt_img = recolor_sprite(dirt_tile, theme.dirt_color, theme.saturation)
    water_img = recolor_sprite(water_tile, theme.water_color, theme.saturation)
    tower_img = recolor_sprite(tower_base, theme.dirt_color, theme.saturation)

    tile_w, tile_h = base_tile.size
    cell_size = int(min(canvas_size / (grid_cols + 0.8), canvas_size / (grid_rows + 0.8)))
    scale = cell_size / max(tile_w, tile_h)
    new_size = (int(tile_w * scale), int(tile_h * scale))
    cell_w, cell_h = new_size

    tile_img = tile_img.resize(new_size, Image.BICUBIC)
    dirt_img = dirt_img.resize(new_size, Image.BICUBIC)
    water_img = water_img.resize(new_size, Image.BICUBIC)

    grid_total_w = grid_cols * cell_w
    grid_total_h = grid_rows * cell_h
    offset_x = (canvas_size - grid_total_w) // 2
    offset_y = (canvas_size - grid_total_h) // 2

    for r in range(grid_rows):
        for c in range(grid_cols):
            cell = theme.layout[r][c]
            x = offset_x + c * cell_w
            y = offset_y + r * cell_h
            if cell == "tile":
                canvas.alpha_composite(tile_img, (x, y))
            elif cell == "dirt":
                canvas.alpha_composite(dirt_img, (x, y))
            else:
                canvas.alpha_composite(water_img, (x, y))

    tower_scale = scale * 1.6
    tw, th = tower_base.size
    tower_size = (int(tw * tower_scale), int(th * tower_scale))
    tower_img = tower_img.resize(tower_size, Image.BICUBIC)
    tr, tc = theme.tower_pos
    tower_x = offset_x + tc * cell_w + cell_w // 2 - tower_size[0] // 2
    tower_y = offset_y + tr * cell_h + cell_h // 2 - tower_size[1] // 2 - int(cell_h * 0.15)
    canvas.alpha_composite(tower_img, (tower_x, tower_y))

    for sprite_name, dr, dc in theme.decorations:
        spr = load_sprite(sprite_name)
        spr = recolor_sprite(spr, theme.accent_color, theme.saturation)
        decor_scale = scale * 1.1
        sw, sh = spr.size
        spr = spr.resize((int(sw * decor_scale), int(sh * decor_scale)), Image.BICUBIC)
        dx = offset_x + dc * cell_w + cell_w // 2 - spr.size[0] // 2
        dy = offset_y + dr * cell_h + cell_h // 2 - spr.size[1] // 2
        canvas.alpha_composite(spr, (dx, dy))

    return canvas


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for map_id, theme in THEMES.items():
        img = compose_map_thumbnail(map_id, theme)
        img.save(OUTPUT_DIR / f"Map_{map_id}.png", "PNG")
        img.save(OUTPUT_DIR / f"Map_{map_id}.webp", "WEBP", quality=90)
        print(f"[ok] Map {map_id} ({theme.name})")


if __name__ == "__main__":
    main()
