import type { ReactNode } from "react";
import type { TowerCharacter } from "@/Game/Character/Tower";

export interface StatsSectionProps {
  tower: TowerCharacter;
  hoveringUpgrade: boolean;
  titleLeft?: ReactNode;
  titleRight?: ReactNode;
  actions?: ReactNode;
  actionsStretch?: boolean;
}
