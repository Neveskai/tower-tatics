import type { TowerTypes } from "@/common/enum/tower-types";
import type { TowerConfig } from "@/common/firestore/catalog/catalog.types";
import type { FirestoreMissionCatalogDoc } from "@/common/firestore/catalog/catalog.types";

export interface CatalogState {
  towerConfigs: Record<TowerTypes, TowerConfig> | null;
  towerOrder: TowerTypes[] | null;
  missions: FirestoreMissionCatalogDoc[];
  loading: boolean;
  loaded: boolean;
  loadCatalog: () => Promise<void>;
  getTowerConfig: (type: TowerTypes) => TowerConfig;
  getTowerOrder: () => TowerTypes[];
}
