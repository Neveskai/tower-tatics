import { useGameStore } from "@/Game/common/stores/state";
import {
  getMonsterDisplayName,
  getSpeedLabel,
  getSpeedTier,
} from "@/Game/common/helpers/monster-labels.helpers";
import { getSpeedIconName } from "@/common/ui/Icon";
import i18n from "@/common/providers/i18n";
import { EMPTY_MONSTER } from "./monster-stats.constants";
import css from "./monster-stats.module.css";
import { Icon, MonsterAvatar, Tooltip } from "@/common/ui";

export function MonsterStats() {
  const monster =
    useGameStore((state) => state.selectedMonster) || EMPTY_MONSTER;

  const { type, isAir, gold: reward } = monster;
  const speed = monster["baseSpeed"];

  return (
    <div className={css.Container}>
      <MonsterAvatar monster={monster} />

      <div className={css.Info}>
        <h2 className={css.monsterName}>
          {getMonsterDisplayName(type)}
        </h2>

        <div className={css.attributes}>
          <Tooltip
            title={
              <>
                {getSpeedLabel(speed)}
                <Icon
                  name={getSpeedIconName(getSpeedTier(speed))}
                  size={18}
                  alt=""
                  variant="highlight"
                />
              </>
            }
            body={i18n.t("tooltipSpeedDesc")}
          >
            <span className={css.attributeItem}>
              <Icon
                name={getSpeedIconName(getSpeedTier(speed))}
                size={18}
                alt={i18n.t("speed")}
                variant="highlight"
              />
              {getSpeedLabel(speed)}
            </span>
          </Tooltip>

          <Tooltip
            title={
              <>
                {reward}
                <Icon name="coin" size={18} alt="" variant="highlight" />
              </>
            }
            body={i18n.t("tooltipRewardDesc")}
          >
            <span className={css.attributeItem}>
              <Icon name="coin" size={18} alt={i18n.t("reward")} variant="highlight" />
              {reward}
            </span>
          </Tooltip>

          {isAir && (
            <Tooltip
              title={
                <>
                  {i18n.t("fly")}
                  <Icon name="fly" size={18} alt="" variant="highlight" />
                </>
              }
              body={i18n.t("tooltipFlyDesc")}
            >
              <span className={css.attributeItem}>
                <Icon
                  name="fly"
                  size={18}
                  alt={i18n.t("fly")}
                  variant="highlight"
                />
                {i18n.t("fly")}
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
