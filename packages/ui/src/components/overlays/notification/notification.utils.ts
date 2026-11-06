import type {
  NotificationInput,
  NotificationItem,
  NotificationOptions,
  NotificationSeverity,
} from "./notification.types";

let notificationId = 0;

const createNotificationId = (): string => {
  notificationId += 1;

  return `puzzle-notification-${notificationId}`;
};

const normalizeNotification = (
  input: NotificationInput,
  severity: NotificationSeverity = "info",
  defaults?: Pick<NotificationOptions, "duration">,
): NotificationItem => {
  const options: NotificationOptions =
    typeof input === "string" ? { title: input, severity } : input;

  return {
    ...options,
    id: options.id ?? createNotificationId(),
    severity: options.severity ?? severity,
    closable: options.closable ?? true,
    duration: options.duration ?? defaults?.duration,
  };
};

export { createNotificationId, normalizeNotification };
