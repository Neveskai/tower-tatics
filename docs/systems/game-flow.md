# Fluxo de jogo

## Rotas (legado 2D)

| Rota | Tela |
|---|---|
| `/` | Preload (auth gate + load catálogo/inventário) |
| `/play` | Select phase: mapa + tabs Torres / Skills |
| `/game` | Partida (canvas Pixi + HUD React) |

## Máquina de estados in-match

```
PreGame (pause, horde=0, gold=60, HP=100, energy=0)
  → Start wave → Spawning → Running
  → Pause mid-wave / Resume
  → Wave clear → Send next (countdown = map.waveIntervalSeconds)
  → Leak → HP -= 5 → se HP era 5 → GameOver
  → Última wave clear + 0 monstros → MissionComplete → unlocks → /play
```

Sair da partida (botão back) pede confirmação, pausa, e navega `/play` (progresso da run é descartado).

## HUD

Modos (`HudModes`): `SHOP` | `MONSTER` | `TOWER`.

| Peça | Função |
|---|---|
| HealthBar | HP 0–100 |
| HordeStats | onda atual |
| SendNextWaveButton | start / resume / pause / sendNext |
| NextWaveIndicator | countdown |
| SkillEnergyBar | 3 segmentos |
| BlizzardSkillButton | se `blizzard` enabled |
| SwitchHud | troca modo |
| TowerShop | compra (só equipped) |
| TowerStats | upgrade / sell / stats |
| MonsterStats | HP / tipo do selecionado |

Overlays: `GameOverScreen`, `MissionCompleteScreen` (torre + próximo mapa).

Pause mid-wave: sem clique em torre/monstro e sem placement. Pre-game: placement e shop liberados.

## Loop técnico (legado)

- Tick: Pixi `Ticker.shared` (refresh do display), entidades usam `deltaMS`. Sem Hz fixo de simulação.
- Countdown de onda: `setInterval` 1 s.
- Regen de skill: `setInterval` 200 ms.
- Auto-pause em `visibilitychange` / sair da aba.
- Sem fast-forward.

No Godot: preferir `_physics_process` com timestep fixo para combate/path, UI no `_process`.
