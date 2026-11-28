import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { z } from "zod";

import { ZodSchemaForm } from "../../../zod";

const schema = z.object({
  tags: z.array(z.string()),
});

describe("ZodSchemaForm array layout", () => {
  it("keeps each input and remove button on the same line at narrow widths", async () => {
    await page.viewport(320, 800);

    render(
      <div style={{ width: "100%" }}>
        <ZodSchemaForm
          schema={schema}
          value={{ tags: ["react"] }}
          onChange={() => {}}
          fields={{ tags: { label: "Tags" } }}
        />
      </div>,
    );

    const input = screen.getByRole("textbox", { name: "Value" });
    const inputField = input.closest(".puzzle-input");
    const removeButton = screen.getByRole("button", {
      name: "Remove item 1",
    });
    expect(inputField).not.toBeNull();
    if (!inputField) {
      throw new Error("Expected the array input wrapper.");
    }

    const inputRect = inputField.getBoundingClientRect();
    const removeRect = removeButton.getBoundingClientRect();

    expect(removeRect.left).toBeGreaterThan(inputRect.right);
    expect(removeRect.top).toBe(inputRect.top);
    expect(removeRect.height).toBe(inputRect.height);
  });
});
