import { describe, expect, it } from "vitest";
import {
  applyMark,
  createTextDocument,
  createTextSelection,
  getBlockText,
  insertDocumentAtSelection,
  normalizeTextDocument,
  setTextVariant,
  setTextAlign,
  setListType,
  setTextLink,
} from "./text-document";
import { parseHtmlToDocument, parseMarkdownToDocument } from "./text-parser";
import type { TextDocument } from "./text-editor.types";

describe("text HTML parsing", () => {
  it("preserves inline text alignment", () => {
    expect(parseHtmlToDocument('<p style="text-align: center">Hello</p>')).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [{ text: "Hello" }],
          align: "center",
        },
      ],
    });
  });

  it("preserves semantic heading levels in editable markup", () => {
    expect(
      parseHtmlToDocument(
        '<p data-puzzle-variant="headline4" data-puzzle-heading-level="2">Title</p>',
      ).content[0],
    ).toMatchObject({
      type: "heading",
      variant: "headline4",
      headingLevel: 2,
      children: [{ text: "Title" }],
    });
  });

  it("parses safe links and discards unsafe link URLs", () => {
    expect(
      parseHtmlToDocument(
        '<p><a href="https://example.com">Safe</a> <a href="javascript:alert(1)">Unsafe</a></p>',
      ).content[0]!.children,
    ).toEqual([
      { text: "Safe", link: { href: "https://example.com" } },
      { text: " Unsafe" },
    ]);

    expect(
      normalizeTextDocument({
        type: "doc",
        content: [
          {
            type: "paragraph",
            variant: "body1",
            children: [{ text: "Unsafe", link: { href: "data:text/html,x" } }],
          },
        ],
      }).content[0]!.children,
    ).toEqual([{ text: "Unsafe" }]);
  });

  it("parses Markdown links into link nodes", () => {
    expect(
      parseMarkdownToDocument("[Puzzle](https://example.com)")
        .content[0]!.children,
    ).toEqual([
      { text: "Puzzle", link: { href: "https://example.com" } },
    ]);
  });

  it.each(["h5", "h6"])("parses semantic %s headings", (tag) => {
    expect(parseHtmlToDocument(`<${tag}>Title</${tag}>`).content[0]).toMatchObject({
      type: "heading",
      headingLevel: Number(tag.slice(1)),
      children: [{ text: "Title" }],
    });
  });
});

const documentWithText = (text: string): TextDocument => ({
  type: "doc",
  content: [{ type: "paragraph", variant: "body1", children: [{ text }] }],
});

describe("text document operations", () => {
  it("applies and removes a mark only for the selected range", () => {
    const document = documentWithText("Hello world");
    const selection = {
      anchor: { block: 0, offset: 6 },
      focus: { block: 0, offset: 11 },
    };

    const bold = applyMark(document, selection, "bold").document;
    expect(bold.content[0]!.children).toEqual([
      { text: "Hello " },
      { text: "world", marks: ["bold"] },
    ]);

    expect(applyMark(bold, selection, "bold").document).toEqual(document);
  });

  it("applies and removes a link without losing marks", () => {
    const document: TextDocument = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [{ text: "Hello", marks: ["bold"] }],
        },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 1 },
      focus: { block: 0, offset: 4 },
    };

    const linked = setTextLink(document, selection, "https://example.com");
    expect(linked.document.content[0]!.children).toEqual([
      { text: "H", marks: ["bold"] },
      {
        text: "ell",
        marks: ["bold"],
        link: { href: "https://example.com" },
      },
      { text: "o", marks: ["bold"] },
    ]);

    expect(setTextLink(linked.document, selection, null).document).toEqual(
      document,
    );
  });

  it("edits or removes the whole link when the caret is inside it", () => {
    const document: TextDocument = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [
            { text: "Hello", link: { href: "https://old.example" } },
          ],
        },
      ],
    };
    const caret = createTextSelection(0, 2);

    expect(
      setTextLink(document, caret, "https://new.example").document.content[0]!
        .children,
    ).toEqual([{ text: "Hello", link: { href: "https://new.example" } }]);
    expect(setTextLink(document, caret, null).document.content[0]!.children)
      .toEqual([{ text: "Hello" }]);
  });

  it("changes the selected block to a theme heading role", () => {
    const next = setTextVariant(
      documentWithText("Title"),
      createTextSelection(0, 2),
      "headline2",
    ).document;

    expect(next.content[0]!.type).toBe("heading");
    expect(next.content[0]!.variant).toBe("headline2");
  });

  it("replaces the selection with a parsed document and returns the caret", () => {
    const document = documentWithText("Hello world");
    const inserted: TextDocument = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [{ text: "Puzzle", marks: ["italic"] }],
        },
      ],
    };
    const result = insertDocumentAtSelection(
      document,
      {
        anchor: { block: 0, offset: 6 },
        focus: { block: 0, offset: 11 },
      },
      inserted,
    );

    expect(getBlockText(result.document.content[0]!)).toBe("Hello Puzzle");
    expect(result.document.content[0]!.children[1]).toEqual({
      text: "Puzzle",
      marks: ["italic"],
    });
    expect(result.selection).toEqual({
      anchor: { block: 0, offset: 12 },
      focus: { block: 0, offset: 12 },
    });
  });

  it("keeps pasted headings as separate blocks when inserted into body text", () => {
    const result = insertDocumentAtSelection(
      documentWithText("Before after"),
      createTextSelection(0, 7),
      {
        type: "doc",
        content: [
          {
            type: "heading",
            variant: "headline2",
            children: [{ text: "Title" }],
          },
          { type: "paragraph", variant: "body1", children: [{ text: "Body" }] },
        ],
      },
    );

    expect(
      result.document.content.map((block) => [block.type, getBlockText(block)]),
    ).toEqual([
      ["paragraph", "Before "],
      ["heading", "Title"],
      ["paragraph", "Bodyafter"],
    ]);
    expect(result.selection).toEqual({
      anchor: { block: 2, offset: 4 },
      focus: { block: 2, offset: 4 },
    });
  });

  it("applies alignment and list semantics to selected blocks", () => {
    const document: TextDocument = {
      type: "doc",
      content: [
        { type: "paragraph", variant: "body1", children: [{ text: "First" }] },
        { type: "paragraph", variant: "body1", children: [{ text: "Second" }] },
      ],
    };
    const selection = {
      anchor: { block: 0, offset: 0 },
      focus: { block: 1, offset: 6 },
    };
    const aligned = setTextAlign(document, selection, "center").document;
    expect(aligned.content.every((block) => block.align === "center")).toBe(
      true,
    );
    const listed = setListType(aligned, selection, "ordered").document;
    expect(listed.content.map((block) => block.listType)).toEqual([
      "ordered",
      "ordered",
    ]);
    expect(listed.content.map((block) => block.type)).toEqual([
      "listItem",
      "listItem",
    ]);
    const unlisted = setListType(listed, selection, "ordered").document;
    expect(unlisted.content.every((block) => !block.listType)).toBe(true);
  });

  it("creates a lean empty document", () => {
    expect(createTextDocument()).toEqual({
      type: "doc",
      content: [{ type: "paragraph", variant: "body1", children: [] }],
    });
  });
});
