import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { DefaultAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class CannonTower extends TowerCharacter {
  readonly aimShoot: DefaultAimShoot;
  public soundAsset: SoundNames = "cannon";

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new DefaultAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.MISSILE));
  }

  public getName(): string {
    return Names[TowerTypes.MISSILE] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.MISSILE;
  }
}
