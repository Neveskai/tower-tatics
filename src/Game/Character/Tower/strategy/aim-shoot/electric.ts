import { MonsterCharacter } from "@/Game/Character/Monster";
import { SCREEN } from "@/Game/common";
import { ElectricTower } from "../..";
import { spawnElectricExplosion } from "../../animations";
import SoundLayer from "@/common/sound";
import { SoundGroups } from "@/common/enum/sound-groups";
import { resolveDamage } from "@/Game/common/combat/damage.helpers";

export class ElectricAimShoot {
  private timeSinceLastAttack = 0;

  constructor(private tower: ElectricTower) {
    this.initAttackTimers();
  }

  private initAttackTimers(): void {
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
    return false;
  }

  public update(): void {
    if (this.tower.upgrader.isUpgrading) return;

    const candidates = this.aim();

    const aimAngle =
      candidates.length > 0
        ? Math.atan2(
            candidates[0].y - this.tower.y,
            candidates[0].x - this.tower.x
          ) + Math.PI / 2
        : null;
    this.tower.render.setAimAngle(aimAngle);

    if (candidates.length) {
      this.shoot();
    }
  }

  private shoot(): void {
    const now = Date.now();
    const range = (this.tower.range + 1) * SCREEN.TILE_SIZE;

    if (now - this.timeSinceLastAttack < 1000 / this.tower.attackSpeed) return;

    this.timeSinceLastAttack = now;

    const monsters = this.tower.charactersLayer.getEnemiesInRange(
      this.tower.position.x,
      this.tower.position.y,
      range,
      false,
      true
    );

    monsters.forEach((monster) => {
      const effectiveDamage = resolveDamage(this.tower.attackDamage);
      if (effectiveDamage > 0) {
        monster.takeDamage(effectiveDamage);
        this.tower.statsTracker.hordeDamage += effectiveDamage;
        this.tower.statsTracker.totalDamage += effectiveDamage;
      }

      if (Math.random() < (this.tower.special?.stunChance ?? 0)) {
        monster.applyStun(this.tower.special?.stunDuration ?? 1);
      }
    });

    spawnElectricExplosion(this.tower.parent!, this.tower.x, this.tower.y);
    this.tower.notifyDamageStatisticsChange();

    SoundLayer.play(SoundGroups.Effects, {
      name: this.tower.soundAsset,
      emitterId: this.tower.id,
    });
  }
}
