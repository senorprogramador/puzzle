import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it } from "vitest";

import { Button } from "../../actions/button";
import { TextInput } from "../input";

import { InputGroup } from "./index";

afterEach(() => {
  cleanup();
});

describe("InputGroup (browser)", () => {
  it("visually positions addons around the input", () => {
    render(
      <InputGroup style={{ width: "360px" }}>
        <TextInput aria-label="Website" />

        <InputGroup.Addon>https://</InputGroup.Addon>
        <InputGroup.Addon align="end">.com</InputGroup.Addon>
      </InputGroup>,
    );

    const start = screen.getByText("https://");
    const input = screen.getByRole("textbox").closest(".puzzle-input")!;
    const end = screen.getByText(".com");

    const startRect = start.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    expect(startRect.right).toBeLessThanOrEqual(inputRect.left);
    expect(inputRect.right).toBeLessThanOrEqual(endRect.left);
  });

  it("uses one focus style for the entire group", async () => {
    const user = userEvent.setup();

    render(
      <InputGroup data-testid="input-group">
        <TextInput aria-label="Search term" />

        <InputGroup.Addon align="end">
          <Button size="sm" variant="ghost">
            Search
          </Button>
        </InputGroup.Addon>
      </InputGroup>,
    );

    const group = screen.getByTestId("input-group");
    group.style.setProperty("--puzzle-color-border", "rgb(180, 180, 180)");
    group.style.setProperty("--puzzle-color-ring", "rgb(12, 34, 56)");
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Search" });

    await user.tab();

    expect(input).toHaveFocus();
    await waitFor(() => {
      expect(getComputedStyle(group).borderTopColor).toBe("rgb(12, 34, 56)");
    });

    await user.tab();

    expect(button).toHaveFocus();
    await waitFor(() => {
      expect(getComputedStyle(group).borderTopColor).toBe("rgb(12, 34, 56)");
    });
  });

  it("keeps keyboard focus order independent from visual addon positioning", async () => {
    const user = userEvent.setup();

    render(
      <InputGroup>
        <TextInput aria-label="Search term" />

        <InputGroup.Addon align="start">
          <Button size="sm" variant="ghost">
            Start action
          </Button>
        </InputGroup.Addon>

        <InputGroup.Addon align="end">
          <Button size="sm" variant="ghost">
            End action
          </Button>
        </InputGroup.Addon>
      </InputGroup>,
    );

    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Start action" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "End action" })).toHaveFocus();
  });
});
