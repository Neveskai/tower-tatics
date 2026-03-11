import { Vec2 } from "@/Game/common/types/placement.types";

export function toKey(v: Vec2): string {
  return `${v.row},${v.col}`;
}

export function fromKey(key: string): Vec2 {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
}

export function heuristic(a: Vec2, b: Vec2): number {
  return Math.hypot(a.row - b.row, a.col - b.col);
}

export function runAStar(
  start: Vec2,
  goal: Vec2,
  obstacles: boolean[][]
): Vec2[] {
  const rows = obstacles.length;
  const cols = obstacles[0].length;

  const dirs: Vec2[] = [
    { row: -2, col: 0 },
    { row: +2, col: 0 },
    { row: 0, col: -2 },
    { row: 0, col: +2 },
    { row: -1, col: -1 },
    { row: -1, col: +1 },
    { row: +1, col: -1 },
    { row: +1, col: +1 },
    { row: +1, col: 0 },
    { row: 0, col: +1 },
    { row: 0, col: -1 },
    { row: -1, col: 0 },
  ];

  const inBounds = (v: Vec2): boolean => {
    return v.row >= 0 && v.row < rows && v.col >= 0 && v.col < cols;
  };

  const isPassable = (v: Vec2): boolean => {
    return inBounds(v) && !obstacles[v.row][v.col];
  };

  const neighbors = (v: Vec2): Vec2[] => {
    const result: Vec2[] = [];
    for (const dir of dirs) {
      const next: Vec2 = { row: v.row + dir.row, col: v.col + dir.col };

      if (!isPassable(next)) continue;

      const isDiagonal = Math.abs(dir.row) === 1 && Math.abs(dir.col) === 1;
      if (isDiagonal) {
        const side1: Vec2 = { row: v.row + dir.row, col: v.col };
        const side2: Vec2 = { row: v.row, col: v.col + dir.col };
        if (!isPassable(side1) || !isPassable(side2)) continue;
      }

      result.push(next);
    }
    return result;
  };

  type QueueItem = { fScore: number; node: Vec2 };
  const openSet: QueueItem[] = [];

  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const openSetKeys = new Set<string>();

  const startKey = toKey(start);
  gScore.set(startKey, 0.0);
  const startFScore = heuristic(start, goal);
  fScore.set(startKey, startFScore);
  openSet.push({ fScore: startFScore, node: start });
  openSetKeys.add(startKey);

  openSet.sort((a, b) => a.fScore - b.fScore);

  while (openSet.length > 0) {
    const current = openSet.shift()!.node;
    const currentKey = toKey(current);
    openSetKeys.delete(currentKey);

    if (current.row === goal.row && current.col === goal.col) {
      const path: Vec2[] = [];
      let pathKey: string | undefined = currentKey;

      while (pathKey && cameFrom.has(pathKey)) {
        path.unshift(fromKey(pathKey));
        pathKey = cameFrom.get(pathKey);
      }

      path.unshift(start);

      return path;
    }

    for (const neighbor of neighbors(current)) {
      const neighborKey = toKey(neighbor);
      const currentGScore = gScore.get(currentKey) ?? Infinity;
      const tentativeG = currentGScore + heuristic(current, neighbor);

      const neighborGScore = gScore.get(neighborKey) ?? Infinity;
      if (tentativeG < neighborGScore) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        const neighborFScore = tentativeG + heuristic(neighbor, goal);
        fScore.set(neighborKey, neighborFScore);

        if (!openSetKeys.has(neighborKey)) {
          openSet.push({ fScore: neighborFScore, node: neighbor });
          openSetKeys.add(neighborKey);
          openSet.sort((a, b) => a.fScore - b.fScore);
        }
      }
    }
  }

  return [];
}

export function convertObstacleMap(
  obstacleData: Uint8Array,
  width: number,
  height: number
): boolean[][] {
  const grid: boolean[][] = [];

  for (let r = 0; r < height; r++) {

    grid[r] = [];

    for (let c = 0; c < width; c++) {
      grid[r][c] = obstacleData[r * width + c] !== 0;
    }
  }

  return grid;
}
