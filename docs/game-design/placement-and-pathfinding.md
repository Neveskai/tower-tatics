# Placement e pathfinding

## Grid

15×15, axis-aligned (não isométrico em matemática). Posição mundo = `(col, row) * TILE_SIZE`. No 2D o tile size é dinâmico (`appWidth / (ROWS - 2)`); no Godot o tile é **1 m** fixo. Câmera ortográfica 3/4: elevação **38°**, yaw **42°** (Phantom Camera, sem câmera livre).

## Footprint da torre

Placement pelo vértice `(vertexRow, vertexCol)` ocupa:

- `(vertexRow, vertexCol)`
- `(vertexRow - 1, vertexCol)`
- `(vertexRow, vertexCol - 1)`
- `(vertexRow - 1, vertexCol - 1)`

Rejeitado se `vertexRow <= 0` ou `vertexCol <= 0`, se qualquer tile já está `occupied`, ou se há monstro terrestre na célula (`monstersOccupied`).

## Bordas e portais

`setupOccupied`: borda = obstáculo, exceto portais esquerda/direita (6 rows a partir de `CENTER_ROW`).

## A*

Implementação própria em `run-path-finding.helpers.ts` (o pacote npm `pathfinding` **não é usado**).

- Heurística: distância euclidiana (`Math.hypot`).
- 12 vizinhos: ortogonais 1 e 2 tiles, mais 4 diagonais 1-tile.
- Diagonal bloqueada se um dos cantos laterais for obstáculo (não corta canto).
- Aéreo: grid vazio (`EMPTY_GRID`), ignora torres.

## Não bloquear o mapa

Antes de confirmar placement, `canPlaceTowerWithoutBlocking` simula a ocupação 2×2 e exige que **cada** spawn da esquerda tenha **pelo menos um** caminho até algum tile do portal direito.

Ao colocar, monstros terrestres no caminho chamam `verifyPath` e recalculam se a torre intercepta o path atual.

## Occupancy de monstros

Terrestres marcam `monstersOccupied[row][col]` no tile atual (não bloqueia pathfinding de outros, mas bloqueia placement de torre naquela célula). Aéreos não marcam.
