import classNames from "classnames";
import css from "./hud-text.module.css";

interface HudItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}


export const HudText = ({ label, value, className }: HudItemProps) => (
  <div className={classNames(css.hudText, className)}>
    <div className={css.label}>{label}</div>
    <div className={css.value}>{value}</div>
  </div>
);

export const TextHud = ({ label, value, className }: HudItemProps) => (
  <div className={classNames(css.hudText, className)}>
    <div className={css.value}>{label}</div>
    <div className={css.label}>{value}</div>
  </div>
);
