import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Radio, RadioGroup } from "./index";

const renderGroup = (orientation: "horizontal" | "vertical" = "vertical") =>
  render(
    <>
      <RadioGroup
        label="Choose a plan"
        name="plan"
        orientation={orientation}
        defaultValue="basic"
      >
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Professional" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>

      <button type="button">Next control</button>
    </>,
  );

describe("RadioGroup (browser)", () => {
  it("renders horizontal options in a row", () => {
    renderGroup("horizontal");

    const options = document.querySelector(".puzzle-radio-group__options");

    expect(options).not.toBeNull();

    expect(getComputedStyle(options as HTMLElement).flexDirection).toBe("row");
  });

  it("renders vertical options in a column", () => {
    renderGroup("vertical");

    const options = document.querySelector(".puzzle-radio-group__options");

    expect(options).not.toBeNull();

    expect(getComputedStyle(options as HTMLElement).flexDirection).toBe(
      "column",
    );
  });

  it("shows focus indicator when navigating with Tab", async () => {
    const user = userEvent.setup();

    renderGroup();

    await user.tab();

    const radio = screen.getByRole("radio", {
      name: "Basic",
    });

    expect(radio).toHaveFocus();

    const indicator = radio.nextElementSibling as HTMLElement;

    expect(getComputedStyle(indicator).outlineWidth).toBe("2px");
  });

  it("enters the group on selected radio and leaves with Tab", async () => {
    const user = userEvent.setup();

    renderGroup();

    await user.tab();

    const basic = screen.getByRole("radio", {
      name: "Basic",
    });

    expect(basic).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "Next control" })).toHaveFocus();
  });

  it("moves focus and selection together with arrow keys", async () => {
    const user = userEvent.setup();

    renderGroup();

    await user.tab();

    const pro = screen.getByRole("radio", {
      name: "Professional",
    });

    await user.keyboard("{ArrowDown}");

    expect(pro).toHaveFocus();
    expect(pro).toBeChecked();
  });

  it("selects an option through its complete label hit area", async () => {
    const user = userEvent.setup();

    renderGroup();

    await user.click(screen.getByText("Professional"));

    expect(
      screen.getByRole("radio", {
        name: "Professional",
      }),
    ).toBeChecked();
  });
});
