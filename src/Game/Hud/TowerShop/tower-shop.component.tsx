import { useEffect, useMemo, useRef } from "react";
import { useInventoryStore } from "@/common/stores/inventory/inventory.store";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { getFallbackTowerI18nKey } from "@/common/firestore/catalog/catalog.fallback";
import { normalizeTowerId } from "@/common/firestore/catalog/catalog.loader";
import { clampEquipped } from "@/common/stores/tower-inventory/tower-inventory.storage";
import i18n from "@/common/providers/i18n";
import { ShopButton } from "./ShopButton";
import css from "./tower-shop.module.css";
import { useGameStore, usePauseState } from "@/Game/common/stores/state";
import { useGoldStore } from "@/Game/common/stores/gold";
import { TowerTypes } from "@/common/enum/tower-types";
import { DEFAULT_INITIAL_TOWER } from "./tower-shop.constants";

export const NativeTowerShop = () => {
  const { isPausedMidWave } = usePauseState();
  const playerGold = useGoldStore((state) => state.playerGold);

  const towerInventory = useInventoryStore((state) => state.towerInventory);
  const getTowerConfig = useCatalogStore((state) => state.getTowerConfig);
  const towerOrder = useCatalogStore((state) => state.towerOrder);
  const validTypesSet = useMemo(
    () => (towerOrder ? new Set(towerOrder) : new Set<TowerTypes>()),
    [towerOrder]
  );

  const equippedTowers = useMemo(() => {
    if (!towerInventory) return [DEFAULT_INITIAL_TOWER];
    return towerInventory.equipped.length > 0
      ? clampEquipped(towerInventory.equipped)
      : [DEFAULT_INITIAL_TOWER];
  }, [towerInventory]);

  const shopOptions = useMemo(() => {
    const ids = equippedTowers.length > 0 ? equippedTowers : [DEFAULT_INITIAL_TOWER];
    const validIds = ids
      .map((id) => normalizeTowerId(id))
      .filter((normalizedId): normalizedId is TowerTypes => validTypesSet.has(normalizedId));
    const toShow = validIds.length > 0 ? validIds : [DEFAULT_INITIAL_TOWER];
    return toShow.map((id) => {
      const config = getTowerConfig(id);
      const label = i18n.t(getFallbackTowerI18nKey(id));
      return { id, label, cost: config.cost };
    });
  }, [equippedTowers, getTowerConfig, validTypesSet]);

  const towerShopEnum = useMemo(() => {
    const map: Record<string, TowerTypes> = {};
    shopOptions.forEach((opt, i) => {
      map[String(i + 1)] = opt.id;
    });
    return map;
  }, [shopOptions]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSelectTower = (type: TowerTypes) => {
    const { previewTower, selectedTowerType, setSelectedTowerType } =
      useGameStore.getState();

    if (previewTower) previewTower.changeTower(type);

    if (selectedTowerType === type) setSelectedTowerType(null);
    else setSelectedTowerType(type);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPausedMidWave) return;
      const typeShortcut = towerShopEnum[e.key];
      if (typeShortcut) handleSelectTower(typeShortcut);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPausedMidWave, towerShopEnum]);

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.scrollTo({
        left: el.scrollWidth - el.clientWidth,
        behavior: "smooth",
      });
    }
  }, [shopOptions]);

  return (
    <div className={css.NativeTowerShop}>
      <div className={css.CarouselWrapper} ref={carouselRef}>
        <div className={css.CarouselTrack}>
          {shopOptions.map(({ id, label, cost }) => (
            <ShopButton
              key={id}
              type={id}
              cost={cost}
              label={label}
              playerGold={playerGold}
              handleSelectTower={handleSelectTower}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
