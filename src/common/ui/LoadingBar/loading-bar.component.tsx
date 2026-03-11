import React from "react";
import css from "./loading-bar.module.css";
import { UpgradeState } from "../UpgradeAnimation";

type LoadingBarProps = {
  progress: UpgradeState;
  height?: number;
};

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress, height = 20 }) => {
  const maintenanceDuration = progress?.maintenanceDuration ?? 0;
  const upgradeTimer = progress?.upgradeTimer ?? 0;

  const timeLeft = Math.max(0, (maintenanceDuration - upgradeTimer) / 1000);
  const timeLeftDisplay = timeLeft.toFixed(1);

  return (
    <div className={css.BarContainer} style={{ height }}>
      <div className={css.BarText}>⏳ {timeLeftDisplay}s</div>
      <div
        className={css.BarFill}
        style={{ width: `${progress.progress * 100}%` }}
      />
    </div>
  );
};
