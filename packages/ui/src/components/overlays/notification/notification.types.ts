import type { ReactNode } from "react";

type NotificationSeverity = "success" | "info" | "warning" | "error";

type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type NotificationAction = {
  label: string;
  onClick: () => void;
};

type NotificationOptions = {
  /** Optional unique ID. Reusing an ID replaces the existing notification. */
  id?: string;
  severity?: NotificationSeverity;
  title?: ReactNode;
  description?: ReactNode;
  /** Duration in milliseconds. Set to 0 to disable auto-dismiss. */
  duration?: number;
  action?: NotificationAction;
  closable?: boolean;
};

type NotificationInput = string | NotificationOptions;

type NotificationItem = NotificationOptions & {
  id: string;
  severity: NotificationSeverity;
  closable: boolean;
};

type NotificationProviderProps = {
  children: ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
  defaultDuration?: number;
  label?: string;
};

type NotificationContextValue = {
  show: (notification: NotificationInput) => string;
  success: (
    message: string,
    options?: Omit<NotificationOptions, "severity" | "title" | "description">,
  ) => string;
  info: (
    message: string,
    options?: Omit<NotificationOptions, "severity" | "title" | "description">,
  ) => string;
  warning: (
    message: string,
    options?: Omit<NotificationOptions, "severity" | "title" | "description">,
  ) => string;
  error: (
    message: string,
    options?: Omit<NotificationOptions, "severity" | "title" | "description">,
  ) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

export type {
  NotificationSeverity,
  NotificationPosition,
  NotificationAction,
  NotificationOptions,
  NotificationInput,
  NotificationItem,
  NotificationProviderProps,
  NotificationContextValue,
};
