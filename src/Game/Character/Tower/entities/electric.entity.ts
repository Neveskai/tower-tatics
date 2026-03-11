import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { ElectricAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class ElectricTower extends TowerCharacter {
  readonly aimShoot: ElectricAimShoot;
  public soundAsset: SoundNames = "electric";
  public special = {
    stunDuration: 0,
    stunChance: 0,
  };

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new ElectricAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.ELECTRIC));
  }

  public getName(): string {
    return Names[TowerTypes.ELECTRIC] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.ELECTRIC;
  }
}
