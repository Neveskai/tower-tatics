import { useState, useMemo } from "react";
import { TowerTypes } from "@/common/enum/tower-types";
import i18n from "@/common/providers/i18n";
import { useCatalogStore } from "@/common/stores/catalog/catalog.store";
import { useInventoryStore } from "@/common/stores/inventory/inventory.store";
import { getFallbackTowerI18nKey } from "@/common/firestore/catalog/catalog.fallback";
import {
  clampEquipped,
  MAX_EQUIPPED,
} from "@/common/stores/tower-inventory";
import { getAssetUrl } from "@/common/assets/get-asset-url";
import { Button } from "@/common/ui/Button";
import { DEFAULT_INITIAL_TOWER, TOWER_IMAGE_MAP } from "./towers-tab.constants";
import type { TowerStatus } from "./towers-tab.types";
import css from "./towers-tab.module.css";

export function TowersTab() {
  const [selectedTower, setSelectedTower] = useState<TowerTypes | null>(null);

  const towerOrderState = useCatalogStore((s) => s.towerOrder);
  const getTowerConfig = useCatalogStore((s) => s.getTowerConfig);

  const towerInventory = useInventoryStore((s) => s.towerInventory);
  const equipTower = useInventoryStore((s) => s.equipTower);
  const unequipTower = useInventoryStore((s) => s.unequipTower);

  const towerOrder = towerOrderState ?? [];

  const equipped = useMemo(() => {
    if (!towerInventory) return [DEFAULT_INITIAL_TOWER];
    
    return towerInventory.equipped.length > 0
      ? clampEquipped(towerInventory.equipped)
      : [DEFAULT_INITIAL_TOWER];
  }, [towerInventory]);

  const unlocked = useMemo(() => {
    return towerInventory?.unlocked ?? [DEFAULT_INITIAL_TOWER];
  }, [towerInventory]);

  const canEquipMore = equipped.length < MAX_EQUIPPED;

  function getStatus(type: TowerTypes): TowerStatus {
    if (equipped.includes(type)) return "equipped";
    if (unlocked.includes(type)) return "unlocked";

    return "toDiscover";
  }

  function getTowerName(type: TowerTypes): string {
    const key = getFallbackTowerI18nKey(type);

    return i18n.t(key);
  }

  async function handleToggleEquip(type: TowerTypes) {
    const status = getStatus(type);

    if (status === "toDiscover") return;

    if (status === "equipped") {
      await unequipTower(type);
    } else if (canEquipMore) {
      await equipTower(type);
    }
  }

  if (!towerInventory || !towerOrderState?.length) {
    return (
      <div className={css.wrapper}>
        <p className={css.loading}>{i18n.t("loading")}</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.scrollArea}>
        <h2 className={css.title}>{i18n.t("selectTowerLoadout")}</h2>

        <div className={css.equippedHeader}>
          <span className={css.equippedLabel}>
            {i18n.t("equippedCount").replace("x", String(equipped.length))}
          </span>

          <div className={css.equippedChips}>
            {equipped.map((id) => (
              <span key={id} className={css.chip}>
                {getTowerName(id)}
              </span>
            ))}

            {Array.from({ length: MAX_EQUIPPED - equipped.length }).map((_, i) => (
              <span key={`empty-${i}`} className={css.chipEmpty}>
                —
              </span>
            ))}
          </div>
        </div>

        <div className={css.grid}>
          {towerOrder.map((type) => {
            const status = getStatus(type);
            const isSelected = selectedTower === type;
            const canToggle = status !== "toDiscover" && (status === "equipped" || canEquipMore);

            return (
              <div
                key={type}
                className={`${css.card} ${isSelected ? css.cardSelected : ""} ${status === "toDiscover" ? css.cardLocked : ""}`}
                onClick={() => setSelectedTower(type)}
              >
                <div className={css.cardImage}>
                  <img
                    src={getAssetUrl(TOWER_IMAGE_MAP[type])}
                    alt={getTowerName(type)}
                    className={css.towerImg}
                  />

                  <span className={`${css.badge} ${css[`badge--${status}`]}`}>
                    {status === "equipped" && i18n.t("equipped")}
                    {status === "unlocked" && i18n.t("unlocked")}
                    {status === "toDiscover" && i18n.t("toDiscover")}
                  </span>

                </div>
                <div className={css.cardContent}>
                  <h3 className={css.cardTitle}>{getTowerName(type)}</h3>

                  <Button
                    kind="warning"
                    size="small"
                    disabled={!canToggle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEquip(type);
                    }}
                  >
                    {status === "equipped" ? i18n.t("unequip") : i18n.t("equip")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTower && (
        <div className={css.detailsPanel}>
          <div className={css.detailsContent}>
            <h3>{getTowerName(selectedTower)}</h3>

            {(() => {
              const config = getTowerConfig(selectedTower);

              return (
                <>
                  <dl className={css.detailsListGrid}>
                    <dt>{i18n.t("cost")}</dt>
                    <dd>{config.cost}</dd>
                    <dt>{i18n.t("range")}</dt>
                    <dd>{config.range}</dd>
                    <dt>{i18n.t("attackDmg")}</dt>
                    <dd>{config.attackDamage}</dd>
                    <dt>{i18n.t("aps")}</dt>
                    <dd>{config.attackSpeed.toFixed(2)}</dd>
                  </dl>

                  <Button
                    kind="secondary"
                    size="small"
                    onClick={() => setSelectedTower(null)}
                  >
                    {i18n.t("back")}
                  </Button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
