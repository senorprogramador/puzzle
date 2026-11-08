import type { ComponentPropsWithRef } from "react";
import type { ProgressProps } from "./types";
import "./linear-progress.css";
import { cn } from "@puzzle-ui/core";
import { getProgressAriaProps, normalizeProgressValue } from "./utils";

type LinearProgressProps = ProgressProps &
  Omit<ComponentPropsWithRef<"div">, keyof ProgressProps>;

const LinearProgress = ({
  color,
  value: rawValue,
  showTrack = true,
  className,
  style,
  ...props
}: LinearProgressProps) => {
  const value = normalizeProgressValue(rawValue);
  const classes = cn(
    "puzzle-linear-progress-track",
    showTrack && "puzzle-linear-progress-show-track",
    className,
  );

  const indicatorClasses = cn(
    "puzzle-linear-progress",
    value === undefined && "puzzle-linear-progress-indeterminate",
  );
  return (
    <div
      {...props}
      {...getProgressAriaProps(value)}
      style={{ color: color ?? "var(--puzzle-color-primary)", ...style }}
      className={classes}
    >
      <div
        aria-hidden="true"
        className={indicatorClasses}
        style={{
          backgroundColor: color ?? "var(--puzzle-color-primary)",
          transform:
            value !== undefined ? `scaleX(${value / 100})` : "scaleX(1)",
          height: "100%",
          transition: "transform 0.3s",
        }}
      />
    </div>
  );
};

export { LinearProgress, type LinearProgressProps };
