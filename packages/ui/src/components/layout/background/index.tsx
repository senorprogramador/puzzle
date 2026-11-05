import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import "./background.css";

type BackgroundPattern =
  | "grid"
  | "dots"
  | "checkerboard"
  | "stripes"
  | "crosshatch"
  | "glow";

type BackgroundLength = number | string;
type BackgroundAngle = number | string;

type BackgroundOwnProps = {
  as?: ElementType;
  pattern?: BackgroundPattern;
  size?: BackgroundLength;
  lineWidth?: BackgroundLength;
  dotSize?: BackgroundLength;
  angle?: BackgroundAngle;
  patternColor?: string;
  backgroundColor?: string;
  patternOpacity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type BackgroundProps<C extends ElementType = "div"> = BackgroundOwnProps &
  Omit<ComponentPropsWithRef<C>, keyof BackgroundOwnProps>;

type BackgroundCSSProperties = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

const toCssLength = (value: BackgroundLength) =>
  typeof value === "number" ? `${value}px` : value;

const toCssAngle = (value: BackgroundAngle) =>
  typeof value === "number" ? `${value}deg` : value;

const Background = <C extends ElementType = "div">({
  as,
  pattern = "grid",
  size = 24,
  lineWidth = 1,
  dotSize = 2,
  angle = 45,
  patternColor,
  backgroundColor,
  patternOpacity,
  className,
  style,
  children,
  ...props
}: BackgroundProps<C>) => {
  const Component = (as ?? "div") as ElementType;

  const backgroundStyle: BackgroundCSSProperties = {
    ...style,
    "--_background-size": toCssLength(size),
    "--_background-line-width": toCssLength(lineWidth),
    "--_background-dot-size": toCssLength(dotSize),
    "--_background-angle": toCssAngle(angle),
    "--_background-color": backgroundColor,
    "--_pattern-color": patternColor,
    "--_pattern-opacity": patternOpacity,
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
    },
    children,
  );
};

export { Background, type BackgroundProps, type BackgroundPattern };
