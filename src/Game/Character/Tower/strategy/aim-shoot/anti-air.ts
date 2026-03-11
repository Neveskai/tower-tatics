import { MonsterCharacter } from "@/Game/Character/Monster";
import { SCREEN } from "@/Game/common";
import { AntiAirTower } from "../..";
import { Bullet } from "../../mixins/bullet.system";
import SoundLayer from "@/common/sound";
import { SoundGroups } from '@/common/enum/sound-groups'

export class AntiAirAimShoot {
  public bullet?: Bullet;

  private targets: (MonsterCharacter | undefined)[] = [
    undefined,
    undefined,
    undefined,
  ];

  private timeSinceLastAttacks = [0, 0, 0];
  private readonly missileDelays = [0, 75, 150];

  constructor(private tower: AntiAirTower) {
    for (let i = 0; i < this.timeSinceLastAttacks.length; i++) {
      const initTime = 1000 / this.tower.attackSpeed + this.missileDelays[i];
      this.timeSinceLastAttacks[i] = initTime;
    }
  }

  public destroy() {
    this.bullet?.destroy();
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

  public update(): void {
    if (this.tower.upgrader.isUpgrading) {
      this.targets = [undefined, undefined, undefined];
      return;
    }

    const candidates = this.aim();

    if (candidates.length) {
      this.setAntiAirTargets(candidates);
    }

    const aimAngle =
      this.targets[0] != null && !this.targets[0].destroyed
        ? Math.atan2(
            this.targets[0].y - this.tower.y,
            this.targets[0].x - this.tower.x
          ) + Math.PI / 2
        : null;
    this.tower.render.setAimAngle(aimAngle);

    this.shoot();
  }

  private setAntiAirTargets(candidates: MonsterCharacter[]): void {
    const count = candidates.length;
    this.targets =
      count === 1
        ? [candidates[0], candidates[0], candidates[0]]
        : count === 2
        ? [candidates[0], candidates[1], candidates[0]]
        : candidates.slice(0, 3);
  }

  private shoot(): void {
    const deltaMS = this.tower.ticker.deltaMS;

    for (let i = 0; i < 3; i++) {
      this.timeSinceLastAttacks[i] += deltaMS;
      const attackInterval = 1000 / this.tower.attackSpeed;
      const target = this.targets[i];

      if (this.tower.isOverheated) {
        continue;
      }

      if (
        target &&
        target.isAlive &&
        this.timeSinceLastAttacks[i] >= attackInterval + this.missileDelays[i]
      ) {
        const inRange = this.isTargetInRange(target);

        if (inRange) {
          this.sendBullet(target);
          this.timeSinceLastAttacks[i] = 0;
        } else {
          this.targets[i] = undefined;
        }
      } else if (!target?.isAlive) {
        this.targets[i] = undefined;
      }
    }
  }

  private isTargetInRange(target: MonsterCharacter): boolean {
    const dx = target.x - this.tower.x;
    const dy = target.y - this.tower.y;
    const distance = Math.hypot(dx, dy);
    const rangePx = this.tower.range * SCREEN.TILE_SIZE;

    return distance <= rangePx;
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
}
