import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "./index";
import type { AccordionItemData } from "./index";

const items: AccordionItemData[] = [
  { id: "first", title: "First", content: "First content" },
  { id: "second", title: "Second", content: "Second content" },
];

describe("Accordion", () => {
  it("keeps ID-selected items open when the items are reordered", () => {
    const { rerender } = render(
      <Accordion items={items} value="second" type="single" />,
    );

    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    rerender(
      <Accordion items={[...items].reverse()} value="second" type="single" />,
    );

    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("supports uncontrolled ID values and reports ID and index changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Accordion
        items={items}
        defaultValue="first"
        type="single"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(onChange).toHaveBeenCalledWith([1]);
    expect(onValueChange).toHaveBeenCalledWith("second");
  });

  it("closes the open item in single mode when selecting another", async () => {
    const user = userEvent.setup();

    render(<Accordion items={items} defaultValue="first" type="single" />);

    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps several items open in multiple mode", async () => {
    const user = userEvent.setup();

    render(<Accordion items={items} type="multiple" />);

    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("does not open disabled items", async () => {
    const user = userEvent.setup();

    render(
      <Accordion
        type="single"
        items={[{ id: "locked", title: "Locked", content: "x", disabled: true }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Locked" }));

    expect(screen.getByRole("button", { name: "Locked" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();

    render(<Accordion items={items} type="single" />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders triggers inside headings of the requested level", () => {
    render(<Accordion items={items} type="single" headingLevel={4} />);

    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(2);
  });
});
