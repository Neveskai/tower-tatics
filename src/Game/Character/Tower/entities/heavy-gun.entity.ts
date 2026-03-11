import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { HeavyGunAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class HeavyGunTower extends TowerCharacter {
  readonly aimShoot: HeavyGunAimShoot;
  public soundAsset: SoundNames = "heavy-gun";

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new HeavyGunAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.HEAVY_GUN));

    this.maxHeat = 120;
    this.heatPerShot = 15;
    this.coolRate = 0.06;
  }

  public getName(): string {
    return Names[TowerTypes.HEAVY_GUN] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.HEAVY_GUN;
  }
}
