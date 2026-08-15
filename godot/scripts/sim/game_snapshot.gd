class_name GameSnapshot
extends RefCounted
## Contrato de assert do runner headless. then{} é subconjunto destas chaves.

var gold: int = 0
var hp: int = 0
var wave: int = 0
var pause: bool = true
var energy: int = 0
var outcome: String = "playing"
var monsters_alive: int = 0
var monsters_leaked: int = 0
var monsters_killed: int = 0
var towers: Array = []
var grid_rows: int = 15
var grid_cols: int = 15
var tile_size: float = 1.0
var camera_elevation: int = 38
var selected_row: int = -1
var selected_col: int = -1
var portal_left_rows: Array = []
var portal_right_col: int = 14
var kenney_phase1_ok: bool = false
var catalog: Dictionary = {}


func to_dict() -> Dictionary:
	return {
		"gold": gold,
		"hp": hp,
		"wave": wave,
		"pause": pause,
		"energy": energy,
		"outcome": outcome,
		"monsters_alive": monsters_alive,
		"monsters_leaked": monsters_leaked,
		"monsters_killed": monsters_killed,
		"towers": towers.duplicate(true),
		"grid_rows": grid_rows,
		"grid_cols": grid_cols,
		"tile_size": tile_size,
		"camera_elevation": camera_elevation,
		"selected_row": selected_row,
		"selected_col": selected_col,
		"portal_left_rows": portal_left_rows.duplicate(),
		"portal_right_col": portal_right_col,
		"kenney_phase1_ok": kenney_phase1_ok,
		"catalog": catalog.duplicate(true),
	}


func to_json() -> String:
	return JSON.stringify(to_dict())
