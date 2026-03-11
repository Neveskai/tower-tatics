"""
Crop PNGs to the minimum rectangle that contains non-transparent pixels.
Run with system Python (requires Pillow):  python scripts/blender/crop_pngs_to_content.py

Use this after render_tower_sprites.py if the in-Blender crop didn't work, or to
re-crop existing PNGs in public/assets/frames/towers and public/assets/frames/tiles.
"""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow:  pip install Pillow")
    raise SystemExit(1)

# Project root (script is in scripts/blender/)
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DIRS_TO_CROP = [
    PROJECT_ROOT / "public" / "assets" / "frames" / "towers",
    PROJECT_ROOT / "public" / "assets" / "frames" / "tiles",
]
ALPHA_THRESHOLD = 2  # 0-255; pixel visible if alpha > this
PADDING = 0


def crop_to_content(image_path: Path) -> bool:
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    w, h = img.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    for y in range(h):
        for x in range(w):
            _, _, _, a = data[y * w + x]
            if a > ALPHA_THRESHOLD:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
    if min_x > max_x or min_y > max_y:
        return False
    min_x = max(0, min_x - PADDING)
    min_y = max(0, min_y - PADDING)
    max_x = min(w - 1, max_x + PADDING)
    max_y = min(h - 1, max_y + PADDING)
    cropped = img.crop((min_x, min_y, max_x + 1, max_y + 1))
    cropped.save(image_path)
    print(f"Cropped {image_path.name} -> {cropped.width}x{cropped.height}")
    return True


def main():
    total = 0
    for dir_path in DIRS_TO_CROP:
        if not dir_path.exists():
            print(f"Skip (missing): {dir_path}")
            continue
        for p in sorted(dir_path.glob("*.png")):
            if crop_to_content(p):
                total += 1
    print(f"Done. Cropped {total} images.")


if __name__ == "__main__":
    main()
