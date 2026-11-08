import { type ReactNode, useState } from "react";
import { cn } from "@puzzle-ui/core";

import type { AlertProps, AlertSeverity, AlertVariant } from "./alert.types";

import "./alert.css";
import { getAlertSemantics } from "./alert.utils";

const AlertIcon = ({ severity }: { severity: AlertSeverity }) => {
  const paths: Record<AlertSeverity, ReactNode> = {
    success: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    warning: (
      <>
        <path d="M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    error: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
  };

  return (
    <svg
      className="puzzle-alert__icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[severity]}
    </svg>
  );
};

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="m18 6-12 12M6 6l12 12" />
  </svg>
);

const Alert = ({
  severity = "info",
  variant = "standard",
  title,
  icon,
  closable = false,
  closeLabel = "Dismiss alert",
  onClose,
  children,
  className,
  style,
  ...props
}: AlertProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  const classes = cn(
    "puzzle-alert",
    `puzzle-alert--${severity}`,
    `puzzle-alert--${variant}`,
    className,
  );

  const semantics = getAlertSemantics(severity);

  return (
    <div
      {...props}
      className={classes}
      style={style}
      role={semantics.role}
      aria-live={semantics.ariaLive}
      aria-atomic="true"
    >
      {icon !== false && (
        <div className="puzzle-alert__icon-wrapper">
          {icon ?? <AlertIcon severity={severity} />}
        </div>
      )}

      <div className="puzzle-alert__content">
        {title && <div className="puzzle-alert__title">{title}</div>}

        {children && (
          <div className="puzzle-alert__description">{children}</div>
        )}
      </div>

      {closable && (
        <button
          type="button"
          className="puzzle-alert__close"
          aria-label={closeLabel}
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export { Alert, type AlertProps, type AlertSeverity, type AlertVariant };
