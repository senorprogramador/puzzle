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
  viewportWidth: number,
  viewportHeight: number,
): PopoutPlacement => {
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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [positionStyle, setPositionStyle] = useState<CSSProperties | null>(
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

  const removePointerListeners = useCallback(() => {
    const ownerDocument = pointerDocumentRef.current;

    if (!ownerDocument) {
      return;
    }

    ownerDocument.removeEventListener("pointerup", handleDocumentPointerUp);
    ownerDocument.removeEventListener("pointercancel", handleDocumentPointerUp);

    pointerDocumentRef.current = null;
  }, []);

  const handleDocumentPointerUp = useCallback(() => {
    removePointerListeners();
    debouncedClose();
  }, [debouncedClose, removePointerListeners]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      debouncedClose.cancel();
      removePointerListeners();
    };
  }, [debouncedClose, removePointerListeners]);

  // Keep the portal in the same document as the trigger.
  const handleTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      anchorRef.current = node;
      setPortalContainer(node?.ownerDocument.body ?? null);
      setRef(trigger.props.ref, node);
    },
    [trigger],
  );

  // Track the content while Transition mounts and unmounts it.
  const handleContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setContentElement(node);
  }, []);

  // Positioning
  useLayoutEffect(() => {
    if (!mounted || !isOpen || !contentElement || !portalContainer) {
      return;
    }

    const anchor = anchorRef.current;
    const ownerDocument = anchor?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;

    if (!anchor || !ownerDocument || !ownerWindow) {
      return;
    }

    const updatePosition = () => {
      const currentAnchor = anchorRef.current;
      const content = contentRef.current;

      if (
        !currentAnchor?.isConnected ||
        !content?.isConnected ||
        currentAnchor.ownerDocument !== ownerDocument ||
        content.ownerDocument !== ownerDocument ||
        currentAnchor.getClientRects().length === 0 ||
        content.getClientRects().length === 0
      ) {
        return;
      }

      const anchorRect = currentAnchor.getBoundingClientRect();
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
        ownerDocument.documentElement.clientWidth,
        ownerDocument.documentElement.clientHeight,
      );

      setPositionStyle({
        position: "fixed",
        top: result.coordinates.top,
        left: result.coordinates.left,
      });
    };

    setPositionStyle(null);
    updatePosition();

    const ResizeObserverConstructor =
      ownerWindow.ResizeObserver ?? ResizeObserver;
    const resizeObserver = new ResizeObserverConstructor(updatePosition);

    resizeObserver.observe(anchor);
    resizeObserver.observe(contentElement);

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    ownerWindow.addEventListener("resize", handleResize);
    ownerWindow.addEventListener("scroll", handleScroll, true);

    const visualViewport = ownerWindow.visualViewport;

    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();

      ownerWindow.removeEventListener("resize", handleResize);
      ownerWindow.removeEventListener("scroll", handleScroll, true);

      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [
    mounted,
    isOpen,
    contentElement,
    portalContainer,
    position,
    align,
    offset,
    collisionPadding,
    children,
  ]);

  // Outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || !portalContainer) {
      return;
    }

    const ownerDocument = anchorRef.current?.ownerDocument;
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
    cancelDebouncedClose,
    changeOpenState,
  ]);

  // Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape || !portalContainer) {
      return;
    }

    const ownerDocument = anchorRef.current?.ownerDocument;

    if (!ownerDocument) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      cancelDebouncedClose();
      changeOpenState(false);
    };

    ownerDocument.addEventListener("keydown", handleKeyDown);

    return () => {
      ownerDocument.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isOpen,
    closeOnEscape,
    portalContainer,
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

    removePointerListeners();
    pointerDocumentRef.current = ownerDocument;

    ownerDocument.addEventListener("pointerup", handleDocumentPointerUp);
    ownerDocument.addEventListener("pointercancel", handleDocumentPointerUp);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    trigger.props.onClick?.(event);

    if (action !== "click" || event.defaultPrevented) {
      return;
    }

    changeOpenState(true);
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
          portalContainer,
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
