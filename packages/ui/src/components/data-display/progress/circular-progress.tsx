import { type ComponentPropsWithRef } from "react";
import "./circular-progress.css";
import { cn } from "@puzzle-ui/core";
import type { ProgressProps } from "./types";
import { getProgressAriaProps, normalizeProgressValue } from "./utils";

type CircularProgressSize = "sm" | "md" | "lg";

type CircularProgressOwnProps = ProgressProps & {
  size?: CircularProgressSize;
};

type CircularProgressProps = CircularProgressOwnProps &
  Omit<ComponentPropsWithRef<"svg">, keyof CircularProgressOwnProps>;

const getDimension = (size: CircularProgressSize) => {
  switch (size) {
    case "sm":
      return 24 + 2 * getStrokeWidth(size);
    case "md":
      return 44 + 2 * getStrokeWidth(size);
    case "lg":
      return 64 + 2 * getStrokeWidth(size);
  }
};

const getHalfDimension = (
  size: CircularProgressSize,
  strokeWidth: number,
) => {
  return 0.5 * getDimension(size) - strokeWidth;
};

const getStrokeWidth = (size: CircularProgressSize) => {
  switch (size) {
    case "sm":
      return 2;
    case "md":
      return 3.6;
    case "lg":
      return 4;
  }
};

const getCenter = (size: CircularProgressSize) => {
  switch (size) {
    case "sm":
      return 12 + getStrokeWidth(size);
    case "md":
      return 22 + getStrokeWidth(size);
    case "lg":
      return 32 + getStrokeWidth(size);
  }
};

const getStrokeDasharray = (
  size: CircularProgressSize,
  strokeWidth: number,
) => {
  const defaultRadius = getHalfDimension(size, getStrokeWidth(size));
  const radius = getHalfDimension(size, strokeWidth);
  switch (size) {
    case "sm":
      return (84 * radius) / defaultRadius;
    case "md":
      return (128 * radius) / defaultRadius;
    case "lg":
      return (192 * radius) / defaultRadius;
  }
};

const CircularProgress = ({
  color,
  className,
  "aria-label": ariaLabel = "Loading...",
  value: rawValue,
  size = "md",
  barWidth,
  showTrack = true,
  ...props
}: CircularProgressProps) => {
  const value = normalizeProgressValue(rawValue);
  const strokeWidth = barWidth ?? getStrokeWidth(size);
  const radius = getHalfDimension(size, strokeWidth);
  const strokeDasharray = getStrokeDasharray(size, strokeWidth);
  const classes = cn(
    "puzzle-circular-progress",
    value === undefined && "puzzle-circular-progress-indeterminate",
    className,
  );
  return (
    <svg
      {...props}
      {...getProgressAriaProps(value)}
      className={classes}
      aria-label={ariaLabel}
      color={color ?? "var(--puzzle-color-primary)"}
      width={getDimension(size)}
      height={getDimension(size)}
      viewBox={`0 0 ${getDimension(size)} ${getDimension(size)}`}
    >
      {showTrack && (
        <circle
          className="puzzle-circular-progress-track"
          cx={getCenter(size)}
          cy={getCenter(size)}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          aria-hidden="true"
        />
      )}
      <circle
        className="puzzle-circular-progress-circle"
        cx={getCenter(size)}
        cy={getCenter(size)}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        style={{
          strokeDashoffset:
            value !== undefined
              ? `${strokeDasharray - (value / 100) * strokeDasharray}px`
              : "32px",
        }}
      />
    </svg>
  );
};

export {
  CircularProgress,
  type CircularProgressProps,
  type CircularProgressSize,
};
