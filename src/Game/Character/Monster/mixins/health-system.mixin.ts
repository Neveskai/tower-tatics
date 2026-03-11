import { Graphics, Sprite, Texture } from "pixi.js";
import { SCREEN } from "@/Game/common";
import { MonsterCharacter } from "../monster.entity";

export class HealthSystem {
  public effectIcon: Sprite | null = null;
  private hpBarBg: Graphics = new Graphics();
  private hpBarFill: Graphics = new Graphics();
  private healthObservers: ((
    currentHealth: number,
    maxHealth: number
  ) => void)[] = [];

  constructor(private monster: MonsterCharacter) {
    this.drawHealthBars();
    this.updateHpBar();
    this.updateEffectIcon();
  }

  private getHpBarConfig() {
    const size = this.monster.size;

    const sizeMap = {
      small: {
        width: SCREEN.TILE_SIZE,
        height: 4,
        offsetY: -8,
        color: 0xffb000,
      },
      normal: {
        width: SCREEN.TILE_SIZE * 1.3,
        height: 5,
        offsetY: -11,
        color: 0xff7000,
      },
      big: {
        width: SCREEN.TILE_SIZE * 1.6,
        height: 6,
        offsetY: -16,
        color: 0xff0070,
      },
      huge: {
        width: SCREEN.TILE_SIZE * 1.9,
        height: 7,
        offsetY: -19,
        color: 0x7f00d0,
      },
      demonic: {
        width: SCREEN.TILE_SIZE * 2.2,
        height: 9,
        offsetY: -21,
        color: 0x9f09d0,
      },
    };

    return sizeMap[size] || sizeMap.normal;
  }

  public takeDamage(amount: number): void {
    if (!this.monster.isAlive) return;

    this.monster.currHealth = Math.max(0, this.monster.currHealth - amount);
    this.updateHpBar();
    this.notifyHealthChange();

    if (this.monster.currHealth <= 0 && this.monster.isAlive) {
      this.monster.onDeath();
    }
  }

  public setHealth(value: number): void {
    this.monster.currHealth = Math.max(
      0,
      Math.min(this.monster.maxHealth, value)
    );
    this.updateHpBar();
  }

  public onHealthChange(
    callback: (health: number, maxHealth: number) => void
  ): () => void {
    this.healthObservers.push(callback);

    return () => {
      this.healthObservers = this.healthObservers.filter(
        (cb) => cb !== callback
      );
    };
  }

  private drawHealthBars(): void {
    const { width, height, offsetY, color } = this.getHpBarConfig();
    const x = -(width - SCREEN.TILE_SIZE) / 2;

    this.hpBarBg.beginPath();
    this.hpBarBg.roundRect(x, offsetY, width, height, height / 2);
    this.hpBarBg.fill({ color: 0x000000 });
    this.monster.addChild(this.hpBarBg);

    this.hpBarFill.beginPath();
    this.hpBarFill.roundRect(x, offsetY, width, height, height / 2);
    this.hpBarFill.fill({ color: color });
    this.monster.addChild(this.hpBarFill);

    const defaultTexture = Texture.EMPTY;
    this.effectIcon = new Sprite(defaultTexture);
    this.effectIcon.visible = false;
    this.monster.addChild(this.effectIcon);
  }

  public updateEffectIcon(): void {
    if (!this.effectIcon) return;

    const isSlowed = this.monster.slowEffect?.slowed;
    const isStunned = this.monster.stunEffect?.stunned;
    const isHealer = this.monster.healer;
    const isEnraged = this.monster.isEnraged;
    const isStealth = this.monster.isStealthActive;

    if (isStunned) {
      this.effectIcon.width = 11;
      this.effectIcon.height = 11;
      this.effectIcon.x = -11;
      this.effectIcon.y = -11;
      this.effectIcon.texture = Texture.from("bolt");
      this.effectIcon.visible = true;
      return;
    }

    if (isSlowed) {
      this.effectIcon.width = 10;
      this.effectIcon.height = 7;
      this.effectIcon.x = -10;
      this.effectIcon.y = -8;
      this.effectIcon.texture = Texture.from("snowflake");
      this.effectIcon.visible = true;
      return;
    }

    if (isHealer) {
      this.effectIcon.width = 10;
      this.effectIcon.height = 10;
      this.effectIcon.x = -10;
      this.effectIcon.y = -12;
      this.effectIcon.texture = Texture.from("heart");
      this.effectIcon.visible = true;
      return;
    }

    if (isEnraged) {
      this.effectIcon.width = 10;
      this.effectIcon.height = 10;
      this.effectIcon.x = -10;
      this.effectIcon.y = -12;
      this.effectIcon.texture = Texture.from("flame");
      this.effectIcon.visible = true;
      return;
    }

    if (isStealth) {
      this.effectIcon.width = 10;
      this.effectIcon.height = 8;
      this.effectIcon.x = -10;
      this.effectIcon.y = -10;
      this.effectIcon.texture = Texture.from("eye-off");
      this.effectIcon.visible = true;
      return;
    }

    this.effectIcon.visible = false;
  }

  public updateHpBar(): void {
    const { width, height, offsetY, color } = this.getHpBarConfig();
    const ratio = Math.max(this.monster.currHealth / this.monster.maxHealth, 0);
    const x = -(width - SCREEN.TILE_SIZE) / 2;

    this.hpBarFill.clear();
    this.hpBarFill.beginPath();
    this.hpBarFill.roundRect(x, offsetY, width * ratio, height, height / 2);
    this.hpBarFill.fill({ color: color });
  }

  private notifyHealthChange(): void {
    for (const observer of this.healthObservers) {
      observer(this.monster.currHealth, this.monster.maxHealth);
    }
  }

  public onDeathCallbacks(): void {
    if (this.hpBarFill) {
      this.monster.removeChild(this.hpBarFill);
      this.hpBarFill.destroy();
    }

    if (this.hpBarBg) {
      this.monster.removeChild(this.hpBarBg);
      this.hpBarBg.destroy();
    }
  }
}
