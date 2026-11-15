import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { ButtonGroup } from "./index";
import { Button } from "../button";

describe("ButtonGroup", () => {
  it("preserves child refs and individual disabled states when the group is re-enabled", () => {
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <ButtonGroup disabled><Button ref={ref}>Save</Button><Button disabled>Unavailable</Button></ButtonGroup>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();

    rerender(<ButtonGroup><Button ref={ref}>Save</Button><Button disabled>Unavailable</Button></ButtonGroup>);

    expect(ref.current).toBe(button);
    expect(button).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-disabled");
  });

  it("preserves polymorphic refs, explicit roles, labels and styles alongside spacing", () => {
    const ref = createRef<HTMLElement>();
    render(
      <>
        <h2 id="editing">Editing actions</h2>
        <ButtonGroup as="section" ref={ref} role="toolbar" aria-labelledby="editing"
          style={{ margin: "2px" }} spacing="var(--puzzle-space-2)">
          <Button>Save</Button>
        </ButtonGroup>
      </>,
    );
    const group = screen.getByRole("toolbar", { name: "Editing actions" });

    expect(ref.current).toBe(group);
    expect(group.tagName).toBe("SECTION");
    expect(group.style.margin).toBe("2px");
    expect(group.style.getPropertyValue("--puzzle-button-group-gap")).toBe("var(--puzzle-space-2)");
  });

  it("prevents disabled native and link actions from calling their handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ButtonGroup disabled>
        <Button onClick={onClick}>Save</Button>
        <Button href="#cancel" onClick={onClick}>Cancel</Button>
      </ButtonGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(screen.getByRole("link", { name: "Cancel" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("retains non-element children when disabled", () => {
    render(<ButtonGroup disabled aria-label="Actions">Available actions:{null}{false}<Button>Save</Button></ButtonGroup>);

    expect(screen.getByRole("group", { name: "Actions" })).toHaveTextContent("Available actions:Save");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

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

  it("disables its buttons when the group is disabled", () => {
    render(
      <ButtonGroup disabled>
        <Button>Save</Button>
        <Button href="/x">Open</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
