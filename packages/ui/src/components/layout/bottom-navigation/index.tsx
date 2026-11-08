import {
  Children,
  isValidElement,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { Link } from "../../navigation/link";
import "./bottom-navigation.css";

type BottomNavigationItemProps = {
  icon: ReactNode;
  label: string;
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
    <>
      <span className="puzzle-bottom-navigation-item__icon" aria-hidden="true">
        {icon}
      </span>

      <span className="puzzle-bottom-navigation-item__label">{label}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        style={style}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        data-active={active || undefined}
      >
        {content}
      </Link>
    );
  }

  // An action button is not the current page, so it gets no aria-current.
  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
      aria-label={label}
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
