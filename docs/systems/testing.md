# Testes — TDD + SpecDriven

Sim: o agente valida o jogo **pelo terminal**, não por screenshot. Toda regra de [`game-design/`](../game-design/overview.md) vira spec JSON em [`docs/specs/`](../specs/README.md) **antes** do código. O contrato **visual** (câmera 3/4, tiles não brancos, vertex color Kenney) também é snapshot JSON (`visual` em `GameSnapshot`) — não uma captura de ecrã.

## Por que isso funciona para o agente

Screenshot e “parece certo” são frágeis (câmera, GPU, timing). O contrato é um **snapshot JSON** do estado da partida + exit code do runner headless.

```
spec JSON  →  Sim (sem render)  →  snapshot  →  then{}  →  stdout TAP/JSON
godot --headless -s res://test/cli_runner.gd
```

Eu (agente) corro o comando, leio o relatório, e sei se gold/HP/ondas/torres batem com a spec.

## Camadas

| Camada | O que testa | Precisa de cena 3D? | Ferramenta |
|---|---|---|---|
| **Unit** | Pathfinder, dano, economia, catálogo JSON, heat | Não (`RefCounted`) | GdUnit4 **ou** `cli_runner` |
| **Integração** | Partida headless: place, spawn, tick, leak, win | Não (Sim + JSON) | specs `layer: integration` |
| **E2E** | HUD, click, pause, Blizzard no viewport | Sim | GdUnit4 SceneRunner, poucos casos |

90% das regras de jogo são unit + integração. E2E só para input/UI.

## Snapshot (`GameSnapshot`)

Único objeto para assert. Serializa para JSON estável (chaves ordenadas).

```json
{
  "gold": 60,
  "hp": 100,
  "wave": 0,
  "pause": true,
  "energy": 0,
  "outcome": "playing",
  "monsters_alive": 0,
  "monsters_leaked": 0,
  "monsters_killed": 0,
  "towers": [
    { "type": "machine-gun", "row": 7, "col": 5, "level": 1 }
  ],
  "grid_rows": 15,
  "grid_cols": 15,
  "tile_size": 1,
  "camera_elevation": 38,
  "selected_row": -1,
  "selected_col": -1,
  "portal_left_rows": [4, 5, 6, 7, 8, 9],
  "portal_right_col": 14,
  "kenney_phase1_ok": true,
  "catalog": {},
  "visual": {
    "camera_pitch_deg": 38,
    "camera_yaw_deg": 42,
    "camera_not_top_down": true,
    "shadows_enabled": true,
    "sand_not_white": true,
    "dirt_differs_from_sand": true,
    "phantom_camera": true,
    "kenney_uses_vertex_color": true,
    "colormap_present": true,
    "grass_is_green": true,
    "dirt_is_warm": true,
    "path_contrasts_grass": true,
    "tiles_not_white": true,
    "tower_not_white": true
  }
}
```

`outcome`: `playing` | `victory` | `game_over`.

Helpers (GDScript, nomes estáveis):

```gdscript
assert_gold(60)
assert_hp(100)
assert_wave(0)
assert_outcome("playing")
assert_tower_at(7, 5, "machine-gun")
assert_no_path_blocked()
snapshot() # Dictionary — o agente compara com then{}
```

RNG da simulação: sempre `seed` na spec (`given.seed`). Sem seed → `1`.

Tick: `sim.tick_ms(delta)` em timestep **fixo** (ex. 50 ms). `tick_until` para quando `monsters_alive == 0` ou `outcome != playing`.

## Spec JSON

Ver schema em [`docs/specs/spec.schema.json`](../specs/spec.schema.json).

```json
{
  "id": "leak-costs-5-hp",
  "layer": "unit",
  "doc": "docs/game-design/maps-and-waves.md",
  "given": { "new_match": true, "map": 1 },
  "when": { "leak": 1 },
  "then": { "hp": 95, "monsters_leaked": 1 }
}
```

`then` é um **subconjunto** do snapshot: só as chaves listadas são comparadas.

Ações `when` permitidas (ir expandindo, nunca silenciosamente):

| Ação | Efeito |
|---|---|
| `leak: n` | n leaks de 5 HP |
| `place_tower: {type,row,col}` | compra se ouro e path ok |
| `sell_tower: {row,col}` | venda pre/mid-game |
| `send_wave: n` | spawna wave n |
| `tick_ms: n` | avança sim |
| `tick_until: "no_monsters_or_game_over"` | + `max_ms` |
| `cast_blizzard: {row,col}` | se energia >= 2 |
| `pick_tile: {row,col}` | seleciona tile no Board |
| `inspect_visual: true` | preenche `visual` (câmera, contraste Kenney, Phantom Camera, paleta) |
| `inspect_scene: true` | instancia o Board 3D e preenche `visual` com tiles/props/chão |

## Loop TDD (obrigatório)

1. Atualizar `docs/game-design/` se a regra for nova.
2. Escrever spec em `docs/specs/<id>.json` (vermelho: runner falha).
3. Código mínimo na Sim (sem mesh/UI).
4. Headless verde.
5. Só então cena Kenney / HUD.

Não implementar feature sem spec. Não “corrigir” quirks documentados para fazer teste passar.

## Como o agente corre os testes

```bash
# Valida schema das specs (sem Godot)
node scripts/validate-specs.mjs

# Godot headless (repo tower-tatics-3D)
npm run export:godot
npm run import:kenney
godot --headless --path ../tower-tatics-3D -s res://test/cli_runner.gd -- --specs docs/specs
```

Stdout esperado: uma linha JSON por spec (`{"id":"...","ok":true}`) e exit `0` ou `1`. Sem UI.

## O que não usar como prova

- Screenshot / “olha o tabuleiro” (o contrato visual é `then.visual` no snapshot)
- Tempo de parede (`wait 3 seconds`)
- Estado escondido só em nós visuais
- RNG sem seed

## Relação com GdUnit4

GdUnit4 entra no projeto Godot para unitários de classes e E2E de cena. As **regras de jogo** passam primeiro pelo `cli_runner` + specs — é o caminho que o agente usa sempre. GdUnit4 é extra, não substitui o snapshot.
