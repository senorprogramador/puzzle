import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "./index";

afterEach(() => {
  cleanup();
});

describe("Label", () => {
  it("associates with its control and forwards native label attributes", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Label htmlFor="terms" className="custom-label" title="Terms">
          Accept terms
        </Label>
        <input id="terms" type="checkbox" />
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    const label = screen.getByText("Accept terms").closest("label");

    expect(label).toHaveClass("puzzle-label", "custom-label");
    expect(label).toHaveAttribute("title", "Terms");

    await user.click(screen.getByText("Accept terms"));

    expect(checkbox).toBeChecked();
  });

  it("renders required and optional indicators", () => {
    render(
      <Label required optional>
        Email
      </Label>,
    );

    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });
});
