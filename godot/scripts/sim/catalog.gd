class_name Catalog
extends RefCounted
## Carrega JSON de res://data/ e, se faltar mapa/constants, de ../godot-export/data/.

const TILE_SIZE_M := 1.0
const TICK_MS := 50
const CAMERA_ELEVATION_DEG := 38
const PHASE1_MODELS := [
	"tile",
	"tile-dirt",
	"tile-spawn",
	"tile-spawn-end",
	"tile-straight",
	"selection-a",
	"tower-square-bottom-a",
	"tower-square-middle-a",
	"tower-square-roof-a",
	"weapon-ballista",
]

var player: Dictionary = {}
var towers: Dictionary = {}
var skills: Dictionary = {}
var progression: Dictionary = {}
var constants: Dictionary = {}
var maps: Dictionary = {}


func load_all() -> String:
	player = _read_required("player.json")
	if player.is_empty():
		return "missing player.json"
	towers = _read_required("towers.json")
	if towers.is_empty():
		return "missing towers.json"
	skills = _read_required("skills.json")
	if skills.is_empty():
		return "missing skills.json"
	progression = _read_required("progression.json")
	if progression.is_empty():
		return "missing progression.json"
	constants = _read_optional("constants.json")
	if constants.is_empty():
		constants = _read_export("constants.json")
	if constants.is_empty():
		return "missing constants.json"
	return ""


func map_data(map_id: int) -> Dictionary:
	if maps.has(map_id):
		return maps[map_id]
	var name := "map_%d.json" % map_id
	var data := _read_optional(name)
	if data.is_empty():
		data = _read_export(name)
	maps[map_id] = data
	return data


func rows() -> int:
	return int(_grid().get("rows", 15))


func cols() -> int:
	return int(_grid().get("cols", 15))


func portal_row_start() -> int:
	return int(_grid().get("portal_row_start", 4))


func portal_row_end() -> int:
	return int(_grid().get("portal_row_end", 9))


func tile_size() -> float:
	return float(_grid().get("tile_size_m", TILE_SIZE_M))


func camera_elevation() -> int:
	return int(constants.get("camera", {}).get("elevation_deg", CAMERA_ELEVATION_DEG))


func tower_cost(type_id: String) -> int:
	var t: Variant = towers.get(type_id, null)
	if typeof(t) != TYPE_DICTIONARY:
		return -1
	return int(t.get("cost", -1))


func map_wave_count(map_id: int) -> int:
	return map_data(map_id).get("waves", []).size()


func kenney_phase1_ok() -> bool:
	for model_name in PHASE1_MODELS:
		var obj_path := "res://assets/models/%s.obj" % model_name
		var glb_path := "res://assets/models/%s.glb" % model_name
		if not FileAccess.file_exists(obj_path) and not FileAccess.file_exists(glb_path):
			return false
	return true


func snapshot_catalog() -> Dictionary:
	var heavy: Dictionary = towers.get("heavy-gun", {})
	var heat: Dictionary = heavy.get("heat", {})
	var energy: Dictionary = skills.get("energy", {})
	var blizzard: Dictionary = skills.get("blizzard", {})
	var maps_prog: Dictionary = progression.get("maps", {})
	var map1: Dictionary = maps_prog.get("1", {})
	var rewards: Dictionary = progression.get("map_rewards", {})
	var reward1: Dictionary = rewards.get("1", {})
	return {
		"towers_count": towers.size(),
		"machine_gun_cost": tower_cost("machine-gun"),
		"heavy_gun_heat_max": int(heat.get("max", 0)),
		"blizzard_cost": int(blizzard.get("cost", -1)),
		"energy_max": int(energy.get("max_segments", 0)),
		"energy_regen_ms": int(energy.get("regen_ms", 0)),
		"player_hp": int(player.get("hp", 0)),
		"player_gold": int(player.get("gold", 0)),
		"leak_damage": int(player.get("leak_damage", 0)),
		"max_equipped": int(player.get("max_equipped", 0)),
		"map_1_unlocked": bool(map1.get("unlocked", false)),
		"map_2_wave_count": map_wave_count(2),
		"map_3_wave_count": map_wave_count(3),
		"map_4_wave_count": map_wave_count(4),
		"map_5_wave_count": map_wave_count(5),
		"map_1_reward": str(reward1.get("tower", "")),
	}


func _grid() -> Dictionary:
	return constants.get("grid", {})


func _read_required(filename: String) -> Dictionary:
	var data := _read_json("res://data/%s" % filename)
	if data.is_empty():
		data = _read_export(filename)
	return data


func _read_optional(filename: String) -> Dictionary:
	return _read_json("res://data/%s" % filename)


func _read_export(filename: String) -> Dictionary:
	var abs := _export_dir().path_join(filename)
	return _read_json(abs)


func _export_dir() -> String:
	var godot_root := ProjectSettings.globalize_path("res://").rstrip("/\\")
	return godot_root.path_join("..").path_join("godot-export").path_join("data")


func _read_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		return {}
	var parsed: Variant = JSON.parse_string(f.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return {}
	return parsed
