import { SoundGroups } from '@/common/enum/sound-groups'
import SoundLayer from "@/common/sound";
import { AnimatedSprite, Container, Texture } from "pixi.js";

const explosionTextures: Texture[] = [];

const options = {
  scale: 0.15,
  speed: 1
};

function getExplosionTextures(): Texture[] {
  if (explosionTextures.length > 0) return explosionTextures;

  for (let i = 1; i <= 5; i++) {
    const texture = Texture.from(`explosion-anti_air-${i}`);
    explosionTextures.push(texture);
  }

  return explosionTextures;
}

export function spawnAntiAirExplosion(
  container: Container,
  x: number,
  y: number
) {
  const textures = getExplosionTextures();

  const explosion = new AnimatedSprite(textures);

  explosion.x = x;
  explosion.y = y;
  explosion.anchor.set(0.5);

  explosion.scale.set(options.scale);
  explosion.animationSpeed = options.speed;

  explosion.loop = false;
  explosion.zIndex = 200;

  container.addChild(explosion);
  explosion.play();
  SoundLayer.play(SoundGroups.Effects, { name: "explosion-anti-air" });

  explosion.onComplete = () => {
    explosion.destroy();
  };
}
