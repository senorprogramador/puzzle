import { describe, expect, it } from "vitest";
import type { TextDocument } from "./text-editor.types";
import {
  applyMark,
  applyMarkdownShortcut,
  clearFormatting,
  clearInlineFormatting,
  createTextDocument,
  createTextSelection,
  deleteTextAtSelection,
  exitEmptyTextBlock,
  findTextInDocument,
  getTextStatistics,
  getListSelectionState,
  getSlashCommandAtSelection,
  insertHorizontalRule,
  replaceAllText,
  setBlockType,
  setBlockIndent,
  setListType,
  removeList,
  setListChecked,
  setListIndent,
  shiftListIndent,
  setListInteractive,
  splitListItemAtSelection,
  setTextAlign,
  setTextVariant,
  toggleListItemChecked,
} from "./text-document";

describe("document transactions", () => {
  it.each(["blockquote", "codeBlock"] as const)(
    "exits an empty line in %s without losing marked surrounding content",
    (type) => {
      const document: TextDocument = {
        type: "doc",
        content: [{
          type, variant: "body1",
          children: [{ text: "before\n\n", marks: ["bold"] }, { text: "after", marks: ["italic"] }],
        }],
      };
      const transaction = exitEmptyTextBlock(document, createTextSelection(0, 7));
      expect(transaction?.document.content).toEqual([
        { type, variant: "body1", children: [{ text: "before", marks: ["bold"] }] },
        { type: "paragraph", variant: "body1", children: [] },
        { type, variant: "body1", children: [{ text: "after", marks: ["italic"] }] },
      ]);
      expect(transaction?.selection).toEqual(createTextSelection(1, 0));
      expect(exitEmptyTextBlock(document, createTextSelection(0, 2))).toBeNull();
      expect(exitEmptyTextBlock(document, {
        anchor: { block: 0, offset: 7 }, focus: { block: 0, offset: 8 },
      })).toBeNull();
    },
  );

  it("preserves trailing content when exiting a blank first line", () => {
    const document: TextDocument = {
      type: "doc",
      content: [{ type: "codeBlock", variant: "body1", children: [{ text: "\nafter" }] }],
    };
    expect(exitEmptyTextBlock(document, createTextSelection(0, 0))?.document.content).toEqual([
      { type: "paragraph", variant: "body1", children: [] },
      { type: "codeBlock", variant: "body1", children: [{ text: "after" }] },
    ]);
  });

  it("returns the transformed document and selection when applying a mark", () => {
    const document = createTextDocument("Hello");
    const selection = createTextSelection(0, 1);
    selection.focus.offset = 4;

    expect(applyMark(document, selection, "bold")).toEqual({
      document: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            variant: "body1",
            children: [
              { text: "H" },
              { text: "ell", marks: ["bold"] },
              { text: "o" },
            ],
          },
        ],
      },
      selection,
    });
  });

  it("makes inline code exclusive of other marks and links", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "paragraph" as const,
          variant: "body1" as const,
          children: [
            {
              text: "value",
              marks: ["bold" as const],
              link: { href: "https://example.com" },
            },
          ],
        },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 0 },
      focus: { block: 0, offset: 5 },
    };

    expect(applyMark(document, selection, "code").document.content[0]?.children)
      .toEqual([{ text: "value", marks: ["code"] }]);
  });

  it("returns a document and selection for block formatting", () => {
    const document = createTextDocument("Hello");
    const selection = createTextSelection(0, 1);

    expect(setTextVariant(document, selection, "headline2")).toMatchObject({
      document: {
        content: [
          {
            type: "heading",
            variant: "headline2",
          },
        ],
      },
      selection,
    });
    expect(setTextAlign(document, selection, "center")).toMatchObject({
      document: { content: [{ align: "center" }] },
      selection,
    });
    expect(setListType(document, selection, "bullet")).toMatchObject({
      document: {
        content: [{ type: "listItem", listType: "bullet" }],
      },
      selection,
    });
  });

  it("keeps checklist interaction and checked state independent", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "checklist" as const,
          checked: false,
          listAttributes: { interactive: false },
          children: [{ text: "First" }],
        },
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "checklist" as const,
          checked: true,
          listAttributes: { interactive: false },
          children: [{ text: "Second" }],
        },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 0 },
      focus: { block: 1, offset: 6 },
    };

    const interactive = setListInteractive(document, selection, true);
    expect(interactive.document.content.map((block) => block.checked)).toEqual([
      false,
      true,
    ]);
    expect(
      interactive.document.content.map(
        (block) => block.listAttributes?.interactive,
      ),
    ).toEqual([true, true]);
    expect(setListChecked(document, selection, true).document.content.map((block) => block.checked))
      .toEqual([true, true]);
    expect(
      toggleListItemChecked(document, createTextSelection(1, 2)).document.content.map(
        (block) => block.checked,
      ),
    ).toEqual([false, false]);
  });

  it("removes list metadata while preserving item text formatting and selection direction", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "headline2" as const,
          listType: "icon" as const,
          listAttributes: {
            icon: { name: "mdi:star", size: 20, color: "#123456" },
          },
          indent: 2,
          align: "center" as const,
          headingLevel: 2 as const,
          children: [
            {
              text: "Keep",
              marks: ["bold" as const],
              link: { href: "https://example.com" },
            },
          ],
        },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 4 },
      focus: { block: 0, offset: 1 },
    };

    const result = removeList(document, selection);
    expect(result.document.content[0]).toEqual({
      type: "paragraph",
      variant: "headline2",
      align: "center",
      children: [
        {
          text: "Keep",
          marks: ["bold"],
          link: { href: "https://example.com" },
        },
      ],
    });
    expect(result.selection).toEqual(selection);
  });

  it("clamps indentation and preserves list transaction selection", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "bullet" as const,
          children: [{ text: "Parent" }],
        },
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "bullet" as const,
          children: [{ text: "Child" }],
        },
      ],
    };
    const selection = {
      anchor: { block: 1, offset: 5 },
      focus: { block: 0, offset: 0 },
    };

    const result = setListIndent(document, selection, 64);
    expect(result.document.content.map((block) => block.indent ?? 0)).toEqual([
      0,
      1,
    ]);
    expect(result.selection).toEqual(selection);
  });

  it("splits a checklist item with inline formatting and defaults the new item unchecked", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "checklist" as const,
          listAttributes: { interactive: true },
          checked: true,
          children: [
            { text: "Bold", marks: ["bold" as const] },
            { text: " link", link: { href: "https://example.com" } },
          ],
        },
      ],
    };

    const result = splitListItemAtSelection(document, createTextSelection(0, 4));
    expect(result.document.content).toMatchObject([
      {
        type: "listItem",
        listType: "checklist",
        checked: true,
        children: [{ text: "Bold", marks: ["bold"] }],
      },
      {
        type: "listItem",
        listType: "checklist",
        checked: false,
        listAttributes: { interactive: true },
        children: [{ text: " link", link: { href: "https://example.com" } }],
      },
    ]);
    expect(result.selection).toEqual({
      anchor: { block: 1, offset: 0 },
      focus: { block: 1, offset: 0 },
    });
  });

  it("reports mixed list types and configurations for a multi-block selection", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "checklist" as const,
          listAttributes: { interactive: true },
          children: [{ text: "One" }],
        },
        {
          type: "listItem" as const,
          variant: "body1" as const,
          listType: "checklist" as const,
          listAttributes: { interactive: false },
          children: [{ text: "Two" }],
        },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 0 },
      focus: { block: 1, offset: 3 },
    };

    expect(getListSelectionState(document, selection)).toEqual({
      status: "mixed",
    });
  });

  it.each([
    ["# ", "heading", undefined, 1, undefined],
    ["## ", "heading", undefined, 2, undefined],
    ["- ", "listItem", "bullet", undefined, undefined],
    ["1. ", "listItem", "ordered", undefined, undefined],
    ["[ ] ", "listItem", "checklist", undefined, false],
    ["[x] ", "listItem", "checklist", undefined, true],
  ] as const)(
    "converts the valid Markdown shortcut %s",
    (text, type, listType, headingLevel, checked) => {
      const document = createTextDocument(text);
      const result = applyMarkdownShortcut(
        document,
        createTextSelection(0, text.length),
      );

      expect(result?.document.content[0]).toMatchObject({
        type,
        ...(listType ? { listType } : {}),
        ...(headingLevel ? { headingLevel } : {}),
        ...(checked !== undefined ? { checked } : {}),
        children: [],
      });
    },
  );

  it("supports block formatting, clear formatting, and horizontal-rule insertion", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "heading" as const,
          variant: "headline2" as const,
          headingLevel: 2 as const,
          align: "center" as const,
          children: [
            {
              text: "Code",
              marks: ["bold" as const],
              link: { href: "https://example.com" },
            },
          ],
        },
      ],
    };
    const selection = createTextSelection(0, 0);

    expect(setBlockType(document, selection, "blockquote").document.content[0])
      .toMatchObject({
        type: "blockquote",
        children: [{ text: "Code", marks: ["bold"], link: { href: "https://example.com" } }],
      });

    expect(setBlockType(document, selection, "codeBlock").document.content[0])
      .toMatchObject({
        type: "codeBlock",
        children: [{ text: "Code" }],
      });
    expect(clearFormatting(document, selection).document.content[0]).toEqual({
      type: "paragraph",
      variant: "body1",
      children: [{ text: "Code" }],
    });

    const rule = insertHorizontalRule(document, selection);
    expect(rule.document.content.map((block) => block.type)).toEqual([
      "horizontalRule",
      "heading",
    ]);
    expect(rule.selection.focus).toEqual({ block: 1, offset: 0 });
  });

  it("clears only selected inline formatting without changing block structure", () => {
    const document: TextDocument = {
      type: "doc",
      content: [{
        type: "listItem",
        variant: "body1",
        listType: "bullet",
        children: [{ text: "abcdef", marks: ["bold", "italic"], link: { href: "/test" } }],
      }],
    };
    const result = clearInlineFormatting(document, {
      anchor: { block: 0, offset: 2 },
      focus: { block: 0, offset: 4 },
    });
    expect(result.document.content[0]).toEqual({
      type: "listItem",
      variant: "body1",
      listType: "bullet",
      children: [
        { text: "ab", marks: ["bold", "italic"], link: { href: "/test" } },
        { text: "cd" },
        { text: "ef", marks: ["bold", "italic"], link: { href: "/test" } },
      ],
    });
  });

  it("inserts horizontal rules at the selection while preserving surrounding content", () => {
    const document = createTextDocument("AlphaBeta");

    const middle = insertHorizontalRule(document, createTextSelection(0, 5));
    expect(middle.document.content.map((block) => block.type)).toEqual([
      "paragraph",
      "horizontalRule",
      "paragraph",
    ]);
    expect(middle.document.content.map((block) => block.children.map((inline) => inline.text).join("")))
      .toEqual(["Alpha", "", "Beta"]);
    expect(middle.selection.focus).toEqual({ block: 2, offset: 0 });

    const end = insertHorizontalRule(document, createTextSelection(0, 9));
    expect(end.document.content.map((block) => block.type)).toEqual([
      "paragraph",
      "horizontalRule",
      "paragraph",
    ]);
    expect(end.selection.focus).toEqual({ block: 2, offset: 0 });

    const selected = insertHorizontalRule(document, {
      anchor: { block: 0, offset: 2 },
      focus: { block: 0, offset: 7 },
    });
    expect(selected.document.content.map((block) => block.children.map((inline) => inline.text).join("")))
      .toEqual(["Al", "", "ta"]);
    expect(selected.selection.focus).toEqual({ block: 2, offset: 0 });

    const empty = insertHorizontalRule(createTextDocument(), createTextSelection());
    expect(empty.document.content.map((block) => block.type)).toEqual([
      "horizontalRule",
      "paragraph",
    ]);

    const repeated = insertHorizontalRule(empty.document, empty.selection);
    expect(repeated.document.content.map((block) => block.type)).toEqual([
      "horizontalRule",
      "horizontalRule",
      "paragraph",
    ]);
    expect(repeated.selection.focus).toEqual({ block: 2, offset: 0 });

    const spanning: TextDocument = {
      type: "doc",
      content: [
        { type: "paragraph", variant: "body1", children: [{ text: "First" }] },
        { type: "paragraph", variant: "body1", children: [{ text: "Second" }] },
      ],
    };
    const acrossBlocks = insertHorizontalRule(spanning, {
      anchor: { block: 0, offset: 3 },
      focus: { block: 1, offset: 3 },
    });
    expect(acrossBlocks.document.content.map((block) =>
      block.children.map((inline) => inline.text).join(""),
    )).toEqual(["Fir", "", "ond"]);
    expect(acrossBlocks.selection.focus).toEqual({ block: 2, offset: 0 });
  });

  it("preserves relative nesting when shifting multiple list items", () => {
    const document: TextDocument = {
      type: "doc",
      content: [
        { type: "listItem", variant: "body1", listType: "bullet", children: [{ text: "Parent" }] },
        { type: "listItem", variant: "body1", listType: "bullet", children: [{ text: "Sibling" }] },
        { type: "listItem", variant: "body1", listType: "bullet", indent: 1, children: [{ text: "Child" }] },
      ],
    };
    const selection = {
      anchor: { block: 1, offset: 0 },
      focus: { block: 2, offset: 5 },
    };
    const indented = shiftListIndent(document, selection, 1);
    expect(indented.document.content.map((block) => block.indent ?? 0)).toEqual([0, 1, 2]);
    const outdented = shiftListIndent(indented.document, selection, -1);
    expect(outdented.document.content.map((block) => block.indent ?? 0)).toEqual([0, 0, 1]);
  });

  it("deletes code-block characters and line breaks without losing block semantics", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "codeBlock" as const,
          variant: "body1" as const,
          children: [{ text: "one\ntwo" }],
        },
      ],
    };

    const result = deleteTextAtSelection(
      document,
      createTextSelection(0, 4),
      "backward",
    );
    expect(result.document.content[0]?.type).toBe("codeBlock");
    expect(result.document.content[0]?.children).toEqual([{ text: "onetwo" }]);
    expect(result.selection.focus).toEqual({ block: 0, offset: 3 });
  });

  it("applies paragraph indentation independently of list nesting", () => {
    const document = {
      type: "doc" as const,
      content: [
        {
          type: "paragraph" as const,
          variant: "body1" as const,
          children: [{ text: "Indented" }],
        },
      ],
    };
    const selection = createTextSelection(0, 3);

    expect(setBlockIndent(document, selection, 2).document.content[0]?.indent)
      .toBe(2);
    expect(
      setBlockIndent(
        { type: "doc", content: [{ ...document.content[0]!, indent: 2 }] },
        selection,
        0,
      ).document.content[0]?.indent,
    ).toBeUndefined();
  });

  it("provides reusable word/character counts and find/replace transactions", () => {
    const document = createTextDocument("Hello, café!\nfoo food FOO");
    expect(getTextStatistics(document)).toEqual({
      wordCount: 5,
      characterCount: 25,
    });
    expect(
      findTextInDocument(document, "foo", { caseSensitive: false, wholeWord: true })
        .map((match) => match.start.offset),
    ).toEqual([13, 22]);
    const replaced = replaceAllText(
      document,
      createTextSelection(),
      "foo",
      "bar",
      { caseSensitive: false, wholeWord: true },
    );
    expect(replaced.document.content[0]?.children.map((inline) => inline.text).join(""))
      .toBe("Hello, café!\nbar food bar");
  });

  it("detects slash-command queries only at valid token boundaries", () => {
    const document = createTextDocument("Text /insert-heading");
    const match = getSlashCommandAtSelection(
      document,
      createTextSelection(0, "Text /insert-heading".length),
    );
    expect(match).toEqual({
      query: "insert-heading",
      start: { block: 0, offset: 5 },
      end: { block: 0, offset: 20 },
    });
    expect(
      getSlashCommandAtSelection(
        createTextDocument("https://example.com"),
        createTextSelection(0, 9),
      ),
    ).toBeNull();
  });
});
