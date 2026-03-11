import { AnimatedSprite, Rectangle, Texture } from "pixi.js";
import { SCREEN } from "@/Game/common";

export const framesCache: Record<string, Texture[]> = {};

export function createAnimatedSprite(
  textureName: string,
  frameCount: number,
  animationSpeed: number,
  size: number,
  loop = true
): AnimatedSprite {
  const cache = framesCache[textureName];
  const frames = !cache ? [] : cache;

  if (!framesCache[textureName]) {
    const base = Texture.from(textureName);
    const frameWidth = base.width / frameCount;

    for (let i = 0; i < frameCount; i++) {
      const frame = new Texture({
        source: base.source,
        frame: new Rectangle(i * frameWidth, 0, frameWidth, base.height),
      });

      frames.push(frame);
    }

    framesCache[textureName] = frames;
  }

  const sprite = new AnimatedSprite(frames);
  sprite.anchor.set(0.5);
  sprite.x = SCREEN.TILE_SIZE / 2;
  sprite.y = SCREEN.TILE_SIZE / 2;
  sprite.width = SCREEN.TILE_SIZE * size;
  sprite.height = SCREEN.TILE_SIZE * size;
  sprite.animationSpeed = animationSpeed;
  sprite.loop = loop;
  sprite.play();

  return sprite;
}
