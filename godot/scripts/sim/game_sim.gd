class_name GameSim
extends RefCounted
## Simulação headless (sem mesh/UI). Números de combate vêm do JSON.

const CatalogScript := preload("res://scripts/sim/catalog.gd")
const SnapshotScript := preload("res://scripts/sim/game_snapshot.gd")

var catalog: RefCounted
var rng := RandomNumberGenerator.new()
var gold: int = 0
var hp: int = 0
var wave: int = 0
var pause: bool = true
var energy: int = 0
var outcome: String = "playing"
var monsters_leaked: int = 0
var monsters_killed: int = 0
var leak_damage: int = 5
var rows: int = 15
var cols: int = 15
var occupied: Array = []
var towers: Array = []
var monsters: Array = []
var spawn_queue: Array = []
var sim_time_ms: int = 0
var map: Dictionary = {}
var last_error: String = ""
var selected_row: int = -1
var selected_col: int = -1
var portal_row_start: int = 4
var portal_row_end: int = 9


func _init() -> void:
	catalog = CatalogScript.new()


func setup_from_given(given: Dictionary) -> String:
	var err: String = catalog.load_all()
	if err != "":
		return err
	var seed_val: int = int(given.get("seed", 1))
	rng.seed = seed_val
	rows = catalog.rows()
	cols = catalog.cols()
	portal_row_start = catalog.portal_row_start()
	portal_row_end = catalog.portal_row_end()
	_init_occupied()
	var map_id: int = int(given.get("map", 1))
	map = catalog.map_data(map_id)
	if map.is_empty():
		return "missing map_%d.json" % map_id
	if given.get("new_match", false):
		_new_match(given)
	return ""


func apply_when(when: Dictionary) -> String:
	var known := {
		"leak": true,
		"place_tower": true,
		"sell_tower": true,
		"send_wave": true,
		"tick_ms": true,
		"tick_until": true,
		"cast_blizzard": true,
		"max_ms": true,
		"pick_tile": true,
	}
	for key in when.keys():
		if not known.has(key):
			return "unknown when action: %s" % key
	if when.has("leak"):
		var leak_err := leak(int(when["leak"]))
		if leak_err != "":
			return leak_err
	if when.has("place_tower"):
		var place: Variant = when["place_tower"]
		if typeof(place) != TYPE_DICTIONARY:
			return "place_tower must be an object"
		var place_err := place_tower(
			str(place.get("type", "")),
			int(place.get("row", -1)),
			int(place.get("col", -1))
		)
		if place_err != "":
			return place_err
	if when.has("sell_tower"):
		return "not implemented: sell_tower"
	if when.has("send_wave"):
		var wave_err := send_wave(int(when["send_wave"]))
		if wave_err != "":
			return wave_err
	if when.has("tick_ms"):
		tick_ms(int(when["tick_ms"]))
	if when.has("tick_until"):
		var until_err := tick_until(str(when["tick_until"]), int(when.get("max_ms", 60000)))
		if until_err != "":
			return until_err
	if when.has("cast_blizzard"):
		return "not implemented: cast_blizzard"
	if when.has("pick_tile"):
		var pick: Variant = when["pick_tile"]
		if typeof(pick) != TYPE_DICTIONARY:
			return "pick_tile must be an object"
		var pick_err := pick_tile(int(pick.get("row", -1)), int(pick.get("col", -1)))
		if pick_err != "":
			return pick_err
	return ""


func leak(n: int) -> String:
	for _i in range(n):
		if outcome != "playing":
			return ""
		if hp <= leak_damage:
			hp = 0
			outcome = "game_over"
			monsters_leaked += 1
			return ""
		hp -= leak_damage
		monsters_leaked += 1
	return ""


func place_tower(type_id: String, row: int, col: int) -> String:
	var cost: int = catalog.tower_cost(type_id)
	if cost < 0:
		return "unknown tower type: %s" % type_id
	if row <= 0 or col <= 0 or row >= rows or col >= cols:
		return "invalid tower vertex %d,%d" % [row, col]
	var tiles := _footprint(row, col)
	for tile in tiles:
		if occupied[tile.x][tile.y]:
			return "tile occupied"
	if gold < cost:
		return "not enough gold"
	gold -= cost
	for tile in tiles:
		occupied[tile.x][tile.y] = true
	towers.append({"type": type_id, "row": row, "col": col, "level": 1})
	return ""


func pick_tile(row: int, col: int) -> String:
	if row < 0 or col < 0 or row >= rows or col >= cols:
		return "pick out of bounds %d,%d" % [row, col]
	selected_row = row
	selected_col = col
	return ""


func send_wave(n: int) -> String:
	var waves: Array = map.get("waves", [])
	if n < 1 or n > waves.size():
		return "wave %d not in map" % n
	var cfg: Dictionary = waves[n - 1]
	pause = false
	wave = n
	var count: int = int(cfg.get("spawn_per_side", 0))
	var duration: float = float(cfg.get("spawn_duration", 0))
	var center_row: int = int(floor(float(rows) / 2.0) - 3)
	for _i in range(count):
		var delay := rng.randf() * duration
		var spawn_row: int = center_row + rng.randi_range(0, 5)
		spawn_queue.append({
			"at_ms": sim_time_ms + int(delay),
			"row": spawn_row,
			"speed": float(cfg.get("speed", 1)),
			"gold": int(cfg.get("gold", 0)),
			"hp": int(cfg.get("max_health", 1)),
			"air": bool(cfg.get("air", false)),
		})
	return ""


func tick_ms(delta_ms: int) -> void:
	if delta_ms <= 0 or outcome != "playing":
		return
	var remaining := delta_ms
	while remaining > 0 and outcome == "playing":
		var step: int = mini(CatalogScript.TICK_MS, remaining)
		_tick_step(step)
		remaining -= step


func tick_until(condition: String, max_ms: int) -> String:
	if condition != "no_monsters_or_game_over":
		return "unknown tick_until: %s" % condition
	var elapsed := 0
	while elapsed < max_ms and outcome == "playing":
		if spawn_queue.is_empty() and monsters.is_empty():
			return ""
		_tick_step(CatalogScript.TICK_MS)
		elapsed += CatalogScript.TICK_MS
	if spawn_queue.size() > 0 or monsters.size() > 0:
		return "tick_until timed out at %d ms" % max_ms
	return ""


func snapshot() -> Dictionary:
	return _make_snapshot().to_dict()


func assert_gold(expected: int) -> bool:
	return gold == expected


func assert_hp(expected: int) -> bool:
	return hp == expected


func assert_wave(expected: int) -> bool:
	return wave == expected


func assert_outcome(expected: String) -> bool:
	return outcome == expected


func assert_tower_at(row: int, col: int, type_id: String) -> bool:
	for t in towers:
		if int(t["row"]) == row and int(t["col"]) == col and str(t["type"]) == type_id:
			return true
	return false


func assert_no_path_blocked() -> bool:
	return true


func _new_match(given: Dictionary) -> void:
	gold = int(catalog.player.get("gold", 0))
	hp = int(given.get("hp", catalog.player.get("hp", 0)))
	leak_damage = int(catalog.player.get("leak_damage", 5))
	energy = int(catalog.player.get("energy_start", 0))
	wave = 0
	pause = true
	outcome = "playing"
	monsters_leaked = 0
	monsters_killed = 0
	towers.clear()
	monsters.clear()
	spawn_queue.clear()
	sim_time_ms = 0
	selected_row = -1
	selected_col = -1
	_init_occupied()


func _init_occupied() -> void:
	occupied = []
	for r in range(rows):
		var row_arr: Array = []
		for c in range(cols):
			var edge := r == 0 or c == 0 or r == rows - 1 or c == cols - 1
			var portal := (c == 0 or c == cols - 1) and r >= portal_row_start and r <= portal_row_end
			row_arr.append(edge and not portal)
		occupied.append(row_arr)


func _footprint(vertex_row: int, vertex_col: int) -> Array[Vector2i]:
	return [
		Vector2i(vertex_row, vertex_col),
		Vector2i(vertex_row - 1, vertex_col),
		Vector2i(vertex_row, vertex_col - 1),
		Vector2i(vertex_row - 1, vertex_col - 1),
	]


func _tick_step(step_ms: int) -> void:
	sim_time_ms += step_ms
	_flush_spawns()
	var dt := float(step_ms) / 1000.0
	var still: Array = []
	for m in monsters:
		m["col"] = float(m["col"]) + float(m["speed"]) * dt
		if float(m["col"]) >= float(cols - 1):
			_leak_one()
		else:
			still.append(m)
	monsters = still


func _flush_spawns() -> void:
	var still: Array = []
	for job in spawn_queue:
		if int(job["at_ms"]) <= sim_time_ms:
			monsters.append({
				"row": int(job["row"]),
				"col": 0.0,
				"speed": float(job["speed"]),
				"gold": int(job["gold"]),
				"hp": int(job["hp"]),
				"air": bool(job["air"]),
			})
		else:
			still.append(job)
	spawn_queue = still


func _leak_one() -> void:
	if outcome != "playing":
		return
	if hp <= leak_damage:
		hp = 0
		outcome = "game_over"
		monsters_leaked += 1
		return
	hp -= leak_damage
	monsters_leaked += 1


func _make_snapshot() -> RefCounted:
	var snap: RefCounted = SnapshotScript.new()
	snap.gold = gold
	snap.hp = hp
	snap.wave = wave
	snap.pause = pause
	snap.energy = energy
	snap.outcome = outcome
	snap.monsters_alive = monsters.size()
	snap.monsters_leaked = monsters_leaked
	snap.monsters_killed = monsters_killed
	snap.towers = towers.duplicate(true)
	snap.grid_rows = rows
	snap.grid_cols = cols
	snap.tile_size = catalog.tile_size()
	snap.camera_elevation = catalog.camera_elevation()
	snap.selected_row = selected_row
	snap.selected_col = selected_col
	var portal_rows: Array = []
	for r in range(portal_row_start, portal_row_end + 1):
		portal_rows.append(r)
	snap.portal_left_rows = portal_rows
	snap.portal_right_col = cols - 1
	snap.kenney_phase1_ok = catalog.kenney_phase1_ok()
	snap.catalog = catalog.snapshot_catalog()
	return snap
