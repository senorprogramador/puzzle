import { cn, isDarkColor, isHexColor } from "@puzzle/core";
import { type ReactNode } from "react";
import "./badge.css";

type AnchorOrigin = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

type AnchorOverlap = "rectangular" | "circular";

type BadgeProps = {
  content: ReactNode;
  size?: number;
  color?: "primary" | "secondary" | "accent" | "danger" | "info" | `#${string}`;
  anchorOrigin?: AnchorOrigin;
  anchorOverlap?: AnchorOverlap;
  className?: string;
  children?: ReactNode;
};

const Badge = ({
  content,
  size = 20,
  color = "primary",
  anchorOrigin = { vertical: "top", horizontal: "right" },
  anchorOverlap = "rectangular",
  className,
  children,
}: BadgeProps) => {
  const resolvedSize = Math.max(size, 16);
  const isHex = isHexColor(color);
  const isDark = isHex ? isDarkColor(color) : false;

  const classes = cn(
    "puzzle-badge",
    anchorOrigin.vertical,
    anchorOrigin.horizontal,
    anchorOverlap,
    !isHex && `puzzle-badge-${color}`,
    className,
  );

  return (
    <div className={classes}>
      {children}
      <span
        style={{
          fontSize: `clamp(0.7rem, calc(${resolvedSize}px - 1em), 4rem)`,
          minHeight: `${resolvedSize}px`,
          minWidth: `${resolvedSize}px`,
          backgroundColor: isHex ? color : undefined,
          color: isHex
            ? isDark
              ? "var(--puzzle-color-light-foreground)"
              : "var(--puzzle-color-dark-foreground)"
            : undefined,
        }}
      >
        {content}
      </span>
    </div>
  );
};

export { Badge, type BadgeProps };
