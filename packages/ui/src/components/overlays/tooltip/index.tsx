"use client";

import {
  cloneElement,
  useCallback,
  useId,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from "react";

import { cn } from "@puzzle/core";

import { Popout, type PopoutAlignment, type PopoutPosition } from "../popout";

import "./tooltip.css";

type TooltipTriggerProps = HTMLAttributes<HTMLElement> &
  RefAttributes<HTMLElement>;

type TooltipArrowSide = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  trigger: ReactElement<TooltipTriggerProps>;
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
  children: ReactNode;
  className?: string;
};

const arrowSize = 8;

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const TooltipContent = ({ id, children, className }: TooltipContentProps) => {
  return (
    <div id={id} role="tooltip" className={cn("puzzle-tooltip", className)}>
      {children}

      <span aria-hidden="true" className="puzzle-tooltip__arrow" />
    </div>
  );
};

const Tooltip = ({
  trigger,
  children,
  position = "bottom",
  align = "center",
  offset = arrowSize,
  exitDelay = 100,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  triggerClassName,
}: TooltipProps) => {
  const tooltipId = useId();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);

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

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    trigger.props.onFocus?.(event);

    if (!event.defaultPrevented) {
      handleOpenChange(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    trigger.props.onBlur?.(event);

    if (
      !event.defaultPrevented &&
      !event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      handleOpenChange(false);
    }
  };

  const describedBy = [
    trigger.props["aria-describedby"],
    isOpen ? tooltipId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const triggerElement = cloneElement(trigger, {
    ref: (node: HTMLElement | null) => {
      setRef(trigger.props.ref, node);
    },
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-describedby": describedBy || undefined,
  });

  return (
    <Popout
      trigger={triggerElement}
      position={position}
      align={align}
      action="hover"
      offset={offset}
      exitDelay={exitDelay}
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick
      closeOnEscape
      className={triggerClassName}
      contentClassName="puzzle-tooltip__content"
    >
      <TooltipContent id={tooltipId} className={className}>
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
