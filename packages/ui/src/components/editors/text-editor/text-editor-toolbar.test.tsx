import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TextEditor } from "./index";
import { TextEditorToolbar } from "./text-editor-toolbar";

const renderToolbar = (dir: "ltr" | "rtl" = "ltr") =>
  render(<TextEditor toolbar={<TextEditorToolbar dir={dir} />} />);

describe("TextEditorToolbar", () => {
  it("renders an accessible horizontal toolbar", () => {
    renderToolbar();

    const toolbar = screen.getByRole("toolbar", {
      name: "Text formatting",
    });

    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("uses one tab stop for all enabled toolbar actions", () => {
    renderToolbar();

    const toolbar = screen.getByRole("toolbar");
    const buttons = within(toolbar).getAllByRole("button");

    const tabStops = buttons.filter((button) => button.tabIndex === 0);

    expect(tabStops).toHaveLength(1);
    expect(tabStops[0]).toHaveAccessibleName("Bold");
  });

  it("provides accessible names for toolbar actions", () => {
    renderToolbar();

    const toolbar = screen.getByRole("toolbar");

    expect(
      within(toolbar).getByRole("button", { name: "Bold" }),
    ).toBeInTheDocument();

    expect(
      within(toolbar).getByRole("button", { name: "Align center" }),
    ).toBeInTheDocument();

    expect(
      within(toolbar).getByRole("button", { name: "Bulleted list" }),
    ).toBeInTheDocument();
  });

  it("moves focus using horizontal arrow keys", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    bold.focus();

    await user.keyboard("{ArrowRight}");

    expect(italic).toHaveFocus();
    expect(italic).toHaveAttribute("tabindex", "0");
  });

  it("skips disabled actions during keyboard navigation", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const undo = screen.getByRole("button", { name: "Undo" });
    const redo = screen.getByRole("button", { name: "Redo" });
    const justify = screen.getByRole("button", { name: "Justify text" });
    const bullet = screen.getByRole("button", { name: "Bulleted list" });

    expect(undo).toBeDisabled();
    expect(redo).toBeDisabled();

    justify.focus();

    await user.keyboard("{ArrowRight}");

    expect(bullet).toHaveFocus();
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const bold = screen.getByRole("button", { name: "Bold" });
    const numbered = screen.getByRole("button", {
      name: "Numbered list",
    });
    const alignCenter = screen.getByRole("button", {
      name: "Align center",
    });

    alignCenter.focus();

    await user.keyboard("{Home}");

    expect(bold).toHaveFocus();

    await user.keyboard("{End}");

    expect(numbered).toHaveFocus();
  });

  it("supports RTL horizontal navigation", async () => {
    const user = userEvent.setup();

    renderToolbar("rtl");

    const bold = screen.getByRole("button", { name: "Bold" });
    const numbered = screen.getByRole("button", {
      name: "Numbered list",
    });

    bold.focus();

    await user.keyboard("{ArrowRight}");

    expect(numbered).toHaveFocus();
  });
});
