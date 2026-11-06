import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
