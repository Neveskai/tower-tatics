import { useId, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import css from "./tooltip.module.css";
import { TOOLTIP_Z_INDEX, GAP, VIEWPORT_PADDING } from "./tooltip.constants";
import type { TooltipProps } from "./tooltip.types";

export function Tooltip({
  title,
  body,
  children,
  placement = "top",
  className,
}: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(
    null
  );

  const hasTitle =
    title != null &&
    (typeof title !== "string" || title !== "");
  const hasBody =
    body != null &&
    (typeof body !== "string" || body !== "");
  const hasContent = hasTitle || hasBody;

  const show = () => {
    if (!triggerRef.current || !hasContent) return;
    setTriggerRect(triggerRef.current.getBoundingClientRect());
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    setTriggerRect(null);
    setCoords(null);
  };

  useLayoutEffect(() => {
    if (!visible || !triggerRect || !popoverRef.current) return;
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left =
      triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
    let top: number;
    if (placement === "bottom") {
      top = triggerRect.bottom + GAP;
    } else {
      top = triggerRect.top - popoverRect.height - GAP;
    }

    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(viewportW - popoverRect.width - VIEWPORT_PADDING, left)
    );
    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(viewportH - popoverRect.height - VIEWPORT_PADDING, top)
    );

    setCoords({ left, top });
  }, [visible, triggerRect, placement]);

  const popoverContent = hasContent && visible && (
    <div
      ref={popoverRef}
      id={id}
      role="tooltip"
      className={[css.popover, css.popoverPortal].filter(Boolean).join(" ")}
      style={{
        position: "fixed",
        left: coords?.left ?? -9999,
        top: coords?.top ?? -9999,
        zIndex: TOOLTIP_Z_INDEX,
        opacity: coords ? 1 : 0,
        visibility: coords ? "visible" : "hidden",
      }}
    >
      {hasTitle && (
        <div className={css.title}>{title}</div>
      )}
      {hasBody && (
        <div className={css.body}>
          {typeof body === "string" ? body : body}
        </div>
      )}
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        className={[css.wrapper, className].filter(Boolean).join(" ")}
        aria-describedby={hasContent ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {typeof document !== "undefined" &&
        createPortal(popoverContent, document.body)}
    </>
  );
}
