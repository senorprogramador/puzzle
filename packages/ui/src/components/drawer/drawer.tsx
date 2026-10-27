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

const DrawerContent = ({
  children,
  className,
  position = "left",
  open,
  onOpenChange,
  ...props
}: DrawerProps) => {
  const classes = cn("puzzle-drawer", `puzzle-drawer--${position}`, className);

  const { dimension, resizeRef } = useResizeBar(
    ["left", "right"].includes(position) ? "horizontal" : "vertical",
    open,
  );

  useEffect(() => {
    if ((dimension ?? 0) > window.innerHeight - 100) {
      onOpenChange(false);
    }
  }, [dimension]);

  return (
    <Stack
      {...props}
      direction="col"
      className={classes}
      style={
        dimension
          ? {
              [position === "left" || position === "right"
                ? "width"
                : "height"]: `${window.innerHeight - dimension}px`,
            }
          : {}
      }
    >
      <button
        ref={resizeRef}
        style={{
          height: "3px",
          minHeight: "3px",
          flexShrink: 0,
          width: "128px",
          margin: "0 auto",
          borderRadius: "2px",
          backgroundColor: "rgba(0, 0, 0, 0.25)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <Stack direction="col" className="puzzle-drawer__content">
        {children}
      </Stack>
    </Stack>
  );
};

export { Drawer, type DrawerProps };
