# Pathfinding / Sim

`scripts/sim/` — Sim headless + `GameSnapshot` (WSN-80). Runner: `godot --headless --path godot -s res://test/cli_runner.gd`.

Quando WSN-61 começar: **portar** `tower-tatics-3D/scripts/pathfinding/grid_astar.gd` (A* 12-dir). Não reescrever do zero. Não copiar cenas Node2D.

Ajustes vs o proto: grid 15×15, tile 1 m, `canPlaceTowerWithoutBlocking` (6 spawns → 6 portais).
