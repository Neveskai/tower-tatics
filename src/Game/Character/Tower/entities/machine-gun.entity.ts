import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { DefaultAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class MachineGunTower extends TowerCharacter {
  readonly aimShoot: DefaultAimShoot;
  public soundAsset: SoundNames = "rifle";

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new DefaultAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.MACHINE_GUN));

    this.maxHeat = 100;
    this.heatPerShot = 10;
    this.coolRate = 0.08;
  }

  public getName(): string {
    return Names[TowerTypes.MACHINE_GUN] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.MACHINE_GUN;
  }
}
