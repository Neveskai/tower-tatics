import { createAnimatedSprite } from "@/Game/Character/Monster/animations/create-animated-sprite";
import { AnimationConfig, Direction } from "@/Game/common/types/animation.types";
import { MonsterSize } from "@/Game/common/types/monsters.types";
import { AnimatedSprite } from "pixi.js";

const walkAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "plantFire-u-walk", flipX: false },
  down: { textureName: "plantFire-d-walk", flipX: false },
  left: { textureName: "plantFire-s-walk", flipX: false, y: -3 },
  right: { textureName: "plantFire-s-walk", flipX: true, y: -3 },
};

const deathAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "plantFire-u-death", flipX: false },
  down: { textureName: "plantFire-d-death", flipX: false },
  left: { textureName: "plantFire-s-death", flipX: false, y: -3 },
  right: { textureName: "plantFire-s-death", flipX: true, y: -3 },
};

export function getPlantFireWalkForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = walkAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 6, 0.15, MonsterSize[size]);

  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}

export function getPlantFireDeathForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = deathAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 10, 0.25, MonsterSize[size], false);
  
  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}
