export type Icons =
  | "back"
  | "coin"
  | "settings"
  | "en"
  | "es"
  | "pt"
  | "play"
  | "pause"
  | "clock"
  | "shop"
  | "tower"
  | "battle"
  | "monster"
  | "wave"
  | "blizzard"
  | "weapon-bullet"
  | "weapon-missile"
  | "weapon-arrow"
  | "weapon-imaterial"
  | "size-small"
  | "size-normal"
  | "size-big"
  | "size-huge"
  | "size-demonic"
  | "speed"
  | "speed-1"
  | "speed-2"
  | "speed-3"
  | "speed-4"
  | "fly"
  | "upgrade"
  | "sell";

export interface IconProps {
  name: Icons;
  alt?: string;
  size?: number;
  className?: string;
  /** Use for weapon/size icons on dark backgrounds so they stay visible */
  variant?: "default" | "highlight";
}
