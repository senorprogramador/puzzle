import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { TextAreaInput } from "./text-area-input";

describe("TextAreaInput (browser)", () => {
  it("grows with multiline content and shrinks when cleared", async () => {
    render(<TextAreaInput aria-label="Notes" rows={2} />);
    const textarea = screen.getByRole("textbox", {
      name: "Notes",
    }) as HTMLTextAreaElement;
    const initialHeight = textarea.getBoundingClientRect().height;

    await userEvent.type(textarea, "one{Enter}two{Enter}three{Enter}four");

    await waitFor(() => {
      expect(textarea.getBoundingClientRect().height).toBeGreaterThan(
        initialHeight,
      );
    });

    const expandedHeight = textarea.getBoundingClientRect().height;
    await userEvent.clear(textarea);

    await waitFor(() => {
      expect(textarea.getBoundingClientRect().height).toBeLessThan(
        expandedHeight,
      );
    });
  });
});
