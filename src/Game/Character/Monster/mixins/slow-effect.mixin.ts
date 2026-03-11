import { Sprite } from "pixi.js";
import { MonsterCharacter } from "../monster.entity";

const RESIST_FACTOR = 1.5;

export class SlowEffect {
  public slowUntil: number = 0;
  public slowFactor: number = 0;
  public slowed: boolean = false;

  private originalTint: number | undefined;

  constructor(private monster: MonsterCharacter) {}

  public applySlow(factor: number, duration: number): void {
    const now = performance.now() / 1000;

    const slowFactor = this.monster.config?.special?.resistToSlow
      ? factor * RESIST_FACTOR
      : factor;

    if (!this.slowUntil || this.slowUntil < now || this.slowFactor > factor) {
      this.slowed = true;
      this.slowFactor = slowFactor;
      this.slowUntil = now + duration;
    }
  }

  public update(): void {
    const now = performance.now() / 1000;

    if (now >= this.slowUntil) {
      this.slowed = false;
      this.slowUntil = 0;
      this.slowFactor = 0;
    }

    const sprite = this.monster.drawSys.getSprite();

    if (!sprite) return;

    if (this.slowed) {
      if (this.originalTint === undefined) {
        this.originalTint = sprite.tint;
      }

      sprite.tint = 0x00ccff;
      this.monster.healthSys.updateEffectIcon();
    } else {
      this.clearSlowTint(sprite);
    }
  }

  private clearSlowTint(sprite: Sprite) {
    if (this.originalTint !== undefined) {
      sprite.tint = this.originalTint;
      this.originalTint = undefined;
      this.monster.healthSys.updateEffectIcon();
    }
  }

  public get currentSpeed(): number {
    const now = performance.now() / 1000;

    const base = this.monster.baseSpeed * (this.monster.speedMultiplier || 1);

    if (this.slowUntil && this.slowUntil > now && this.slowFactor) {
      return base * this.slowFactor;
    }

    return base;
  }
}
