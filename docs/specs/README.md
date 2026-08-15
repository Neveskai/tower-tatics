# Specs (Given / When / Then)

Contrato executável das regras em [`game-design/`](../game-design/overview.md). Formato: [`systems/testing.md`](../systems/testing.md). Schema: [`spec.schema.json`](spec.schema.json).

| Spec | Camada | Doc |
|---|---|---|
| [match-starts-with-60-gold](match-starts-with-60-gold.json) | unit | economy |
| [leak-costs-5-hp](leak-costs-5-hp.json) | unit | maps-and-waves |
| [machine-gun-costs-5](machine-gun-costs-5.json) | integration | towers / economy |
| [wave-1-no-towers-leaks-10](wave-1-no-towers-leaks-10.json) | integration | maps-and-waves |
| [catalog-complete-export](catalog-complete-export.json) | unit | data-catalog |
| [kenney-phase1-models](kenney-phase1-models.json) | unit | kenney-3d |
| [board-15x15-portals-camera](board-15x15-portals-camera.json) | unit | placement-and-pathfinding |
| [board-pick-tile](board-pick-tile.json) | integration | placement-and-pathfinding |
| [board-visual-readable](board-visual-readable.json) | unit | kenney-3d |
| [board-visual-e2e-kenney-palette](board-visual-e2e-kenney-palette.json) | e2e | kenney-3d |

Nova regra = novo arquivo aqui **antes** do código. Validar: `node scripts/validate-specs.mjs`.
