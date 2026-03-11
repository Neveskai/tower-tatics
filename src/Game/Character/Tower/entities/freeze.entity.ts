import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { FreezeAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class FreezeTower extends TowerCharacter {
  readonly aimShoot: FreezeAimShoot;
  public soundAsset: SoundNames = "freeze";
  public special = {
    slowDuration: 0,
    slowFactor: 0,
  };

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new FreezeAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.FREEZE));
  }

  public getName(): string {
    return Names[TowerTypes.FREEZE] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.FREEZE;
  }
}
