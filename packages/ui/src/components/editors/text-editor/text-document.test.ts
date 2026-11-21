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
import {
  parseHtmlToDocument,
  parseMarkdownToDocument,
  serializeTextDocumentToHtml,
  serializeTextDocumentToMarkdown,
} from "./text-parser";
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

  it("drops unsafe HTML elements and attributes while retaining safe text", () => {
    const parsed = parseHtmlToDocument(
      '<p onclick="alert(1)">Safe<script>alert(2)</script><img src="x" onerror="alert(3)"></p>',
    );

    expect(getBlockText(parsed.content[0]!)).toBe("Safe");
    expect(serializeTextDocumentToHtml({
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [{ text: `<img src=x onerror="alert(1)">` }],
        },
      ],
    })).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("preserves safe formatting from Word and Google Docs style spans", () => {
    const parsed = parseHtmlToDocument(
      '<p><span style="font-weight:700;font-style:italic;text-decoration:underline line-through">Styled</span></p>',
    );

    expect(parsed.content[0]?.children).toEqual([
      { text: "Styled", marks: ["bold", "italic", "underline", "strike"] },
    ]);
  });

  it("parses Markdown links into link nodes", () => {
    expect(
      parseMarkdownToDocument("[Puzzle](https://example.com)")
        .content[0]!.children,
    ).toEqual([
      { text: "Puzzle", link: { href: "https://example.com" } },
    ]);
  });

  it("round-trips inline code through Markdown and semantic HTML", () => {
    const document = parseMarkdownToDocument(
      "Use ``const marker = `value`;`` here.",
    );

    expect(document.content[0]!.children).toEqual([
      { text: "Use " },
      { text: "const marker = `value`;", marks: ["code"] },
      { text: " here." },
    ]);

    const html = serializeTextDocumentToHtml(document);
    expect(html).toContain("<code>const marker = `value`;</code>");
    expect(parseHtmlToDocument(html)).toEqual(document);
    expect(
      parseMarkdownToDocument(serializeTextDocumentToMarkdown(document)),
    ).toEqual(document);
  });

  it.each(["h5", "h6"])("parses semantic %s headings", (tag) => {
    expect(parseHtmlToDocument(`<${tag}>Title</${tag}>`).content[0]).toMatchObject({
      type: "heading",
      headingLevel: Number(tag.slice(1)),
      children: [{ text: "Title" }],
    });
  });

  it("parses nested HTML lists and task-list state", () => {
    const parsed = parseHtmlToDocument(
      '<ul data-puzzle-list-type="checklist" data-puzzle-list-interactive="true"><li><input type="checkbox" checked><strong>Parent</strong><ol><li>Nested</li></ol></li><li><input type="checkbox">Next</li></ul>',
    );

    expect(parsed.content).toMatchObject([
      {
        listType: "checklist",
        listAttributes: { interactive: true },
        checked: true,
        children: [{ text: "Parent", marks: ["bold"] }],
      },
      {
        listType: "ordered",
        indent: 1,
        children: [{ text: "Nested" }],
      },
      {
        listType: "checklist",
        listAttributes: { interactive: true },
        checked: false,
        children: [{ text: "Next" }],
      },
    ]);
  });

  it("parses semantic blockquotes, code blocks, inline code, and rules", () => {
    const parsed = parseHtmlToDocument(
      "<blockquote><p>Quote <code>inline</code></p></blockquote><pre><code>line one\n  line two</code></pre><hr>",
    );
    expect(parsed.content.map((block) => block.type)).toEqual([
      "blockquote",
      "codeBlock",
      "horizontalRule",
    ]);
    expect(parsed.content[0]?.children).toEqual([
      { text: "Quote " },
      { text: "inline", marks: ["code"] },
    ]);
    expect(getBlockText(parsed.content[1]!)).toBe("line one\n  line two");
    expect(parseHtmlToDocument(serializeTextDocumentToHtml(parsed))).toEqual(
      parsed,
    );
  });

  it("parses icon list metadata without trusting its attributes", () => {
    const parsed = parseHtmlToDocument(
      '<ul data-puzzle-list-type="icon" data-puzzle-list-icon="mdi:star" data-puzzle-list-icon-size="1000" data-puzzle-list-icon-color="url(javascript:alert(1))"><li>Star</li></ul>',
    );

    expect(parsed.content[0]?.listAttributes).toEqual({
      icon: { name: "mdi:star", size: 64, color: "currentColor" },
    });
  });

  it("round-trips nested list attributes through deterministic HTML", () => {
    const document = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "listItem",
          variant: "headline2",
          headingLevel: 2,
          listType: "checklist",
          listAttributes: { interactive: true },
          checked: true,
          children: [{ text: "Parent", marks: ["bold"] }],
        },
        {
          type: "listItem",
          variant: "body1",
          listType: "icon",
          indent: 1,
          listAttributes: {
            icon: { name: "mdi:star", size: 20, color: "#123456" },
          },
          children: [{ text: "Nested" }],
        },
      ],
    });

    const html = serializeTextDocumentToHtml(document);
    expect(html).toContain('<ul data-puzzle-list-type="checklist"');
    expect(html).toContain('data-puzzle-list-interactive="true"');
    expect(parseHtmlToDocument(html)).toEqual(document);
    expect(serializeTextDocumentToHtml(document)).toBe(html);
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

  it("makes inline code exclusive with other marks and links", () => {
    const document: TextDocument = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          variant: "body1",
          children: [
            {
              text: "value",
              marks: ["bold"],
              link: { href: "https://example.com" },
            },
          ],
        },
      ],
    };

    expect(
      applyMark(
        document,
        {
          anchor: { block: 0, offset: 0 },
          focus: { block: 0, offset: 5 },
        },
        "code",
      ).document.content[0]!
        .children,
    ).toEqual([{ text: "value", marks: ["code"] }]);
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

  it("keeps pasted list items semantic between surrounding paragraph text", () => {
    const result = insertDocumentAtSelection(
      documentWithText("BeforeAfter"),
      createTextSelection(0, 6),
      {
        type: "doc",
        content: [
          {
            type: "listItem",
            variant: "body1",
            listType: "checklist",
            checked: true,
            listAttributes: { interactive: false },
            children: [{ text: "Task" }],
          },
        ],
      },
    );

    expect(result.document.content.map((block) => ({
      type: block.type,
      listType: block.listType,
      text: getBlockText(block),
    }))).toEqual([
      { type: "paragraph", listType: undefined, text: "Before" },
      { type: "listItem", listType: "checklist", text: "Task" },
      { type: "paragraph", listType: undefined, text: "After" },
    ]);
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

  it("parses nested Markdown and checked task-list items", () => {
    const parsed = parseMarkdownToDocument(
      "- [x] Done\n  - Nested\n- [ ] Next",
    );

    expect(parsed.content.map((block) => ({
      listType: block.listType,
      checked: block.checked,
      indent: block.indent ?? 0,
      text: getBlockText(block),
    }))).toEqual([
      { listType: "checklist", checked: true, indent: 0, text: "Done" },
      { listType: "bullet", checked: undefined, indent: 1, text: "Nested" },
      { listType: "checklist", checked: false, indent: 0, text: "Next" },
    ]);
  });

  it("parses Markdown blockquotes, fenced code, inline code, and rules", () => {
    const parsed = parseMarkdownToDocument(
      "> quoted\n> lines\n\n```ts\nconst value = `code`;\n```\n\n---",
    );

    expect(parsed.content.map((block) => block.type)).toEqual([
      "blockquote",
      "codeBlock",
      "horizontalRule",
    ]);
    expect(getBlockText(parsed.content[0]!)).toBe("quoted\nlines");
    expect(getBlockText(parsed.content[1]!)).toBe("const value = `code`;");
    expect(parseMarkdownToDocument("inline `code`").content[0]?.children)
      .toEqual([
        { text: "inline " },
        { text: "code", marks: ["code"] },
      ]);
    expect(
      parseMarkdownToDocument(serializeTextDocumentToMarkdown(parsed)),
    ).toEqual(parsed);
  });

  it("round-trips nested tasks and degrades icon lists to Markdown bullets", () => {
    const document = normalizeTextDocument({
      type: "doc",
      content: [
        {
          type: "listItem",
          variant: "body1",
          listType: "checklist",
          checked: true,
          children: [{ text: "Done", marks: ["bold"] }],
        },
        {
          type: "listItem",
          variant: "body1",
          listType: "icon",
          indent: 1,
          listAttributes: {
            icon: { name: "mdi:star", size: 18, color: "currentColor" },
          },
          children: [{ text: "Nested icon" }],
        },
      ],
    });
    const markdown = serializeTextDocumentToMarkdown(document);

    expect(markdown).toBe("- [x] **Done**\n  - Nested icon");
    expect(parseMarkdownToDocument(markdown)).toMatchObject({
      content: [
        { listType: "checklist", checked: true },
        { listType: "bullet", indent: 1 },
      ],
    });
  });
});
