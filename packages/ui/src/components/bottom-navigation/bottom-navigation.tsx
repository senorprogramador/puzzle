import {
  type ReactNode,
  type PropsWithChildren,
  Children,
  isValidElement,
  type CSSProperties,
} from "react";
import { Stack } from "../stack/stack";
import { cn } from "@puzzle/core/string/class-names";
import "./bottom-navigation.css";

type BottomNavigationItemProps = {
  icon: ReactNode;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const BottomNavigationItem = ({
  icon,
  label,
  className,
  style,
}: BottomNavigationItemProps) => {
  const classes = cn("puzzle-bottom-navigation-item", className);
  return (
    <Stack
      direction="col"
      alignH="center"
      alignV="center"
      gap="sm"
      className={classes}
      style={style}
    >
      {icon}
      {label && <span>{label}</span>}
    </Stack>
  );
};

type BottomNavigationProps = PropsWithChildren<{
  showLabels?: boolean;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
  style?: CSSProperties;
}>;

const BottomNavigation = ({
  showLabels,
  selectedIndex,
  onSelect,
  children,
  className,
  style,
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

  const classes = cn("puzzle-bottom-navigation", className);
  return (
    <Stack
      direction="row"
      alignH="center"
      alignV="center"
      gap="md"
      className={classes}
      style={style}
    >
      {children}
    </Stack>
  );
};

export {
  BottomNavigation,
  BottomNavigationItem,
  type BottomNavigationProps,
  type BottomNavigationItemProps,
};
