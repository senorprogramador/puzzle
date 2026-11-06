"use client";

import {
  cloneElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from "react";
import { cn } from "@puzzle/core";
import {
  Popout,
  type PopoutAction,
  type PopoutAlignment,
  type PopoutPosition,
} from "../popout";
import { Stack } from "../../layout/stack";
import "./tooltip.css";

type TooltipTriggerProps = HTMLAttributes<HTMLElement> &
  RefAttributes<HTMLElement>;

type TooltipArrowSide = "top" | "right" | "bottom" | "left";

type TooltipArrowStyle = {
  side: TooltipArrowSide;
  style: CSSProperties;
};

type TooltipProps = {
  trigger: ReactElement<TooltipTriggerProps>;
  action?: PopoutAction;
  closable?: boolean;
  children: ReactNode;
  position?: PopoutPosition;
  align?: PopoutAlignment;
  offset?: number;
  exitDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
};

type TooltipContentProps = {
  id?: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  position: PopoutPosition;
  closable?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

const arrowSize = 8;

const getArrowSide = (
  anchor: DOMRect,
  content: DOMRect,
  position: PopoutPosition,
): TooltipArrowSide => {
  // Determine the actual side after Popout fallback positioning.
  if (anchor.bottom <= content.top) {
    return "top";
  }

  if (anchor.top >= content.bottom) {
    return "bottom";
  }

  if (anchor.right <= content.left) {
    return "left";
  }

  if (anchor.left >= content.right) {
    return "right";
  }

  // Fallback when the rectangles overlap.
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

const getArrowStyle = (
  side: TooltipArrowSide,
  anchor: DOMRect,
  content: DOMRect,
): CSSProperties => {
  const anchorCenterX = anchor.left + anchor.width / 2;
  const anchorCenterY = anchor.top + anchor.height / 2;

  switch (side) {
    case "top":
      return {
        top: -arrowSize,
        left: anchorCenterX - content.left - arrowSize,
      };

    case "bottom":
      return {
        bottom: -arrowSize,
        left: anchorCenterX - content.left - arrowSize,
      };

    case "left":
      return {
        left: -arrowSize,
        top: anchorCenterY - content.top - arrowSize,
      };

    case "right":
      return {
        right: -arrowSize,
        top: anchorCenterY - content.top - arrowSize,
      };
  }
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const TooltipContent = ({
  id,
  anchorRef,
  position,
  closable,
  onOpenChange,
  children,
  className,
}: TooltipContentProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [arrow, setArrow] = useState<TooltipArrowStyle | null>(null);

  const updateArrowPosition = useCallback(() => {
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

    if (
      (contentRect.width === 0 && contentRect.height === 0) ||
      (anchorRect.width === 0 && anchorRect.height === 0)
    ) {
      return;
    }

    const side = getArrowSide(anchorRect, contentRect, position);

    setArrow({
      side,
      style: getArrowStyle(side, anchorRect, contentRect),
    });
  }, [anchorRef, position]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const content = contentRef.current;
    const ownerDocument = anchor?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;

    if (
      !anchor ||
      !content ||
      !ownerDocument ||
      !ownerWindow ||
      content.ownerDocument !== ownerDocument
    ) {
      return;
    }

    let animationFrame = 0;

    const scheduleArrowUpdate = () => {
      ownerWindow.cancelAnimationFrame(animationFrame);
      animationFrame = ownerWindow.requestAnimationFrame(updateArrowPosition);
    };

    updateArrowPosition();

    const ResizeObserverConstructor =
      ownerWindow.ResizeObserver ?? ResizeObserver;
    const resizeObserver = new ResizeObserverConstructor(scheduleArrowUpdate);

    resizeObserver.observe(anchor);
    resizeObserver.observe(content);

    const handleResize = () => scheduleArrowUpdate();
    const handleScroll = () => scheduleArrowUpdate();

    ownerWindow.addEventListener("resize", handleResize);
    ownerWindow.addEventListener("scroll", handleScroll, true);

    const visualViewport = ownerWindow.visualViewport;

    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleScroll);

    return () => {
      ownerWindow.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      ownerWindow.removeEventListener("resize", handleResize);
      ownerWindow.removeEventListener("scroll", handleScroll, true);

      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [anchorRef, updateArrowPosition]);

  return (
    <Stack
      ref={contentRef}
      direction="row"
      gap="sm"
      className={cn("puzzle-tooltip", className)}
    >
      <span role="tooltip" id={id} className="puzzle-tooltip__text">
        {children}
      </span>

      {closable && (
        <button
          type="button"
          className="puzzle-tooltip__close"
          aria-label="Close"
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          &times;
        </button>
      )}

      <span
        aria-hidden="true"
        className={cn(
          "puzzle-tooltip__arrow",
          arrow && `puzzle-tooltip__arrow--${arrow.side}`,
        )}
        style={{
          ...arrow?.style,
          visibility: arrow ? "visible" : "hidden",
        }}
      />
    </Stack>
  );
};

const Tooltip = ({
  trigger,
  children,
  position = "bottom",
  align = "center",
  action = "hover",
  closable = false,
  offset = arrowSize,
  exitDelay = 100,
  open,
  defaultOpen,
  onOpenChange,
  className,
  triggerClassName,
}: TooltipProps) => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [open, onOpenChange],
  );

  const handleTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      anchorRef.current = node;
      setRef(trigger.props.ref, node);
    },
    [trigger],
  );

  // Keyboard users get the same tooltip as pointer users on hover tooltips.
  const opensOnFocus = action === "hover";

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    trigger.props.onFocus?.(event);

    if (opensOnFocus && !event.defaultPrevented) {
      handleOpenChange(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    trigger.props.onBlur?.(event);

    if (
      opensOnFocus &&
      !event.defaultPrevented &&
      !event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      handleOpenChange(false);
    }
  };

  const describedBy = [trigger.props["aria-describedby"], isOpen && tooltipId]
    .filter(Boolean)
    .join(" ");

  const triggerElement = cloneElement(trigger, {
    ref: handleTriggerRef,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-describedby": describedBy || undefined,
  });

  return (
    <Popout
      trigger={triggerElement}
      position={position}
      align={align}
      action={action}
      offset={offset}
      exitDelay={exitDelay}
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick
      closeOnEscape
      className={triggerClassName}
      contentClassName="puzzle-tooltip__content"
    >
      <TooltipContent
        id={tooltipId}
        anchorRef={anchorRef}
        position={position}
        closable={closable}
        onOpenChange={handleOpenChange}
        className={className}
      >
        {children}
      </TooltipContent>
    </Popout>
  );
};

export {
  Tooltip,
  type TooltipProps,
  type TooltipContentProps,
  type TooltipArrowSide,
};
