# De-para Kenney 3D

Override visual 2D → mesh do [Kenney Tower Defense Kit](https://kenney.nl/assets/tower-defense-kit) (CC0). Godot importa GLB **direto**; o kit local neste workspace vem sobretudo em **OBJ**. Bake PNG/WebP em `scripts/blender/` é legado do cliente Pixi.

Look e proporções (escala 1,7, **só a arma**, o que não empilhar): [`tower-tatics-3D/docs/visual.md`](../../tower-tatics-3D/docs/visual.md). Código: [`tower_visual_catalog.gd`](../../tower-tatics-3D/scripts/tower_visual_catalog.gd).

Kit: `kenney_tower-defense-kit/Models/` (GLB se existir; senão OBJ). Destino: `tower-tatics-3D/assets/models/`. Import: `npm run import:kenney`.

Textura: paleta oficial `colormap.png` (CC0). Sem ela o albedo `Kd 1 1 1` deixa o tabuleiro branco. `KenneyMesh` liga `vertex_color_use_as_albedo` e filtro nearest.

## Torres

IDs de jogo → arma Kenney no chão (sem plinto). A arma gira no XZ. Peças do kit nascem com frente em **+Z**; o Godot `look_at` usa **−Z**, então a receita aplica `weapon_yaw = 180`.

Todas as torres usam `FOOTPRINT_SCALE = 1.7` (modelo 1×1 no footprint 2×2).

| ID | Loja | Arma | Munição (projétil) |
|---|---|---|---|
| `machine-gun` | Ballista | `weapon-ballista` | `weapon-ammo-arrow` |
| `heavy-gun` | Catapult | `weapon-catapult` | `weapon-ammo-boulder` |
| `missile` | Cannon | `weapon-cannon` | `weapon-ammo-cannonball` |
| `anti-air` | AA | `weapon-turret` | `weapon-ammo-bullet` |
| `freeze` | Ice | `weapon-turret` (tint gelo) | esfera de gelo |
| `electric` | Crystal | `tower-round-crystals` | — (arcos) |

Notas:

- Sem plinto (`tower-*-bottom-*` / `tower-round-base`). A arma senta em `y = 0`.
- Não usar `tower-square-roof-*` nem `middle-*`: o telhado cobre a arma.
- Specs: [`kenney-tower-type-models.json`](../specs/kenney-tower-type-models.json), [`tower-visual-facing-projectiles.json`](../specs/tower-visual-facing-projectiles.json) (yaw 180, flecha pequena, arco alto).
- Stats L1–L6 e targeting **não** vêm daqui — ver [towers.md](../game-design/towers.md) e o JSON exportado.

## Tiles e seleção

| Uso | Mesh |
|---|---|
| Chão padrão | `tile` |
| Terra / path | `tile-dirt` |
| Spawn (portal esquerdo) | `tile-spawn` |
| Destino (portal direito) | `tile-spawn-end` |
| Preview de seleção | `selection-a` (primário), `selection-b` (secundário) |
| Decoração (borda, escala 0,62) | `detail-tree`, `detail-tree-large`, `detail-rocks` |

Não colocar `tile-wide-transition` / `tile-wide-straight` no grid de 1 m: `tile-wide-transition` tem **2 m** de largura.

### Biomas (Fase 6)

Tintas já no JSON (`godot-export/data/maps_list.json` / `maps-assets.ts`). Ice usa meshes de neve; os outros reusam `tile` / `tile-dirt` + tint + props. **Ainda não ligados** no board Godot (um look só).

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

Stand-in atual (escala 0,72):

| Grupo | Mesh |
|---|---|
| Aéreos (`bee`, flag `air`) | `enemy-ufo-d` |
| `goblin`, `wolf`, `orc`, `orcLord` | `enemy-ufo-b` |
| `plant`, `plantZombie`, `plantFire` | `enemy-ufo-c` |
| Resto | `enemy-ufo-a` |

Decisão de kit futuro (Kenney Characters ou arte própria): [WSN-77](https://linear.app/wsn-workspace/issue/WSN-77). Tipo no JSON continua a escolher só visual; stats vêm da wave.

## O que não usar do kit 2D

- 36 frames de rotação PNG (`ROTATION_FRAMES`) — no Godot a arma gira no eixo Y.
- `kenney_all/*.png` e WebP em `public/assets/frames/`.
- `ColorRect` / `Polygon2D` do proto `tower-tatics-3D`.
