import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextAreaInput } from "./text-area-input";

afterEach(() => {
  cleanup();
});

describe("TextAreaInput", () => {
  it("renders a labelled textbox with the requested rows", () => {
    render(<TextAreaInput aria-label="Notes" rows={5} />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute(
      "rows",
      "5",
    );
  });

  it("calls the consumer's onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TextAreaInput aria-label="Notes" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "ab");

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("only allows manual resizing when `resizable` is set", () => {
    const { rerender } = render(<TextAreaInput aria-label="Notes" />);

    expect(screen.getByRole("textbox")).toHaveStyle({ resize: "none" });

    rerender(<TextAreaInput aria-label="Notes" resizable />);

    expect(screen.getByRole("textbox")).toHaveStyle({ resize: "vertical" });
  });

  it("keeps vertical scrolling available when autoSize is off", () => {
    render(<TextAreaInput aria-label="Notes" autoSize={false} />);

    expect(screen.getByRole("textbox")).toHaveStyle({ overflowY: "auto" });
  });
});
