import { MonsterCharacter } from "@/Game/Character/Monster";
import { SCREEN } from "@/Game/common";
import { HeavyGunTower } from "../..";
import { Bullet } from "../../mixins/bullet.system";
import SoundLayer from "@/common/sound";
import { SoundGroups } from '@/common/enum/sound-groups'

export class HeavyGunAimShoot {
  public bullet?: Bullet;

  private heatFactor: number = 0;
  private lastHeatUpdateTime: number = performance.now();
  private readonly heatUpDuration = 4000;
  private readonly heatDecayDuration = 4000;

  private target?: MonsterCharacter;
  private timeSinceLastAttack = 0;

  constructor(private tower: HeavyGunTower) {
    this.timeSinceLastAttack = 1000 / this.tower.attackSpeed;
  }

  private aim(): MonsterCharacter[] {
    const rangePx = this.tower.range * SCREEN.TILE_SIZE;

    return this.tower.charactersLayer.getEnemiesInRange(
      this.tower.x,
      this.tower.y,
      rangePx,
      this.tower.attackAir,
      this.tower.attackTerrain
    );
  }

  public destroy() {
    this.bullet?.destroy();
  }

  public update(): void {
    if (this.tower.upgrader.isUpgrading) {
      this.target = undefined;
      return;
    }

    const candidates = this.aim();

    if (this.target) {
      this.followCurrentTarget(candidates);
    } else {
      this.findNewTarget(candidates);
    }

    const aimAngle =
      this.target != null
        ? Math.atan2(
            this.target.y - this.tower.y,
            this.target.x - this.tower.x
          ) + Math.PI / 2
        : null;
    this.tower.render.setAimAngle(aimAngle);

    this.shoot();
  }

  private shoot(): void {
    const deltaMS = this.tower.ticker.deltaMS;

    this.timeSinceLastAttack += deltaMS;

    const attackInterval = this.calculateAttackInterval();

    if (!this.target || this.tower.isOverheated) {
      return SoundLayer.stop(SoundGroups.Effects, {
        name: this.tower.soundAsset,
        emitterId: this.tower.id,
      });
    }

    if (this.timeSinceLastAttack >= attackInterval) {
      this.sendBullet(this.target);
      this.timeSinceLastAttack = 0;
    }
  }

  private calculateAttackInterval(): number {
    const now = performance.now();
    const delta = now - this.lastHeatUpdateTime;
    this.lastHeatUpdateTime = now;

    const isAttacking = !!this.target;

    if (isAttacking) {
      this.heatFactor = Math.min(
        1,
        this.heatFactor + delta / this.heatUpDuration
      );
    } else {
      this.heatFactor = Math.max(
        0,
        this.heatFactor - delta / this.heatDecayDuration
      );
    }

    const speedMultiplier = 0.2 + 0.8 * this.heatFactor;
    return 1000 / (this.tower.attackSpeed * speedMultiplier);
  }

  private async sendBullet(target: MonsterCharacter): Promise<void> {
    this.bullet = new Bullet(
      this.tower.parent!,
      target,
      this.tower,
      this.tower.charactersLayer,
      this.tower.bulletAsset
    );

    const minRate = 0.1;
    const maxRate = 1;
    const rate = minRate + this.heatFactor * (maxRate - minRate);

    SoundLayer.play(SoundGroups.Effects, {
      name: this.tower.soundAsset,
      rate,
      emitterId: this.tower.id,
    });

    this.tower.registerShot();
  }

  private followCurrentTarget(candidates: MonsterCharacter[]): void {
    if (!this.target) return;

    if (!this.target?.isAlive) {
      this.target = undefined;
    } else if (!candidates.some((monster) => monster.id === this.target?.id)) {
      this.target = undefined;
    }
  }

  private findNewTarget(candidates: MonsterCharacter[]): void {
    const previousTarget = this.target;

    this.target = candidates.reduce<MonsterCharacter | undefined>(
      (best, monster) => {
        if (!monster.isAlive) return best;

        return !best ||
          monster.getProgressToPortal() > best.getProgressToPortal()
          ? monster
          : best;
      },
      undefined
    );

    if (previousTarget && this.target && previousTarget.id !== this.target.id) {
      this.heatFactor = Math.max(0, this.heatFactor * 0.9);
    }
  }
}
