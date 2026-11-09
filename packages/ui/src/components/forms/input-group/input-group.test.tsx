import { createRef } from "react";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "../../actions/button";
import { TextInput } from "../input";

import { InputGroup } from "./index";

afterEach(() => {
  cleanup();
});

describe("InputGroup", () => {
  it("renders the existing TextInput", () => {
    render(
      <InputGroup>
        <TextInput aria-label="Website" placeholder="example.com" />
      </InputGroup>,
    );

    expect(
      screen.getByRole("textbox", { name: "Website" }),
    ).toBeInTheDocument();
  });

  it("renders addons with start alignment by default", () => {
    render(
      <InputGroup>
        <TextInput aria-label="Website" />
        <InputGroup.Addon data-testid="start-addon">https://</InputGroup.Addon>
      </InputGroup>,
    );

    expect(screen.getByTestId("start-addon")).toHaveAttribute(
      "data-align",
      "start",
    );
  });

  it("supports end alignment", () => {
    render(
      <InputGroup>
        <TextInput aria-label="Website" />
        <InputGroup.Addon align="end" data-testid="end-addon">
          .com
        </InputGroup.Addon>
      </InputGroup>,
    );

    expect(screen.getByTestId("end-addon")).toHaveAttribute(
      "data-align",
      "end",
    );
  });

  it("supports multiple addons", () => {
    render(
      <InputGroup>
        <TextInput aria-label="Website" />
        <InputGroup.Addon>https://</InputGroup.Addon>
        <InputGroup.Addon align="end">.com</InputGroup.Addon>
      </InputGroup>,
    );

    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(screen.getByText(".com")).toBeInTheDocument();
  });

  it("supports interactive components inside addons", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <InputGroup>
        <TextInput aria-label="Search term" />

        <InputGroup.Addon align="end">
          <Button size="sm" variant="ghost" onClick={onClick}>
            Search
          </Button>
        </InputGroup.Addon>
      </InputGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards native div properties and refs", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <InputGroup ref={ref} data-testid="input-group">
        <TextInput aria-label="Website" />
      </InputGroup>,
    );

    expect(ref.current).toBe(screen.getByTestId("input-group"));
  });

  it("forwards custom addon properties", () => {
    render(
      <InputGroup>
        <TextInput aria-label="Website" />

        <InputGroup.Addon
          align="end"
          className="custom-addon"
          data-testid="custom-addon"
        >
          .com
        </InputGroup.Addon>
      </InputGroup>,
    );

    const addon = screen.getByTestId("custom-addon");

    expect(addon).toHaveClass("puzzle-input-group__addon");
    expect(addon).toHaveClass("custom-addon");
    expect(addon).toHaveAttribute("data-align", "end");
  });
});
