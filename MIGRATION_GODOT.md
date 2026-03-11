# Migração Tower Tactics: HTML + Pixi.js → Godot

Este documento descreve como migrar o jogo **Tower Tactics** da stack atual (HTML, React, Pixi.js 8, Zustand) para a engine **Godot** (4.x recomendado).

---

## 1. Visão geral do projeto atual

| Área | Tecnologia atual | Conteúdo principal |
|------|------------------|--------------------|
| **Render** | Pixi.js 8 | Canvas 2D, `Application`, `Container`, sprites, animações por frames |
| **UI** | React | HUD, loja, pausa, seleção de mapa, configurações |
| **Estado** | Zustand | Gold, vida, horda, torre selecionada, pause, skill ativa |
| **Backend** | Firebase | Auth, Firestore (catálogo, progresso), Crashlytics |
| **Áudio** | Howler | Grupos de som (monstros, tiros, explosões, voz) |
| **Pathfinding** | A* custom (grid 15×15) | `run-path-finding.helpers.ts` – obstáculos = torres |
| **Plataforma** | Vite + Capacitor | Web + Android (e potencialmente iOS) |

**Conceitos de jogo:**

- **Grid:** 15×15 tiles; constantes em `COLS`, `ROWS`, `SCREEN.TILE_SIZE`, `CENTER_ROW`, `CENTER_COL`.
- **Mapas:** `PlacementConfig` (id, nome, waves, waveIntervalSeconds, tileTint, dirtTint, etc.).
- **Waves:** array de `MonsterConfig` por horda (tipo, vida, velocidade, gold, spawn, especiais).
- **Torres:** várias entidades (Machine Gun, Cannon, Electric, etc.) com estratégias aim-shoot, upgrades, estatísticas.
- **Monstros:** entidades com movimento, vida, slow/stun, healer, stealth, enrage; animações por direção/ação (Walk, Death, etc.).
- **Skill:** Blizzard (área, duração, overlay de vértices no grid).

---

## 2. Mapeamento de conceitos para Godot

### 2.1 Render (Pixi → Godot)

| Pixi.js | Godot 4 |
|--------|---------|
| `Application` | `SceneTree` + viewport / `SubViewport` ou cena principal 2D |
| `Container` | `Node2D` ou `CanvasLayer` |
| `Sprite` / sprites animados | `Sprite2D` / `AnimatedSprite2D` |
| `Graphics` (grid, overlay) | `CanvasItem` (ex.: `Line2D`, polígonos) ou nós desenhados com `draw_*` |
| `app.stage` | Raiz da cena de jogo (ex.: `GameWorld` como `Node2D`) |
| `app.ticker` / `Ticker.shared` | `_process(delta)` ou `_physics_process(delta)` |
| Coordenadas (x, y) em px | `position` em pixels; manter mesma convenção de grid (tile size) |

Sugestão de hierarquia de cena de jogo:

```
GameWorld (Node2D)
├── MapRender      # grid, tiles, overlay de skill
├── CharactersLayer (Node2D)
│   ├── Towers     # ou cada torre como filho
│   └── Monsters
├── Projectiles   # balas, efeitos
└── BlizzardEffects
```

### 2.2 Estado (Zustand → Godot)

| Zustand | Godot |
|---------|--------|
| Stores (gold, vida, horda, pause, etc.) | `Autoload` (singleton) em GDScript ou C# |
| `useGameStore.getState()` | Chamar funções/setters do singleton global |
| `subscribe()` para reação | Signals do Godot (`game_state_changed`, `gold_changed`, etc.) |

Exemplo de Autoload em GDScript:

```gdscript
# res://autoloads/game_state.gd
extends Node
signal gold_changed(new_value)
signal wave_changed(current)
signal game_paused(paused)

var gold: int = 0
var player_health: int = 20
var current_horde: int = 0
var is_paused: bool = false
```

Conectar UI e lógica de jogo a esses signals.

### 2.3 Pathfinding (A* custom → Godot)

O projeto usa um A* em grid 2D com obstáculos (torres). Em Godot:

- **AStar2D** (built-in): criar pontos por célula do grid e conectar vizinhos; marcar células ocupadas como não andáveis (não adicionar ou não conectar).
- Ou **NavigationAgent2D** com um `NavigationRegion2D` gerado a partir do grid (menos direto para grid fixo).

Recomendação: implementar um **AStar2D** em cima do mesmo grid 15×15, com a mesma regra de obstáculos (ex.: `occupied[row][col]`). Pode-se portar a lógica de `run-path-finding.helpers.ts` (vizinhos, diagonal, custos) para GDScript/C# e usar `AStar2D` ou um script equivalente.

### 2.4 Entidades (torres e monstros)

- **Pixi:** `TowerCharacter extends Container`, `MonsterCharacter extends Container`, com mixins (render, upgrade, aim-shoot, movement, health).
- **Godot:** cada torre = cena `Tower.tscn` com script (ex.: `Tower.gd`); cada monstro = cena `Monster.tscn` com script (ex.: `Monster.gd`).

Lógica atual:

- Torres: estratégias de disparo (default, electric, freeze, anti-air), upgrades, estatísticas, clique para seleção.
- Monstros: movimento por path, vida, slow/stun, healer, stealth, enrage, animações por direção.

Portar para:

- **Torres:** `_process` ou timer para cadência; `get_enemies_in_range()` (equivalente ao quadtree/lista no `CharactersLayer`); nós de disparo e de projéteis.
- **Monstros:** `_process(delta)` para mover ao longo do path; nós de vida/efeitos; `AnimatedSprite2D` por direção/ação.

### 2.5 UI (React → Godot)

- Telas atuais: Game, MapSelect, Preload, MissionComplete, GameOver, Config, Auth, etc.
- Godot: cada tela = cena (ex.: `GameUI.tscn`, `MapSelect.tscn`) com `Control`/`CanvasLayer` e scripts.
- Botões, labels, barras de vida: usar `Button`, `Label`, `ProgressBar`, `TextureProgressBar`, etc.
- Dados (gold, vida, wave): binding via signals dos Autoloads para atualizar labels e barras.

### 2.6 Áudio (Howler → Godot)

- **AudioStreamPlayer** (ou um por tipo) para efeitos (tiros, explosões, roars).
- **AudioStreamPlayer** para música de fundo.
- Grupos (ex.: pausar só monstros): controlar por código (mute/pause dos nós de áudio) ou usar buses de áudio e alterar volume/ mute no bus.

### 2.7 Firebase e backend

- Godot não tem SDK oficial Firebase; opções:
  - REST (Firebase REST API) com HTTPRequest.
  - Plugin de terceiros (ex.: GodotFirebase) se disponível para a versão que usar.
  - Manter um backend mínimo (Cloud Functions + REST) e chamar de Godot via HTTP.

Auth, progresso e catálogo precisarão ser reimplementados nessa camada.

---

## 3. Estrutura sugerida do projeto Godot

```
tower-tatics-godot/
├── project.godot
├── export_presets.cfg
├── autoloads/
│   ├── game_state.gd      # gold, vida, horda, pause
│   ├── sound_manager.gd    # wrappers para áudio
│   └── firebase_client.gd  # opcional, HTTP + auth
├── scenes/
│   ├── main.tscn           # entrada, troca de telas
│   ├── game/
│   │   ├── game_world.tscn
│   │   ├── map_render.tscn
│   │   ├── characters_layer.tscn
│   │   ├── tower.tscn      # base; variantes por tipo
│   │   ├── monster.tscn
│   │   ├── projectile.tscn
│   │   └── blizzard_effect.tscn
│   ├── ui/
│   │   ├── game_hud.tscn
│   │   ├── map_select.tscn
│   │   ├── mission_complete.tscn
│   │   └── game_over.tscn
│   └── preload.tscn
├── scripts/
│   ├── pathfinding/
│   │   └── grid_astar.gd   # port do run-path-finding.helpers
│   └── ...
├── resources/
│   ├── data/
│   │   ├── maps/           # JSON ou Resource por mapa
│   │   └── waves/          # waves por mapa (ver secção 4)
│   ├── towers/             # definições por torre
│   └── monsters/           # definições por monstro
└── assets/
    ├── sprites/            # exportados de public/assets/frames
    ├── tiles/
    ├── maps/
    ├── audio/
    └── fonts/
```

---

## 4. Dados reutilizáveis (waves, mapas, constantes)

Os dados atuais estão em TypeScript (waves, constantes de monstros, `PlacementConfig`). Para Godot convém usar:

- **JSON**: fácil de gerar a partir do TS e carregar com `FileAccess` + `JSON.parse()` ou Resource.
- **Resources (.tres)**: para definir recursos no editor (ex.: `MonsterConfig`, `WaveConfig`).

Exemplo de formato JSON para um mapa (compatível com o teu `PlacementConfig` e waves):

```json
{
  "id": 1,
  "nome": "Map 1",
  "descricao": "...",
  "dificuldade": "easy",
  "hordas": 10,
  "wave_interval_seconds": 30,
  "tile_tint": 16777215,
  "dirt_tint": 8947848,
  "waves": [
    {
      "wave_id": 1,
      "type": "slime",
      "size": "small",
      "spawn_duration": 5000,
      "gold": 2,
      "speed": 1,
      "max_health": 160,
      "spawn_per_side": 10
    }
  ]
}
```

Constantes de monstros (velocidade, tamanhos) podem ficar em script Autoload ou em JSON de configuração global.

Foi criado o script **`scripts/export-godot-data.ts`** para exportar mapas e constantes a partir do código atual; ver secção 6.

---

## 5. Assets

- **Sprites:** `public/assets/frames/` (torres, monstros, explosões, tiles) → copiar para `assets/sprites/` (ou estrutura equivalente). Godot suporta PNG; para WebP, converter ou usar addon se necessário.
- **Mapas (imagens):** `public/assets/images/maps/Map_*.png` → `assets/maps/`.
- **Áudio:** `public/assets/` (shoot, monsters, voice, explosion) → `assets/audio/`; formatos Ogg Vorbis ou WAV são nativos no Godot.
- **Animações de monstros:** atualmente sprites por direção (D, U, S, etc.) e ação (Walk, Death). Em Godot: `AnimatedSprite2D` com vários `SpriteFrames`, um por animação (ex.: `goblin_d_walk`), e trocar a animação conforme direção e estado.

---

## 6. Script de exportação de dados para Godot

No repositório foi adicionado **`scripts/export-godot-data.ts`** que:

- Usa as definições de mapas e waves do projeto (importando dos módulos existentes).
- Gera ficheiros JSON em `godot-export/data/` (mapas e constantes) no formato descrito acima.

Para correr (a partir da raiz do projeto):

```bash
npx tsx scripts/export-godot-data.ts
```

Depois podes copiar a pasta `godot-export/data/` para o projeto Godot (ex.: `resources/data/`) e carregar os JSON em tempo de jogo ou em ferramentas de importação.

---

## 7. Ordem sugerida de migração

1. **Projeto Godot base:** criar projeto 4.x, estrutura de pastas, Autoloads (game_state, sound).
2. **Grid e pathfinding:** portar grid 15×15 e A* para GDScript/C#; testar com obstáculos estáticos.
3. **Mapa e torres:** desenhar grid/tiles; colocar uma torre e lógica de clique/seleção.
4. **Um tipo de monstro:** movimento por path, vida, morte; um tipo de torre que dispara e causa dano.
5. **Waves e spawn:** usar JSON exportado; spawn por tempo e por horda; countdown entre waves.
6. **Restantes torres e monstros:** portar stats, estratégias de disparo e efeitos (slow, stun, etc.).
7. **Skill Blizzard:** área, duração, overlay e dano/efeito.
8. **HUD e telas:** Game HUD, Map Select, Mission Complete, Game Over, Pause.
9. **Áudio:** mapear todos os sons e grupos para AudioStreamPlayer / buses.
10. **Firebase (opcional):** auth e dados remotos via HTTP ou plugin.

---

## 8. Referências úteis

- [Godot 4 Docs – 2D](https://docs.godotengine.org/en/stable/tutorials/2d/index.html)
- [AStar2D](https://docs.godotengine.org/en/stable/classes/class_astar2d.html)
- [Signals](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html)
- [Autoloads](https://docs.godotengine.org/en/stable/tutorials/scripting/singletons_autoload.html)

Se quiseres, o próximo passo pode ser implementar o `export-godot-data.ts` e/ou um exemplo mínimo em GDScript (grid + A* + um monstro e uma torre) para servir de base no Godot.
