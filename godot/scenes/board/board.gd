extends Node3D
## Board 15×15 Desert, câmera ortográfica ~38°, picking no plano Y=0 (WSN-58).

const CatalogScript := preload("res://scripts/sim/catalog.gd")
const SAND := Color(0.949, 0.843, 0.627)
const DIRT := Color(0.773, 0.545, 0.227)
const SPAWN := Color(0.55, 0.78, 0.42)
const EXIT := Color(0.82, 0.38, 0.32)

var catalog: RefCounted
var selected_row: int = -1
var selected_col: int = -1
var _camera: Camera3D
var _selection: MeshInstance3D


func _ready() -> void:
	catalog = CatalogScript.new()
	var err: String = catalog.load_all()
	if err != "":
		push_error(err)
	_build_grid()
	_setup_light()
	_setup_camera()
	_setup_selection()


func select_tile(row: int, col: int) -> bool:
	if row < 0 or col < 0 or row >= catalog.rows() or col >= catalog.cols():
		return false
	selected_row = row
	selected_col = col
	if _selection != null:
		_selection.visible = true
		_selection.position = Vector3(float(col), 0.22, float(row))
	return true


func _unhandled_input(event: InputEvent) -> void:
	if _camera == null or not (event is InputEventMouseButton):
		return
	var mb := event as InputEventMouseButton
	if not mb.pressed or mb.button_index != MOUSE_BUTTON_LEFT:
		return
	var from := _camera.project_ray_origin(mb.position)
	var dir := _camera.project_ray_normal(mb.position)
	if absf(dir.y) < 0.0001:
		return
	var dist := -from.y / dir.y
	if dist < 0.0:
		return
	var hit := from + dir * dist
	select_tile(int(round(hit.z)), int(round(hit.x)))


func _build_grid() -> void:
	var tiles := Node3D.new()
	tiles.name = "Tiles"
	add_child(tiles)
	for row in range(catalog.rows()):
		for col in range(catalog.cols()):
			var kind := _tile_kind(row, col)
			var node := _make_tile(kind)
			node.name = "tile_%d_%d" % [row, col]
			node.position = Vector3(float(col), 0.0, float(row))
			tiles.add_child(node)


func _tile_kind(row: int, col: int) -> String:
	var start: int = catalog.portal_row_start()
	var end_row: int = catalog.portal_row_end()
	var last_col: int = catalog.cols() - 1
	if col == 0 and row >= start and row <= end_row:
		return "tile-spawn"
	if col == last_col and row >= start and row <= end_row:
		return "tile-spawn-end"
	if row >= start and row <= end_row:
		return "tile-dirt"
	return "tile"


func _make_tile(kind: String) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var mesh_res: Mesh = _load_kenney_mesh(kind)
	if mesh_res != null:
		mi.mesh = mesh_res
		return mi
	var box := BoxMesh.new()
	box.size = Vector3(0.95, 0.2, 0.95)
	mi.mesh = box
	var mat := StandardMaterial3D.new()
	match kind:
		"tile-dirt":
			mat.albedo_color = DIRT
		"tile-spawn":
			mat.albedo_color = SPAWN
		"tile-spawn-end":
			mat.albedo_color = EXIT
		_:
			mat.albedo_color = SAND
	mi.material_override = mat
	return mi


func _load_kenney_mesh(kind: String) -> Mesh:
	for ext in ["glb", "obj"]:
		var path := "res://assets/models/%s.%s" % [kind, ext]
		if not FileAccess.file_exists(path):
			continue
		var loaded: Variant = load(path)
		if loaded is Mesh:
			return loaded
		if loaded is PackedScene:
			var inst: Node = loaded.instantiate()
			var found := _find_mesh(inst)
			inst.queue_free()
			return found
	return null


func _find_mesh(node: Node) -> Mesh:
	if node is MeshInstance3D:
		return (node as MeshInstance3D).mesh
	for child in node.get_children():
		var mesh := _find_mesh(child)
		if mesh != null:
			return mesh
	return null


func _setup_camera() -> void:
	_camera = Camera3D.new()
	_camera.name = "Camera3D"
	_camera.projection = Camera3D.PROJECTION_ORTHOGONAL
	_camera.current = true
	var rows: int = catalog.rows()
	var cols: int = catalog.cols()
	var center := Vector3((float(cols) - 1.0) * 0.5, 0.0, (float(rows) - 1.0) * 0.5)
	var elevation := deg_to_rad(float(catalog.camera_elevation()))
	var dist := 22.0
	_camera.position = center + Vector3(0.0, dist * sin(elevation), dist * cos(elevation))
	_camera.look_at(center, Vector3.UP)
	_camera.size = 18.0
	add_child(_camera)


func _setup_light() -> void:
	var sun := DirectionalLight3D.new()
	sun.name = "Sun"
	sun.rotation_degrees = Vector3(-50.0, 30.0, 0.0)
	sun.light_energy = 1.1
	add_child(sun)
	var env := WorldEnvironment.new()
	env.name = "WorldEnvironment"
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color(0.62, 0.78, 0.92)
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color(0.85, 0.82, 0.75)
	environment.ambient_light_energy = 0.45
	env.environment = environment
	add_child(env)


func _setup_selection() -> void:
	_selection = MeshInstance3D.new()
	_selection.name = "Selection"
	var mesh_res: Mesh = _load_kenney_mesh("selection-a")
	if mesh_res != null:
		_selection.mesh = mesh_res
	else:
		var box := BoxMesh.new()
		box.size = Vector3(1.02, 0.04, 1.02)
		_selection.mesh = box
		var mat := StandardMaterial3D.new()
		mat.albedo_color = Color(0.2, 0.95, 0.35, 0.65)
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		_selection.material_override = mat
	_selection.visible = false
	add_child(_selection)
