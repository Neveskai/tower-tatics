import { Container } from "pixi.js";
import { PlacementLayer } from "@/Game/Placement";
import { v4 as uuidv4 } from "uuid";
import {
  MonsterConfig,
  MonsterSize,
  MonsterType,
} from "@/Game/common/types/monsters.types";
import { Direction } from "@/Game/common/types/animation.types";
import { useGameStore, isPausedMidWave } from "@/Game/common/stores/state";
import {
  HealthSystem,
  MovementSystem,
  RenderSystem,
  SlowEffect,
  SpawnSystem,
} from "./mixins";
import { StunEffect } from "./mixins/stun-effect.mixin";
import { monsterDeathAnimations } from "./animations";
import { onDeathHudCallbacks } from "@/Game/Character/Monster/helpers";
import { TowerCharacter } from "../Tower";
import { SoundNames } from "@/common/assets/sound-assets";
import SoundLayer from "@/common/sound";
import { showFloatingText } from "@/Game/Text/text.layer";
import { GOLD_GAINED_TEXT, SLOW_RESIST_TEXT, STUN_RESIST_TEXT } from "@/Game/Text/monster-text";
import { HudModes } from "@/common/enum/hud-modes";
import { SoundGroups } from "@/common/enum/sound-groups";
import { Vec2 } from "@/Game/common/types/placement.types";

export class MonsterCharacter extends Container {
  id = uuidv4();

  private roarSound: SoundNames = "slime-walk";
  readonly healthSys: HealthSystem;
  readonly movementSys: MovementSystem;
  readonly drawSys: RenderSystem;
  readonly slowEffect: SlowEffect;
  readonly stunEffect: StunEffect;
  readonly spawnSys: SpawnSystem;

  public initialDirection = "right";
  private air: boolean;

  public direction: Direction = "right";
  public baseSpeed = 1;
  public mapLayer: PlacementLayer;
  public gold: number;
  public size: keyof typeof MonsterSize;
  public type: MonsterType;
  public isAlive: boolean = true;
  public maxHealth: number = 100;
  public currHealth: number = 100;
  public config: MonsterConfig;
  public healer: boolean = false;
  public stealth: boolean = false;
  public revealed: boolean = true;
  public enrageOnLowHP: boolean = false;
  public isEnraged: boolean = false;
  public speedMultiplier: number = 1;
  public healerElapsedMs: number = 0;

  get isAir() {
    return this.air;
  }

  get isTerrain() {
    return !this.air;
  }

  get currentSpeed() {
    return this.slowEffect.currentSpeed;
  }

  constructor(
    mapLayer: PlacementLayer,
    config: MonsterConfig,
  ) {
    super();
    this.config = config;
    this.mapLayer = mapLayer;
    this.type = config.type;
    this.air = config.air || false;
    this.gold = config.gold;
    this.type = config.type;
    this.size = config.size;
    this.zIndex = 100;
    this.maxHealth = config.maxHealth;
    this.currHealth = config.maxHealth;
    this.baseSpeed = config.speed;
    this.roarSound = `${config.type}-roar` as SoundNames;

    this.healer = !!(config.special?.healer ?? (config as { healer?: boolean }).healer);
    this.stealth = !!(config.special?.stealth ?? (config as { stealth?: boolean }).stealth);
    this.revealed = !this.stealth;
    this.enrageOnLowHP = !!(config.special?.enrageOnLowHP ?? (config as { enrageOnLowHP?: boolean }).enrageOnLowHP);

    this.healthSys = new HealthSystem(this);
    this.movementSys = new MovementSystem(this);
    this.drawSys = new RenderSystem(this);
    this.slowEffect = new SlowEffect(this);
    this.stunEffect = new StunEffect(this);
    this.spawnSys = new SpawnSystem(this);

    if (this.enrageOnLowHP) {
      this.healthSys.onHealthChange((health, maxHealth) => {
        if (!this.isEnraged && maxHealth > 0 && health / maxHealth <= 0.3) {
          this.isEnraged = true;
          this.speedMultiplier = 1.5;
        }
      });
    }

    this.setupClickEvent();
  }

  public onDestroy() {
    this.destroy();
  }

  public onDeath(): void {
    this.isAlive = false;

    SoundLayer.play(SoundGroups.Monsters, {
      name: this.roarSound,
      emitterId: this.id,
    });

    SoundLayer.stop(SoundGroups.Monsters, {
      name: this.roarSound,
      emitterId: this.id,
      fadeOutDuration: 2000,
    });

    onDeathHudCallbacks(this);

    this.healthSys.onDeathCallbacks();
    this.movementSys.onDeathCallbacks();
    this.drawSys.onDeathCallbacks();
    this.spawnSys.onDeathCallbacks();

    this.showGoldRewardText();
    this.showDeathAnimation();
  }

  public update = (deltaMS: number) => {
    this.stunEffect.update();
    this.slowEffect.update();
    this.movementSys.update(deltaMS);
  };

  public reDraw() {
    this.drawSys.reDraw();
    this.healthSys.updateHpBar();
  }

  public takeDamage(amount: number) {
    this.healthSys.takeDamage(amount);
  }

  public setHealth(value: number) {
    this.healthSys.setHealth(value);
  }

  public get isStealthActive(): boolean {
    return this.stealth && !this.revealed;
  }

  public reveal(): void {
    this.revealed = true;
    this.healthSys.updateEffectIcon();
  }

  public getProgressToPortal(): number {
    return this.movementSys.getProgressToPortal();
  }

  public async goToAny(targets: Vec2[]) {
    return this.movementSys.goToAny(targets);
  }

  public verifyPath(tower: TowerCharacter) {
    this.movementSys.verifyPath(tower);
  }

  public recalcPath() {
    this.movementSys.recalcPath();
  }

  public setWalkAnimation() {
    this.drawSys.setWalkAnimation();
  }

  public onHealthChange(callback: (health: number, maxHealth: number) => void) {
    return this.healthSys.onHealthChange(callback);
  }

  private setupClickEvent() {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointertap", () => {
      const store = useGameStore.getState();
      const currentSelected = store.selectedMonster;

      if (isPausedMidWave(store)) return;

      if (currentSelected?.id !== this.id) {
        store.setSelectedMonster(this);
      }
      store.setMode(HudModes.MONSTER);
    });
  }

  public applySlow(factor: number, duration: number) {
    if (this.config?.special?.resistToSlow) {
      showFloatingText(
        SLOW_RESIST_TEXT,
        750,
        this
      );
    }

    this.slowEffect.applySlow(factor, duration);
  }

  public applyStun(duration: number) {
    if (this.config?.special?.resistToStun) {
      showFloatingText(
        STUN_RESIST_TEXT,
        750,
        this
      );
    }

    this.stunEffect.applyStun(duration);
  }

  private showDeathAnimation() {
    const direction = this.movementSys.lastDirection || "down";
    const deathSprite = monsterDeathAnimations[this.type](direction, this.size);

    if (deathSprite) {
      this.drawSys.sprite = deathSprite;
      this.addChild(deathSprite);

      deathSprite.loop = false;
      deathSprite.onComplete = () => {
        this.emit("monster-died", this);
      };
      deathSprite.play();
    } else {
      this.emit("monster-died", this);
    }
  }

  private showGoldRewardText() {
    SoundLayer.play(SoundGroups.Effects, {
      name: "clinking-coin",
      emitterId: this.id,
    });

    showFloatingText(
      GOLD_GAINED_TEXT(this.gold),
      1500,
      this
    );
  }
}
