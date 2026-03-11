import { useEffect, useState } from "react";
import i18n from "@/common/providers/i18n";
import css from "./stats-section.module.css";
import type { StatsSectionProps } from "./stats-section.types";

export function StatsSection({
  tower,
  titleLeft,
  titleRight,
  actions,
  actionsStretch,
}: StatsSectionProps) {
  const [totalDamage, setTotalDamage] = useState(0);
  const [hordeDamage, setHordeDamage] = useState(0);
  useEffect(() => {
    if (tower) {
      const unsubscribe = tower.onStatisticsChange(
        ({ totalDamage, hordeDamage }) => {
          setTotalDamage(totalDamage);
          setHordeDamage(hordeDamage);
        }
      );

      setTotalDamage(tower.statsTracker.totalDamage);
      setHordeDamage(tower.statsTracker.hordeDamage);

      return unsubscribe;
    }
  }, [tower]);

  return (
    <div className={css.Container}>
      <div className={css.titleRow}>
        <div className={css.titleSide}>{titleLeft}</div>
        <h2 className={css.towerName} title={tower.getName()}>
          {tower.getName()}
        </h2>
        <div className={css.titleSide}>{titleRight}</div>
      </div>

      <div className={css.bottomRow}>
        <div className={css.stats}>
          <div className={css.statBlock}>
            <span className={css.statValue}>{tower.attackSpeed.toFixed(1)}</span>
            <span className={css.statLabel}>{i18n.t("aps")}</span>
          </div>
          <div className={css.statBlock}>
            <span className={css.statValue}>{tower.attackDamage ?? 0}</span>
            <span className={css.statLabel}>{i18n.t("attackDmg")}</span>
          </div>
          <div className={css.statBlock}>
            <span className={css.statValue}>{totalDamage}</span>
            <span className={css.statLabel}>{i18n.t("totalDmg")}</span>
          </div>
          <div className={css.statBlock}>
            <span className={css.statValue}>{hordeDamage}</span>
            <span className={css.statLabel}>{i18n.t("roundDmg")}</span>
          </div>
        </div>
        {actions != null && (
          <div
            className={
              actionsStretch ? `${css.actions} ${css.actionsStretch}` : css.actions
            }
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
