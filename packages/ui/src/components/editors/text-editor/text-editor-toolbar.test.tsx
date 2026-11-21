import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TextEditor } from "./index";
import { TextEditorToolbar } from "./text-editor-toolbar";
import { createTextDocument } from "./text-document";
import { clearIconifySearchCache } from "./iconify-search";
import { THEME_TOKEN_REGISTRY } from "@puzzle-ui/theme";
import type { TextDocument } from "./text-editor.types";

vi.mock("@puzzle-ui/icons", () => ({
  Icon: ({ name }: { name: string }) => (
    <svg data-testid="toolbar-icon" data-icon-name={name} />
  ),
}));

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
  vi.unstubAllGlobals();
  clearIconifySearchCache();
});

const selectBlocks = (
  editor: HTMLElement,
  startIndex: number,
  endIndex: number,
) => {
  const blocks = editor.querySelectorAll<HTMLElement>(
    "[data-puzzle-editor-block]",
  );
  const startText = blocks[startIndex]!.querySelector("span")!.firstChild!;
  const endText = blocks[endIndex]!.querySelector("span")!.firstChild!;
  const range = editor.ownerDocument.createRange();
  range.setStart(startText, 0);
  range.setEnd(endText, endText.textContent?.length ?? 0);
  const selection = editor.ownerDocument.defaultView!.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  fireEvent(editor.ownerDocument, new Event("selectionchange"));
};

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
    expect(tabStops[0]).toHaveAccessibleName("Block style");
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
      within(toolbar).getByRole("button", { name: "List" }),
    ).toBeInTheDocument();
    expect(
      within(toolbar).getByRole("button", { name: "Inline code" }),
    ).toBeInTheDocument();
    expect(
      within(toolbar).getByRole("button", { name: "Blockquote" }),
    ).toBeInTheDocument();
  });

  it("disables editing toolbar actions in read-only mode", () => {
    render(
      <TextEditor
        readOnly
        toolbar={<TextEditorToolbar />}
        defaultValue={createTextDocument("Read only")}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Text editor" })).toHaveAttribute(
      "aria-readonly",
      "true",
    );
    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "List" })).toBeDisabled();
  });

  it("uses the unified list dropdown and removes mixed list formatting", async () => {
    const user = userEvent.setup();
    let latestDocument: TextDocument = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "bullet" as const,
          children: [{ text: "Bullet item" }],
        },
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "ordered" as const,
          children: [{ text: "Ordered item" }],
        },
        {
          type: "paragraph" as const,
          variant: "body1" as const,
          children: [{ text: "Paragraph" }],
        },
      ],
    };
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
    selectBlocks(editor, 0, 2);
    const listButton = screen.getByRole("button", { name: "List" });
    expect(listButton).toHaveAttribute("aria-pressed", "mixed");
    await user.click(listButton);
    const dialog = await screen.findByRole("dialog", { name: "List options" });
    expect(
      within(dialog).getByRole("button", { name: "Remove list" }),
    ).toBeEnabled();
    await user.click(within(dialog).getByRole("button", { name: "Remove list" }));

    expect(latestDocument.content.map((block) => block.type)).toEqual([
      "paragraph",
      "paragraph",
      "paragraph",
    ]);
    expect(latestDocument.content.every((block) => !block.listType)).toBe(true);
  });

  it("dismisses the list dropdown with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    renderToolbar();

    const trigger = screen.getByRole("button", { name: "List" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "List options" }))
      .toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "List options" }))
        .not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("supports roving keyboard activation in the list dropdown", async () => {
    const user = userEvent.setup();
    let latestDocument: TextDocument = createTextDocument("Keyboard item");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "List" }));
    const dialog = await screen.findByRole("dialog", { name: "List options" });
    const bullet = within(dialog).getByRole("button", { name: "Bullet" });
    const ordered = within(dialog).getByRole("button", { name: "Ordered" });
    bullet.focus();
    await user.keyboard("{ArrowDown}");
    expect(ordered).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(latestDocument.content[0]?.listType).toBe("ordered");
  });

  it("toggles blockquote and code block exclusively", async () => {
    const user = userEvent.setup();
    let latestDocument: TextDocument = createTextDocument("Quote me");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(latestDocument.content[0]?.type).toBe("blockquote");

    await user.click(screen.getByRole("button", { name: "Code block" }));
    expect(latestDocument.content[0]?.type).toBe("codeBlock");
    expect(screen.getByRole("button", { name: "Blockquote" })).toHaveAttribute("aria-pressed", "false");
    expect(latestDocument.content[0]?.children.map((inline) => inline.text).join(""))
      .toBe("Quote me");
    await user.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(latestDocument.content[0]?.type).toBe("blockquote");
    await user.click(screen.getByRole("button", { name: "Blockquote" }));
    expect(latestDocument.content[0]?.type).toBe("paragraph");
  });

  it("applies the theme heading styles and returns to a paragraph", async () => {
    const user = userEvent.setup();
    let latestDocument = createTextDocument("Keep this text");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => { latestDocument = document; }}
      />,
    );
    const variants = Array.from(new Set(THEME_TOKEN_REGISTRY.flatMap(({ group }) => {
      const match = /^typography\.roles\.((?:display|headline)\d+)$/.exec(group);
      return match ? [match[1]!] : [];
    })));
    expect(variants.length).toBeGreaterThan(0);
    for (const variant of variants) {
      await user.click(screen.getByRole("button", { name: "Block style" }));
      const dialog = await screen.findByRole("dialog", { name: "Block styles" });
      const label = variant.replace(/(\D)(\d)/, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
      await user.click(within(dialog).getByRole("button", { name: label }));
      expect(latestDocument.content[0]).toMatchObject({
        type: "heading", variant, children: [{ text: "Keep this text" }],
      });
    }
    await user.click(screen.getByRole("button", { name: "Block style" }));
    await user.click(within(await screen.findByRole("dialog", { name: "Block styles" })).getByRole("button", { name: "Paragraph" }));
    expect(latestDocument.content[0]).toMatchObject({
      type: "paragraph", children: [{ text: "Keep this text" }],
    });
  });

  it("inserts a semantic horizontal rule", async () => {
    const user = userEvent.setup();
    let latestDocument: TextDocument = createTextDocument("Above");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Horizontal rule" }));

    expect(latestDocument.content.map((block) => block.type)).toEqual([
      "horizontalRule",
      "paragraph",
    ]);
  });

  it("toggles an active bullet list off", async () => {
    const user = userEvent.setup();
    let latestDocument = createTextDocument("Item");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => { latestDocument = document; }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(await screen.findByRole("button", { name: "Bullet" }));
    expect(latestDocument.content[0]?.listType).toBe("bullet");
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(await screen.findByRole("button", { name: "Bullet" }));
    expect(latestDocument.content[0]).toMatchObject({
      type: "paragraph",
      children: [{ text: "Item" }],
    });
    expect(latestDocument.content[0]?.listType).toBeUndefined();
  });

  it("keeps checklist interaction and checked state independent", async () => {
    const user = userEvent.setup();
    let latestDocument: TextDocument = {
      type: "doc" as const,
      content: [
        {
          type: "paragraph" as const,
          variant: "body1" as const,
          children: [{ text: "First task" }],
        },
        {
          type: "paragraph" as const,
          variant: "body1" as const,
          children: [{ text: "Second task" }],
        },
      ],
    };
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
    selectBlocks(editor, 0, 1);
    await user.click(screen.getByRole("button", { name: "List" }));
    const options = await screen.findByRole("dialog", { name: "List options" });
    await user.click(within(options).getByRole("button", { name: /Checklist/ }));
    const settings = await screen.findByRole("dialog", {
      name: "Checklist settings",
    });

    await user.click(
      within(settings).getByRole("checkbox", {
        name: "Allow checkbox interaction",
      }),
    );
    expect(
      latestDocument.content.map(
        (block) => block.listAttributes?.interactive,
      ),
    ).toEqual([true, true]);
    expect(latestDocument.content.map((block) => block.checked)).toEqual([
      false,
      false,
    ]);

    await user.click(
      within(settings).getByRole("button", { name: "Mark selected checked" }),
    );
    expect(latestDocument.content.map((block) => block.checked)).toEqual([
      true,
      true,
    ]);
  });

  it("searches Iconify on demand and applies the selected icon configuration", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ icons: ["mdi:star", "not-an-icon"] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    let latestDocument = createTextDocument("Icon item");
    render(
      <TextEditor
        toolbar={<TextEditorToolbar />}
        defaultValue={latestDocument}
        onChange={(document) => {
          latestDocument = document;
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "List" }));
    const options = await screen.findByRole("dialog", { name: "List options" });
    await user.click(within(options).getByRole("button", { name: /^Icon$/ }));
    const settings = await screen.findByRole("dialog", {
      name: "Icon list settings",
    });
    await user.type(
      within(settings).getByRole("searchbox", { name: "Search icons" }),
      "star",
    );
    await user.click(
      await within(settings).findByRole("button", { name: "mdi:star" }),
    );
    const sizeInput = within(settings).getByRole("spinbutton", {
      name: "Icon size",
    });
    fireEvent.change(sizeInput, { target: { value: "100" } });
    expect(sizeInput).toHaveAttribute("aria-invalid", "true");
    expect(within(settings).getByRole("alert")).toHaveTextContent("8 to 64");
    expect(latestDocument.content[0]?.listAttributes?.icon?.size).toBe(18);
    await user.clear(sizeInput);
    await user.type(sizeInput, "24");
    await user.click(
      within(settings).getByRole("button", { name: "Icon color" }),
    );
    expect(
      await screen.findByRole("dialog", { name: "Choose Icon color" }),
    ).toBeInTheDocument();
    expect(settings).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(latestDocument.content[0]?.listType).toBe("icon");
    expect(latestDocument.content[0]?.listAttributes?.icon).toEqual({
      name: "mdi:star",
      size: 24,
      color: "#0277B5",
    });

    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(screen.getByRole("button", { name: "List" }));
    const reopenedPicker = await screen.findByRole("dialog", {
      name: "Icon list settings",
    });
    await user.type(
      within(reopenedPicker).getByRole("searchbox", { name: "Search icons" }),
      "star",
    );
    await within(reopenedPicker).findByRole("button", { name: "mdi:star" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("executes formatting commands through the editor context", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const bold = screen.getByRole("button", { name: "Bold" });
    await user.click(bold);

    expect(bold).toHaveAttribute("aria-pressed", "true");
  });

  it("applies inline code as an exclusive text mark", async () => {
    const user = userEvent.setup();
    renderToolbar();

    await user.click(screen.getByRole("button", { name: "Inline code" }));

    expect(screen.getByRole("button", { name: "Inline code" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
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
    expect(screen.getByRole("button", { name: "Inline code" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "List" })).toHaveFocus();
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
    const list = screen.getByRole("button", { name: "Blockquote" });

    expect(undo).toBeDisabled();
    expect(redo).toBeDisabled();

    justify.focus();

    await user.keyboard("{ArrowRight}");

    expect(list).toHaveFocus();
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    renderToolbar();

    const bold = screen.getByRole("button", { name: "Block style" });
    const list = screen.getByRole("button", { name: "Clear formatting" });
    const alignCenter = screen.getByRole("button", {
      name: "Align center",
    });

    alignCenter.focus();

    await user.keyboard("{Home}");

    expect(bold).toHaveFocus();

    await user.keyboard("{End}");

    expect(list).toHaveFocus();
  });

  it("supports RTL horizontal navigation", async () => {
    const user = userEvent.setup();

    renderToolbar("rtl");

    const bold = screen.getByRole("button", { name: "Block style" });
    const list = screen.getByRole("button", { name: "Clear formatting" });

    bold.focus();

    await user.keyboard("{ArrowRight}");

    expect(list).toHaveFocus();
  });
});
