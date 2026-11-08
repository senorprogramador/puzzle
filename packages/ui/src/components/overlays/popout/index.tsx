"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from "react";
import { createPortal } from "react-dom";

import { cn, debounce } from "@puzzle-ui/core";
import { useThemeScope } from "@puzzle-ui/theme/scope-context";

import { Transition } from "../../utilities/transition";
import { registerOverlay } from "../overlay-stack";
import { useFloatingPosition } from "../floating-position";

import "./popout.css";

// Content is hidden, and therefore unfocusable, until it has been positioned.
const PopoutPositionedContext = createContext(true);

const usePopoutPositioned = (): boolean => useContext(PopoutPositionedContext);

type PopoutPosition = "top" | "right" | "bottom" | "left";

type PopoutAlignment = "start" | "center" | "end";

type PopoutAction = "hover" | "click" | "down";

type PopoutTriggerProps = HTMLAttributes<HTMLElement> &
  RefAttributes<HTMLElement>;

type PopoutProps = {
  trigger: ReactElement<PopoutTriggerProps>;
  children: ReactNode;
  position?: PopoutPosition;
  align?: PopoutAlignment;
  action?: PopoutAction;
  offset?: number;
  collisionPadding?: number;
  exitDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  toggleOnClick?: boolean;
  matchTriggerWidth?: boolean;
  className?: string;
  contentClassName?: string;
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const Popout = ({
  trigger,
  children,
  position = "bottom",
  align = "start",
  action = "click",
  offset = 8,
  collisionPadding = 8,
  exitDelay = 150,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  toggleOnClick = false,
  matchTriggerWidth = false,
  className,
  contentClassName,
}: PopoutProps) => {
  const themeScope = useThemeScope();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );

  const anchorRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pointerDocumentRef = useRef<Document | null>(null);

  const isOpen = open ?? internalOpen;

  const changeOpenState = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [open, onOpenChange],
  );

  const debouncedClose = useMemo(
    () => debounce(() => changeOpenState(false), Math.max(0, exitDelay)),
    [changeOpenState, exitDelay],
  );

  const cancelDebouncedClose = useCallback(() => {
    debouncedClose.cancel();
  }, [debouncedClose]);

  const scheduleClose = useCallback(() => {
    if (exitDelay > 0) {
      debouncedClose();
    } else {
      changeOpenState(false);
    }
  }, [debouncedClose, exitDelay, changeOpenState]);

  const removePointerListeners = useCallback((handler: EventListener) => {
    const ownerDocument = pointerDocumentRef.current;

    if (!ownerDocument) {
      return;
    }

    ownerDocument.removeEventListener("pointerup", handler);
    ownerDocument.removeEventListener("pointercancel", handler);

    pointerDocumentRef.current = null;
  }, []);

  const handleDocumentPointerUp = useCallback(() => {
    removePointerListeners(handleDocumentPointerUp);
    debouncedClose();
  }, [debouncedClose, removePointerListeners]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      debouncedClose.cancel();
      removePointerListeners(handleDocumentPointerUp);
    };
  }, [debouncedClose, handleDocumentPointerUp, removePointerListeners]);

  const handleTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      anchorRef.current = node;
      setAnchorElement(node);

      setPortalContainer(
        themeScope
          ? themeScope.portalTarget
          : (node?.ownerDocument.body ?? null),
      );

      setRef(trigger.props.ref, node);
    },
    [trigger, themeScope],
  );

  const handleContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setContentElement(node);
  }, []);

  const {
    style: positionStyle,
    placement,
    isPositioned,
  } = useFloatingPosition({
    anchor: anchorElement,
    content: contentElement,
    enabled: mounted && isOpen,
    position,
    align,
    offset,
    collisionPadding,
    matchTriggerWidth,
  });

  // Outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || !portalContainer) {
      return;
    }

    const ownerDocument = anchorElement?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;

    if (!ownerDocument || !ownerWindow) {
      return;
    }

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (!(target instanceof ownerWindow.Node)) {
        return;
      }

      if (
        anchorRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return;
      }

      cancelDebouncedClose();
      changeOpenState(false);
    };

    ownerDocument.addEventListener("pointerdown", handlePointerDown);

    return () => {
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [
    isOpen,
    closeOnOutsideClick,
    portalContainer,
    anchorElement,
    cancelDebouncedClose,
    changeOpenState,
  ]);

  // Escape: only the topmost registered overlay handles the key.
  useEffect(() => {
    if (!isOpen || !portalContainer || !anchorElement) {
      return;
    }

    const ownerDocument = anchorElement.ownerDocument;

    return registerOverlay(ownerDocument, () => {
      if (!closeOnEscape) {
        return;
      }

      cancelDebouncedClose();
      changeOpenState(false);

      if (contentRef.current?.contains(ownerDocument.activeElement)) {
        anchorRef.current?.focus({ preventScroll: true });
      }
    });
  }, [
    isOpen,
    portalContainer,
    anchorElement,
    closeOnEscape,
    cancelDebouncedClose,
    changeOpenState,
  ]);

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    trigger.props.onPointerEnter?.(event);

    if (action !== "hover") {
      return;
    }

    cancelDebouncedClose();
    changeOpenState(true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    trigger.props.onPointerLeave?.(event);

    if (action !== "hover") {
      return;
    }

    scheduleClose();
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    trigger.props.onPointerUp?.(event);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    trigger.props.onPointerDown?.(event);

    if (action !== "down" || event.defaultPrevented) {
      return;
    }

    changeOpenState(true);

    const ownerDocument = event.currentTarget.ownerDocument;

    removePointerListeners(handleDocumentPointerUp);

    pointerDocumentRef.current = ownerDocument;

    ownerDocument.addEventListener("pointerup", handleDocumentPointerUp);
    ownerDocument.addEventListener("pointercancel", handleDocumentPointerUp);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    trigger.props.onClick?.(event);

    if (action !== "click" || event.defaultPrevented) {
      return;
    }

    changeOpenState(toggleOnClick ? !isOpen : true);
  };

  const triggerElement = cloneElement(trigger, {
    ref: handleTriggerRef,
    className: cn(trigger.props.className, className),
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onClick: handleClick,
  });

  if (!mounted) {
    return triggerElement;
  }

  const contentStyle: CSSProperties = {
    ...(positionStyle ?? {}),
    visibility: isPositioned ? "visible" : "hidden",
    pointerEvents: isOpen && isPositioned ? "auto" : "none",
  };

  return (
    <>
      {triggerElement}

      {portalContainer &&
        createPortal(
          <Transition
            visible={isOpen}
            template="fade"
            duration={200}
            unmountOnExit
          >
            <div
              ref={handleContentRef}
              className={cn("puzzle-popout__content", contentClassName)}
              data-placement={placement}
              style={contentStyle}
              onPointerEnter={
                action === "hover" ? cancelDebouncedClose : undefined
              }
              onPointerLeave={action === "hover" ? scheduleClose : undefined}
            >
              <PopoutPositionedContext.Provider value={isPositioned}>
                {children}
              </PopoutPositionedContext.Provider>
            </div>
          </Transition>,
          portalContainer,
        )}
    </>
  );
};

export {
  Popout,
  usePopoutPositioned,
  type PopoutProps,
  type PopoutPosition,
  type PopoutAlignment,
  type PopoutAction,
  type PopoutTriggerProps,
};
