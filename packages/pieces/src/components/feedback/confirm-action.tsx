"use client";

import { useState } from "react";

import { Button, Dialog, type ButtonVariant } from "@puzzle-ui/ui";

import "./feedback.css";

export type ConfirmActionProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
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

  const confirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <div
      className={["puzzle-confirm-action", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Button variant={confirmVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        closeLabel={cancelLabel}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {cancelLabel}
            </Button>
            <Button variant={confirmVariant} onClick={confirm}>
              {confirmLabel}
            </Button>
          </>
        }
      />
    </div>
  );
};
