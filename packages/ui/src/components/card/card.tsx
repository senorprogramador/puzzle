import {
  createElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import "./card.css";

export type CardVariant = "elevated" | "outlined" | "filled" | "ghost";

export type CardSize = "sm" | "md" | "lg";

export type CardOrientation = "vertical" | "horizontal";

type CardOwnProps<C extends ElementType> = {
  as?: C;
  variant?: CardVariant;
  size?: CardSize;
  orientation?: CardOrientation;
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
};

export type CardProps<C extends ElementType = "div"> = CardOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof CardOwnProps<C>>;

type CardPartOwnProps<C extends ElementType> = {
  as?: C;
  className?: string;
  children?: ReactNode;
};

export type CardPartProps<C extends ElementType> = CardPartOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof CardPartOwnProps<C>>;

const Card = <C extends ElementType = "div">({
  as,
  variant = "outlined",
  size = "md",
  orientation = "vertical",
  interactive = false,
  className,
  children,
  ...props
}: CardProps<C>) => {
  const Component = (as ?? "div") as ElementType;

  return createElement(
    Component,
    {
      ...props,
      className: cn(
        "puzzle-card",
        `puzzle-card--${variant}`,
        `puzzle-card--${size}`,
        `puzzle-card--${orientation}`,
        interactive && "puzzle-card--interactive",
        className,
      ),
      "data-variant": variant,
      "data-size": size,
      "data-orientation": orientation,
      "data-interactive": interactive ? "" : undefined,
    } as never,
    children,
  );
};

const createCardPart = <C extends ElementType>(
  defaultElement: C,
  className: string,
) => {
  const Part = <T extends ElementType = C>({
    as,
    className: customClassName,
    children,
    ...props
  }: CardPartProps<T>) => {
    const Component = (as ?? defaultElement) as ElementType;

    return createElement(
      Component,
      {
        ...props,
        className: cn(className, customClassName),
      } as never,
      children,
    );
  };

  return Part;
};

const CardHeader = createCardPart("div", "puzzle-card__header");
const CardTitle = createCardPart("h3", "puzzle-card__title");
const CardDescription = createCardPart("p", "puzzle-card__description");
const CardAction = createCardPart("div", "puzzle-card__action");
const CardContent = createCardPart("div", "puzzle-card__content");
const CardFooter = createCardPart("div", "puzzle-card__footer");
const CardMedia = createCardPart("div", "puzzle-card__media");

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardMedia,
};
