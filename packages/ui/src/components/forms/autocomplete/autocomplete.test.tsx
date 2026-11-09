import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FormField } from "../form-field";
import { Autocomplete } from "./index";

const options = [
  { value: "apple", label: "Apple", group: "Fruit" },
  { value: "banana", label: "Banana", group: "Fruit" },
  { value: "cherry", label: "Cherry", disabled: true, group: "Fruit" },
  { value: "date", label: "Date", group: "Fruit" },
  { value: "carrot", label: "Carrot", group: "Vegetables" },
];

beforeEach(() => {
  // jsdom does not perform layout; give Popout measurable elements.
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 200,
    bottom: 40,
    width: 200,
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
  vi.restoreAllMocks();
});

describe("Autocomplete", () => {
  it("renders an accessible combobox", () => {
    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).not.toHaveAttribute("aria-controls");
    expect(input).not.toHaveAttribute("aria-activedescendant");
  });

  it("supports an accessible name without a visible label", () => {
    render(<Autocomplete aria-label="Choose a fruit" options={options} />);

    expect(
      screen.getByRole("combobox", { name: "Choose a fruit" }),
    ).toBeInTheDocument();
  });

  it("associates description and error messages with the input", () => {
    render(
      <Autocomplete
        label="Fruit"
        options={options}
        description="Choose your favourite fruit"
        error="A fruit is required"
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });
    const describedBy = input.getAttribute("aria-describedby")?.split(" ");

    expect(describedBy).toHaveLength(2);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("opens the listbox when the input is clicked", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls");
  });

  it("opens when focused if openOnFocus is enabled", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} openOnFocus />);

    await user.tab();

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("filters options as the user types", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.type(input, "ban");

    expect(
      await screen.findByRole("option", { name: "Banana" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Cherry" }),
    ).not.toBeInTheDocument();
  });

  it("filters without being case-sensitive or accent-sensitive", async () => {
    const user = userEvent.setup();

    const coffeeOptions = [
      { value: "coffee", label: "Café Mocha" },
      { value: "tea", label: "Tea" },
    ];

    render(<Autocomplete label="Drink" options={coffeeOptions} />);

    await user.type(screen.getByRole("combobox", { name: "Drink" }), "cafe");

    expect(
      await screen.findByRole("option", { name: "Café Mocha" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", { name: "Tea" }),
    ).not.toBeInTheDocument();
  });

  it("filters on string descriptions as well as labels", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        options={[
          {
            value: "apple",
            label: "Apple",
            description: "Red and sweet",
          },
          {
            value: "pear",
            label: "Pear",
            description: "Green and juicy",
          },
        ]}
      />,
    );

    await user.type(screen.getByRole("combobox", { name: "Fruit" }), "juicy");

    expect(
      await screen.findByRole("option", { name: "Pear" }),
    ).toHaveAccessibleDescription("Green and juicy");

    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
  });

  it("supports custom filtering", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        filterOptions={(items) => items.filter((item) => item.value === "date")}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));

    expect(
      await screen.findByRole("option", { name: "Date" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
  });

  it("navigates options with ArrowDown and ArrowUp", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-0"),
    );

    await user.keyboard("{ArrowDown}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-1"),
    );

    await user.keyboard("{ArrowUp}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-0"),
    );
  });

  it("skips disabled options during keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-3"),
    );
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{End}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-4"),
    );

    await user.keyboard("{Home}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-0"),
    );
  });

  it("supports PageUp and PageDown navigation", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{PageDown}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-4"),
    );

    await user.keyboard("{PageUp}");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-0"),
    );
  });

  it("selects an option with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete label="Fruit" options={options} onChange={onChange} />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("banana");
    expect(input).toHaveValue("Banana");
    expect(input).toHaveFocus();

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects an option with a pointer", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete label="Fruit" options={options} onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));

    await user.click(await screen.findByRole("option", { name: "Banana" }));

    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        onChange={onChange}
        defaultOpen
      />,
    );

    await user.click(await screen.findByRole("option", { name: "Cherry" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports controlled value and inputValue independently", async () => {
    const user = userEvent.setup();

    const ControlledAutocomplete = () => {
      const [value, setValue] = useState<string | undefined>("apple");
      const [query, setQuery] = useState("Apple");

      return (
        <Autocomplete
          label="Fruit"
          options={options}
          value={value}
          onChange={setValue}
          inputValue={query}
          onInputChange={setQuery}
        />
      );
    };

    render(<ControlledAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveValue("Apple");

    await user.clear(input);
    await user.type(input, "Banana");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(input).toHaveValue("Banana");
  });

  it("supports defaultValue", () => {
    render(
      <Autocomplete label="Fruit" options={options} defaultValue="banana" />,
    );

    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveValue(
      "Banana",
    );
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        multiple
        options={options}
        defaultValue={["apple"]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    const listboxTrigger = screen.getByRole("button", {
      name: "Remove Apple",
    });

    expect(listboxTrigger).toBeInTheDocument();

    await user.click(input);

    await user.click(await screen.findByRole("option", { name: "Banana" }));

    expect(onChange).toHaveBeenCalledWith(["apple", "banana"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("removes selected values in multiple mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        multiple
        options={options}
        defaultValue={["apple", "banana"]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remove Apple" }));

    expect(onChange).toHaveBeenCalledWith(["banana"]);
  });

  it("removes the last selected value with Backspace when the input is empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        multiple
        options={options}
        defaultValue={["apple", "banana"]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    input.focus();
    await user.keyboard("{Backspace}");

    expect(onChange).toHaveBeenCalledWith(["apple"]);
  });

  it("filters selected values in multiple mode by default", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        multiple
        options={options}
        defaultValue={["apple"]}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));

    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("respects maxSelected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        multiple
        maxSelected={1}
        options={options}
        defaultValue={["apple"]}
        onChange={onChange}
        defaultOpen
      />,
    );

    const banana = await screen.findByRole("option", { name: "Banana" });

    expect(banana).toHaveAttribute("aria-disabled", "true");

    await user.click(banana);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports freeSolo values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Tag"
        options={options}
        freeSolo
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Tag" });

    await user.type(input, "Mango");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("Mango");
    expect(input).toHaveValue("Mango");
  });

  it("prefers an exact option match over a freeSolo string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        freeSolo
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.type(input, "Banana");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("shows loading and empty states", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        options={[]}
        loading
        loadingText="Searching..."
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Searching...");
  });

  it("shows noOptionsText when no results match", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        noOptionsText="Nothing found"
      />,
    );

    await user.type(screen.getByRole("combobox", { name: "Fruit" }), "xyz");

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Nothing found",
    );
  });

  it("clears the selected value and the input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        defaultValue="apple"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveValue("Apple");

    await user.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("supports selecting and clearing a controlled undefined value", async () => {
    const user = userEvent.setup();
    const ControlledAutocomplete = () => {
      const [value, setValue] = useState<string | undefined>();

      return (
        <Autocomplete
          label="Fruit"
          options={options}
          value={value}
          onChange={setValue}
        />
      );
    };

    render(<ControlledAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveValue("");
    await user.click(input);
    await user.click(await screen.findByRole("option", { name: "Banana" }));
    expect(input).toHaveValue("Banana");

    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(input).toHaveValue("");

    await user.click(input);
    expect(
      await screen.findByRole("option", { name: "Banana" }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("closes the popup on Escape", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(input);

    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(input).toHaveFocus();
    });
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Fruit" options={options} disabled />);

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toBeDisabled();

    await user.click(input);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports required form validation", async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        required
        requiredMessage="Choose a fruit"
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveAttribute("aria-required", "true");

    await waitFor(() => {
      expect(input).toBeInvalid();
    });

    await user.click(input);

    await user.click(await screen.findByRole("option", { name: "Apple" }));

    await waitFor(() => {
      expect(input).toBeValid();
    });
  });

  it("works inside FormField", () => {
    render(
      <FormField
        label="Fruit"
        description="Choose your favourite fruit"
        required
      >
        <Autocomplete options={options} />
      </FormField>,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });

    expect(input).toHaveAttribute("aria-describedby");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("id");
  });

  it("serializes selected values into native form fields", () => {
    render(
      <form>
        <Autocomplete
          label="Fruit"
          name="fruit"
          options={options}
          defaultValue="apple"
        />
      </form>,
    );

    expect(
      document.querySelector<HTMLInputElement>('input[name="fruit"]'),
    ).toHaveValue("apple");
  });

  it("supports custom serialization for generic values", () => {
    const countries = [
      { value: { id: 1 }, label: "Netherlands" },
      { value: { id: 2 }, label: "Spain" },
    ];

    render(
      <form>
        <Autocomplete
          label="Country"
          name="country"
          options={countries}
          defaultValue={countries[1]!.value}
          serializeValue={(value) =>
            typeof value === "string" ? value : String(value.id)
          }
          isOptionEqualToValue={(option, value) =>
            typeof value !== "string" && option.value.id === value.id
          }
        />
      </form>,
    );

    expect(
      document.querySelector<HTMLInputElement>('input[name="country"]'),
    ).toHaveValue("2");
  });
});
