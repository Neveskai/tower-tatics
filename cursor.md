# Tower-Tatics

Tower defense 3D inspirado em Xeno Tactics (2007). Reconstrução do jogo 2D (Pixi.js + React) em **Godot 4 + GDScript**.

## Fonte da verdade

As regras de negócio e de jogo estão em [`docs/`](docs/README.md). O código 2D em `src/` é referência histórica até o corte da migração.

- Não altere balanceamento, comportamento ou IDs sem atualizar o doc correspondente.
- Identificadores em inglês (`machine-gun`, `blizzard`, `catalog_towers`).
- Documentação em português.

## Stack

| Alvo (migração) | Legado (não portar) |
|---|---|
| Godot 4, GDScript, projeto em `godot/` | Pixi.js, React HUD, Howler, Capacitor |
| JSON em `godot-export/data/` | Tile-size dinâmico em pixels |
| GLB Kenney em 3D | Pipeline PNG/WebP de sprites |

## Documentação

- [Índice](docs/README.md)
- [Glossário](docs/glossary.md)
- [Visão geral](docs/game-design/overview.md)
- [Combate](docs/game-design/combat.md)
- [Torres](docs/game-design/towers.md)
- [Monstros](docs/game-design/monsters.md)
- [Skills](docs/game-design/skills.md)
- [Mapas e ondas](docs/game-design/maps-and-waves.md)
- [Placement e pathfinding](docs/game-design/placement-and-pathfinding.md)
- [Economia](docs/game-design/economy.md)
- [Progressão](docs/game-design/progression.md)
- [Fluxo de jogo](docs/systems/game-flow.md)
- [Catálogo e dados](docs/systems/data-catalog.md)
- [Migração Godot 3D](docs/migration/godot-3d.md)
