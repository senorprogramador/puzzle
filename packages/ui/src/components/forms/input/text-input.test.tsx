import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextInput } from "./text-input";

afterEach(() => {
  cleanup();
});

describe("TextInput", () => {
  it("maps the phone type to a tel input", () => {
    render(<TextInput type="phone" aria-label="Phone" />);

    expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
  });

  it("forwards change events and native attributes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TextInput aria-label="Name" placeholder="Ada" required onChange={onChange} />,
    );

    const input = screen.getByRole("textbox", { name: "Name" });

    await user.type(input, "Hi");

    expect(input).toBeRequired();
    expect(input).toHaveValue("Hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("toggles password visibility with a named pressed button", async () => {
    const user = userEvent.setup();

    render(<TextInput type="password" aria-label="Password" />);

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("disables the control and the password toggle together", () => {
    render(<TextInput type="password" aria-label="Password" disabled />);

    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
  });

  it("hides decorative prefixes from assistive technology", () => {
    const { container } = render(
      <TextInput aria-label="Price" prefix="€" />,
    );

    expect(container.querySelector(".puzzle-input__prefix")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
