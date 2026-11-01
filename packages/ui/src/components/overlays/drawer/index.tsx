"use client";

import { cn } from "@puzzle/core";

import { useCallback, useEffect, type ComponentPropsWithRef } from "react";

import {
  Transition,
  type TransitionTemplate,
} from "../../utilities/transition";

import { Backdrop } from "../backdrop";
import { Stack } from "../../layout/stack";

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
  closeOnEscape?: boolean;
};

type DrawerProps = DrawerOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof DrawerOwnProps>;

const Drawer = ({
  position = "left",
  open,
  onOpenChange,
  closeOnEscape = true,
  className,
  children,
  ...props
}: DrawerProps) => {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Backdrop
      open={open}
      modal
      closeOnEscape={closeOnEscape}
      onClose={handleClose}
    >
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
  "aria-label": ariaLabel = "Drawer",
  "aria-labelledby": ariaLabelledBy,
  ...props
}: DrawerProps) => {
  const classes = cn("puzzle-drawer", `puzzle-drawer--${position}`, className);

  const { dimension, resizeRef } = useResizeBar(position, open);

  const resolvedDimension = dimension
    ? calculateDimension(position, dimension)
    : undefined;

  useEffect(() => {
    if (
      resolvedDimension !== undefined &&
      Number.parseInt(resolvedDimension, 10) < 100
    ) {
      onOpenChange(false);
    }
  }, [resolvedDimension, onOpenChange]);

  return (
    <Stack
      {...props}
      direction={["left", "right"].includes(position) ? "row" : "col"}
      reverse={["top", "left"].includes(position)}
      gap="0"
      className={classes}
      data-overlay-content=""
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
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
        type="button"
        className="puzzle-drawer__resize-bar"
        aria-label="Resize drawer"
        onMouseDown={(event) => event.stopPropagation()}
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
