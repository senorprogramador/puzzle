import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Select } from "./index";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "date", label: "Date" },
];

// jsdom performs no layout; the popover stays hidden until it has a size.
beforeEach(() => {
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 40,
    width: 100,
    height: 40,
    toJSON: () => ({}),
  } as DOMRect;

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

afterEach(() => {
  cleanup();
});

describe("Select", () => {
  it("renders an accessible combobox trigger", () => {
    render(
      <Select label="Fruit" options={options} placeholder="Choose fruit" />,
    );

    const trigger = screen.getByRole("button", { name: /fruit/i });

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-labelledby");
  });

  it("opens with ArrowDown", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    const trigger = screen.getByRole("button", { name: /fruit/i });

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens with Enter", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard("{Enter}");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("opens with Space", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard(" ");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("moves the active option with ArrowDown", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard("{ArrowDown}");

    const listbox = await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}");

    expect(listbox).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-1"),
    );
  });

  it("skips disabled options during keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard("{ArrowDown}");

    const listbox = await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    expect(listbox).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-3"),
    );
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard("{ArrowDown}");

    const listbox = await screen.findByRole("listbox");

    await user.keyboard("{End}");

    expect(listbox).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-3"),
    );

    await user.keyboard("{Home}");

    expect(listbox).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-0"),
    );
  });

  it("supports typeahead navigation", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    screen.getByRole("button", { name: /fruit/i }).focus();

    await user.keyboard("d");

    const listbox = await screen.findByRole("listbox");

    expect(listbox).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-3"),
    );
  });

  it("selects an option and closes the listbox", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select label="Fruit" options={options} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /fruit/i }));

    await user.click(await screen.findByRole("option", { name: "Banana" }));

    expect(onChange).toHaveBeenCalledWith("banana");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        label="Fruit"
        options={options}
        onChange={onChange}
        defaultOpen
      />,
    );

    await user.click(await screen.findByRole("option", { name: "Cherry" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} />);

    const trigger = screen.getByRole("button", { name: /fruit/i });

    await user.click(trigger);

    const listbox = await screen.findByRole("listbox");

    expect(listbox).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select label="Fruit" multiple options={options} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: /fruit/i }));

    const listbox = await screen.findByRole("listbox");

    expect(listbox).toHaveAttribute("aria-multiselectable", "true");

    await user.click(screen.getByRole("option", { name: "Apple" }));

    expect(onChange).toHaveBeenLastCalledWith(["apple"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("respects maxSelected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        label="Fruit"
        multiple
        maxSelected={1}
        defaultValue={["apple"]}
        options={options}
        onChange={onChange}
        defaultOpen
      />,
    );

    await user.click(await screen.findByRole("option", { name: "Banana" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();

    render(<Select label="Fruit" options={options} disabled />);

    const trigger = screen.getByRole("button", { name: /fruit/i });

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports clearing a selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        label="Fruit"
        options={options}
        defaultValue="apple"
        clearable
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("associates its description and error with the trigger", () => {
    render(
      <Select
        label="Fruit"
        options={options}
        description="Choose one fruit"
        error="A fruit is required"
      />,
    );

    const trigger = screen.getByRole("button", { name: /fruit/i });

    expect(trigger).toHaveAttribute("aria-describedby");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });
});
