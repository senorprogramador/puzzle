import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NotificationProvider } from "./notification-provider";
import { useNotification } from "./use-notification";

afterEach(() => {
  cleanup();
});

const NotificationTest = () => {
  const notification = useNotification();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Test notification",
            description: "Notification description",
          })
        }
      >
        Show notification
      </button>

      <button
        type="button"
        onClick={() =>
          notification.success("Success notification")
        }
      >
        Show success
      </button>

      <button
        type="button"
        onClick={() =>
          notification.error("Error notification")
        }
      >
        Show error
      </button>

      <button
        type="button"
        onClick={() =>
          notification.show({
            id: "replaceable",
            title: "Original notification",
          })
        }
      >
        Show original
      </button>

      <button
        type="button"
        onClick={() =>
          notification.show({
            id: "replaceable",
            title: "Updated notification",
          })
        }
      >
        Replace notification
      </button>

      <button type="button" onClick={() => notification.dismissAll()}>
        Dismiss all
      </button>
    </div>
  );
};

const renderNotifications = (
  ui: React.ReactNode = <NotificationTest />,
  providerProps: Omit<
    React.ComponentProps<typeof NotificationProvider>,
    "children"
  > = {},
) =>
  render(<NotificationProvider {...providerProps}>{ui}</NotificationProvider>);

describe("NotificationProvider", () => {
  it("renders its children", () => {
    renderNotifications();

    expect(
      screen.getByRole("button", { name: "Show notification" }),
    ).toBeInTheDocument();
  });

  it("renders a notification when show is called", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show notification" }));

    expect(await screen.findByText("Test notification")).toBeInTheDocument();

    expect(screen.getByText("Notification description")).toBeInTheDocument();
  });

  it("renders success notifications", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show success" }));

    expect(await screen.findByText("Success notification")).toBeInTheDocument();
  });

  it("renders error notifications", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show error" }));

    expect(await screen.findByText("Error notification")).toBeInTheDocument();
  });

  it("uses the correct live region semantics for an error", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show error" }));

    const notification = await screen.findByRole("alert");

    expect(notification).toHaveAttribute("aria-live", "assertive");
    expect(notification).toHaveAttribute("aria-atomic", "true");
  });

  it("uses polite live region semantics for non-error notifications", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show success" }));

    const notification = await screen.findByRole("status");

    expect(notification).toHaveAttribute("aria-live", "polite");
    expect(notification).toHaveAttribute("aria-atomic", "true");
  });

  it("replaces an existing notification with the same ID", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show original" }));

    expect(
      await screen.findByText("Original notification"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Replace notification" }),
    );

    expect(await screen.findByText("Updated notification")).toBeInTheDocument();

    expect(screen.queryByText("Original notification")).not.toBeInTheDocument();
  });

  it("dismisses an individual notification", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show success" }));

    const notification = await screen.findByText("Success notification");
    const container = notification.closest('[role="status"]');

    expect(container).not.toBeNull();

    await user.click(within(container as HTMLElement).getByRole("button"));

    await waitFor(() => {
      expect(
        screen.queryByText("Success notification"),
      ).not.toBeInTheDocument();
    });
  });

  it("dismisses all notifications", async () => {
    const user = userEvent.setup();

    renderNotifications();

    await user.click(screen.getByRole("button", { name: "Show success" }));
    await user.click(screen.getByRole("button", { name: "Show error" }));

    expect(await screen.findByText("Success notification")).toBeInTheDocument();

    expect(screen.getByText("Error notification")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss all" }));

    await waitFor(() => {
      expect(screen.queryByText("Success notification")).toBeNull();
      expect(screen.queryByText("Error notification")).toBeNull();
    });
  });

  it("calls the notification action callback", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    const ActionTest = () => {
      const notification = useNotification();

      return (
        <button
          type="button"
          onClick={() =>
            notification.show({
              title: "Action notification",
              action: {
                label: "Undo",
                onClick: onAction,
              },
            })
          }
        >
          Show action
        </button>
      );
    };

    renderNotifications(<ActionTest />);

    await user.click(screen.getByRole("button", { name: "Show action" }));

    await user.click(await screen.findByRole("button", { name: "Undo" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("keeps persistent notifications visible", async () => {
    vi.useFakeTimers();

    const PersistentTest = () => {
      const notification = useNotification();

      return (
        <button
          type="button"
          onClick={() =>
            notification.show({
              title: "Persistent notification",
              duration: 0,
            })
          }
        >
          Show persistent
        </button>
      );
    };

    try {
      renderNotifications(<PersistentTest />);

      fireEvent.click(screen.getByRole("button", { name: "Show persistent" }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10_000);
      });

      expect(
        screen.getByText("Persistent notification"),
      ).toBeInTheDocument();
    } finally {
      cleanup();
      vi.useRealTimers();
    }
  });

  it("throws when useNotification is used outside its provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const InvalidTest = () => {
      useNotification();

      return null;
    };

    expect(() => render(<InvalidTest />)).toThrow();

    consoleError.mockRestore();
  });
});
