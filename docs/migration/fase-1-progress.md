# Fase 1 — controle de progresso

Critério: specs em `tower-tatics/docs/specs/` + runner no repo **`tower-tatics-3D`**. Sem screenshot.

Cliente Godot: gráficos 3D (Kenney), jogabilidade 2D (grid/A*/HUD).

| Issue | Escopo | Specs | Status |
|---|---|---|---|
| [WSN-80](https://linear.app/wsn-workspace/issue/WSN-80) | Harness GameSnapshot + cli_runner | match-starts-with-60-gold, leak-costs-5-hp, machine-gun-costs-5, wave-1-no-towers-leaks-10 | Done |
| [WSN-55](https://linear.app/wsn-workspace/issue/WSN-55) | Export `towers/skills/player/progression.json`; waves fatiadas | catalog-complete-export | Done |
| [WSN-57](https://linear.app/wsn-workspace/issue/WSN-57) | Kenney tiles + MG em `tower-tatics-3D/assets/models/` | kenney-phase1-models | Done |
| [WSN-58](https://linear.app/wsn-workspace/issue/WSN-58) | Board 15×15, portais, câmera 38°/42°, picking | board-15x15-portals-camera, board-pick-tile, board-visual-readable | Done |
| [WSN-59](https://linear.app/wsn-workspace/issue/WSN-59) | Gate: click seleciona tile no Board 3D | (preview Kenney + clique coloca torre) | Unblocked |

## Como validar

No repo `tower-tatics`:

```bash
npm run export:godot
npm run import:kenney
node scripts/validate-specs.mjs
godot --headless --path ../tower-tatics-3D -s res://test/cli_runner.gd -- --specs docs/specs
```

Todas as linhas `{"ok":true}` e exit 0.

## Notas

- Código do jogo vive em **`tower-tatics-3D`**. Este repo só exporta JSON + docs/specs.
- Plano XZ = grid 2D (row/col). Y é altura visual. Sem física 3D, sem câmera livre.
