import styles from "./stat-row.module.css";
import type { StatRowProps } from "./stat-row.types";

export function StatRow({
  label,
  value,
  labelWidth,
  valueWidth,
  align = "left",
  isUpgrade = false,
}: StatRowProps) {
  return (
    <div className={isUpgrade ? styles.upgradeRow : styles.statRow}>
      <span
        className={styles.statLabel}
        style={{ textAlign: align, minWidth: labelWidth }}
      >
        {label}:
      </span>

      {isUpgrade && <span className={styles.arrow}>→</span>}

      <span
        className={styles.statValue}
        style={{ textAlign: align, minWidth: valueWidth }}
      >
        {value}
      </span>
    </div>
  );
}
