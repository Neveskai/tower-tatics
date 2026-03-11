import type { ReactNode } from "react";

export interface TooltipProps {
  /** Optional title shown above the body (value + icon) */
  title?: string | ReactNode;
  /** Main content: string (supports newlines) or ReactNode */
  body?: string | ReactNode;
  /** Wrapped content that triggers the tooltip on hover/focus */
  children: ReactNode;
  /** Optional: render popover below trigger */
  placement?: "top" | "bottom";
  className?: string;
}
