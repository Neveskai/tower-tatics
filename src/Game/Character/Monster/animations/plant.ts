import { createAnimatedSprite } from "@/Game/Character/Monster/animations/create-animated-sprite";
import { AnimationConfig, Direction } from "@/Game/common/types/animation.types";
import { MonsterSize } from "@/Game/common/types/monsters.types";
import { AnimatedSprite } from "pixi.js";

const walkAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "plant-u-walk", flipX: false },
  down: { textureName: "plant-d-walk", flipX: false },
  left: { textureName: "plant-s-walk", flipX: false, y: -3 },
  right: { textureName: "plant-s-walk", flipX: true, y: -3 },
};

const deathAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "plant-u-death", flipX: false },
  down: { textureName: "plant-d-death", flipX: false },
  left: { textureName: "plant-s-death", flipX: false, y: -3 },
  right: { textureName: "plant-s-death", flipX: true, y: -3 },
};

export function getPlantWalkForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = walkAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 6, 0.15, MonsterSize[size]);

  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}

export function getPlantDeathForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = deathAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 10, 0.25, MonsterSize[size], false);
  
  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}
