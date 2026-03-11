import { TowerCharacter } from "../tower.abstract";
import { CharactersLayer } from "@/Game/Character";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { Names } from "../constants/tower-names.constants";
import { AntiAirAimShoot } from "../strategy/aim-shoot";
import { SoundNames } from "@/common/assets/sound-assets";
import { TowerTypes } from "@/common/enum";

export class AntiAirTower extends TowerCharacter {
  readonly aimShoot: AntiAirAimShoot;
  readonly soundAsset: SoundNames = "anti-air";

  constructor(charactersLayer: CharactersLayer) {
    super(charactersLayer);

    this.aimShoot = new AntiAirAimShoot(this);

    Object.assign(this, useCatalogStore.getState().getTowerConfig(TowerTypes.ANTI_AIR));
  }

  public getName(): string {
    return Names[TowerTypes.ANTI_AIR] || "-";
  }

  public getType(): TowerTypes {
    return TowerTypes.ANTI_AIR;
  }
}
