import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { TextInput } from "../input";
import { FormField } from "./index";

afterEach(() => {
  cleanup();
});

describe("FormField (browser)", () => {
  it("focuses the control when the label is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FormField label="Email address">
        <TextInput type="email" />
      </FormField>,
    );

    await user.click(screen.getByText("Email address"));

    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("stacks label, control, description and error vertically", () => {
    render(
      <FormField label="Email" description="Help text" error="Bad value">
        <TextInput type="email" />
      </FormField>,
    );

    const tops = [
      screen.getByText("Email"),
      screen.getByRole("textbox"),
      screen.getByText("Help text"),
      screen.getByText("Bad value"),
    ].map((element) => element.getBoundingClientRect().top);

    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    expect(new Set(tops).size).toBe(4);
  });

  it("stretches the control to the field width", () => {
    const { container } = render(
      <div style={{ width: 300 }}>
        <FormField label="Email">
          <TextInput type="email" />
        </FormField>
      </div>,
    );

    const field = container.querySelector(".puzzle-form-field") as HTMLElement;
    const control = container.querySelector(
      ".puzzle-form-field__control",
    ) as HTMLElement;

    expect(control.getBoundingClientRect().width).toBe(
      field.getBoundingClientRect().width,
    );
  });

  it("styles the error and description with their theme tokens", () => {
    render(
      <div
        style={
          {
            "--puzzle-color-danger": "rgb(200, 0, 0)",
            "--puzzle-color-text-muted": "rgb(0, 0, 200)",
          } as React.CSSProperties
        }
      >
        <FormField label="Email" description="Help text" error="Bad value">
          <TextInput type="email" />
        </FormField>
      </div>,
    );

    expect(getComputedStyle(screen.getByText("Bad value")).color).toBe(
      "rgb(200, 0, 0)",
    );
    expect(getComputedStyle(screen.getByText("Help text")).color).toBe(
      "rgb(0, 0, 200)",
    );
  });

  it("shows the not-allowed cursor on a disabled field", () => {
    const { container } = render(
      <FormField label="Email" disabled>
        <TextInput type="email" />
      </FormField>,
    );

    expect(
      getComputedStyle(
        container.querySelector(".puzzle-form-field") as HTMLElement,
      ).cursor,
    ).toBe("not-allowed");
  });

  it("does not move focus into a disabled control", async () => {
    const user = userEvent.setup();

    render(
      <FormField label="Email" disabled>
        <TextInput type="email" />
      </FormField>,
    );

    await user.tab();

    expect(screen.getByRole("textbox")).not.toHaveFocus();
  });
});
