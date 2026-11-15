import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TextEditor } from "./index";
import { TextEditorToolbar } from "./text-editor-toolbar";
import { createTextDocument } from "./text-document";

const renderToolbar = (dir: "ltr" | "rtl" = "ltr") =>
  render(<TextEditor toolbar={<TextEditorToolbar dir={dir} />} />);

beforeEach(() => {
  const rect = new DOMRect(0, 0, 100, 40);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("executes formatting commands through the editor context", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const bold = screen.getByRole("button", { name: "Bold" });
    await user.click(bold);

    expect(bold).toHaveAttribute("aria-pressed", "true");
  });

  it("adds, edits, and removes links on the selected text", async () => {
    const user = userEvent.setup();
    let latestDocument = createTextDocument("Hello");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "Text editor" });
    editor.focus();
    const text = editor.querySelector("span")!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(text);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent(editor.ownerDocument, new Event("selectionchange"));

    await user.click(screen.getByRole("button", { name: "Link" }));
    expect(await screen.findByRole("dialog", { name: "Link settings" })).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Link URL" }), "javascript:alert(1)");
    await user.click(screen.getByRole("button", { name: "Apply link" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid link URL.");
    expect(latestDocument).toEqual(createTextDocument("Hello"));
    await user.clear(screen.getByRole("textbox", { name: "Link URL" }));
    await user.type(
      screen.getByRole("textbox", { name: "Link URL" }),
      "https://first.example",
    );
    await user.click(screen.getByRole("button", { name: "Apply link" }));

    expect(latestDocument.content[0]!.children).toEqual([
      { text: "Hello", link: { href: "https://first.example" } },
    ]);

    await user.click(screen.getByRole("button", { name: "Link" }));
    const linkInput = screen.getByRole("textbox", { name: "Link URL" });
    expect(linkInput).toHaveValue("https://first.example");
    await user.clear(linkInput);
    await user.type(linkInput, "https://second.example");
    await user.click(screen.getByRole("button", { name: "Apply link" }));

    expect(latestDocument.content[0]!.children).toEqual([
      { text: "Hello", link: { href: "https://second.example" } },
    ]);

    await user.click(screen.getByRole("button", { name: "Link" }));
    await user.click(screen.getByRole("button", { name: "Remove link" }));

    expect(latestDocument.content[0]!.children).toEqual([{ text: "Hello" }]);
  });

  it("disables Link for a collapsed selection, including inside an existing link", async () => {
    const user = userEvent.setup();
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={{
          type: "doc",
          content: [{
            type: "paragraph",
            variant: "body1",
            children: [{ text: "Hello", link: { href: "https://example.com" } }],
          }],
        }}
      />,
    );
    const linkButton = screen.getByRole("button", { name: "Link" });
    expect(linkButton).toBeDisabled();
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    editor.focus();
    const text = editor.querySelector("a")!.firstChild!;
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.collapse(text, 2);
    fireEvent(editor.ownerDocument, new Event("selectionchange"));
    expect(linkButton).toBeDisabled();

    screen.getByRole("button", { name: "Strikethrough" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Align left" })).toHaveFocus();
  });

  it("dismisses the link popover with Escape without modifying the document", async () => {
    const user = userEvent.setup();
    const initialDocument = createTextDocument("Hello");
    let latestDocument = initialDocument;
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={initialDocument}
        onChange={(document) => { latestDocument = document; }}
      />,
    );
    const editor = screen.getByRole("textbox", { name: "Text editor" });
    editor.focus();
    const text = editor.querySelector("span")!.firstChild!;
    const range = editor.ownerDocument.createRange();
    range.selectNodeContents(text);
    const selection = editor.ownerDocument.defaultView!.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent(editor.ownerDocument, new Event("selectionchange"));

    await user.click(screen.getByRole("button", { name: "Link" }));
    await user.type(await screen.findByRole("textbox", { name: "Link URL" }), "https://example.com");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Link settings" })).not.toBeInTheDocument());
    expect(latestDocument).toEqual(initialDocument);
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
