import { AnimatedSprite, Container, Texture } from "pixi.js";

const explosionTextures: Texture[] = [];

const options = {
  scale: 0.2,
  speed: 1,
};

function getExplosionTextures(): Texture[] {
  if (explosionTextures.length > 0) return explosionTextures;

  for (let i = 1; i <= 5; i++) {
    const texture = Texture.from(
      `explosion-electric-${i}`
    );
    explosionTextures.push(texture);
  }

  return explosionTextures;
}

export function spawnElectricExplosion(
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

  explosion.onComplete = () => {
    explosion.destroy();
  };
}
