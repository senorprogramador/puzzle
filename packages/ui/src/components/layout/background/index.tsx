import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
} from "react";
import { cn } from "@puzzle/core";
import "./background.css";

type BackgroundPattern =
  | "grid"
  | "dots"
  | "checkerboard"
  | "stripes"
  | "crosshatch"
  | "glow"
  | "blueprint"
  | "topographic"
  | "mesh";

type BackgroundFade = "top" | "right" | "bottom" | "left";

type BackgroundLength = number | string;
type BackgroundAngle = number | string;

type BackgroundMeshColors = readonly [string, string, string, string];

type BackgroundOwnProps<C extends ElementType> = {
  as?: C;
  pattern?: BackgroundPattern;
  size?: BackgroundLength;
  majorSize?: BackgroundLength;
  lineWidth?: BackgroundLength;
  dotSize?: BackgroundLength;
  angle?: BackgroundAngle;
  patternColor?: string;
  backgroundColor?: string;
  patternOpacity?: number;
  meshColors?: BackgroundMeshColors;
  fade?: BackgroundFade;
};

type BackgroundProps<C extends ElementType = "div"> = BackgroundOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof BackgroundOwnProps<C>>;

type BackgroundCSSProperties = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

const toCssLength = (value: BackgroundLength) =>
  typeof value === "number" ? `${value}px` : value;

const toCssAngle = (value: BackgroundAngle) =>
  typeof value === "number" ? `${value}deg` : value;

const clampOpacity = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : undefined;

const Background = <C extends ElementType = "div">({
  as,
  pattern = "grid",
  size = 24,
  majorSize,
  lineWidth = 1,
  dotSize = 2,
  angle = 45,
  patternColor,
  backgroundColor,
  patternOpacity,
  meshColors,
  fade,
  className,
  style,
  children,
  ...props
}: BackgroundProps<C>) => {
  const Component = (as ?? "div") as ElementType;

  const backgroundStyle: BackgroundCSSProperties = {
    ...style,
    "--_background-size": toCssLength(size),
    "--_background-major-size": majorSize ? toCssLength(majorSize) : undefined,
    "--_background-line-width": toCssLength(lineWidth),
    "--_background-dot-size": toCssLength(dotSize),
    "--_background-angle": toCssAngle(angle),
    "--_background-color": backgroundColor,
    "--_pattern-color": patternColor,
    "--_pattern-opacity":
      patternOpacity === undefined ? undefined : clampOpacity(patternOpacity),
    "--_mesh-color-1": meshColors?.[0],
    "--_mesh-color-2": meshColors?.[1],
    "--_mesh-color-3": meshColors?.[2],
    "--_mesh-color-4": meshColors?.[3],
  };

  return createElement(
    Component,
    {
      ...props,
      className: cn(
        "puzzle-background",
        `puzzle-background--${pattern}`,
        className,
      ),
      style: backgroundStyle,
      "data-fade": fade,
    } as never,
    children,
  );
};

export {
  Background,
  type BackgroundProps,
  type BackgroundPattern,
  type BackgroundFade,
  type BackgroundMeshColors,
};
