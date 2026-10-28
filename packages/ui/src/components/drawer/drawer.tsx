import { cn } from "@puzzle/core";
import { useEffect, type ComponentPropsWithRef } from "react";
import { Transition, type TransitionTemplate } from "../transition/transition";
import { Backdrop } from "../backdrop/backdrop";
import { Stack } from "../stack/stack";
import "./drawer.css";
import { useResizeBar } from "./use-resize-bar";

const TRANSITION_MAP: Record<DrawerPosition, TransitionTemplate> = {
  left: "slide-in-right",
  right: "slide-in-left",
  top: "slide-in-down",
  bottom: "slide-in-up",
};

type DrawerPosition = "left" | "right" | "top" | "bottom";
type DrawerOwnProps = {
  position?: DrawerPosition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DrawerProps = DrawerOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof DrawerOwnProps>;

const Drawer = ({
  position = "left",
  open,
  onOpenChange,
  className,
  children,
  ...props
}: DrawerProps) => {
  return (
    <Backdrop open={open} onClose={() => onOpenChange(false)}>
      <Transition visible={open} template={TRANSITION_MAP[position]} forceMount>
        <DrawerContent
          position={position}
          open={open}
          onOpenChange={onOpenChange}
          className={className}
          {...props}
        >
          {children}
        </DrawerContent>
      </Transition>
    </Backdrop>
  );
};

const calculateDimension = (position: DrawerPosition, dimension: number) => {
  switch (position) {
    case "left":
      return `${dimension}px`;
    case "right":
      return `${window.innerWidth - dimension}px`;
    case "top":
      return `${dimension}px`;
    case "bottom":
      return `${window.innerHeight - dimension}px`;
  }
};

const DrawerContent = ({
  children,
  className,
  position = "left",
  open,
  onOpenChange,
  ...props
}: DrawerProps) => {
  const classes = cn("puzzle-drawer", `puzzle-drawer--${position}`, className);

  const { dimension, resizeRef } = useResizeBar(position, open);
  const resolvedDimension = dimension
    ? calculateDimension(position, dimension)
    : undefined;

  useEffect(() => {
    if (resolvedDimension !== undefined && parseInt(resolvedDimension) < 100) {
      onOpenChange(false);
    }
  }, [resolvedDimension]);

  return (
    <Stack
      {...props}
      direction={["left", "right"].includes(position) ? "row" : "col"}
      reverse={["top", "left"].includes(position)}
      gap="0"
      className={classes}
      style={
        resolvedDimension
          ? {
              [["left", "right"].includes(position) ? "width" : "height"]:
                resolvedDimension,
            }
          : undefined
      }
    >
      <button
        ref={resizeRef}
        className="puzzle-drawer__resize-bar"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="puzzle-drawer__resize-bar-inner" />
      </button>
      <Stack direction="col" className="puzzle-drawer__content-wrapper">
        <Stack direction="col" className="puzzle-drawer__content">
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};

export { Drawer, type DrawerProps };
