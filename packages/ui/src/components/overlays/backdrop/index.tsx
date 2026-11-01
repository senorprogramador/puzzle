"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ElementType,
  type Ref,
} from "react";

import { cn } from "@puzzle/core";

import "./backdrop.css";

import { Transition } from "../../utilities/transition";
import { ScrollLock } from "../../utilities/scroll-lock";

import {
  OverlayStackProvider,
  registerOverlay,
  useOverlayPriority,
  type OverlayRegistration,
} from "../overlay-stack";

type BackdropOwnProps<C extends ElementType> = {
  as?: C;
  open?: boolean;
  modal?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
};

type BackdropProps<C extends ElementType = "div"> = BackdropOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof BackdropOwnProps<C> | "as">;

const Backdrop = <C extends ElementType = "div">({
  as,
  open = true,
  modal = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  onClose,
  className,
  children,
  onClick,
  ...props
}: BackdropProps<C>) => {
  const Component = as ?? "div";

  const rootRef = useRef<HTMLElement | null>(null);

  const registrationRef = useRef<OverlayRegistration | null>(null);

  const parentPriority = useOverlayPriority();

  const classes = cn("puzzle-backdrop", className);

  const forwardedRef = (props as { ref?: Ref<HTMLElement> }).ref;

  const componentProps = { ...props };

  delete (componentProps as { ref?: Ref<HTMLElement> }).ref;

  const setRootRef = (node: HTMLElement | null) => {
    rootRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const root = rootRef.current;

    if (!root) {
      return;
    }

    const unregister = registerOverlay(
      root.ownerDocument,
      () => {
        if (closeOnEscape) {
          onClose?.();
        }
      },
      parentPriority,
      {
        modal,

        getContent: () =>
          rootRef.current?.querySelector<HTMLElement>(
            "[data-overlay-content]",
          ) ?? rootRef.current,

        getLayer: () => rootRef.current,
      },
    );

    registrationRef.current = unregister;

    return () => {
      unregister();

      if (registrationRef.current === unregister) {
        registrationRef.current = null;
      }
    };
  }, [open, modal, closeOnEscape, onClose, parentPriority]);

  return (
    <OverlayStackProvider priority={parentPriority + 1}>
      <ScrollLock enabled={open && modal} />

      <Transition visible={open} template="fade">
        <Component
          {...componentProps}
          ref={setRootRef as never}
          className={classes}
          onClick={(event) => {
            onClick?.(event);

            if (
              event.defaultPrevented ||
              !closeOnBackdrop ||
              event.target !== event.currentTarget ||
              !registrationRef.current?.isTop()
            ) {
              return;
            }

            event.stopPropagation();
            onClose?.();
          }}
        >
          {children}
        </Component>
      </Transition>
    </OverlayStackProvider>
  );
};

export { Backdrop, type BackdropProps };
