"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { cn, debounce } from "@puzzle/core";
import { Transition } from "../transition/transition";
import "./popout.css";

type PopoutPosition = "top" | "right" | "bottom" | "left";
type PopoutAlignment = "start" | "center" | "end";
type PopoutAction = "hover" | "click" | "down";

type PopoutTriggerProps = HTMLAttributes<HTMLElement> &
  RefAttributes<HTMLElement>;

type PositionCoordinates = {
  top: number;
  left: number;
};

type PopoutPlacement = {
  position: PopoutPosition;
  coordinates: PositionCoordinates;
};

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
  className?: string;
  contentClassName?: string;
};

const getPositionCoordinates = (
  position: PopoutPosition,
  align: PopoutAlignment,
  anchor: DOMRect,
  content: DOMRect,
  offset: number,
): PositionCoordinates => {
  let top = 0;
  let left = 0;

  switch (position) {
    case "top":
      top = anchor.top - content.height - offset;
      break;

    case "right":
      left = anchor.right + offset;
      break;

    case "bottom":
      top = anchor.bottom + offset;
      break;

    case "left":
      left = anchor.left - content.width - offset;
      break;
  }

  if (position === "top" || position === "bottom") {
    switch (align) {
      case "start":
        left = anchor.left;
        break;

      case "center":
        left = anchor.left + (anchor.width - content.width) / 2;
        break;

      case "end":
        left = anchor.right - content.width;
        break;
    }
  } else {
    switch (align) {
      case "start":
        top = anchor.top;
        break;

      case "center":
        top = anchor.top + (anchor.height - content.height) / 2;
        break;

      case "end":
        top = anchor.bottom - content.height;
        break;
    }
  }

  return { top, left };
};

const getOppositePosition = (position: PopoutPosition): PopoutPosition => {
  switch (position) {
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "bottom":
      return "top";
    case "left":
      return "right";
  }
};

const getFallbackPositions = (position: PopoutPosition): PopoutPosition[] => {
  const opposite = getOppositePosition(position);

  const remaining = (
    ["top", "right", "bottom", "left"] as PopoutPosition[]
  ).filter((item) => item !== position && item !== opposite);

  return [position, opposite, ...remaining];
};

const fitsViewport = (
  coordinates: PositionCoordinates,
  content: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): boolean => {
  return (
    coordinates.top >= padding &&
    coordinates.left >= padding &&
    coordinates.top + content.height <= viewportHeight - padding &&
    coordinates.left + content.width <= viewportWidth - padding
  );
};

const clampPosition = (
  coordinates: PositionCoordinates,
  content: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): PositionCoordinates => {
  const maxLeft = Math.max(padding, viewportWidth - content.width - padding);

  const maxTop = Math.max(padding, viewportHeight - content.height - padding);

  return {
    top: Math.min(Math.max(coordinates.top, padding), maxTop),
    left: Math.min(Math.max(coordinates.left, padding), maxLeft),
  };
};

const calculatePosition = (
  anchor: DOMRect,
  content: DOMRect,
  position: PopoutPosition,
  align: PopoutAlignment,
  offset: number,
  collisionPadding: number,
): PopoutPlacement => {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const positions = getFallbackPositions(position);

  for (const candidate of positions) {
    const coordinates = getPositionCoordinates(
      candidate,
      align,
      anchor,
      content,
      offset,
    );

    if (
      fitsViewport(
        coordinates,
        content,
        viewportWidth,
        viewportHeight,
        collisionPadding,
      )
    ) {
      return {
        position: candidate,
        coordinates,
      };
    }
  }

  const preferredCoordinates = getPositionCoordinates(
    position,
    align,
    anchor,
    content,
    offset,
  );

  return {
    position,
    coordinates: clampPosition(
      preferredCoordinates,
      content,
      viewportWidth,
      viewportHeight,
      collisionPadding,
    ),
  };
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
  className,
  contentClassName,
}: PopoutProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [positionStyle, setPositionStyle] = useState<CSSProperties | null>(
    null,
  );

  const anchorRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      debouncedClose.cancel();
    };
  }, [debouncedClose]);

  // Track the content while Transition mounts and unmounts it.
  const handleContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setContentElement(node);
  }, []);

  // Positioning
  useLayoutEffect(() => {
    if (!mounted || !isOpen || !contentElement) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const content = contentRef.current;

      if (
        !anchor?.isConnected ||
        !content?.isConnected ||
        anchor.getClientRects().length === 0 ||
        content.getClientRects().length === 0
      ) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      if (contentRect.width === 0 && contentRect.height === 0) {
        return;
      }

      const result = calculatePosition(
        anchorRect,
        contentRect,
        position,
        align,
        offset,
        collisionPadding,
      );

      setPositionStyle({
        position: "fixed",
        top: result.coordinates.top,
        left: result.coordinates.left,
      });
    };

    // Reset the previous position before measuring.
    setPositionStyle(null);
    updatePosition();

    const anchor = anchorRef.current;

    if (!anchor) {
      return;
    }

    const resizeObserver = new ResizeObserver(updatePosition);

    resizeObserver.observe(anchor);
    resizeObserver.observe(contentElement);

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    const visualViewport = window.visualViewport;

    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);

      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [
    mounted,
    isOpen,
    contentElement,
    position,
    align,
    offset,
    collisionPadding,
    children,
  ]);

  // Outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) {
      return;
    }

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
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

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, closeOnOutsideClick, cancelDebouncedClose, changeOpenState]);

  // Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      cancelDebouncedClose();
      changeOpenState(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, cancelDebouncedClose, changeOpenState]);

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

  const handlePointerUp = (
    event: PointerEvent<HTMLElement> | globalThis.PointerEvent,
  ) => {
    trigger.props.onPointerUp?.(event as PointerEvent<HTMLElement>);

    if (action !== "down" || event.defaultPrevented) {
      return;
    }
    debouncedClose();
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    trigger.props.onPointerDown?.(event);

    if (action !== "down" || event.defaultPrevented) {
      return;
    }

    changeOpenState(true);

    document.addEventListener("pointerup", handlePointerUp, { once: true });
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    trigger.props.onClick?.(event);

    if (action !== "click" || event.defaultPrevented) {
      return;
    }

    changeOpenState(true);
  };

  const triggerElement = cloneElement(trigger, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      setRef(trigger.props.ref, node);
    },
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

  return (
    <>
      {triggerElement}

      {createPortal(
        <Transition
          visible={isOpen}
          template="fade"
          duration={200}
          unmountOnExit
        >
          <div
            ref={handleContentRef}
            className={cn("puzzle-popout__content", contentClassName)}
            style={{
              ...positionStyle,
              visibility: positionStyle ? "visible" : "hidden",
              pointerEvents: isOpen ? "auto" : "none",
            }}
            onPointerEnter={
              action === "hover" ? cancelDebouncedClose : undefined
            }
            onPointerLeave={action === "hover" ? scheduleClose : undefined}
          >
            {children}
          </div>
        </Transition>,
        document.body,
      )}
    </>
  );
};

export type {
  PopoutProps,
  PopoutPosition,
  PopoutAlignment,
  PopoutAction,
  PopoutTriggerProps,
};

export { Popout };
