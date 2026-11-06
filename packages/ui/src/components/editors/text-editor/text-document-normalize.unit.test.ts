import { describe, expect, it } from "vitest";
import {
  createTextDocument,
  getBlockLength,
  getBlockText,
  isHeadingVariant,
  normalizeInlines,
  normalizeTextDocument,
} from "./text-document";
import type { TextDocument } from "./text-editor.types";

describe("normalizeInlines", () => {
  it("merges adjacent runs with identical marks", () => {
    expect(
      normalizeInlines([
        { text: "a", marks: ["bold"] },
        { text: "b", marks: ["bold"] },
      ]),
    ).toEqual([{ text: "ab", marks: ["bold"] }]);
  });

  it("keeps runs with different marks apart", () => {
    expect(
      normalizeInlines([
        { text: "a", marks: ["bold"] },
        { text: "b", marks: [] },
      ]),
    ).toHaveLength(2);
  });
});

describe("block helpers", () => {
  it("reads text and length across inline runs", () => {
    const block = {
      type: "paragraph" as const,
      variant: "body1" as const,
      children: [{ text: "ab" }, { text: "cde" }],
    };

    expect(getBlockText(block)).toBe("abcde");
    expect(getBlockLength(block)).toBe(5);
  });

  it("identifies heading variants", () => {
    expect(isHeadingVariant("headline1")).toBe(true);
    expect(isHeadingVariant("body1")).toBe(false);
  });

  it("creates a document with one paragraph", () => {
    expect(createTextDocument("Hi").content).toHaveLength(1);
  });
});

describe("normalizeTextDocument headingLevel", () => {
  const heading = (headingLevel: unknown): TextDocument =>
    ({
      type: "doc",
      content: [
        {
          type: "heading",
          variant: "headline4",
          headingLevel,
          children: [{ text: "Title" }],
        },
      ],
    }) as TextDocument;

  it("keeps a valid level independent of the variant", () => {
    const [block] = normalizeTextDocument(heading(2)).content;

    expect(block.type).toBe("heading");
    expect(block.variant).toBe("headline4");
    expect(block.headingLevel).toBe(2);
  });

  it.each([0, 7, 1.5, "2", null])("drops the invalid level %s", (level) => {
    const [block] = normalizeTextDocument(heading(level)).content;

    expect(block.headingLevel).toBeUndefined();
  });

  it("drops the level of non-heading blocks", () => {
    const [block] = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          headingLevel: 2,
          children: [{ text: "Text" }],
        },
      ],
    } as TextDocument).content;

    expect(block.headingLevel).toBeUndefined();
  });
});
