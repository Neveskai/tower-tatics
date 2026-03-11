import {
  MAX_TOWER_LEVEL,
  BASE_UPGRADE_DURATION,
} from "@/Game/common/constants/towers.constants";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Graphics } from "pixi.js";
import { SCREEN } from "@/Game/common";
import { TowerCharacter } from "../tower.abstract";
import { UpgradeProgressObserver } from "../tower.types";
import SoundLayer from "@/common/sound";
import { SoundGroups } from '@/common/enum/sound-groups'
import { DefaultAimShoot } from "../strategy/aim-shoot";
import { useGoldStore } from "@/Game/common/stores/gold";
import { useGameStore, isPreGame, isGameRunning } from "@/Game/common/stores/state";

export class UpgradeSystem {
  private observers: UpgradeProgressObserver[] = [];
  public progressBar?: Graphics;
  public baseProgressBar?: Graphics;
  public isUpgrading: boolean = false;
  public upgradeTimer: number = 0;
  public progress: number = 0;

  constructor(private tower: TowerCharacter) {}

  get maintenanceDuration(): number {
    return BASE_UPGRADE_DURATION * Math.pow(1.35, this.tower.level - 1);
  }

  public async upgrade() {
    if (this.tower.level >= MAX_TOWER_LEVEL || this.tower.upgrader.isUpgrading)
      return false;

    SoundLayer.stop(SoundGroups.Effects, {
      name: this.tower.soundAsset,
      emitterId: this.tower.id,
    });

    const cost = this.getNextLevelStats()?.cost || 0;
    const { playerGold, decrementPlayerGold } = useGoldStore.getState();

    if (playerGold < cost) return false;

    decrementPlayerGold(cost);
    this.isUpgrading = true;
    this.upgradeTimer = 0;
    this.progress = 0;

    if (this.tower.render.weaponSprite) {
      this.tower.render.weaponSprite.visible = false;
    }

    if (!this.progressBar) {
      this.progressBar = new Graphics();
      this.tower.addChild(this.progressBar);
    }

    if (!this.baseProgressBar) {
      this.baseProgressBar = new Graphics();
      this.tower.addChild(this.baseProgressBar);
    }

    this.notify();
  }

  public getNextLevelStats() {
    if (this.tower.level >= MAX_TOWER_LEVEL) return null;

    const config = useCatalogStore.getState().getTowerConfig(this.tower.getType());

    return config.upgrades[
      (this.tower.level + 1) as keyof typeof config.upgrades
    ];
  }

  get sellPrice(): number {
    const config = useCatalogStore.getState().getTowerConfig(this.tower.getType());
    return config.sell_prices[
      this.tower.level as keyof typeof config.sell_prices
    ];
  }

  public sell(): void {
    const { incrementPlayerGold } = useGoldStore.getState();
    const { selectedTower, setSelectedTower } = useGameStore.getState();
    const store = useGameStore.getState();

    if (isPreGame(store)) {
      setSelectedTower(null);
      incrementPlayerGold(this.tower.cost);
    } else if (selectedTower && selectedTower === this.tower) {
      setSelectedTower(null);
      incrementPlayerGold(this.sellPrice);
    }

    const aimShoot = this.tower.aimShoot as DefaultAimShoot;

    if (aimShoot?.bullet) aimShoot.bullet.onDestroy();

    this.tower.emit("tower-selled");
    this.tower.onDestroy();
  }

  public update(delta: number): void {
    const store = useGameStore.getState();
    if (!this.tower.upgrader.isUpgrading || !isGameRunning(store)) return;

    this.upgradeTimer += delta;

    if (this.progressBar && this.baseProgressBar) {
      const width = SCREEN.TILE_SIZE * 1.6;
      const height = 5;

      this.progress = Math.min(this.upgradeTimer / this.maintenanceDuration, 1);

      this.baseProgressBar
        .fill(0x000000)
        .roundRect(
          SCREEN.TILE_SIZE - width / 2,
          SCREEN.TILE_SIZE * 2 - 6,
          width,
          height,
          3
        ).zIndex = 9;

      this.progressBar
        .fill(0x00c6ff)
        .roundRect(
          SCREEN.TILE_SIZE - width / 2,
          SCREEN.TILE_SIZE * 2 - 6,
          width * this.progress,
          height,
          3
        ).zIndex = 10;
    }

    this.notify();

    if (this.upgradeTimer >= this.maintenanceDuration) {
      this.completeUpgrade();
    }
  }

  private completeUpgrade() {
    const { selectedTower } = useGameStore.getState();
    this.tower.level += 1;

    const config = useCatalogStore.getState().getTowerConfig(this.tower.getType());

    Object.assign(
      this.tower,
      config.upgrades[this.tower.level as keyof typeof config.upgrades]
    );

    this.cleanupBars();

    if (this.tower.render.weaponSprite) {
      this.tower.render.weaponSprite.visible = true;
    }

    this.tower.render.updateWeaponColor();
    this.tower.upgrader.isUpgrading = false;

    if (selectedTower?.id === this.tower.id) this.tower.drawRangeIndicator();

    this.notify();

    SoundLayer.play(SoundGroups.Voices, { name: "upgrade_complete" });
  }

  private cleanupBars() {
    if (this.progressBar) {
      this.tower.removeChild(this.progressBar);
      this.progressBar.destroy();
      this.progressBar = undefined;
    }
    if (this.baseProgressBar) {
      this.tower.removeChild(this.baseProgressBar);
      this.baseProgressBar.destroy();
      this.baseProgressBar = undefined;
    }

    this.notify();
  }

  subscribe(callback: UpgradeProgressObserver): () => void {
    this.observers.push(callback);

    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  notify(): void {
    const stats = {
      progress: this.tower.upgrader.progress,
      isUpgrading: this.tower.upgrader.isUpgrading,
      level: this.tower.level,
      upgradeTimer: this.upgradeTimer,
      maintenanceDuration: this.maintenanceDuration,
    };

    for (const observer of this.observers) {
      observer(stats);
    }
  }
}
