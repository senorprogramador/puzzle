import { type ComponentPropsWithRef } from "react";
import "./circular-progress.css";
import { cn } from "@puzzle/core";
import type { ProgressProps } from "./types";

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

const getHalfDimension = (size: CircularProgressSize) => {
  return 0.5 * getDimension(size) - getStrokeWidth(size);
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

const getStrokeDasharray = (size: CircularProgressSize) => {
  switch (size) {
    case "sm":
      return 84;
    case "md":
      return 128;
    case "lg":
      return 192;
  }
};

const CircularProgress = ({
  color,
  className,
  "aria-label": ariaLabel = "Loading...",
  value,
  size = "md",
  showTrack = true,
  ...props
}: CircularProgressProps) => {
  const classes = cn(
    "puzzle-circular-progress",
    value === undefined && "puzzle-circular-progress-indeterminate",
    className,
  );
  return (
    <svg
      {...props}
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
          r={getHalfDimension(size)}
          fill="none"
          stroke="currentColor"
          strokeWidth={getStrokeWidth(size)}
          aria-hidden="true"
        />
      )}
      <circle
        className="puzzle-circular-progress-circle"
        aria-label={value !== undefined ? `${value}%` : undefined}
        cx={getCenter(size)}
        cy={getCenter(size)}
        r={getHalfDimension(size)}
        fill="none"
        stroke="currentColor"
        strokeWidth={getStrokeWidth(size)}
        strokeLinecap="round"
        strokeDasharray={getStrokeDasharray(size)}
        style={{
          strokeDashoffset:
            value !== undefined
              ? `${getStrokeDasharray(size) - (value / 100) * getStrokeDasharray(size)}px`
              : "32px",
        }}
      />
    </svg>
  );
};

export { CircularProgress, type CircularProgressProps };
