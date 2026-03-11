import { createAnimatedSprite } from "@/Game/Character/Monster/animations/create-animated-sprite";
import { AnimationConfig, Direction } from "@/Game/common/types/animation.types";
import { MonsterSize } from "@/Game/common/types/monsters.types";
import { AnimatedSprite } from "pixi.js";

const walkAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "orc-u-walk", flipX: false },
  down: { textureName: "orc-d-walk", flipX: false },
  left: { textureName: "orc-s-walk", flipX: false, y: -3 },
  right: { textureName: "orc-s-walk", flipX: true, y: -3 },
};

const deathAnimationMap: Record<Direction, AnimationConfig> = {
  up: { textureName: "orc-u-death", flipX: false },
  down: { textureName: "orc-d-death", flipX: false },
  left: { textureName: "orc-s-death", flipX: false, y: -3 },
  right: { textureName: "orc-s-death", flipX: true, y: -3 },
};

export function getOrcWalkForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = walkAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 6, 0.15, MonsterSize[size]);

  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}

export function getOrcDeathForDirection(
  direction: Direction,
  size: keyof typeof MonsterSize
): AnimatedSprite {
  const config = deathAnimationMap[direction];
  const sprite = createAnimatedSprite(config.textureName, 8, 0.25, MonsterSize[size], false);
  
  sprite.scale.x = config.flipX ? -1 : 1;
  if (config.y) sprite.y = sprite.y + config.y

  return sprite;
}
