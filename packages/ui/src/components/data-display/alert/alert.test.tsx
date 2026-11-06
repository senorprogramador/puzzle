import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Alert } from "./index";

afterEach(() => {
  cleanup();
});

describe("Alert", () => {
  it("renders its children", () => {
    render(<Alert>Something happened</Alert>);

    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders an optional title", () => {
    render(<Alert title="Heads up">Additional information</Alert>);

    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Additional information")).toBeInTheDocument();
  });

  it("uses status semantics for info by default", () => {
    render(<Alert>Information</Alert>);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it.each(["warning", "error"] as const)(
    "uses assertive alert semantics for %s severity",
    (severity) => {
      render(<Alert severity={severity}>Important message</Alert>);

      expect(screen.getByRole("alert")).toHaveAttribute(
        "aria-live",
        "assertive",
      );
    },
  );

  it.each(["success", "info"] as const)(
    "uses polite status semantics for %s severity",
    (severity) => {
      render(<Alert severity={severity}>Message</Alert>);

      expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    },
  );

  it.each(["standard", "outlined", "filled"] as const)(
    "supports the %s variant",
    (variant) => {
      render(
        <Alert variant={variant} data-testid="alert">
          Message
        </Alert>,
      );

      expect(screen.getByTestId("alert")).toBeInTheDocument();
    },
  );

  it("renders a custom icon", () => {
    render(
      <Alert icon={<span data-testid="custom-icon">!</span>}>Message</Alert>,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render an icon when icon is false", () => {
    render(
      <Alert icon={false} data-testid="alert">
        Message
      </Alert>,
    );

    expect(screen.getByTestId("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
  });

  it("renders a close button when closable", () => {
    render(<Alert closable>Message</Alert>);

    expect(
      screen.getByRole("button", { name: "Dismiss alert" }),
    ).toBeInTheDocument();
  });

  it("supports a custom close label", () => {
    render(
      <Alert closable closeLabel="Close message">
        Message
      </Alert>,
    );

    expect(
      screen.getByRole("button", { name: "Close message" }),
    ).toBeInTheDocument();
  });

  it("does not render a close button when not closable", () => {
    render(<Alert>Message</Alert>);

    expect(
      screen.queryByRole("button", { name: "Dismiss alert" }),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Alert closable onClose={onClose}>
        Message
      </Alert>,
    );

    await user.click(screen.getByRole("button", { name: "Dismiss alert" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("dismisses itself after closing", async () => {
    const user = userEvent.setup();

    render(<Alert closable>Dismissible message</Alert>);

    await user.click(screen.getByRole("button", { name: "Dismiss alert" }));

    expect(screen.queryByText("Dismissible message")).not.toBeInTheDocument();
  });

  it("passes through div props", () => {
    render(
      <Alert data-testid="alert" id="custom-alert" className="custom-class">
        Message
      </Alert>,
    );

    const alert = screen.getByTestId("alert");

    expect(alert).toHaveAttribute("id", "custom-alert");
    expect(alert).toHaveClass("custom-class");
  });
});
