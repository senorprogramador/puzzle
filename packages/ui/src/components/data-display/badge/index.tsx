import { cn, isDarkColor, isHexColor } from "@puzzle-ui/core";
import { type ReactNode } from "react";
import "./badge.css";

type AnchorOrigin = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

type AnchorOffset = {
  vertical: number;
  horizontal: number;
};

type AnchorOverlap = "rectangular" | "circular";
type BadgeColor =
  | "primary"
  | "secondary"
  | "accent"
  | "danger"
  | "info"
  | `#${string}`;

type BadgeProps = {
  content: ReactNode;
  size?: number;
  color?: BadgeColor;
  anchorOrigin?: AnchorOrigin;
  anchorOffset?: AnchorOffset;
  anchorOverlap?: AnchorOverlap;
  className?: string;
  children?: ReactNode;
};

const Badge = ({
  content,
  size = 20,
  color = "primary",
  anchorOrigin = { vertical: "top", horizontal: "right" },
  anchorOffset = { vertical: 0, horizontal: 0 },
  anchorOverlap = "rectangular",
  className,
  children,
}: BadgeProps) => {
  if (!Number.isFinite(anchorOffset.vertical) || !Number.isFinite(anchorOffset.horizontal)) {
    throw new TypeError("Badge anchorOffset values must be finite numbers.");
  }

  const resolvedSize = Math.max(size, 16);
  const isHex = isHexColor(color);
  const isDark = isHex ? isDarkColor(color) : false;

  const classes = cn(
    "puzzle-badge",
    children != null && [
      anchorOrigin.vertical,
      anchorOrigin.horizontal,
      anchorOverlap,
    ],
    children == null && "puzzle-badge-standalone",
    !isHex && `puzzle-badge-${color}`,
    className,
  );

  return (
    <div className={classes}>
      {children}
      <span
        className="puzzle-badge-indicator"
        style={{
          fontSize: `clamp(0.7rem, calc(${resolvedSize}px - 1em), 4rem)`,
          minHeight: `${resolvedSize}px`,
          minWidth: `${resolvedSize}px`,
          translate: children != null
            ? `${anchorOffset.horizontal * (anchorOrigin.horizontal === "left" ? 1 : -1)}px ${anchorOffset.vertical * (anchorOrigin.vertical === "top" ? 1 : -1)}px`
            : undefined,
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

export {
  Badge,
  type BadgeProps,
  type BadgeColor,
  type AnchorOrigin,
  type AnchorOffset,
  type AnchorOverlap,
};
