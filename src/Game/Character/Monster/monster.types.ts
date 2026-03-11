export interface Node {
  row: number;
  col: number;
  g: number;
  h: number;
  parent?: Node;
}

export interface TileCoord {
  row: number;
  col: number;
}