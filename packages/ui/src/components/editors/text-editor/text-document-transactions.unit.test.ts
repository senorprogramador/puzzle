import { describe, expect, it } from "vitest";
import {
  applyMark,
  createTextDocument,
  createTextSelection,
  setListType,
  setTextAlign,
  setTextVariant,
} from "./text-document";

describe("document transactions", () => {
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
});
