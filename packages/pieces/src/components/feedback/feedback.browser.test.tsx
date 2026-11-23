import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NotificationList } from ".";
import { ConfirmAction } from "./confirm-action";

describe("NotificationList (browser)", () => {
  it("wraps long notification titles in a narrow row and names dismiss actions", () => {
    const longTitle =
      "AReallyLongUnbrokenNotificationTitleThatMustWrapWithoutEscapingItsRow";
    render(
      <div style={{ width: 280 }}>
        <NotificationList
          items={[
            {
              id: "notice-1",
              title: longTitle,
              href: "/notifications/notice-1",
              unread: true,
              onDismiss: () => {},
            },
          ]}
        />
      </div>,
    );

    const link = screen.getByRole("link", { name: longTitle });
    const content = link.closest<HTMLElement>(
      ".puzzle-notification-item__content",
    );
    const row = link.closest<HTMLElement>("li");
    if (!content || !row) {
      throw new Error("Expected the notification link to belong to a row.");
    }

    expect(link.getBoundingClientRect().height).toBeGreaterThan(20);
    expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
    expect(row.getBoundingClientRect().width).toBeLessThanOrEqual(280);
    expect(
      screen.getByRole("button", {
        name: /AReallyLongUnbrokenNotificationTitle.*Unread.*Dismiss notification/,
      }),
    ).toBeVisible();
  });
});

describe("ConfirmAction (browser)", () => {
  it("uses alert dialog semantics and preserves focus during async confirmation", async () => {
    const user = userEvent.setup();
    let resolveConfirm!: () => void;
    let confirmCalls = 0;

    render(
      <ConfirmAction
        triggerLabel="Delete project"
        title="Delete this project?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() =>
          {
            confirmCalls += 1;
            return new Promise<void>((resolve) => {
              resolveConfirm = resolve;
            });
          }
        }
      />,
    );

    const trigger = screen.getByRole("button", { name: "Delete project" });
    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this project?",
    });
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveFocus();

    const confirm = screen.getByRole("button", { name: "Delete" });
    confirm.focus();
    await user.keyboard("{Enter}");

    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(confirm).toHaveFocus();

    const backdrop = document.querySelector(".puzzle-backdrop");
    if (!backdrop) {
      throw new Error("Expected the confirmation backdrop to be mounted.");
    }
    await user.click(backdrop);
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });

    await user.keyboard("{Enter}");
    expect(confirmCalls).toBe(1);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });

    await act(async () => {
      resolveConfirm();
    });

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
