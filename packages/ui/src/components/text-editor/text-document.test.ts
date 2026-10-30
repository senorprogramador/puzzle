import { describe, expect, it } from "vitest";
import {
  applyMark,
  createTextDocument,
  createTextSelection,
  getBlockText,
  insertDocumentAtSelection,
  setTextVariant,
  setTextAlign,
  setListType,
} from "./text-document";
import type { TextDocument } from "./text-editor.types";

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

    const bold = applyMark(document, selection, "bold");
    expect(bold.content[0].children).toEqual([
      { text: "Hello " },
      { text: "world", marks: ["bold"] },
    ]);

    expect(applyMark(bold, selection, "bold")).toEqual(document);
  });

  it("changes the selected block to a theme heading role", () => {
    const next = setTextVariant(
      documentWithText("Title"),
      createTextSelection(0, 2),
      "headline2",
    );

    expect(next.content[0].type).toBe("heading");
    expect(next.content[0].variant).toBe("headline2");
  });

  it("replaces the selection with a parsed document and returns the caret", () => {
    const document = documentWithText("Hello world");
    const inserted: TextDocument = {
      type: "doc",
      content: [{
        type: "paragraph",
        variant: "body1",
        children: [{ text: "Puzzle", marks: ["italic"] }],
      }],
    };
    const result = insertDocumentAtSelection(document, {
      anchor: { block: 0, offset: 6 },
      focus: { block: 0, offset: 11 },
    }, inserted);

    expect(getBlockText(result.document.content[0])).toBe("Hello Puzzle");
    expect(result.document.content[0].children[1]).toEqual({
      text: "Puzzle",
      marks: ["italic"],
    });
    expect(result.selection).toEqual({
      anchor: { block: 0, offset: 11 },
      focus: { block: 0, offset: 11 },
    });
  });

  it("keeps pasted headings as separate blocks when inserted into body text", () => {
    const result = insertDocumentAtSelection(
      documentWithText("Before after"),
      createTextSelection(0, 7),
      {
        type: "doc",
        content: [
          { type: "heading", variant: "headline2", children: [{ text: "Title" }] },
          { type: "paragraph", variant: "body1", children: [{ text: "Body" }] },
        ],
      },
    );

    expect(result.document.content.map((block) => [block.type, getBlockText(block)])).toEqual([
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
    const aligned = setTextAlign(document, selection, "center");
    expect(aligned.content.every((block) => block.align === "center")).toBe(true);
    const listed = setListType(aligned, selection, "ordered");
    expect(listed.content.map((block) => block.listType)).toEqual(["ordered", "ordered"]);
    expect(listed.content.map((block) => block.type)).toEqual(["listItem", "listItem"]);
    const unlisted = setListType(listed, selection, "ordered");
    expect(unlisted.content.every((block) => !block.listType)).toBe(true);
  });

  it("creates a lean empty document", () => {
    expect(createTextDocument()).toEqual({
      type: "doc",
      content: [{ type: "paragraph", variant: "body1", children: [] }],
    });
  });
});
