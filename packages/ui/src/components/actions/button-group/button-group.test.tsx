import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonGroup } from "./index";
import { Button } from "../button";

describe("ButtonGroup", () => {
  it("renders children", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
  });

  it("renders with group semantics", () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>Save</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group", { name: "Actions" })).toBeInTheDocument();
  });

  it("supports custom element types", () => {
    render(
      <ButtonGroup as="section" aria-label="Actions">
        <Button>Save</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group", { name: "Actions" }).tagName).toBe(
      "SECTION",
    );
  });

  it("supports vertical orientation", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveClass(
      "puzzle-button-group--vertical",
    );
  });

  it("supports attached buttons", () => {
    render(
      <ButtonGroup attached>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveClass(
      "puzzle-button-group--attached",
    );
  });

  it("supports full width", () => {
    render(
      <ButtonGroup fullWidth>
        <Button>One</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveClass(
      "puzzle-button-group--full-width",
    );
  });

  it("supports disabled semantics", () => {
    render(
      <ButtonGroup disabled>
        <Button disabled>Save</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not override child click handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ButtonGroup>
        <Button onClick={onClick}>Save</Button>
      </ButtonGroup>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports spacing as a number", () => {
    render(
      <ButtonGroup spacing={8}>
        <Button>One</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveStyle(
      "--puzzle-button-group-gap: 8px",
    );
  });

  it("supports spacing as a CSS value", () => {
    render(
      <ButtonGroup spacing="1rem">
        <Button>One</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveStyle(
      "--puzzle-button-group-gap: 1rem",
    );
  });

  it("supports custom class names", () => {
    render(
      <ButtonGroup className="custom-group">
        <Button>One</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveClass("custom-group");
  });

  it("does not change child button variants", () => {
    render(
      <ButtonGroup>
        <Button variant="danger">Delete</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("button")).toHaveClass("puzzle-button--danger");
  });

  it("supports links as children", () => {
    render(
      <ButtonGroup>
        <Button href="/dashboard">Dashboard</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("supports native buttons and links together", () => {
    render(
      <ButtonGroup>
        <Button>Submit</Button>
        <Button href="/cancel">Cancel</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
  });

  it("does not interfere with keyboard interaction", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ButtonGroup>
        <Button onClick={onClick}>Save</Button>
      </ButtonGroup>,
    );

    const button = screen.getByRole("button");

    button.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
