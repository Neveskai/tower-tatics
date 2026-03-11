import type React from "react";

export type TextProps = React.HTMLAttributes<HTMLSpanElement> & {
  kind?: "default" | "danger" | "warning" | "success" | "white" | "secondary" | "gold";
  size?: number;
  fullWidth?: boolean;
  fontWeight?: "normal" | "medium" | "bold";
};
