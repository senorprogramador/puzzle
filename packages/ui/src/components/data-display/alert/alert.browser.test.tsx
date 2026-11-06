import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Alert } from "./index";

afterEach(() => {
  cleanup();
});

describe("Alert browser behavior", () => {
  it("allows keyboard users to focus and activate the close button", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before alert</button>

        <Alert closable>Keyboard dismissible alert</Alert>

        <button type="button">After alert</button>
      </>,
    );

    const beforeButton = screen.getByRole("button", {
      name: "Before alert",
    });
    const closeButton = screen.getByRole("button", {
      name: "Dismiss alert",
    });

    beforeButton.focus();

    expect(beforeButton).toHaveFocus();

    await user.tab();

    expect(closeButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(
      screen.queryByText("Keyboard dismissible alert"),
    ).not.toBeInTheDocument();
  });

  it("supports Space activation on the close button", async () => {
    const user = userEvent.setup();

    render(<Alert closable>Space dismissible alert</Alert>);

    const closeButton = screen.getByRole("button", {
      name: "Dismiss alert",
    });

    closeButton.focus();

    await user.keyboard(" ");

    expect(
      screen.queryByText("Space dismissible alert"),
    ).not.toBeInTheDocument();
  });

  it("keeps the alert visible when it is not closable", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Other action</button>
        <Alert>Persistent alert</Alert>
      </>,
    );

    await user.tab();

    expect(screen.getByText("Persistent alert")).toBeInTheDocument();
  });

  it("exposes the correct accessible role in the browser", () => {
    render(<Alert severity="error">Something went wrong</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveAttribute("aria-atomic", "true");
  });

  it("does not create a focusable icon", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">First</button>
        <Alert closable icon={<span>Decorative icon</span>}>
          Alert message
        </Alert>
        <button type="button">Last</button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Dismiss alert" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });
});
