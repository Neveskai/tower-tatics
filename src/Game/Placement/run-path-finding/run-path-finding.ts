import { convertObstacleMap, runAStar } from './run-path-finding.helpers'
import { Vec2 } from "@/Game/common/types/placement.types";

export async function runPathfinding(params: {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  obstacleMap: Uint8Array
  width: number
  height: number
}): Promise<Vec2[]> {
  const { startRow, startCol, endRow, endCol, obstacleMap, width, height } =
    params

  const grid = convertObstacleMap(obstacleMap, width, height)
  const start: Vec2 = { row: startRow, col: startCol }
  const goal: Vec2 = { row: endRow, col: endCol }
  const path = runAStar(start, goal, grid)

  return path
}
