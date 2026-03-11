export function flattenGrid(grid: boolean[][]) {
  const height = grid.length;
  const width = grid[0].length;
  const obstacleMap = new Uint8Array(width * height);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      obstacleMap[row * width + col] = grid[row][col] ? 1 : 0;
    }
  }

  return { obstacleMap, width, height }
}
