import { useEffect, useRef } from "react";
import { Application, Sprite, Texture } from "pixi.js";
import { usePauseState } from "@/Game/common/stores/state";
import css from "./tower-avatar.module.css";
import { AssetsMap } from "@/common/assets/assets";
import { COLORS } from "@/Game/Character/Tower/constants/tower-colors.constants";
import { BASE_WEAPON_SIZE } from "@/Game/Character/Tower/constants/tower-weapon-anchors.constants";
import { TOWER_AVATAR_WIDTH } from "./tower-avatar.constants";
import type { TowerAvatarProps } from "./tower-avatar.types";

let weaponAsset: (typeof AssetsMap)["tower-base"];
let context: Application | null = null;

export function TowerAvatar({ tower, isUpgrading }: TowerAvatarProps) {
  const { isGameRunning } = usePauseState();
  const containerRef = useRef<HTMLDivElement>(null);
  const baseSpriteRef = useRef<Sprite | null>(null);
  const weaponSpriteRef = useRef<Sprite | null>(null);

  const init = async () => {
    if (!context) {
      context = new Application();
      await context.init({
        width: TOWER_AVATAR_WIDTH,
        height: TOWER_AVATAR_WIDTH,
        backgroundAlpha: 0,
      });
      context.ticker.stop();
    }

    if (
      containerRef.current &&
      !containerRef.current.contains(context.canvas)
    ) {
      containerRef.current.appendChild(context.canvas);
    }

    if (!tower.getType()) return;

    const weaponAssetKey = tower.getType();
    weaponAsset = AssetsMap[weaponAssetKey as keyof typeof AssetsMap];

    const weaponTexture = Texture.from(weaponAsset.alias);
    const maxTex = Math.max(weaponTexture.width, weaponTexture.height);
    const scale = (TOWER_AVATAR_WIDTH * BASE_WEAPON_SIZE) / (maxTex > 0 ? maxTex : 1);

    const baseSprite = new Sprite(weaponTexture);
    baseSprite.anchor.set(0.5, 0.5);
    baseSprite.width = 0;
    baseSprite.height = 0;
    baseSprite.x = TOWER_AVATAR_WIDTH * 0.5;
    baseSprite.y = TOWER_AVATAR_WIDTH * 0.5;

    const weaponSprite = new Sprite(weaponTexture);
    weaponSprite.scale.set(scale);
    weaponSprite.anchor.set(0.5, 0.5);
    weaponSprite.x = TOWER_AVATAR_WIDTH * 0.5;
    weaponSprite.y = TOWER_AVATAR_WIDTH * 0.5;

    if (tower.level) {
      const color = COLORS.TowerEvolution[tower.level - 1];
      weaponSprite.tint = color;
      baseSprite.tint = color;
    }

    if (baseSpriteRef.current) {
      context.stage.removeChild(baseSpriteRef.current);
      baseSpriteRef.current.destroy();
    }
    if (weaponSpriteRef.current) {
      context.stage.removeChild(weaponSpriteRef.current);
      weaponSpriteRef.current.destroy();
    }

    context.stage.addChild(baseSprite);
    context.stage.addChild(weaponSprite);
    baseSpriteRef.current = baseSprite;
    weaponSpriteRef.current = weaponSprite;

    context.renderer.render(context.stage);
  };

  useEffect(() => {
    if (isGameRunning) {
      if (context) context.ticker.start();
      init();
    } else {
      if (context) context.ticker.stop();
    }

    return () => {
      baseSpriteRef.current?.destroy();
      baseSpriteRef.current = null;
      weaponSpriteRef.current?.destroy();
      weaponSpriteRef.current = null;
    };
  }, [tower.getType(), isGameRunning]);

  useEffect(() => {
    if (tower.level) {
      if (weaponSpriteRef.current && baseSpriteRef.current && context) {
        const color = COLORS.TowerEvolution[tower.level - 1];
        weaponSpriteRef.current.tint = color;
        baseSpriteRef.current.tint = color;

        context.renderer.render(context.stage);
      }
    }
  }, [tower.level]);

  useEffect(() => {
    if (
      baseSpriteRef.current?.visible !== undefined &&
      weaponSpriteRef.current?.visible !== undefined &&
      context
    ) {
      if (isUpgrading) {
        weaponSpriteRef.current.visible = false;
        context.renderer.render(context.stage);
      } else {
        weaponSpriteRef.current.visible = true;
        context.renderer.render(context.stage);
      }
    }
  }, [isUpgrading]);

  return (
    <div
      ref={containerRef}
      className={css.TowerAvatar}
      style={{
        height: "100%",
      }}
    />
  );
}
