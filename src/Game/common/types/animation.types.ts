// Tipos reutilizáveis
export type Direction = "up" | "down" | "left" | "right";

export type AnimationConfig = {
  textureName: string;
  flipX: boolean;
  y?: number;
};
