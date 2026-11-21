import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { JsonEditor } from "./index";

describe("JsonEditor (browser)", () => {
  it("supports keyboard formatting and validation", async () => {
    render(
      <JsonEditor
        label="JSON source"
        defaultValue='{"title":"Puzzle","enabled":true}'
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "JSON source" });
    await userEvent.tab();
    expect(textarea).toHaveFocus();

    await userEvent.tab();
    expect(
      screen.getByRole("button", { name: "Format JSON" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(textarea).toHaveValue(
        '{\n  "title": "Puzzle",\n  "enabled": true\n}',
      );
    });

    await userEvent.tab();
    expect(
      screen.getByRole("button", { name: "Validate JSON" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Valid JSON.");
    });
  });
});
