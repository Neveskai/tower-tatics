export const TILE_INCREMENT = 0.1;
export const ROWS = 15;
export const COLS = 15;
export const CENTER_COL = Math.floor(COLS / 2) - 3;
export const CENTER_ROW = Math.floor(ROWS / 2) - 3;

export const EMPTY_GRID: boolean[][] = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => false)
);
