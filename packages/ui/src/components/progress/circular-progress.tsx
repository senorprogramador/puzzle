import { type ComponentPropsWithRef } from "react";
import "./circular-progress.css";
import { cn } from "@puzzle/core";
import type { ProgressProps } from "./types";

type CircularProgressProps = ProgressProps &
  Omit<ComponentPropsWithRef<"svg">, keyof ProgressProps>;

const CircularProgress = ({
  color,
  className,
  "aria-label": ariaLabel = "Loading...",
  value,
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
      width="44"
      height="44"
      viewBox="22 22 44 44"
    >
      {showTrack && (
        <circle
          className="puzzle-circular-progress-track"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke="currentColor"
          stroke-width="3.6"
          aria-hidden="true"
        />
      )}
      <circle
        className="puzzle-circular-progress-circle"
        aria-label={value !== undefined ? `${value}%` : undefined}
        cx="44"
        cy="44"
        r="20.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeDasharray="128"
        style={{
          strokeDashoffset:
            value !== undefined ? `${128 - (value / 100) * 128}px` : "32px",
        }}
      />
    </svg>
  );
};

export { CircularProgress, type CircularProgressProps };
