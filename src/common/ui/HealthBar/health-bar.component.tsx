import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./health-bar.module.css";
import { useGameStore } from "@/Game/common/stores/state";
import { INITIAL_PLAYER_HEALTH } from "@/Game/common/constants/player.constants";

export const HealthBar = () => {
  const playerHealth = useGameStore((state) => state.playerHealth);
  const prevHealth = useRef(playerHealth);
  const [recentlyDamaged, setRecentlyDamaged] = useState(false);

  useEffect(() => {
    if (playerHealth < prevHealth.current) {
      setRecentlyDamaged(true);

      const t = setTimeout(() => setRecentlyDamaged(false), 400);

      prevHealth.current = playerHealth;
      
      return () => clearTimeout(t);
    }

    prevHealth.current = playerHealth;
  }, [playerHealth]);

  const percent = Math.max(0, Math.min(100, (playerHealth / INITIAL_PLAYER_HEALTH) * 100));

  return (
    <div
      className={classNames(styles.healthBarContainer, {
        [styles.recentlyDamaged]: recentlyDamaged,
      })}
    >
      <div className={styles.healthBarTrack}>
        <div
          className={styles.healthBarFill}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
