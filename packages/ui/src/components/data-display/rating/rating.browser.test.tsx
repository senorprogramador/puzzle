import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it } from "vitest";

import { userEvent as browserUserEvent } from "vitest/browser";

import { Rating } from "./index";

afterEach(() => {
  cleanup();
});

describe("Rating (browser)", () => {
  it("supports keyboard focus and navigation", async () => {
    render(
      <>
        <button type="button">Before</button>

        <Rating defaultValue={2} />

        <button type="button">After</button>
      </>,
    );

    const user = userEvent.setup();

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    const rating = screen.getByRole("slider");

    expect(rating).toHaveFocus();

    await browserUserEvent.keyboard("{ArrowRight}");

    expect(rating).toHaveAttribute("aria-valuenow", "2.5");

    await browserUserEvent.keyboard("{End}");

    expect(rating).toHaveAttribute("aria-valuenow", "5");

    await browserUserEvent.keyboard("{Home}");

    expect(rating).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports reverse tab navigation", async () => {
    render(
      <>
        <button type="button">Before</button>

        <Rating />

        <button type="button">After</button>
      </>,
    );

    const after = screen.getByRole("button", {
      name: "After",
    });

    after.focus();

    await browserUserEvent.keyboard("{Shift>}{Tab}{/Shift}");

    expect(screen.getByRole("slider")).toHaveFocus();
  });

  it("does not enter the tab order when disabled or read-only", async () => {
    render(
      <>
        <button type="button">Before</button>

        <Rating disabled />

        <Rating value={3} readOnly />

        <button type="button">After</button>
      </>,
    );

    const user = userEvent.setup();

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("shows a visible focus indicator", async () => {
    render(<Rating />);

    const rating = screen.getByRole("slider");
    rating.style.setProperty("--puzzle-color-ring", "rgb(12, 34, 56)");

    await browserUserEvent.tab();

    expect(rating).toHaveFocus();

    expect(getComputedStyle(rating).outlineStyle).toBe("solid");
    expect(getComputedStyle(rating).outlineWidth).toBe("2px");
    expect(getComputedStyle(rating).outlineColor).toBe("rgb(12, 34, 56)");
  });

  it("supports pointer input", async () => {
    render(<Rating />);

    const rating = screen.getByRole("slider");

    const star = rating.querySelectorAll<HTMLElement>(
      ".puzzle-rating__star",
    )[3]!;

    await browserUserEvent.click(star);

    expect(rating).toHaveAttribute("aria-valuenow", "4");
  });
});
