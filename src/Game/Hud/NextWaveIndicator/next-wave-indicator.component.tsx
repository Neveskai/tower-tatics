import classNames from "classnames";
import { useGameStore } from "@/Game/common/stores/state";
import type { MonsterConfig } from "@/Game/common/types/monsters.types";
import i18n from "@/common/providers/i18n";
import css from "../hud.module.css";
import localCss from "./next-wave-indicator.module.css";

function getTypeDisplayName(type: MonsterConfig["type"], qtd: number): string {
  const name =
    type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1").trim();
  return qtd === 1 ? name : `${name}s`;
}

export const NextWaveIndicator = () => {
  const gameController = useGameStore((state) => state.gameController);
  useGameStore((state) => state.currentHorde);

  const config: MonsterConfig | null =
    gameController?.getNextWaveConfig() ?? null;

  if (!config) return null;

  const qtd = config.spawnPerSide;
  const typeName = getTypeDisplayName(config.type, qtd);

  return (
    <section
      className={localCss.Container}
      aria-label={i18n.t("nextWave")}
    >
      <span className={classNames(css.HudText, localCss.Label)}>
        {i18n.t("nextWave")}
      </span>
      <span className={classNames(css.HudText, localCss.DetailLine)}>
        <span>{qtd}</span>
        <span>{typeName}</span>
      </span>
    </section>
  );
};
