import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { FieldArray } from "./index";

const KeyboardFieldArray = () => {
  const [items, setItems] = useState<string[]>([]);

  return (
    <FieldArray
      label="Repeated values"
      items={items}
      onChange={setItems}
      createItem={() => `Value ${items.length + 1}`}
      renderItem={({ item }) => <span>{item}</span>}
      reorderable
    />
  );
};

describe("FieldArray (browser)", () => {
  it("supports adding entries from the keyboard", async () => {
    render(<KeyboardFieldArray />);

    const addButton = screen.getByRole("button", { name: "Add item" });
    await userEvent.tab();
    expect(addButton).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.getByText("Value 1")).toBeInTheDocument();
    });

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.getByText("Value 2")).toBeInTheDocument();
    });
  });
});
