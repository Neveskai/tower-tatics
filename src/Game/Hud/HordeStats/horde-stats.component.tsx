import classNames from "classnames";
import { useGameStore } from "@/Game/common/stores/state";
import css from "../hud.module.css";
import css2 from "./horde-stats.module.css";

import { Icon } from "@/common/ui";

export const HordeStats = () => {
  const countdown = useGameStore((state) => state.countdown);
  const currentHorde = useGameStore((state) => state.currentHorde);

  return (
    <section className={css2.HordeStats}>
      <span className={classNames(css.HudText, css2.StatItem)} title="Horde">
        <Icon name="wave" size={18} className={css2.StatIcon} />
        <span className={css2.StatValue}>{currentHorde}</span>
      </span>

      <span className={classNames(css.HudText, css2.StatItem)} title="To next horde">
        <Icon name="clock" size={18} className={css2.StatIcon} />
        <span className={css2.StatValue}>{countdown}s</span>
      </span>
    </section>
  );
};
