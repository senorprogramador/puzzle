import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { NotificationProvider } from "./notification-provider";
import { useNotification } from "./use-notification";

afterEach(() => {
  cleanup();
});

const BrowserTest = () => {
  const notification = useNotification();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Browser notification",
            description: "Browser notification description",
            duration: 0,
          })
        }
      >
        Show notification
      </button>

      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Timed notification",
            duration: 1000,
          })
        }
      >
        Show timed notification
      </button>

      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Error notification",
            severity: "error",
            duration: 0,
          })
        }
      >
        Show error
      </button>
    </div>
  );
};

const renderBrowserNotifications = () =>
  render(
    <NotificationProvider>
      <BrowserTest />
    </NotificationProvider>,
  );

describe("Notification browser behavior", () => {
  it("supports keyboard navigation to the notification close button", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    const notification = await screen.findByText("Browser notification");
    const container = notification.closest('[role="status"]');

    expect(container).not.toBeNull();

    const closeButton = within(container as HTMLElement).getByRole("button");

    await user.tab();

    expect(
      screen.getByRole("button", { name: "Show timed notification" }),
    ).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "Show error" })).toHaveFocus();

    await user.tab();

    expect(closeButton).toHaveFocus();
  });

  it("dismisses a notification with Enter", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    const notification = await screen.findByText("Browser notification");
    const container = notification.closest('[role="status"]');

    const closeButton = within(container as HTMLElement).getByRole("button");

    closeButton.focus();

    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(
        screen.queryByText("Browser notification"),
      ).not.toBeInTheDocument();
    });
  });

  it("dismisses a notification with Space", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    const notification = await screen.findByText("Browser notification");
    const container = notification.closest('[role="status"]');

    const closeButton = within(container as HTMLElement).getByRole("button");

    closeButton.focus();

    await user.keyboard(" ");

    await waitFor(() => {
      expect(
        screen.queryByText("Browser notification"),
      ).not.toBeInTheDocument();
    });
  });

  it("exposes error notifications as assertive alerts", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show error" }));

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveAttribute("aria-atomic", "true");
  });

  it("exposes non-error notifications as polite status messages", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    const status = await screen.findByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("does not make decorative notification content focusable", async () => {
    const user = userEvent.setup();

    renderBrowserNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    const notification = await screen.findByText("Browser notification");
    const container = notification.closest('[role="status"]');

    expect(container).not.toBeNull();

    const focusableElements = container!.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    expect(focusableElements.length).toBe(1);
    expect(focusableElements[0]).toHaveAttribute("type", "button");
  });
});
