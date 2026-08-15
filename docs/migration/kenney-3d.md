# De-para Kenney 3D

Override visual 2D → GLB do [Kenney Tower Defense Kit](https://kenney.nl/assets/tower-defense-kit) (CC0). Godot importa os GLB **direto** — o bake PNG/WebP em `scripts/blender/` é legado do cliente Pixi.

Fonte da composição: `TOWER_RENDERS` em [`scripts/blender/render_tower_sprites.py`](../../scripts/blender/render_tower_sprites.py). Kit: `kenney_tower-defense-kit/Models/GLB format/` (na raiz do workspace). Destino Godot: `tower-tatics-3D/assets/models/`. Import: `npm run import:kenney` (GLB se existir; senão OBJ).

Textura do kit: paleta oficial `colormap.png` (CC0). Copiar de `kenney_tower-defense-kit/Models/GLB format/Textures/` via `npm run import:kenney`. Sem essa paleta o albedo `Kd 1 1 1` deixa o tabuleiro branco. `KenneyMesh` liga `vertex_color_use_as_albedo` e filtro nearest; se o GLB vier sem textura, aplica o colormap.

## Torres

IDs de jogo (`machine-gun`, …) → stack de meshes Kenney. Armas e munição são nós filhos; a base não gira, a arma sim.

| ID | Base Kenney | Arma | Munição (projétil) |
|---|---|---|---|
| `machine-gun` | `tower-square-bottom-a` + `middle-a` + `roof-a` | `weapon-ballista` | `weapon-ammo-bullet` |
| `heavy-gun` | `tower-square-bottom-b` + `middle-b` + `top-b` | `weapon-turret` | — |
| `missile` | `tower-square-bottom-c` + `middle-c` + `top-c` | `weapon-cannon` | `weapon-ammo-cannonball` |
| `anti-air` | `tower-round-base` + `bottom-a` + `build-a` + `middle-a` + `top-a` | `weapon-turret` | — |
| `freeze` | `tower-round-base` + `bottom-b` + `build-b` + `middle-b` + `top-b` | `weapon-turret` | — |
| `electric` | `tower-round-base` + `bottom-c` + `build-c` + `middle-c` | `tower-round-crystals` | — |

Notas:

- Square **a** usa `roof-a`; square **b/c** usam `top-b` / `top-c` (é o que o Blender já monta).
- Round stacks incluem `tower-round-base` + `build-*`. Electric não tem `top`/`roof`: os crystals substituem o telhado.
- Stats L1–L6, heat e targeting **não** vêm daqui — ver [towers.md](../game-design/towers.md) e o JSON exportado.

## Tiles e seleção

| Uso | GLB |
|---|---|
| Chão padrão | `tile` |
| Terra / path | `tile-dirt` |
| Spawn (portal esquerdo) | `tile-spawn` |
| Destino (portal direito) | `tile-spawn-end` |
| Path extra | `tile-straight`, `tile-crossing`, `tile-bump`, `tile-corner-*` |
| Preview de seleção | `selection-a` (primário), `selection-b` (secundário) |

### Biomas (Fase 6)

Tintas já no JSON (`godot-export/data/maps_list.json` / `maps-assets.ts`). Ice usa meshes de neve; os outros reusam `tile` / `tile-dirt` + tint + props.

| Mapa | Tiles | Props | Tint tile / dirt |
|---|---|---|---|
| 1 Desert | `tile`, `tile-dirt`, `tile-spawn`, `tile-spawn-end` | `detail-dirt`, `detail-rocks`, `detail-tree` | `#f2d7a0` / `#c58b3a` |
| 2 Cemetery | mesmos + tinta | `tile-rock`, `detail-tree` | `#6a7a6b` / `#4c4f52` |
| 3 Garden | mesmos + tinta | `detail-tree`, `detail-crystal` | `#88c96b` / `#5e8f43` |
| 4 Ice | `snow-tile*`, `snow-detail*` | `snow-detail*` | `#c8e8ff` / `#7fb2ff` |
| 5 Hell | mesmos + tinta | `detail-crystal`, `tile-rock` | `#803030` / `#ff7a3c` |

## Gap de monstros

O kit TD tem **~160 meshes, 0 animações**, e **não inclui** os 11 tipos do jogo:

`slime`, `goblin`, `wolf`, `bee`, `plant`, `plantZombie`, `plantFire`, `orc`, `orcLord`, `slimeBoned`, `slimeVulcan`.

| Grupo | Stand-in até arte própria |
|---|---|
| Aéreos (`bee`, flag `air`) | `enemy-ufo-a` … `enemy-ufo-d` |
| Terrestres | mesh primitiva (cápsula/box) — **não bloqueia** lógica das Fases 2–3 |

Decisão de kit futuro (Kenney Characters ou arte própria): [WSN-77](https://linear.app/wsn-workspace/issue/WSN-77). Tipo no JSON continua a escolher só visual; stats vêm da wave.

## O que não usar do kit 2D

- 36 frames de rotação PNG (`ROTATION_FRAMES`) — no Godot a arma gira no eixo Y.
- `kenney_all/*.png` e WebP em `public/assets/frames/`.
- `ColorRect` / `Polygon2D` do proto `tower-tatics-3D`.
