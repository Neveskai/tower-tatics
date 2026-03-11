import { AnimatedSprite, Container, Texture } from "pixi.js";

const mgExplosionTextures: Texture[] = [];

const options = {
  scale: 0.12,
  speed: 1.25,
};

function getMGExplosionTextures(): Texture[] {
  if (mgExplosionTextures.length > 0) return mgExplosionTextures;

  for (let i = 1; i <= 4; i++) {
    const texture = Texture.from(
      `explosion-bullet_mg-${i}`
    );
    mgExplosionTextures.push(texture);
  }

  return mgExplosionTextures;
}

export function spawnBulletMGExplosion(
  container: Container,
  x: number,
  y: number
) {
  const textures = getMGExplosionTextures();

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

  explosion.onComplete = () => {
    explosion.destroy();
  };
}
