import React from "react";
import classNames from "classnames";
import css from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outlined" | 'ghost';
  kind?: "default" | "danger" | "warning" | "success" | "white" | "secondary";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  fontWeight?: "normal" | "medium" | "bold";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "solid",
  kind = "default",
  size = "medium",
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  fontWeight = "medium",
  style,
  contentStyle,
  ...props
}) => {
  const classes = classNames(
    css.btn,
    css[`btn--variant-${variant}`],
    css[`btn--scheme-${kind}`],
    css[`btn--size-${size}`],
    css[`fontWeight-${fontWeight}`],
    {
      [css["btn--full"]]: fullWidth,
    },
    className
  );

  return (
    <button
      className={classes}
      style={style}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={css.spinner} />
      ) : (
        <>
          {startIcon && <span className={css.icon}>{startIcon}</span>}
          <span className={css.buttonContent} style={contentStyle}>
            {children}
          </span>
          {endIcon && <span className={css.icon}>{endIcon}</span>}
        </>
      )}
    </button>
  );
};
