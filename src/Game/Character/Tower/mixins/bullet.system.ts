import { FreezeTower } from "../entities/freeze.entity";
import { Sprite, Texture, Ticker, Container, ColorMatrixFilter } from "pixi.js";
import {
  AntiAirTower,
  CannonTower,
  CharactersLayer,
  HeavyGunTower,
  MachineGunTower,
} from "@/Game/Character";
import {
  spawnAntiAirExplosion,
  spawnBulletMGExplosion,
} from "@/Game/Character/Tower/animations";
import { SCREEN } from "@/Game/common";
import { MonsterCharacter } from "@/Game/Character/Monster";
import { TowerCharacter } from "../tower.abstract";
import { spawnMissileExplosion } from "../animations/bullet-missile";
import { resolveDamage } from "@/Game/common/combat/damage.helpers";

const minDist = 6;

export class Bullet extends Sprite {
  private speed = 500;
  private damage: number;
  private aoe: number;
  private ticker = Ticker.shared;
  private fallbackTargetPos: { x: number; y: number } | null = null;

  constructor(
    private container: Container,
    private target: MonsterCharacter,
    private tower: TowerCharacter,
    private charactersLayer: CharactersLayer,
    bulletAsset: string
  ) {
    super(Texture.from(bulletAsset));

    if (this.tower?.render) {
      const gunLength = 20;
      const aimRad = this.tower.render.aimAngleRad;
      const rotation =
        aimRad != null ? aimRad - Math.PI / 2 : this.tower.render.weaponSprite
          ? this.tower.render.weaponSprite.rotation - Math.PI / 2
          : 0;
      const baseX = this.tower.x + Math.cos(rotation) * gunLength;
      const baseY = this.tower.y + Math.sin(rotation) * gunLength;

      this.x = baseX;
      this.y = baseY;
    }

    this.anchor.set(0.5);
    this.width = this.tower.bulletSize.width;
    this.height = this.tower.bulletSize.height;
    this.speed = this.tower.bulletSpeed;
    // @ts-expect-error no-type
    this.tint = this.tower.bulletSize.tint;

    this.damage = this.tower["attackDamage"];
    this.aoe = this.tower["AoE"];
    this.zIndex = 100;

    this.container.addChild(this);

    if (this.tower instanceof FreezeTower) {
      const colorMatrix = new ColorMatrixFilter();
      colorMatrix.tint(0x00ccff);
      this.filters = [colorMatrix];
    }

    this.ticker.add(this.update, this);
  }

  public onDestroy() {
    this.ticker.remove(this.update, this);
    this.parent?.removeChild(this);
    this.destroy();
  }

  private update = () => {
    let targetX: number;
    let targetY: number;

    this.fallbackTargetPos = { x: this.target.x, y: this.target.y };

    const halfTile = SCREEN.TILE_SIZE / 2;

    if (this.target && !this.target.destroyed && this.target.parent) {
      targetX = this.target.x + halfTile;
      targetY = this.target.y + halfTile;
    } else {
      targetX = this.fallbackTargetPos.x + halfTile;
      targetY = this.fallbackTargetPos.y + halfTile;
    }

    const dx = this?.x ? targetX - this.x : this.parent.x;
    const dy = this?.y ? targetY - this.y : this.parent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    this.rotation = Math.atan2(dy, dx) + Math.PI / 2;

    if (dist < minDist) {
      if (!(this.tower instanceof FreezeTower)) this.spawnExplosionEffect();
      this.applyDamage();
      this.onDestroy();
      return;
    }

    const delta = this.ticker.deltaMS / 1000;
    const vx = (dx / dist) * this.speed * delta;
    const vy = (dy / dist) * this.speed * delta;
    this.x += vx;
    this.y += vy;
  };

  private applyDamage() {
    const baseDamage = this.damage;

    if (this.aoe > 0) {
      const monsters = this.charactersLayer["monsters"];

      for (const monster of monsters) {
        if (monster.destroyed || !monster.parent) continue;

        const dx = monster.x - this.target.x;
        const dy = monster.y - this.target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.aoe * SCREEN.TILE_SIZE) {
          const effectiveDamage = resolveDamage(baseDamage);
          if (effectiveDamage > 0) {
            monster.takeDamage(effectiveDamage);
            this.tower.statsTracker.totalDamage += effectiveDamage;
            this.tower.statsTracker.hordeDamage += effectiveDamage;
          }
        }
      }
    } else {
      const effectiveDamage = resolveDamage(baseDamage);
      if (effectiveDamage > 0) {
        this.target.takeDamage(effectiveDamage);
        this.tower.statsTracker.totalDamage += effectiveDamage;
        this.tower.statsTracker.hordeDamage += effectiveDamage;
      }
    }

    if (this.tower instanceof FreezeTower) {
      if (
        this.tower?.special?.slowFactor &&
        this.tower?.special?.slowDuration
      ) {
        this.target.applySlow(
          this.tower?.special?.slowFactor,
          this.tower?.special?.slowDuration
        );
      }
    }

    this.tower.notifyDamageStatisticsChange();
  }

  private spawnExplosionEffect() {
    const explosionX = (this.target?.x ?? this.x) + SCREEN.TILE_SIZE / 2;
    const explosionY = (this.target?.y ?? this.y) + SCREEN.TILE_SIZE / 2;

    if (this.tower instanceof AntiAirTower) {
      return spawnAntiAirExplosion(this.container, explosionX, explosionY);
    }

    if (this.tower instanceof MachineGunTower) {
      return spawnBulletMGExplosion(this.container, explosionX, explosionY);
    }

    if (this.tower instanceof HeavyGunTower) {
      return spawnBulletMGExplosion(this.container, explosionX, explosionY);
    }

    if (this.tower instanceof CannonTower) {
      return spawnMissileExplosion(this.container, explosionX, explosionY);
    }
  }
}
