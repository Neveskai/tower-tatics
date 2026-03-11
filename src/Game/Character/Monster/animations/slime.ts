
import { createAnimatedSprite } from "@/Game/Character/Monster/animations/create-animated-sprite";
import { AnimationConfig, Direction } from "@/Game/common/types/animation.types";
import { MonsterSize } from "@/Game/common/types/monsters.types";
import { AnimatedSprite } from "pixi.js";

const slimeWalkAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "slime-u-walk", flipX: false },
  down: { textureName: "slime-d-walk", flipX: false },
  left: { textureName: "slime-s-walk", flipX: false, y: -3 },
  right: { textureName: "slime-s-walk", flipX: true, y: -3 },
};

const slimeDeathAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "slime-u-death", flipX: false },
  down: { textureName: "slime-d-death", flipX: false },
  left: { textureName: "slime-s-death", flipX: false, y: -3 },
  right: { textureName: "slime-s-death", flipX: true, y: -3 },
};

export function getSlimeWalkForDirection(
  direction: Direction, 
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = slimeWalkAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 8, 0.08, MonsterSize[size]);

  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y
  
  return sprite;
}

export function getSlimeDeathForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = slimeDeathAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 10, 0.2, MonsterSize[size], false);

  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}
