import { describe, expect, it } from "vitest";
import {
  createNotificationId,
  normalizeNotification,
} from "./notification.utils";

describe("createNotificationId", () => {
  it("creates a unique notification ID", () => {
    const firstId = createNotificationId();
    const secondId = createNotificationId();

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it("returns a string", () => {
    expect(typeof createNotificationId()).toBe("string");
  });
});

describe("normalizeNotification", () => {
  it("applies the default notification values", () => {
    const notification = normalizeNotification({
      title: "Notification title",
    });

    expect(notification).toMatchObject({
      title: "Notification title",
      severity: "info",
    });

    expect(notification.id).toBeTruthy();
  });

  it.each(["success", "info", "warning", "error"] as const)(
    "preserves the %s severity",
    (severity) => {
      const notification = normalizeNotification({
        title: "Notification title",
        severity,
      });

      expect(notification.severity).toBe(severity);
    },
  );

  it("preserves the supplied notification ID", () => {
    const notification = normalizeNotification({
      id: "custom-notification-id",
      title: "Notification title",
    });

    expect(notification.id).toBe("custom-notification-id");
  });

  it("preserves the supplied duration", () => {
    const notification = normalizeNotification({
      title: "Notification title",
      duration: 5000,
    });

    expect(notification.duration).toBe(5000);
  });

  it("preserves a zero duration instead of applying the default duration", () => {
    const notification = normalizeNotification(
      {
        title: "Notification title",
        duration: 0,
      },
      "info",
      { duration: 5000 },
    );

    expect(notification.duration).toBe(0);
  });

  it("preserves the notification action", () => {
    const action = {
      label: "Undo",
      onClick: () => undefined,
    };

    const notification = normalizeNotification({
      title: "Notification title",
      action,
    });

    expect(notification.action).toBe(action);
  });
});
