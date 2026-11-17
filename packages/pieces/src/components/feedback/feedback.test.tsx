import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmAction } from "./confirm-action";
import {
  ErrorStatePanel,
  NotificationItem,
  NotificationList,
} from ".";

describe("NotificationItem", () => {
  it("renders linked notification content and dismiss action", () => {
    const onDismiss = vi.fn();
    render(
      <ul>
        <NotificationItem
          id="notice-1"
          title="Task assigned"
          description="You were assigned a task."
          timestamp="Today"
          dateTime="2026-11-16"
          href="/tasks/one"
          unread
          onDismiss={onDismiss}
        />
      </ul>,
    );

    expect(screen.getByRole("link", { name: "Task assigned" })).toHaveAttribute(
      "href",
      "/tasks/one",
    );
    expect(screen.getByText("Today").closest("time")).toHaveAttribute(
      "dateTime",
      "2026-11-16",
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe("NotificationList", () => {
  it("renders its empty state and item collection", () => {
    const { rerender } = render(<NotificationList items={[]} />);

    expect(screen.getByText("No notifications.")).toBeVisible();
    rerender(
      <NotificationList
        items={[
          {
            id: "notice-1",
            title: "Invitation accepted",
          },
        ]}
      />,
    );

    expect(screen.getByRole("region", { name: "Notifications" })).toBeVisible();
    expect(screen.getByText("Invitation accepted")).toBeVisible();
  });
});

describe("ConfirmAction", () => {
  it("asks for confirmation before invoking the action", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmAction
        triggerLabel="Delete project"
        title="Delete this project?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="secondary"
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete project" }));
    expect(screen.getByRole("dialog", { name: "Delete this project?" })).toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Delete", hidden: true }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

describe("ErrorStatePanel", () => {
  it("uses the Puzzle alert and supports recovery actions", () => {
    render(
      <ErrorStatePanel
        title="Unable to load projects"
        description="Try again in a moment."
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load projects");
    expect(screen.getByRole("button", { name: "Retry" })).toBeVisible();
  });
});
