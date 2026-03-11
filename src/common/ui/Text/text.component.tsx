import React from "react";
import classNames from "classnames";
import styles from "./text.module.css";
import type { TextProps } from "./text.types";

export const Text: React.FC<TextProps> = ({
  children,
  className,
  kind = "default",
  size = 15,
  fullWidth = false,
  fontWeight = "medium",
  ...props
}) => {
  const classes = classNames(
    styles.text,
    styles[`${kind}Variant`],
    styles[`fontWeight-${fontWeight}`],
    {
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <span className={classes} {...props} style={{ fontSize: size + 'px' }}>
      {children}
    </span>
  );
};
