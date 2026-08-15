# Specs (Given / When / Then)

Contrato executável das regras em [`game-design/`](../game-design/overview.md). Formato: [`systems/testing.md`](../systems/testing.md). Schema: [`spec.schema.json`](spec.schema.json).

| Spec | Camada | Doc |
|---|---|---|
| [match-starts-with-60-gold](match-starts-with-60-gold.json) | unit | economy |
| [leak-costs-5-hp](leak-costs-5-hp.json) | unit | maps-and-waves |
| [machine-gun-costs-5](machine-gun-costs-5.json) | integration | towers / economy |
| [wave-1-no-towers-leaks-10](wave-1-no-towers-leaks-10.json) | integration | maps-and-waves |
| [mg-targets-most-advanced](mg-targets-most-advanced.json) | unit | combat |
| [wave-1-with-mgs-clears](wave-1-with-mgs-clears.json) | integration | combat |
| [wave-1-game-over-at-5-hp](wave-1-game-over-at-5-hp.json) | integration | maps-and-waves |
| [catalog-complete-export](catalog-complete-export.json) | unit | data-catalog |
| [kenney-phase1-models](kenney-phase1-models.json) | unit | kenney-3d |
| [board-15x15-portals-camera](board-15x15-portals-camera.json) | unit | placement-and-pathfinding |
| [board-pick-tile](board-pick-tile.json) | integration | placement-and-pathfinding |
| [board-visual-readable](board-visual-readable.json) | unit | kenney-3d |
| [board-visual-e2e-kenney-palette](board-visual-e2e-kenney-palette.json) | e2e | kenney-3d |
| [path-open-on-empty-grid](path-open-on-empty-grid.json) | unit | placement-and-pathfinding |
| [place-tower-keeps-path](place-tower-keeps-path.json) | integration | placement-and-pathfinding |
| [place-tower-rejects-full-block](place-tower-rejects-full-block.json) | integration | placement-and-pathfinding |
| [tower-footprint-world-center](tower-footprint-world-center.json) | integration | placement-and-pathfinding |
| [placement-ui-e2e](placement-ui-e2e.json) | e2e | placement-and-pathfinding |
| [energy-regens-one-segment-in-15s](energy-regens-one-segment-in-15s.json) | unit | skills |
| [energy-does-not-regen-while-paused](energy-does-not-regen-while-paused.json) | unit | skills |
| [blizzard-costs-2-energy-not-gold](blizzard-costs-2-energy-not-gold.json) | unit | skills |
| [blizzard-rejected-without-energy](blizzard-rejected-without-energy.json) | unit | skills |
| [blizzard-tick-damages-in-radius](blizzard-tick-damages-in-radius.json) | unit | skills |
| [pause-mid-wave-blocks-place](pause-mid-wave-blocks-place.json) | integration | maps-and-waves |
| [hud-send-wave-energy-e2e](hud-send-wave-energy-e2e.json) | e2e | game-flow |

Nova regra = novo arquivo aqui **antes** do código. Validar: `node scripts/validate-specs.mjs`.
