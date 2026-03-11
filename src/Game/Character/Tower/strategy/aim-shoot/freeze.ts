import { MonsterCharacter } from "@/Game/Character/Monster";
import { SCREEN } from "@/Game/common";
import { FreezeTower } from "../..";
import { Bullet } from "../../mixins/bullet.system";
import SoundLayer from "@/common/sound";
import { SoundGroups } from '@/common/enum/sound-groups'

export class FreezeAimShoot {
  public bullet?: Bullet;

  private target?: MonsterCharacter;
  private timeSinceLastAttack = 0;

  constructor(private tower: FreezeTower) {
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
    }

    if (!this.target || this.target?.slowEffect.slowed) {
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

    if (this.tower.isOverheated) return;

    if (!this.target) {
      return;
    }

    if (this.timeSinceLastAttack >= attackInterval) {
      this.sendBullet(this.target);
      this.timeSinceLastAttack = 0;
    }
  }

  private calculateAttackInterval(): number {
    return 1000 / this.tower.attackSpeed;
  }

  private async sendBullet(target: MonsterCharacter): Promise<void> {
    this.bullet = new Bullet(
      this.tower.parent!,
      target,
      this.tower,
      this.tower.charactersLayer,
      this.tower.bulletAsset
    );

    SoundLayer.play(SoundGroups.Effects, {
      name: this.tower.soundAsset,
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
    this.target = candidates.reduce<MonsterCharacter | undefined>(
      (best, monster) => {
        if (!monster.isAlive) return best;
        if (monster.slowEffect.slowed) return best;

        return !best ||
          monster.getProgressToPortal() > best.getProgressToPortal()
          ? monster
          : best;
      },
      undefined
    );
  }
}
