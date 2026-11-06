import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card } from "./index";

afterEach(() => {
  cleanup();
});

describe("Card", () => {
  it("renders an interactive card as a button by default", () => {
    render(<Card interactive>Open</Card>);

    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("type", "button");
  });

  it("renders an interactive card with href as a link", () => {
    render(<Card as="a" interactive href="/x">Open</Card>);

    expect(screen.getByRole("link", { name: "Open" })).toBeTruthy();
  });

  it("keeps a non-interactive card a div", () => {
    render(<Card data-testid="card">Text</Card>);

    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });

  it("does not add button or link semantics to non-interactive cards", () => {
    render(<Card>Text</Card>);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("respects an explicit element for interactive cards", () => {
    render(
      <Card as="a" interactive href="/x">
        Open
      </Card>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("link")).toHaveAttribute("data-interactive");
  });

  it("does not override a custom button type", () => {
    render(
      <Card as="button" interactive type="submit">
        Send
      </Card>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("exposes variant, size and orientation as classes and data attributes", () => {
    render(
      <Card
        data-testid="card"
        variant="filled"
        size="lg"
        orientation="horizontal"
      />,
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveClass(
      "puzzle-card--filled",
      "puzzle-card--lg",
      "puzzle-card--horizontal",
    );
    expect(card).toHaveAttribute("data-variant", "filled");
  });

  it("calls onClick for interactive cards activated with the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Card interactive onClick={onClick}>
        Open
      </Card>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
