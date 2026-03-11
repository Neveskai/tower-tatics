import type { ReactNode } from "react";

export interface StatRowProps {
  label: string;
  labelWidth?: string;
  valueWidth?: string;
  value: string | number | ReactNode;
  isUpgrade?: boolean;
  align?: "left" | "right";
}
