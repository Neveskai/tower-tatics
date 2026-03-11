"""
Blender script: render tower (and weapon) and map tile models from Kenney Tower
Defense Kit as PNG sprites with transparent background, in the same perspective
(D = down/front, elevation 38°, orthographic).

Usage (from project root):
  blender --background --python scripts/blender/render_tower_sprites.py

Or from Blender's Scripting workspace: run the script (paths are auto-detected).

Output:
  - public/assets/frames/towers/   – composições para o jogo (Tower, Machine_Gun, etc.)
  - public/assets/frames/tiles/    – tiles do mapa (composições)
  - public/assets/frames/kenney_all/ – todos os .glb do kit, um PNG por modelo (se RENDER_ALL_GLB=True)
Convert to WebP manually if needed (e.g. with squoosh, sharp, or cwebp).
"""

import bpy
import math
import os
import sys
from pathlib import Path

# -----------------------------------------------------------------------------
# Config (edit or pass via BLENDER_ENV)
# -----------------------------------------------------------------------------
def get_dirs():
    # When run as: blender --python script.py, argv[0] is blender executable
    script_dir = Path(bpy.data.filepath or __file__).resolve().parent
    project_root = script_dir.parent.parent  # tower-tatics
    kit_path = project_root / "kenney_tower-defense-kit" / "Models" / "GLB format"
    out_dir = project_root / "public" / "assets" / "frames" / "towers"
    tiles_out_dir = project_root / "public" / "assets" / "frames" / "tiles"
    all_assets_dir = project_root / "public" / "assets" / "frames" / "kenney_all"
    return kit_path, out_dir, tiles_out_dir, all_assets_dir

KIT_PATH, OUT_DIR, TILES_OUT_DIR, ALL_ASSETS_DIR = get_dirs()

# Resolution (square, like typical sprite). Match goblin scale or higher.
RESOLUTION = 256

# Orthographic scale: smaller = zoom in (bigger sprite). Tweak so tower fits frame.
ORTHO_SCALE = 4.0

# Camera distance from origin (for positioning). Orthographic scale controls zoom.
CAM_DIST = 8.0

# Directions matching goblin: D (down/front), S (side), U (up/back)
# Angles: azimuth (deg) around Y, elevation (deg) from horizontal
# Blender: Y up, camera looks toward -Z by default; we rotate camera.
DIRECTIONS = {
    "D": {"azimuth": 0, "elevation": 38},   # front, slightly from above
    "S": {"azimuth": 90, "elevation": 38},  # side
    "U": {"azimuth": 180, "elevation": 38}, # back
}

# Tower compositions: each tower type uses a DIFFERENT base (doc: square a/b/c, round a/b/c).
# Map: Cannon=weapon-cannon, Machine_Gun=weapon-ballista, Heavy_Gun=weapon-turret, Electric=tower-round-crystals.
TOWER_RENDERS = [
    # Generic base (Tower.png) – square style A, base only
    ("Tower", ["tower-square-bottom-a.glb", "tower-square-middle-a.glb", "tower-square-roof-a.glb"]),
    # Machine_Gun = base square-a + weapon-ballista (per asset map)
    ("Machine_Gun", ["tower-square-bottom-a.glb", "tower-square-middle-a.glb", "tower-square-roof-a.glb", "weapon-ballista.glb"]),
    # Rambo (Heavy_Gun): Kenney weapon-turret
    ("Heavy_Gun", ["tower-square-bottom-b.glb", "tower-square-middle-b.glb", "tower-square-top-b.glb", "weapon-turret.glb"]),
    # Cannon: Kenney weapon-cannon
    ("Cannon", ["tower-square-bottom-c.glb", "tower-square-middle-c.glb", "tower-square-top-c.glb", "weapon-cannon.glb"]),
    # Round: base + bottom + build + middle + roof/top + weapon
    ("Anti_Air", ["tower-round-base.glb", "tower-round-bottom-a.glb", "tower-round-build-a.glb", "tower-round-middle-a.glb", "tower-round-top-a.glb", "weapon-turret.glb"]),
    ("Freeze", ["tower-round-base.glb", "tower-round-bottom-b.glb", "tower-round-build-b.glb", "tower-round-middle-b.glb", "tower-round-top-b.glb", "weapon-turret.glb"]),
    ("Electric", ["tower-round-base.glb", "tower-round-bottom-c.glb", "tower-round-build-c.glb", "tower-round-middle-c.glb", "tower-round-crystals.glb"]),
]

# Base-only sprites (cada variante de base da doc) – para usar “cada torre com base diferente”
# Nomes: Tower_square_a, Tower_square_b, Tower_square_c, Tower_round_a, Tower_round_b, Tower_round_c
BASE_ONLY_RENDERS = [
    ("Tower_square_a", ["tower-square-bottom-a.glb", "tower-square-middle-a.glb", "tower-square-roof-a.glb"]),
    ("Tower_square_b", ["tower-square-bottom-b.glb", "tower-square-middle-b.glb", "tower-square-roof-b.glb"]),
    ("Tower_square_c", ["tower-square-bottom-c.glb", "tower-square-middle-c.glb", "tower-square-roof-c.glb"]),
    # Round: base + bottom + build + middle + roof (torre completa como na imagem de referência)
    ("Tower_round_a", ["tower-round-base.glb", "tower-round-bottom-a.glb", "tower-round-build-a.glb", "tower-round-middle-a.glb", "tower-round-roof-a.glb"]),
    ("Tower_round_b", ["tower-round-base.glb", "tower-round-bottom-b.glb", "tower-round-build-b.glb", "tower-round-middle-b.glb", "tower-round-roof-b.glb"]),
    ("Tower_round_c", ["tower-round-base.glb", "tower-round-bottom-c.glb", "tower-round-build-c.glb", "tower-round-middle-c.glb", "tower-round-roof-c.glb"]),
]

# Optional: render only one direction (e.g. "D") to match single tower sprite in game
RENDER_DIRECTIONS = ["D"]  # use ["D", "S", "U"] to match goblin D_Walk, S_Walk, U_Walk

# Rotation frames (turntable): camera orbits; only the asset that matches Kenney PNG is used.
ROTATION_FRAMES = 36  # 360/36 = 10° per frame
TOWERS_WITH_ROTATION = ["Cannon", "Machine_Gun", "Heavy_Gun", "Electric"]

# De-para: output PNG name (game) → single GLB (same name as Kenney PNG, e.g. weapon-cannon.png → weapon-cannon.glb).
# So the rendered frames match exactly kenney_all/weapon-cannon.png, weapon-ballista.png, etc.
ROTATION_TOWER_GLB_MAP = {
    "Cannon": ["weapon-cannon.glb"],           # Cannon.png = weapon-cannon.png
    "Machine_Gun": ["weapon-ballista.glb"],   # Machine_Gun.png = weapon-ballista.png
    "Heavy_Gun": ["weapon-turret.glb"],        # Heavy_Gun.png = weapon-turret.png
    "Electric": ["tower-round-crystals.glb"], # Electric.png = tower-round-crystals.png
}

# Crop each output PNG to the minimum rectangle that contains non-transparent pixels.
CROP_TO_CONTENT = True
CROP_ALPHA_THRESHOLD = 0.02  # pixel considered visible if alpha > this (ignore near-transparent)
CROP_PADDING = 0  # extra pixels around the bounding box (0 = tight)

# Map tiles: same perspective as towers (direction D, same camera). One GLB per output PNG.
TILE_RENDERS = [
    ("tile", ["tile.glb"]),
    ("tile-straight", ["tile-straight.glb"]),
    ("tile-corner-inner", ["tile-corner-inner.glb"]),
    ("tile-corner-outer", ["tile-corner-outer.glb"]),
    ("tile-corner-round", ["tile-corner-round.glb"]),
    ("tile-corner-square", ["tile-corner-square.glb"]),
    ("tile-crossing", ["tile-crossing.glb"]),
    ("tile-bump", ["tile-bump.glb"]),
    ("tile-dirt", ["tile-dirt.glb"]),
]

# Export every .glb in the kit as a single PNG (same perspective). Output: kenney_all/*.png
RENDER_ALL_GLB = True


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)


def setup_world_transparent():
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputWorld")
    back = nodes.new("ShaderNodeBackground")
    back.inputs["Color"].default_value = (0, 0, 0, 0)
    back.inputs["Strength"].default_value = 0
    world.node_tree.links.new(back.outputs["Background"], out.inputs["Surface"])
    bpy.context.scene.render.film_transparent = True


def add_lights():
    # Soft front light
    bpy.ops.object.light_add(type="AREA", location=(2, -3, 5))
    front = bpy.context.active_object
    front.data.energy = 400
    front.data.size = 4
    # Fill from side
    bpy.ops.object.light_add(type="AREA", location=(-3, 2, 4))
    fill = bpy.context.active_object
    fill.data.energy = 150
    fill.data.size = 3


def create_camera():
    bpy.ops.object.camera_add(location=(0, -CAM_DIST, CAM_DIST * 0.6))
    cam = bpy.context.active_object
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = ORTHO_SCALE
    bpy.context.scene.camera = cam  # required for rendering
    return cam


def azimuth_elevation_to_rotation(azimuth_deg, elevation_deg):
    """Convert azimuth (deg around Y) and elevation (deg) to Blender camera position (x, y, z)."""
    az = math.radians(azimuth_deg)
    el = math.radians(elevation_deg)
    x = CAM_DIST * math.cos(el) * math.sin(az)
    y = CAM_DIST * math.cos(el) * math.cos(az)
    z = CAM_DIST * math.sin(el)
    return (x, y, z)


def camera_position_on_orbit_circle(angle_rad, elevation_deg):
    """
    Position of the camera on a circle around the object (origin).
    Circle lies in a horizontal plane at fixed elevation; camera keeps CAM_DIST
    and always looks at origin via Track To.
    Blender: Y up → horizontal plane = XZ. angle_rad = 0 is along +Z.
    """
    el = math.radians(elevation_deg)
    radius = CAM_DIST * math.cos(el)   # horizontal distance from origin
    height = CAM_DIST * math.sin(el)   # height of the orbit circle (Y)
    x = radius * math.sin(angle_rad)
    z = radius * math.cos(angle_rad)
    y = height
    return (x, y, z)


def import_glb(path: Path):
    path_str = str(path.resolve())
    bpy.ops.import_scene.gltf(filepath=path_str)
    return list(bpy.context.selected_objects)


def import_tower_composition(glb_names, kit_path: Path):
    imported = []
    for name in glb_names:
        path = kit_path / name
        if not path.exists():
            print(f"Warning: {path} not found, skipping.")
            continue
        imported.extend(import_glb(path))
    if not imported:
        return None
    meshes = [o for o in imported if o.type == "MESH"]
    if not meshes:
        return imported[0]  # e.g. single empty or other type
    bpy.ops.object.select_all(action="DESELECT")
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    return bpy.context.active_object


def center_and_scale(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0, 0, 0)
    # Scale to fit in ortho view (bounds-based)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    dims = obj.dimensions
    max_dim = max(dims.x, dims.y, dims.z)
    if max_dim > 1e-6:
        scale = 1.8 / max_dim  # fit in ~1.8 units
        obj.scale = (scale, scale, scale)
    bpy.ops.object.transform_apply(scale=True)


def crop_image_to_content(filepath: Path):
    """
    Load the PNG we just wrote, find bounding box of pixels with alpha > threshold,
    create a new image with that size (plus padding), save over filepath.
    Uses the file on disk (reliable in background mode; Render Result may be unavailable).
    Blender image origin is bottom-left; pixel index (y * w + x) * 4.
    """
    path_str = str(filepath.resolve())
    if not filepath.exists():
        print(f"Crop skip (file not found): {path_str}")
        return
    try:
        loaded = bpy.data.images.load(path_str, check_existing=False)
    except RuntimeError as e:
        print(f"Crop skip (load failed): {e}")
        return
    w, h = loaded.size[0], loaded.size[1]
    # pixels: float RGBA, bottom-left origin, row-major
    pixels = list(loaded.pixels)
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    for y in range(h):
        for x in range(w):
            i = (y * w + x) * 4
            a = pixels[i + 3]
            if a > CROP_ALPHA_THRESHOLD:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
    bpy.data.images.remove(loaded)
    if min_x > max_x or min_y > max_y:
        print(f"Crop skip (no visible pixels): {filepath.name}")
        return
    pad = CROP_PADDING
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(w - 1, max_x + pad)
    max_y = min(h - 1, max_y + pad)
    crop_w = max_x - min_x + 1
    crop_h = max_y - min_y + 1
    crop_name = "CroppedOutput"
    if crop_name in bpy.data.images:
        bpy.data.images.remove(bpy.data.images[crop_name])
    crop_img = bpy.data.images.new(crop_name, crop_w, crop_h, alpha=True)
    for cy in range(crop_h):
        for cx in range(crop_w):
            sx = min_x + cx
            sy = min_y + cy
            src_i = (sy * w + sx) * 4
            dst_i = (cy * crop_w + cx) * 4
            crop_img.pixels[dst_i : dst_i + 4] = pixels[src_i : src_i + 4]
    crop_img.filepath_raw = path_str
    crop_img.file_format = "PNG"
    crop_img.save()
    bpy.data.images.remove(crop_img)
    print(f"Cropped {filepath.name} -> {crop_w}x{crop_h}")


def render_frame(filepath: Path):
    bpy.context.scene.render.filepath = str(filepath)
    bpy.context.scene.render.resolution_x = RESOLUTION
    bpy.context.scene.render.resolution_y = RESOLUTION
    bpy.context.scene.render.image_settings.file_format = "PNG"
    bpy.context.scene.render.image_settings.color_mode = "RGBA"
    bpy.ops.render.render(write_still=True)
    if CROP_TO_CONTENT:
        crop_image_to_content(filepath)


def delete_mesh_objects():
    """Remove only mesh/imported objects, keep camera, lights, empty."""
    to_delete = [o for o in bpy.data.objects if o.type == "MESH" or (o.type == "EMPTY" and o.name != "TrackEmpty")]
    for o in to_delete:
        bpy.data.objects.remove(o, do_unlink=True)


def render_composition_rotations(kit_path: Path, out_dir: Path, label: str, glb_list: list):
    """
    Object fixed at origin; camera orbits around it (same distance and elevation).
    Renders ROTATION_FRAMES PNGs: {label}_00.png ... {label}_{N-1:02d}.png
    """
    elevation_deg = DIRECTIONS["D"]["elevation"]  # keep same elevation (38°)

    comp = import_tower_composition(glb_list, kit_path)
    if comp is None:
        print(f"Skip {label} (rotation): no models loaded.")
        return
    center_and_scale(comp)

    cam = bpy.context.scene.camera
    for frame in range(ROTATION_FRAMES):
        azimuth_deg = (360.0 / ROTATION_FRAMES) * frame
        x, y, z = azimuth_elevation_to_rotation(azimuth_deg, elevation_deg)
        if cam:
            cam.location = (x, y, z)
        bpy.context.view_layer.update()
        out_name = f"{label}_{frame:02d}.png"
        render_frame(out_dir / out_name)
        print(f"Rendered {out_name}")

    delete_mesh_objects()


def render_compositions(kit_path, out_dir, renders, dir_keys):
    """Import each composition, center/scale, render for each direction, then delete meshes."""
    for label, glb_list in renders:
        if label in TOWERS_WITH_ROTATION:
            # Use only the GLB that matches the Kenney PNG (de-para), not the full tower composition
            rotation_glb_list = ROTATION_TOWER_GLB_MAP.get(label, glb_list)
            render_composition_rotations(kit_path, out_dir, label, rotation_glb_list)
            continue

        comp = import_tower_composition(glb_list, kit_path)
        if comp is None:
            print(f"Skip {label}: no models loaded.")
            continue
        center_and_scale(comp)

        for dir_key in dir_keys:
            cfg = DIRECTIONS[dir_key]
            x, y, z = azimuth_elevation_to_rotation(cfg["azimuth"], cfg["elevation"])
            cam = bpy.context.scene.camera
            if cam:
                cam.location = (x, y, z)
            if len(dir_keys) > 1:
                out_name = f"{label}_{dir_key}.png"
            else:
                out_name = f"{label}.png"
            render_frame(out_dir / out_name)
            print(f"Rendered {out_name}")

        delete_mesh_objects()


def render_all_glb_assets(kit_path: Path, out_dir: Path, dir_keys):
    """Import every .glb in the kit, center/scale, render as PNG (same perspective)."""
    glb_files = sorted(kit_path.glob("*.glb"))
    if not glb_files:
        print("No .glb files in kit path.")
        return
    print(f"Exporting {len(glb_files)} GLB assets to {out_dir}...")
    for glb_path in glb_files:
        name = glb_path.name
        comp = import_tower_composition([name], kit_path)
        if comp is None:
            print(f"Skip {name}: no mesh loaded.")
            continue
        center_and_scale(comp)
        stem = glb_path.stem
        for dir_key in dir_keys:
            cfg = DIRECTIONS[dir_key]
            x, y, z = azimuth_elevation_to_rotation(cfg["azimuth"], cfg["elevation"])
            cam = bpy.context.scene.camera
            if cam:
                cam.location = (x, y, z)
            if len(dir_keys) > 1:
                out_name = f"{stem}_{dir_key}.png"
            else:
                out_name = f"{stem}.png"
            render_frame(out_dir / out_name)
            print(f"Rendered {out_name}")
        delete_mesh_objects()
    print(f"Done. Exported {len(glb_files)} assets to {out_dir}")


def main():
    kit_path = Path(KIT_PATH)
    out_dir = Path(OUT_DIR)
    tiles_out_dir = Path(TILES_OUT_DIR)
    all_assets_dir = Path(ALL_ASSETS_DIR)
    if not kit_path.exists():
        print(f"Kenney kit path not found: {kit_path}")
        print("Place kenney_tower-defense-kit in project root or set paths in script.")
        return
    out_dir.mkdir(parents=True, exist_ok=True)
    tiles_out_dir.mkdir(parents=True, exist_ok=True)
    all_assets_dir.mkdir(parents=True, exist_ok=True)

    clear_scene()
    setup_world_transparent()
    add_lights()
    cam = create_camera()
    bpy.ops.object.empty_add(location=(0, 0, 0))
    track_empty = bpy.context.active_object
    track_empty.name = "TrackEmpty"
    track = cam.constraints.new(type="TRACK_TO")
    track.target = track_empty
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    # 1) Tower compositions (jogo): Tower, Machine_Gun, Heavy_Gun, Cannon, Anti_Air, Freeze, Electric + bases
    all_renders = TOWER_RENDERS + BASE_ONLY_RENDERS
    render_compositions(kit_path, out_dir, all_renders, RENDER_DIRECTIONS)

    # 2) Map tile compositions
    render_compositions(kit_path, tiles_out_dir, TILE_RENDERS, RENDER_DIRECTIONS)

    # 3) Todos os assets do kit: cada .glb exportado como PNG
    if RENDER_ALL_GLB:
        render_all_glb_assets(kit_path, all_assets_dir, RENDER_DIRECTIONS)

    print("Done. Towers:", out_dir)
    print("Tiles:", tiles_out_dir)
    if RENDER_ALL_GLB:
        print("All GLB:", all_assets_dir)


if __name__ == "__main__":
    main()
