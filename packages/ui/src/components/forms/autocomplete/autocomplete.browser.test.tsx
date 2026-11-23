import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Autocomplete } from "./index";

afterEach(cleanup);

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
];

describe("Autocomplete (browser)", () => {
  it("does not allow keyboard selection in read-only mode", async () => {
    const onChange = vi.fn();

    render(
      <Autocomplete
        label="Fruit"
        options={options}
        filterOptions={(available) => available}
        value="apple"
        readOnly
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });
    input.focus();

    await userEvent.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    const banana = screen.getByRole("option", { name: "Banana" });

    expect(listbox).toBeInTheDocument();
    expect(banana).toHaveAttribute("aria-disabled", "true");

    await userEvent.keyboard("{Enter}");

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("Apple");
  });
});
