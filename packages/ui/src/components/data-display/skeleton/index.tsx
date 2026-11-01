import { cn } from "@puzzle/core";
import type { CSSProperties } from "react";
import "./skeleton.css";

type SkeletonRadius = "standard" | "full" | "none";
type SkeletonProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: SkeletonRadius;
  className?: string;
};

const Skeleton = ({
  width = "100%",
  height = "1rem",
  radius = "standard",
  className,
}: SkeletonProps) => {
  const classes = cn("puzzle-skeleton", `puzzle-skeleton-${radius}`, className);

  return (
    <span aria-hidden="true" className={classes} style={{ width, height }} />
  );
};

export { Skeleton, type SkeletonProps, type SkeletonRadius };
