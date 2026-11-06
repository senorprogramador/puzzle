import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "./index";

afterEach(() => {
  cleanup();
});

describe("Checkbox", () => {
  it("is named by its label and toggles on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Accept terms" onChange={onChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("toggles with the Space key", async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Accept terms" />);

    await user.tab();
    await user.keyboard(" ");

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("links its description with aria-describedby", () => {
    render(<Checkbox label="Newsletter" description="Weekly email" />);

    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
      "Weekly email",
    );
  });

  it("exposes the mixed state through the native indeterminate property", () => {
    render(<Checkbox label="All" indeterminate />);

    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(
      true,
    );
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("does not toggle while disabled", async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Locked" disabled />);
    await user.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("marks required checkboxes and hides the asterisk from assistive technology", () => {
    render(<Checkbox label="Consent" required />);

    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards its ref to the input", () => {
    let node: HTMLInputElement | null = null;

    render(<Checkbox label="Ref" ref={(value) => { node = value; }} />);

    expect(node).toBe(screen.getByRole("checkbox"));
  });
});
