import React from "react";
import classNames from "classnames";
import styles from "./icon.module.css";
import {
  IoPlay,
  IoPause,
  IoTimeOutline,
  IoWalletOutline,
  IoSettingsOutline,
  IoLanguageOutline,
  IoCartOutline,
  IoLayersOutline,
  IoFlashOutline,
  IoRepeatOutline,
  IoChevronBack,
  IoSnowOutline,
  IoSparkles,
  IoEllipseOutline,
  IoRemoveCircleOutline,
  IoArrowUpOutline,
  IoRadioButtonOnOutline,
  IoDiscOutline,
  IoPlanetOutline,
  IoSpeedometerOutline,
  IoAirplaneOutline,
  IoTrashOutline,
  IoPawOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { FaAngleDoubleUp } from "react-icons/fa";
import type { IconProps, Icons } from "./icon.types";

const iconMap: Record<Icons, React.ComponentType<{ size?: number }>> = {
  back: IoChevronBack,
  play: IoPlay,
  pause: IoPause,
  clock: IoTimeOutline,
  coin: IoWalletOutline,
  settings: IoSettingsOutline,
  en: IoLanguageOutline,
  es: IoLanguageOutline,
  pt: IoLanguageOutline,
  shop: IoCartOutline,
  tower: IoLayersOutline,
  battle: IoFlashOutline,
  monster: IoPawOutline,
  wave: IoRepeatOutline,
  blizzard: IoSnowOutline,
  "weapon-bullet": IoEllipseOutline,
  "weapon-missile": IoRemoveCircleOutline,
  "weapon-arrow": IoArrowUpOutline,
  "weapon-imaterial": IoSparkles,
  "size-small": IoEllipseOutline,
  "size-normal": IoRemoveCircleOutline,
  "size-big": IoRadioButtonOnOutline,
  "size-huge": IoDiscOutline,
  "size-demonic": IoPlanetOutline,
  speed: IoSpeedometerOutline,
  "speed-1": IoSpeedometerOutline,
  "speed-2": IoSpeedometerOutline,
  "speed-3": IoSpeedometerOutline,
  "speed-4": IoSpeedometerOutline,
  fly: IoAirplaneOutline,
  upgrade: FaAngleDoubleUp,
  sell: IoTrashOutline,
};

const SPEED_ARROW_ICONS = ["speed-1", "speed-2", "speed-3", "speed-4"] as const;

function SpeedArrowsIcon({
  count,
  size,
}: {
  count: 1 | 2 | 3 | 4;
  size: number;
}) {
  const arrowSize = Math.max(10, Math.floor(size / 1.8));
  const gap = Math.max(1, Math.floor(arrowSize / 4));
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <IoArrowForwardOutline key={i} size={arrowSize} />
      ))}
    </span>
  );
}

export const Icon = ({
  name,
  className,
  size,
  alt,
  variant = "default",
}: IconProps) => {
  const s = size ?? 18;

  if (SPEED_ARROW_ICONS.includes(name as (typeof SPEED_ARROW_ICONS)[number])) {
    const count = parseInt(name.split("-")[1], 10) as 1 | 2 | 3 | 4;
    return (
      <span
        className={classNames(
          styles.icon,
          styles.svgIcon,
          variant === "highlight" && styles.iconHighlight,
          className
        )}
        style={{ width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        role="img"
        aria-label={alt || name}
      >
        <SpeedArrowsIcon count={count} size={s} />
      </span>
    );
  }

  const Component = iconMap[name];
  if (!Component) return null;

  return (
    <span
      className={classNames(
        styles.icon,
        styles.svgIcon,
        variant === "highlight" && styles.iconHighlight,
        className
      )}
      style={{ width: s, height: s, display: "inline-flex" }}
      role="img"
      aria-label={alt || name}
    >
      <Component size={s} />
    </span>
  );
};
