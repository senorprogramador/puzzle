"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { cn } from "@puzzle-ui/core";

import type {
  NotificationItem,
  NotificationPosition,
  NotificationSeverity,
  NotificationAction,
  NotificationOptions,
  NotificationInput,
  NotificationProviderProps,
} from "./notification.types";

import "./notification.css";

type NotificationProps = {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
};

type NotificationViewportProps = {
  notifications: NotificationItem[];
  position: NotificationPosition;
  label: string;
  onDismiss: (id: string) => void;
};

const NotificationIcon = ({
  severity,
}: {
  severity: NotificationItem["severity"];
}) => {
  const paths: Record<NotificationItem["severity"], string> = {
    success: "M5 12l4 4L19 6",
    info: "M12 8h.01M11 12h1v4h1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
    warning:
      "M12 9v4m0 4h.01M10.3 3.9L1.8 18.5A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z",
    error: "M18 6 6 18M6 6l12 12",
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[severity]} />
    </svg>
  );
};

const Notification = ({ notification, onDismiss }: NotificationProps) => {
  const { id, severity, title, description, duration, action, closable } =
    notification;

  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(duration ?? 0);
  const startedAtRef = useRef(0);

  const dismiss = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  useEffect(() => {
    if (!duration || duration <= 0 || paused) return;

    startedAtRef.current = Date.now();

    const timer = window.setTimeout(dismiss, remainingRef.current);

    return () => {
      window.clearTimeout(timer);

      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current),
      );
    };
  }, [duration, paused, dismiss]);

  useEffect(() => {
    const handleWindowBlur = () => setPaused(true);
    const handleWindowFocus = () => setPaused(false);

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.visibilityState !== "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleAction = () => {
    try {
      action?.onClick();
    } finally {
      dismiss();
    }
  };

  return (
    <div
      className={cn("puzzle-notification", `puzzle-notification--${severity}`)}
      data-severity={severity}
      role={severity === "error" ? "alert" : "status"}
      aria-live={severity === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <span className="puzzle-notification__icon">
        <NotificationIcon severity={severity} />
      </span>

      <div className="puzzle-notification__content">
        {title != null && (
          <div className="puzzle-notification__title">{title}</div>
        )}

        {description != null && (
          <div className="puzzle-notification__description">{description}</div>
        )}

        {action && (
          <button
            type="button"
            className="puzzle-notification__action"
            onClick={handleAction}
          >
            {action.label}
          </button>
        )}
      </div>

      {closable && (
        <button
          type="button"
          className="puzzle-notification__close"
          aria-label="Dismiss notification"
          onClick={dismiss}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

const NotificationViewport = ({
  notifications,
  position,
  label,
  onDismiss,
}: NotificationViewportProps) => (
  <div
    className={cn(
      "puzzle-notification-viewport",
      `puzzle-notification-viewport--${position}`,
    )}
    role="region"
    aria-label={label}
    style={
      { "--puzzle-notification-count": notifications.length } as CSSProperties
    }
  >
    {notifications.map((notification) => (
      <Notification
        key={notification.id}
        notification={notification}
        onDismiss={onDismiss}
      />
    ))}
  </div>
);

export type {
  NotificationSeverity,
  NotificationPosition,
  NotificationAction,
  NotificationOptions,
  NotificationInput,
  NotificationItem,
  NotificationProviderProps,
};
export {
  Notification,
  NotificationViewport,
  type NotificationProps,
  type NotificationViewportProps,
};
export { NotificationProvider } from "./notification-provider";

export { useNotification } from "./use-notification";
