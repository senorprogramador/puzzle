import {
  Children,
  isValidElement,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import { Stack } from "../stack";
import "./bottom-navigation.css";

type BottomNavigationItemProps = {
  icon: ReactNode;
  label?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
};

const BottomNavigationItem = ({
  icon,
  label,
  href,
  onClick,
  active = false,
  className,
  style,
}: BottomNavigationItemProps) => {
  const classes = cn(
    "puzzle-bottom-navigation-item",
    active && "active",
    className,
  );

  const content = (
    <Stack
      direction="col"
      alignH="center"
      alignV="center"
      gap="xs"
      className="puzzle-bottom-navigation-item__content"
    >
      <span className="puzzle-bottom-navigation-item__icon" aria-hidden="true">
        {icon}
      </span>

      {label && (
        <span className="puzzle-bottom-navigation-item__label">{label}</span>
      )}
    </Stack>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        aria-current={active ? "page" : undefined}
        data-active={active || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
      aria-pressed={active}
      data-active={active || undefined}
    >
      {content}
    </button>
  );
};

type BottomNavigationProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

const BottomNavigation = ({
  children,
  className,
  style,
  ariaLabel = "Bottom navigation",
}: BottomNavigationProps) => {
  const invalidChildren = Children.toArray(children).filter(
    (child) =>
      !isValidElement<BottomNavigationItemProps>(child) ||
      child.type !== BottomNavigationItem,
  );

  if (invalidChildren.length > 0) {
    console.warn(
      "BottomNavigation only accepts BottomNavigationItem as children.",
    );
  }

  return (
    <nav
      className={cn("puzzle-bottom-navigation", className)}
      style={style}
      aria-label={ariaLabel}
    >
      <div className="puzzle-bottom-navigation__track">{children}</div>
    </nav>
  );
};

export {
  BottomNavigation,
  BottomNavigationItem,
  type BottomNavigationProps,
  type BottomNavigationItemProps,
};
