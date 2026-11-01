"use client";

import { cn } from "@puzzle/core";
import { useEffect, type ComponentPropsWithRef, type ElementType } from "react";
import "./backdrop.css";
import { Transition } from "../../utilities/transition";
import {
  OverlayStackProvider,
  registerOverlay,
  useOverlayPriority,
} from "../overlay-stack";

type BackdropOwnProps<C extends ElementType> = {
  as?: C;
  open?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
};

type BackdropProps<C extends ElementType = "div"> = BackdropOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof BackdropOwnProps<C> | "as">;

const Backdrop = <C extends ElementType = "div">({
  as,
  open = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  onClose,
  className,
  children,
  onClick,
  ...props
}: BackdropProps<C>) => {
  const Component = as ?? "div";
  const classes = cn("puzzle-backdrop", className);
  const parentPriority = useOverlayPriority();

  useEffect(() => {
    if (!open || !onClose) {
      return;
    }

    return registerOverlay(
      document,
      () => {
        if (closeOnEscape) {
          onClose();
        }
      },
      parentPriority,
    );
  }, [open, closeOnEscape, onClose, parentPriority]);

  return (
    <OverlayStackProvider priority={parentPriority + 1}>
      <Transition visible={open} template="fade">
        <Component
          className={classes}
          {...props}
          onClick={(event) => {
            onClick?.(event);

            if (closeOnBackdrop && event.target === event.currentTarget) {
              event.stopPropagation();
              onClose?.();
            }
          }}
        >
          {children}
        </Component>
      </Transition>
    </OverlayStackProvider>
  );
};

export { Backdrop, type BackdropProps };
