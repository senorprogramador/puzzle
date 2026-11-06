"use client";

import { createContext, useCallback, useMemo, useState } from "react";

import { Portal } from "../portal";
import { NotificationViewport } from ".";
import { normalizeNotification } from "./notification.utils";

import type {
  NotificationContextValue,
  NotificationItem,
  NotificationOptions,
  NotificationProviderProps,
  NotificationSeverity,
} from "./notification.types";

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const NotificationProvider = ({
  children,
  position = "bottom-right",
  maxNotifications = 5,
  defaultDuration = 5000,
  label = "Notifications",
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showWithSeverity = useCallback(
    (
      severity: NotificationSeverity,
      message: string,
      options?: NotificationOptions,
    ) => {
      const item = normalizeNotification(
        {
          ...options,
          title: message,
          severity,
        },
        severity,
        { duration: defaultDuration },
      );

      setNotifications((current) => {
        const existing = current.filter(
          (notification) => notification.id !== item.id,
        );

        return [...existing, item].slice(-Math.max(1, maxNotifications));
      });

      return item.id;
    },
    [defaultDuration, maxNotifications],
  );

  const show = useCallback(
    (input: string | NotificationOptions) => {
      const item = normalizeNotification(input, "info", {
        duration: defaultDuration,
      });

      setNotifications((current) => {
        const existing = current.filter(
          (notification) => notification.id !== item.id,
        );

        return [...existing, item].slice(-Math.max(1, maxNotifications));
      });

      return item.id;
    },
    [defaultDuration, maxNotifications],
  );

  const success = useCallback(
    (message: string, options?: NotificationOptions) =>
      showWithSeverity("success", message, options),
    [showWithSeverity],
  );

  const info = useCallback(
    (message: string, options?: NotificationOptions) =>
      showWithSeverity("info", message, options),
    [showWithSeverity],
  );

  const warning = useCallback(
    (message: string, options?: NotificationOptions) =>
      showWithSeverity("warning", message, options),
    [showWithSeverity],
  );

  const error = useCallback(
    (message: string, options?: NotificationOptions) =>
      showWithSeverity("error", message, options),
    [showWithSeverity],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      show,
      success,
      info,
      warning,
      error,
      dismiss,
      dismissAll,
    }),
    [show, success, info, warning, error, dismiss, dismissAll],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <Portal>
        <NotificationViewport
          notifications={notifications}
          position={position}
          label={label}
          onDismiss={dismiss}
        />
      </Portal>
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
