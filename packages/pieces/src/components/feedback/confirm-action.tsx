"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Dialog, type ButtonVariant } from "@puzzle-ui/ui";

import "./feedback.css";

export type ConfirmActionProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void | Promise<void>;
  className?: string;
};

export const ConfirmAction = ({
  triggerLabel,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  className,
}: ConfirmActionProps) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      const frame = window.requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });

      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [open]);

  const confirm = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    setFailed(false);

    try {
      await onConfirm();
      restoreFocus.current = true;
      setOpen(false);
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={["puzzle-confirm-action", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        ref={triggerRef}
        variant={confirmVariant}
        onClick={() => {
          setFailed(false);
          restoreFocus.current = true;
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!pending) {
            if (!nextOpen) {
              restoreFocus.current = true;
            }
            setOpen(nextOpen);
          }
        }}
        title={title}
        description={description}
        closeLabel={cancelLabel}
        role="alertdialog"
        aria-busy={pending || undefined}
        closeButton={false}
        closeOnBackdrop={!pending}
        closeOnEscape={!pending}
        footer={
          <>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => {
                restoreFocus.current = true;
                setOpen(false);
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              aria-busy={pending || undefined}
              onClick={() => void confirm()}
            >
              {confirmLabel}
            </Button>
          </>
        }
      >
        {failed ? (
          <p role="alert">The action could not be completed. Please try again.</p>
        ) : null}
      </Dialog>
    </div>
  );
};
