import { Container, Ticker } from "pixi.js";
import { CharactersLayer } from "@/Game/Character";
import { SCREEN } from "@/Game/common";
import { TowerTypes } from "@/common/enum/tower-types";
import {
  AimShootStrategy,
  DamageStatisticsObserver,
  UpgradeProgressObserver,
} from "./tower.types";
import { v4 as uuidv4 } from "uuid";

import { RenderSystem, UpgradeSystem, StatisticsSystem } from "./mixins";
import { useGameStore, isPausedMidWave } from "@/Game/common/stores/state";
import { SoundNames } from "@/common/assets/sound-assets";
import { HudModes } from "@/common/enum/hud-modes";

export abstract class TowerCharacter extends Container {
  public id = uuidv4();

  public soundAsset: SoundNames = "rifle";
  public attackAir = false;
  public attackTerrain = false;
  public AoE = 0;
  public level = 1;
  public range = 3;
  public bulletSize = { width: 6, height: 8 };
  public bulletAsset = "bullet-mg";
  public bulletSpeed = 400;
  public attackSpeed = 1;
  public attackDamage = 20;
  public cost = 5;
  public sell_prices: object[] = [];
  public upgrades: object = {};

  public heat = 0;
  public maxHeat = Infinity;
  public heatPerShot = 0;
  public coolRate = 0;
  public isOverheated = false;

  public ticker = Ticker.shared;
  public previousTileSize = SCREEN.TILE_SIZE;

  readonly statsTracker: StatisticsSystem;
  readonly render: RenderSystem;
  readonly upgrader: UpgradeSystem;
  abstract readonly aimShoot: AimShootStrategy;

  constructor(public charactersLayer: CharactersLayer) {
    super();

    this.statsTracker = new StatisticsSystem();
    this.render = new RenderSystem(this);
    this.upgrader = new UpgradeSystem(this);

    this.render.loadTowerSprites();
    this.pivot.set(SCREEN.TILE_SIZE, SCREEN.TILE_SIZE);
    this.position.set(SCREEN.TILE_SIZE, SCREEN.TILE_SIZE);
    this.ticker.add(this.update, this);
    this.zIndex = 99;
    this.setupClickEvent();
  }


  public abstract getName(): string;

  public abstract getType(): TowerTypes;

  public onDestroy() {
    this.destroy();
    this.aimShoot.destroy();
  }

  setupClickEvent(): void {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointertap", () => {
      const store = useGameStore.getState();
      const current = store.selectedTower;

      if (isPausedMidWave(store)) return;

      if (current && current !== this) {
        current.hideRangeIndicator();
      }

      store.setSelectedTowerType(null);

      if (current === this) {
        store.setSelectedTower(null);
        this.hideRangeIndicator();
        store.toggleMode();
      } else {
        store.setSelectedTower(this);
        this.drawRangeIndicator();
        store.setMode(HudModes.TOWER);
      }
    });
  }

  destroy(options?: boolean) {
    this.ticker.remove(this.update, this);
    super.destroy(options);
  }

  update = () => {
    if (!this.charactersLayer) return;

    const deltaMS = this.ticker.deltaMS;

    if (this.upgrader.isUpgrading) {
      this.upgrader.update(deltaMS);
      return;
    }

    if (this.maxHeat !== Infinity && this.heatPerShot > 0) {
      if (this.heat > 0) {
        this.heat = Math.max(0, this.heat - this.coolRate * deltaMS);
      }

      if (this.isOverheated && this.heat === 0) {
        this.isOverheated = false;
      }
    }

    this.aimShoot.update();
    this.render.updateWeaponFrame();
    this.render.updateOverheatVisual();
  };

  public registerShot() {
    if (this.maxHeat === Infinity || this.heatPerShot <= 0) return;
    this.heat = Math.min(this.maxHeat, this.heat + this.heatPerShot);
    if (this.heat >= this.maxHeat) {
      this.isOverheated = true;
    }
  }

  sell = () => this.upgrader.sell();
  upgrade = () => this.upgrader.upgrade();
  getNextLevelStats = () => this.upgrader.getNextLevelStats();

  get sell_price() {
    return this.upgrader.sellPrice;
  }

  paintColoredRect = (type: TowerTypes) => {
    return this.render.paintColoredRect(type);
  };
  reDraw = () => this.render.reDraw();
  loadTowerSprites = () => this.render.loadTowerSprites();
  drawRangeIndicator = () => this.render.drawRangeIndicator();
  hideRangeIndicator = () => this.render.hideRangeIndicator();
  getCurrentTilePosition = () => this.render.getCurrentTilePosition();

  notifyDamageStatisticsChange = () => this.statsTracker.notify();
  onStatisticsChange = (cb: DamageStatisticsObserver) => {
    return this.statsTracker.subscribe(cb);
  };

  notifyUpgradeProgress = () => this.upgrader.notify();
  onUpgradeChange = (cb: UpgradeProgressObserver) => {
    return this.upgrader.subscribe(cb);
  };
}
