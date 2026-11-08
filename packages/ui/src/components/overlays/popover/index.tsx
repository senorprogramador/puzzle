"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
  type RefObject,
} from "react";
import { cn } from "@puzzle-ui/core";
import { Popout, type PopoutAlignment, type PopoutPosition } from "../popout";
import "./popover.css";

type PopoverTriggerProps = HTMLAttributes<HTMLElement> &
  RefAttributes<HTMLElement>;

/**
 * Non-modal dialog anchored to a trigger, for interactive content such as
 * links, form controls or actions. Use Tooltip for non-interactive hints.
 */
type PopoverProps = {
  trigger: ReactElement<PopoverTriggerProps>;
  children: ReactNode;
  /** Visible heading; also used as the dialog's accessible name. */
  title?: ReactNode;
  /** Accessible name when there is no visible title. */
  "aria-label"?: string;
  /** Renders a close button inside the popover. */
  closable?: boolean;
  closeLabel?: string;
  position?: PopoutPosition;
  align?: PopoutAlignment;
  offset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
};

type PopoverContentProps = {
  id: string;
  title?: ReactNode;
  ariaLabel?: string;
  closable: boolean;
  closeLabel: string;
  skipAutoFocusRef: RefObject<boolean>;
  dialogRef: RefObject<HTMLDivElement | null>;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

const getFocusable = (dialog: HTMLElement): HTMLElement[] =>
  Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

/** Returns whether focus actually landed inside the dialog. */
const focusFirst = (dialog: HTMLElement): boolean => {
  const target = getFocusable(dialog)[0] ?? dialog;

  target.focus({ preventScroll: true });

  return dialog.contains(dialog.ownerDocument.activeElement);
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const PopoverContent = ({
  id,
  title,
  ariaLabel,
  closable,
  closeLabel,
  skipAutoFocusRef,
  dialogRef,
  anchorRef,
  onClose,
  children,
  className,
}: PopoverContentProps) => {
  const titleId = `${id}-title`;

  // Popout keeps the surface `visibility: hidden` until it is positioned, and
  // hidden elements cannot receive focus; retry once the surface is revealed.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (skipAutoFocusRef.current) {
      skipAutoFocusRef.current = false;
      return;
    }

    const surface = dialog.parentElement;

    if (focusFirst(dialog) || !surface) return;

    const MutationObserverConstructor =
      dialog.ownerDocument.defaultView?.MutationObserver ?? MutationObserver;
    const observer = new MutationObserverConstructor(() => {
      if (surface.style.visibility !== "hidden") {
        observer.disconnect();
        focusFirst(dialog);
      }
    });

    observer.observe(surface, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [dialogRef, skipAutoFocusRef]);

  // Non-modal: moving focus outside both the popover and its trigger closes it.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;

    if (
      next &&
      !event.currentTarget.contains(next) &&
      !anchorRef.current?.contains(next)
    ) {
      onClose();
    }
  };

  // The popover is portaled, so keep Tab order anchored to the trigger.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const dialog = event.currentTarget;
    const focusable = getFocusable(dialog);
    const active = dialog.ownerDocument.activeElement;
    const first = focusable[0] ?? dialog;
    const last = focusable[focusable.length - 1] ?? dialog;

    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      anchorRef.current?.focus({ preventScroll: true });
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      onClose();
      anchorRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-labelledby={title != null ? titleId : undefined}
      aria-label={title == null ? ariaLabel : undefined}
      tabIndex={-1}
      className={cn("puzzle-popover", className)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {(title != null || closable) && (
        <div className="puzzle-popover__header">
          {title != null && (
            <div id={titleId} className="puzzle-popover__title">
              {title}
            </div>
          )}

          {closable && (
            <button
              type="button"
              className="puzzle-popover__close"
              aria-label={closeLabel}
              onClick={() => {
                onClose();
                anchorRef.current?.focus({ preventScroll: true });
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      )}

      <div className="puzzle-popover__body">{children}</div>
    </div>
  );
};

const Popover = ({
  trigger,
  children,
  title,
  "aria-label": ariaLabel,
  closable = false,
  closeLabel = "Close",
  position = "bottom",
  align = "center",
  offset = 8,
  open,
  defaultOpen,
  onOpenChange,
  className,
  triggerClassName,
}: PopoverProps) => {
  const popoverId = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;

  // A popover that is already open on first render must not steal focus.
  const skipAutoFocusRef = useRef(isOpen);

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

  // Tab from the trigger moves into the open popover instead of skipping it.
  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    trigger.props.onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      event.key !== "Tab" ||
      event.shiftKey ||
      !isOpen ||
      !dialogRef.current
    ) {
      return;
    }

    event.preventDefault();
    focusFirst(dialogRef.current);
  };

  const triggerElement = cloneElement(trigger, {
    ref: handleTriggerRef,
    onKeyDown: handleTriggerKeyDown,
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? popoverId : undefined,
  });

  return (
    <Popout
      trigger={triggerElement}
      position={position}
      align={align}
      action="click"
      toggleOnClick
      offset={offset}
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick
      closeOnEscape
      className={triggerClassName}
      contentClassName="puzzle-popover__surface"
    >
      <PopoverContent
        id={popoverId}
        title={title}
        ariaLabel={ariaLabel}
        closable={closable}
        closeLabel={closeLabel}
        skipAutoFocusRef={skipAutoFocusRef}
        dialogRef={dialogRef}
        anchorRef={anchorRef}
        onClose={() => handleOpenChange(false)}
        className={className}
      >
        {children}
      </PopoverContent>
    </Popout>
  );
};

export { Popover, type PopoverProps };
