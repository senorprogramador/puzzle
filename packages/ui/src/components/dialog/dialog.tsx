"use client";
import {
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type MouseEventHandler,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@puzzle/core";
import "./dialog.css";
import { Transition } from "../transition/transition";
import { Backdrop } from "../backdrop/backdrop";
import { Portal } from "../portal/portal";

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

type NativeDialogProps = Omit<
  ComponentPropsWithoutRef<"div">,
  | "open"
  | "children"
  | "onCancel"
  | "onClose"
  | "onClick"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-label"
  | "aria-modal"
  | "role"
  | "tabIndex"
>;

type DialogProps = NativeDialogProps & {
  /** Whether the dialog is open. */
  open: boolean;

  /** Called when the dialog requests a change in its open state. */
  onOpenChange: (open: boolean) => void;

  /** Required accessible heading for the dialog. */
  title: ReactNode;

  /** Short, optional description of the dialog. */
  description?: string;

  /** Main dialog content. */
  children?: ReactNode;

  /** Optional footer, typically containing action buttons. */
  footer?: ReactNode;

  /** Maximum dialog width preset. */
  size?: DialogSize;

  /** Whether to render a close button. */
  closeButton?: boolean;

  /** Accessible label for the close button. */
  closeLabel?: string;

  /** Whether clicking the backdrop requests closing. */
  closeOnBackdrop?: boolean;

  /** Whether pressing Escape requests closing. */
  closeOnEscape?: boolean;

  /** Optional native click handler. */
  onClick?: MouseEventHandler<HTMLElement>;

  /** Called when the native dialog fires its close event. */
  onClose?: () => void;

  /** Additional IDs describing the dialog. */
  "aria-describedby"?: string;
};

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  closeButton = true,
  closeLabel = "Close dialog",
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  onClick,
  onClose,
  "aria-describedby": externalDescriptionId,
  ...props
}: DialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      event.stopPropagation();
      onOpenChange(false);
    }
    onClick?.(event);
  };

  const handleBackdropClick = (
    event: MouseEvent<HTMLElement> | KeyboardEvent,
  ) => {
    if (closeOnBackdrop) {
      event.stopPropagation();
      onOpenChange(false);
    }
  };

  const describedBy =
    [description ? descriptionId : undefined, externalDescriptionId]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Portal>
      <Backdrop open={open} onClose={handleBackdropClick}>
        <Transition template="slide-in-up" visible={open}>
          <div
            {...props}
            className={cn("puzzle-dialog", `puzzle-dialog--${size}`, className)}
            aria-labelledby={titleId}
            aria-describedby={describedBy}
            onClick={handleClick}
          >
            <header className="puzzle-dialog__header">
              <div className="puzzle-dialog__heading">
                <h2 id={titleId} className="puzzle-dialog__title">
                  {title}
                </h2>

                {description && (
                  <p id={descriptionId} className="puzzle-dialog__description">
                    {description}
                  </p>
                )}
              </div>

              {closeButton && (
                <button
                  type="button"
                  className="puzzle-dialog__close"
                  aria-label={closeLabel}
                  onClick={() => onOpenChange(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </header>

            <div className="puzzle-dialog__body">{children}</div>

            {footer != null && (
              <footer className="puzzle-dialog__footer">{footer}</footer>
            )}
          </div>
        </Transition>
      </Backdrop>
    </Portal>
  );
};

export { Dialog, type DialogProps };
