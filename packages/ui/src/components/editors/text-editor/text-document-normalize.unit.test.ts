import { describe, expect, it } from "vitest";
import {
  createTextDocument,
  getBlockLength,
  getBlockText,
  isHeadingVariant,
  normalizeInlines,
  normalizeTextDocument,
  validateTextDocument,
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

    expect(block!.type).toBe("heading");
    expect(block!.variant).toBe("headline4");
    expect(block!.headingLevel).toBe(2);
  });

  it.each([0, 7, 1.5, "2", null])("drops the invalid level %s", (level) => {
    const [block] = normalizeTextDocument(heading(level)).content;

    expect(block!.headingLevel).toBeUndefined();
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

    expect(block!.headingLevel).toBeUndefined();
  });
});

describe("normalizeTextDocument lists", () => {
  it("keeps legacy bullet and ordered blocks unchanged", () => {
    const legacy: TextDocument = {
      type: "doc",
      content: [
        {
          type: "listItem",
          variant: "body1",
          listType: "bullet",
          children: [{ text: "Bullet" }],
        },
        {
          type: "listItem",
          variant: "body1",
          listType: "ordered",
          children: [{ text: "Ordered" }],
        },
      ],
    };

    expect(normalizeTextDocument(legacy)).toEqual(legacy);
  });

  it("normalizes checklist defaults independently from checked state", () => {
    const normalized = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "listItem",
          variant: "body1",
          listType: "checklist",
          checked: true,
          children: [{ text: "Done" }],
        },
        {
          type: "listItem",
          variant: "body1",
          listType: "checklist",
          checked: "true",
          listAttributes: { interactive: "yes" },
          children: [{ text: "Next" }],
        },
      ],
    });

    expect(normalized.content).toMatchObject([
      {
        checked: true,
        listAttributes: { interactive: false },
      },
      {
        checked: false,
        listAttributes: { interactive: false },
      },
    ]);
  });

  it("clamps icon attributes and rejects unsafe identifiers and colors", () => {
    const normalized = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "listItem",
          variant: "body1",
          listType: "icon",
          listAttributes: {
            icon: {
              name: "javascript:alert",
              size: 1000,
              color: "red; background:url(javascript:alert(1))",
            },
          },
          children: [{ text: "Item" }],
        },
      ],
    });

    expect(normalized.content[0]?.listAttributes).toEqual({
      icon: { name: "mdi:circle", size: 64, color: "currentColor" },
    });
    expect(normalizeTextDocument(normalized)).toEqual(normalized);
  });

  it("clamps nested indentation and prevents invalid depth jumps", () => {
    const normalized = normalizeTextDocument({
      type: "doc",
      content: [
        { type: "listItem", variant: "body1", listType: "bullet", indent: 2, children: [] },
        { type: "listItem", variant: "body1", listType: "bullet", indent: 1, children: [] },
        { type: "listItem", variant: "body1", listType: "bullet", indent: 8, children: [] },
        { type: "paragraph", variant: "body1", children: [] },
        { type: "listItem", variant: "body1", listType: "bullet", indent: 8, children: [] },
      ],
    });

    expect(normalized.content.map((block) => block.indent ?? 0)).toEqual([
      0,
      1,
      2,
      0,
      0,
    ]);
  });

  it("preserves valid paragraph indentation without allowing it to parent lists", () => {
    const normalized = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          indent: 3,
          children: [{ text: "Paragraph" }],
        },
        {
          type: "listItem",
          variant: "body1",
          listType: "bullet",
          indent: 3,
          children: [{ text: "Top-level list" }],
        },
      ],
    });

    expect(normalized.content.map((block) => block.indent ?? 0)).toEqual([
      3,
      0,
    ]);
  });
});

describe("validateTextDocument", () => {
  it("distinguishes normalized, recoverable, and invalid documents", () => {
    expect(validateTextDocument(createTextDocument("Valid")).status).toBe("valid");
    expect(
      validateTextDocument({
        type: "doc",
        content: [
          {
            type: "listItem",
            variant: "body1",
            listType: "icon",
            listAttributes: { icon: { name: "bad", size: 99, color: "url(x)" } },
            children: [{ text: "Recoverable" }],
          },
        ],
      }).status,
    ).toBe("recoverable");
    expect(
      validateTextDocument({
        type: "doc",
        content: [{ type: "image", children: [] }],
      }).status,
    ).toBe("invalid");
  });
});

describe("document scale", () => {
  it("normalizes a 2,000-block document within the generous 2-second budget", () => {
    const input = {
      type: "doc",
      content: Array.from({ length: 2_000 }, (_, index) => ({
        type: "paragraph",
        variant: "body1",
        children: [{ text: `Paragraph ${index}` }],
      })),
    };
    const startedAt = performance.now();
    const normalized = normalizeTextDocument(input);

    expect(normalized.content).toHaveLength(2_000);
    expect(performance.now() - startedAt).toBeLessThan(2_000);
  });
});
