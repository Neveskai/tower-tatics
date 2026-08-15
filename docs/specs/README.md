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
| [kenney-tower-type-models](kenney-tower-type-models.json) | unit | kenney-3d |
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
| [sell-mg-pregame-refunds-cost](sell-mg-pregame-refunds-cost.json) | unit | economy |
| [sell-mg-midgame-uses-sell-price](sell-mg-midgame-uses-sell-price.json) | unit | economy |
| [sell-mg-rejected-paused-mid-wave](sell-mg-rejected-paused-mid-wave.json) | integration | economy |
| [sell-mg-rejected-while-upgrading](sell-mg-rejected-while-upgrading.json) | unit | economy |
| [upgrade-mg-l1-to-l2-in-3000ms](upgrade-mg-l1-to-l2-in-3000ms.json) | integration | towers / combat |
| [upgrade-mg-still-l1-before-3000ms](upgrade-mg-still-l1-before-3000ms.json) | unit | combat |
| [upgrade-mg-l2-to-l3-in-4050ms](upgrade-mg-l2-to-l3-in-4050ms.json) | integration | towers / combat |
| [upgrade-mg-timer-does-not-advance-while-paused](upgrade-mg-timer-does-not-advance-while-paused.json) | unit | combat |
| [upgrade-mg-does-not-shoot](upgrade-mg-does-not-shoot.json) | unit | combat |
| [upgrade-mg-rejected-at-l6](upgrade-mg-rejected-at-l6.json) | unit | towers |
| [upgrade-mg-rejected-without-gold](upgrade-mg-rejected-without-gold.json) | unit | economy |
| [hud-tower-sell-upgrade-e2e](hud-tower-sell-upgrade-e2e.json) | e2e | game-flow |
| [missile-ignores-air-primary](missile-ignores-air-primary.json) | unit | combat |
| [missile-aoe-hits-nearby-including-air](missile-aoe-hits-nearby-including-air.json) | unit | combat |
| [heavy-gun-overheats-at-120](heavy-gun-overheats-at-120.json) | unit | combat |
| [heavy-gun-cools-0-06-per-ms](heavy-gun-cools-0-06-per-ms.json) | unit | combat |
| [anti-air-ignores-ground-primary](anti-air-ignores-ground-primary.json) | unit | combat |
| [anti-air-aoe-hits-nearby-ground](anti-air-aoe-hits-nearby-ground.json) | unit | combat |
| [electric-needs-candidate-in-range](electric-needs-candidate-in-range.json) | unit | combat |
| [electric-hits-ground-in-range-plus-one](electric-hits-ground-in-range-plus-one.json) | unit | combat |
| [electric-stun-stops-movement](electric-stun-stops-movement.json) | unit | combat |
| [freeze-slows-primary-only](freeze-slows-primary-only.json) | unit | combat |
| [hud-shop-six-towers-e2e](hud-shop-six-towers-e2e.json) | e2e | towers |
| [spawns-on-death-waits-400ms](spawns-on-death-waits-400ms.json) | unit | monsters |
| [spawns-on-death-child-at-same-tile](spawns-on-death-child-at-same-tile.json) | unit | monsters |
| [spawns-on-death-skips-on-leak](spawns-on-death-skips-on-leak.json) | unit | monsters |
| [spawns-per-time-still-one-before-10s](spawns-per-time-still-one-before-10s.json) | unit | monsters |
| [spawns-per-time-child-after-10s](spawns-per-time-child-after-10s.json) | unit | monsters |
| [spawns-per-time-skips-if-3x3-blocked](spawns-per-time-skips-if-3x3-blocked.json) | unit | monsters |
| [wave-2-spawns-9-goblins](wave-2-spawns-9-goblins.json) | integration | maps-and-waves |
| [wave-2-no-towers-leaks-9](wave-2-no-towers-leaks-9.json) | integration | maps-and-waves |
| [wave-3-no-towers-leaks-9](wave-3-no-towers-leaks-9.json) | integration | maps-and-waves |
| [wave-3-with-mgs-kills-18](wave-3-with-mgs-kills-18.json) | integration | monsters |
| [wave-5-spawns-1-wolf](wave-5-spawns-1-wolf.json) | integration | maps-and-waves |
| [wave-5-no-towers-leaks-1](wave-5-no-towers-leaks-1.json) | integration | maps-and-waves |
| [wave-9-no-towers-leaks-12](wave-9-no-towers-leaks-12.json) | integration | maps-and-waves |
| [wave-10-spawns-9-air-bees](wave-10-spawns-9-air-bees.json) | integration | maps-and-waves |
| [wave-10-no-towers-leaks-9](wave-10-no-towers-leaks-9.json) | integration | maps-and-waves |

Nova regra = novo arquivo aqui **antes** do código. Validar: `node scripts/validate-specs.mjs`.
