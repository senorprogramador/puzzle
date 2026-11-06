import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it } from "vitest";

import { FormField } from "../form-field";
import { Slider } from "./index";

afterEach(() => {
  cleanup();
});

describe("Slider (browser)", () => {
  it("focuses the control when its associated label is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FormField label="Volume">
        <Slider />
      </FormField>,
    );

    await user.click(screen.getByText("Volume"));

    expect(screen.getByRole("slider")).toHaveFocus();
  });

  it("supports native keyboard interaction", async () => {
    const user = userEvent.setup();

    render(<Slider aria-label="Volume" min={0} max={10} defaultValue={5} />);

    const slider = screen.getByRole("slider");

    await user.tab();

    expect(slider).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    expect(slider).toHaveValue("6");

    await user.keyboard("{ArrowLeft}");

    expect(slider).toHaveValue("5");
  });

  it("does not receive keyboard focus when disabled", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <Slider aria-label="Volume" disabled />

        <button type="button">After</button>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("keeps its native form label accessible", () => {
    render(
      <FormField label="Brightness" description="Adjust the screen brightness.">
        <Slider />
      </FormField>,
    );

    const slider = screen.getByRole("slider", {
      name: "Brightness",
    });

    expect(slider).toHaveAccessibleDescription("Adjust the screen brightness.");
  });
});
