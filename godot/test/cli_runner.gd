extends SceneTree
## Runner headless: godot --headless --path godot -s res://test/cli_runner.gd -- --specs ../docs/specs

const GameSimScript := preload("res://scripts/sim/game_sim.gd")


func _init() -> void:
	call_deferred("_run")


func _run() -> void:
	var specs_dir := _resolve_specs_dir()
	if specs_dir == "":
		print(JSON.stringify({"id": "runner", "ok": false, "error": "specs dir not found"}))
		quit(1)
		return
	var files := _list_specs(specs_dir)
	if files.is_empty():
		print(JSON.stringify({"id": "runner", "ok": false, "error": "no spec JSON in %s" % specs_dir}))
		quit(1)
		return
	var failed := 0
	for path in files:
		var result := _run_spec(path)
		print(JSON.stringify(result))
		if not result.get("ok", false):
			failed += 1
	quit(0 if failed == 0 else 1)


func _resolve_specs_dir() -> String:
	var args := OS.get_cmdline_user_args()
	var i := 0
	while i < args.size():
		if args[i] == "--specs" and i + 1 < args.size():
			return _normalize_dir(args[i + 1])
		i += 1
	var godot_root := ProjectSettings.globalize_path("res://").rstrip("/\\")
	return _normalize_dir(godot_root.path_join("..").path_join("docs").path_join("specs"))


func _normalize_dir(path: String) -> String:
	if path.begins_with("res://"):
		path = ProjectSettings.globalize_path(path)
	var abs := path
	if not abs.is_absolute_path():
		abs = ProjectSettings.globalize_path("res://").rstrip("/\\").path_join(path)
	if DirAccess.dir_exists_absolute(abs):
		return abs
	return ""


func _list_specs(dir_path: String) -> PackedStringArray:
	var out: PackedStringArray = []
	var d := DirAccess.open(dir_path)
	if d == null:
		return out
	d.list_dir_begin()
	var name := d.get_next()
	while name != "":
		if not d.current_is_dir() and name.ends_with(".json") and name != "spec.schema.json":
			out.append(dir_path.path_join(name))
		name = d.get_next()
	d.list_dir_end()
	out.sort()
	return out


func _run_spec(path: String) -> Dictionary:
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		return {"id": path.get_file(), "ok": false, "error": "cannot read file"}
	var parsed: Variant = JSON.parse_string(f.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return {"id": path.get_file(), "ok": false, "error": "invalid JSON"}
	var spec: Dictionary = parsed
	var spec_id := str(spec.get("id", path.get_file().get_basename()))
	var sim: RefCounted = GameSimScript.new()
	var given: Dictionary = spec.get("given", {})
	var setup_err: String = sim.setup_from_given(given)
	if setup_err != "":
		return {"id": spec_id, "ok": false, "error": setup_err}
	var when: Dictionary = spec.get("when", {})
	var when_err: String = sim.apply_when(when)
	if when_err != "":
		return {"id": spec_id, "ok": false, "error": when_err}
	var then_dict: Dictionary = spec.get("then", {})
	var snap: Dictionary = sim.snapshot()
	var diff := _diff_then(then_dict, snap)
	if diff != "":
		return {"id": spec_id, "ok": false, "error": diff, "snapshot": snap}
	return {"id": spec_id, "ok": true}


func _diff_then(then_dict: Dictionary, snap: Dictionary) -> String:
	for key in then_dict.keys():
		if not snap.has(key):
			return "%s: missing in snapshot" % key
		var err := _values_equal(str(key), then_dict[key], snap[key])
		if err != "":
			return err
	return ""


func _values_equal(path: String, expected: Variant, actual: Variant) -> String:
	if typeof(expected) == TYPE_ARRAY:
		if typeof(actual) != TYPE_ARRAY:
			return "%s: expected array" % path
		var exp_arr: Array = expected
		var act_arr: Array = actual
		if exp_arr.size() != act_arr.size():
			return "%s: expected %d items got %d" % [path, exp_arr.size(), act_arr.size()]
		for i in range(exp_arr.size()):
			var item_err := _values_equal("%s[%d]" % [path, i], exp_arr[i], act_arr[i])
			if item_err != "":
				return item_err
		return ""
	if typeof(expected) == TYPE_DICTIONARY:
		if typeof(actual) != TYPE_DICTIONARY:
			return "%s: expected object" % path
		var exp_d: Dictionary = expected
		var act_d: Dictionary = actual
		for k in exp_d.keys():
			if not act_d.has(k):
				return "%s.%s: missing" % [path, k]
			var field_err := _values_equal("%s.%s" % [path, k], exp_d[k], act_d[k])
			if field_err != "":
				return field_err
		return ""
	if typeof(expected) == TYPE_FLOAT or typeof(actual) == TYPE_FLOAT:
		if float(expected) != float(actual):
			return "%s: expected %s got %s" % [path, str(expected), str(actual)]
		return ""
	if expected != actual:
		return "%s: expected %s got %s" % [path, str(expected), str(actual)]
	return ""
