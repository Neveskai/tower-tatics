import { MonsterCharacter } from "@/Game/Character/Monster";
import { useEffect, useRef } from "react";
import { Application, AnimatedSprite } from "pixi.js";
import { usePauseState } from "@/Game/common/stores/state";
import {
  MONSTER_AVATAR_DIRECTION,
  MONSTER_AVATAR_WIDTH,
} from "./monster-avatar.constants";
import css from "./monster-avatar.module.css";
import { monsterWalkAnimations } from "@/Game/Character/Monster/animations";

let context: Application | null = null;

export function MonsterAvatar({ monster }: { monster: MonsterCharacter }) {
  const { isGameRunning } = usePauseState();
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<AnimatedSprite | null>(null);

  const init = async () => {
    if (!context) {
      context = new Application();
      await context.init({
        width: MONSTER_AVATAR_WIDTH,
        height: MONSTER_AVATAR_WIDTH,
        backgroundAlpha: 0,
      });
    }

    containerRef.current?.appendChild(context.canvas);

    if (!monster.type) return;

    const sprite = monsterWalkAnimations[monster.type](
      MONSTER_AVATAR_DIRECTION,
      monster.size
    );

    sprite.anchor.set(0.5, 0.5);
    sprite.x = MONSTER_AVATAR_WIDTH / 2;
    sprite.y = MONSTER_AVATAR_WIDTH / 2;
    sprite.loop = true;
    sprite.play();

    const targetSize = MONSTER_AVATAR_WIDTH * 0.85;
    if (sprite.width > 0 && sprite.height > 0) {
      const scaleFactor = Math.min(
        targetSize / sprite.width,
        targetSize / sprite.height
      );
      sprite.scale.set(sprite.scale.x * scaleFactor, sprite.scale.y * scaleFactor);
    } else {
      sprite.width = targetSize;
      sprite.height = targetSize;
    }

    if (spriteRef.current) {
      context.stage.removeChild(spriteRef.current);
      spriteRef.current.destroy();
    }

    context.stage.addChild(sprite);
    spriteRef.current = sprite;
  };

  useEffect(() => {
    if (isGameRunning) {
      if (context) context.ticker.start();
      init();
    } else {
      if (context) context.ticker.stop();
    }

    return () => {
      spriteRef.current?.destroy();
      spriteRef.current = null;
    };
  }, [isGameRunning, monster.id]);

  return (
    <div className={css.imageContainer}>
      <div ref={containerRef} className={css.MonsterAvatar} />
    </div>
  );
}
