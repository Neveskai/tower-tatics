import { Sprite } from "pixi.js";
import { MonsterCharacter } from "../monster.entity";

const RESIST_FACTOR = 0.5;

export class StunEffect {
  public stunUntil: number = 0;
  public stunned: boolean = false;

  private originalTint: number | undefined;

  constructor(private monster: MonsterCharacter) {}

  public applyStun(duration: number): void {
    const now = performance.now() / 1000;

    const newDuration = this.monster.config?.special?.resistToStun
      ? duration * RESIST_FACTOR
      : duration;

    this.stunned = true;
    this.stunUntil = now + newDuration;
  }

  public update(): void {
    const now = performance.now() / 1000;

    if (now >= this.stunUntil) {
      this.stunned = false;
      this.stunUntil = 0;
    }

    const sprite = this.monster.drawSys.getSprite();
    if (!sprite) return;

    if (this.stunned) {
      if (this.originalTint === undefined) {
        this.originalTint = sprite.tint;
      }

      sprite.tint = 0xffcc00;
      this.monster.healthSys.updateEffectIcon();
    } else {
      this.clearStunTint(sprite);
    }
  }

  private clearStunTint(sprite: Sprite): void {
    if (this.originalTint !== undefined) {
      sprite.tint = this.originalTint;
      this.originalTint = undefined;
      this.monster.healthSys.updateEffectIcon();
    }
  }
}
