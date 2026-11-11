import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { Checkbox } from "./index";

afterEach(cleanup);

for (const defaultChecked of [false, true]) {
  it(`shows only the check icon when toggled with defaultChecked=${defaultChecked}`, async () => {
    const { container } = render(
      <Checkbox label="Accept terms" defaultChecked={defaultChecked} />,
    );
    const checkbox = screen.getByRole("checkbox");
    const check = container.querySelector(".puzzle-checkbox__check")!;
    const mixed = container.querySelector(".puzzle-checkbox__mixed")!;

    expect(getComputedStyle(check).display).toBe(defaultChecked ? "block" : "none");
    expect(getComputedStyle(mixed).display).toBe("none");

    await userEvent.click(checkbox);

    expect(getComputedStyle(check).display).toBe(defaultChecked ? "none" : "block");
    expect(getComputedStyle(mixed).display).toBe("none");

    await userEvent.click(checkbox);

    expect(getComputedStyle(check).display).toBe(defaultChecked ? "block" : "none");
    expect(getComputedStyle(mixed).display).toBe("none");
  });
}

it("shows only the mixed icon while indeterminate and switches to the check on click", async () => {
  const { container } = render(<Checkbox label="Select all" indeterminate />);
  const check = container.querySelector(".puzzle-checkbox__check")!;
  const mixed = container.querySelector(".puzzle-checkbox__mixed")!;

  expect(getComputedStyle(check).display).toBe("none");
  expect(getComputedStyle(mixed).display).toBe("block");

  await userEvent.click(screen.getByRole("checkbox"));

  expect(getComputedStyle(check).display).toBe("block");
  expect(getComputedStyle(mixed).display).toBe("none");
});
