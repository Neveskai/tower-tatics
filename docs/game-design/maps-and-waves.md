# Mapas e ondas

## Grid e portais

- `ROWS = COLS = 15`.
- `CENTER_ROW = 4`, `CENTER_COL = 4` (`floor(n/2) - 3`).
- Portal esquerdo: `col = 0`, rows `4..9` (6 tiles) — spawn.
- Portal direito: `col = 14`, rows `4..9` — destino / leak.
- Bordas (`row/col === 0` ou `14`) são bloqueadas **exceto** os tiles de portal.

Spawn escolhe `CENTER_ROW + random(0..5)` → rows 4–9. A checagem de path usa 6 origens começando em `floor(ROWS/2)-2 = 5` (rows 5–10) — leve desalinhamento atual; preservar até decisão explícita.

## Os 5 mapas

| ID | Nome | Dificuldade | Ondas jogáveis | Intervalo (s) | Waves no disco |
|---|---|---|---|---|---|
| 1 | Desert | easy | 10 | 30 | 10 |
| 2 | Cemetery | medium | 15 | 24 | 40 (`slice(0, 15)`) |
| 3 | Garden | hard | 20 | 18 | 60 (`slice(0, 20)`) |
| 4 | Ice | very_hard | 25 | 14 | 80 (`slice(0, 25)`) |
| 5 | Hell | nightmare | 40 | 12 | 100 (`slice(0, 40)`) |

Vitória usa `map.waves.length` (conjunto já fatiado). JSON exportado em `godot-export/data/map_N.json` contém o array completo; o cliente 2D é quem fatia.

Tintas (hex) e paths de imagem: `maps-assets.ts` / `maps_list.json`.

## Fluxo de onda

1. Início: `pause=true`, `currentHorde=0`.
2. Botão: `start` → `resume` → `pause` → `sendNext` (`getWaveButtonMode`).
3. `spawnMonsters()`: spawna `spawnPerSide` unidades do portal esquerdo ao longo de `spawnDuration` ms; depois incrementa horde e reinicia countdown `intervalMs/1000`.
4. Pause no meio da onda **bloqueia** seleção de torre/monstro e placement (`isPausedMidWave`).
5. Sem monstros vivos e não pausado → `sendNext` (countdown até a próxima, ou vitória se era a última).

Não há multiplicador de velocidade da partida.

## HP do jogador

- Inicial: **100**.
- Leak: **−5**.
- Game over quando o HP **antes** do decremento é 5 (ou seja, o leak que levaria a 0). Overlay `GameOverScreen`.
- Vitória: última horde concluída **e** `monsters.size === 0` → `MissionCompleteScreen`.
