import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Stepper } from "./index";

const renderSteps = (props: Partial<React.ComponentProps<typeof Stepper>> = {}) =>
  render(
    <Stepper {...props}>
      <Stepper.Step id="details" label="Details" />
      <Stepper.Step id="shipping" label="Shipping" />
      <Stepper.Step id="payment" label="Payment" />
    </Stepper>,
  );

describe("Stepper", () => {
  it("preserves ID-based active selection when steps are reordered", () => {
    const { rerender } = render(
      <Stepper activeStepId="shipping">
        <Stepper.Step id="details" label="Details" />
        <Stepper.Step id="shipping" label="Shipping" />
        <Stepper.Step id="payment" label="Payment" />
      </Stepper>,
    );

    expect(screen.getByText("Shipping").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );

    rerender(
      <Stepper activeStepId="shipping">
        <Stepper.Step id="payment" label="Payment" />
        <Stepper.Step id="shipping" label="Shipping" />
        <Stepper.Step id="details" label="Details" />
      </Stepper>,
    );

    expect(screen.getByText("Shipping").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("moves focus between selectable steps with arrow keys", async () => {
    const user = userEvent.setup();

    renderSteps({ clickable: true, linear: false });

    const details = screen.getByRole("button", { name: /details/i });
    const shipping = screen.getByRole("button", { name: /shipping/i });

    expect(details).toHaveAttribute("tabindex", "0");
    expect(shipping).toHaveAttribute("tabindex", "-1");

    details.focus();
    await user.keyboard("{ArrowRight}");

    expect(shipping).toHaveFocus();
    expect(shipping).toHaveAttribute("tabindex", "0");
  });

  it("keeps an out-of-range active index on the last available step", () => {
    renderSteps({ activeStep: 10 });

    expect(screen.getByText("Payment").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("rejects an active step ID that does not exist", () => {
    expect(() =>
      render(
        <Stepper activeStepId="missing">
          <Stepper.Step id="details" label="Details" />
        </Stepper>,
      ),
    ).toThrow("Stepper activeStepId must match an available step ID.");
  });

  it("reports ID selection while retaining the index callback", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    const onStepIdChange = vi.fn();

    render(
      <Stepper
        defaultActiveStepId="shipping"
        clickable
        onStepChange={onStepChange}
        onStepIdChange={onStepIdChange}
      >
        <Stepper.Step id="details" label="Details" />
        <Stepper.Step id="shipping" label="Shipping" />
        <Stepper.Step id="payment" label="Payment" />
      </Stepper>,
    );

    await user.click(screen.getByRole("button", { name: /details/i }));

    expect(onStepChange).toHaveBeenCalledWith(0);
    expect(onStepIdChange).toHaveBeenCalledWith("details");
    expect(screen.getByText("Details").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("renders steps as an ordered list", () => {
    renderSteps();

    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("starts on the first step by default", () => {
    renderSteps();

    expect(screen.getByText("Details").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("does not render buttons unless steps are clickable", () => {
    renderSteps();

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("prevents jumping ahead of the active step in linear mode", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    renderSteps({ clickable: true, onStepChange });

    await user.click(screen.getByRole("button", { name: /payment/i }));

    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("allows jumping ahead when linear is off", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    renderSteps({ clickable: true, linear: false, onStepChange });

    await user.click(screen.getByRole("button", { name: /payment/i }));

    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it("does not select disabled steps", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <Stepper clickable linear={false} onStepChange={onStepChange}>
        <Stepper.Step id="a" label="A" />
        <Stepper.Step id="b" label="B" disabled />
      </Stepper>,
    );

    await user.click(screen.getByRole("button", { name: /^B/ }));

    expect(onStepChange).not.toHaveBeenCalled();
  });
});
