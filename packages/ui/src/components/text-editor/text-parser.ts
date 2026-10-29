import { createTextDocument, isHeadingVariant, normalizeInlines, normalizeTextDocument } from "./text-document";
import type { TextBlock, TextDocument, TextInline, TextMark, TextBlockVariant } from "./text-editor.types";

const VARIANTS = new Set<TextBlockVariant>([
  "display1", "display2", "headline1", "headline2", "headline3", "headline4",
  "subtitle1", "subtitle2", "body1", "body2", "button", "caption", "overline",
]);

const MARK_TAGS: Record<string, TextMark> = {
  b: "bold",
  strong: "bold",
  i: "italic",
  em: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  del: "strike",
};

const HEADING_VARIANTS: Record<string, TextBlockVariant> = {
  h1: "headline1",
  h2: "headline2",
  h3: "headline3",
  h4: "headline4",
};

const appendText = (target: TextInline[], text: string, marks: TextMark[]) => {
  if (!text) return;
  target.push({ text, ...(marks.length ? { marks: [...marks] } : {}) });
};

const readInlineNodes = (
  nodes: NodeListOf<ChildNode> | ChildNode[],
  inheritedMarks: TextMark[] = [],
): TextInline[] => {
  const result: TextInline[] = [];

  for (const node of Array.from(nodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(result, node.textContent ?? "", inheritedMarks);
      continue;
    }

    if (!(node instanceof Element)) continue;
    const tag = node.tagName.toLowerCase();
    if (["script", "style", "iframe", "object", "embed", "noscript"].includes(tag)) continue;

    if (tag === "br") {
      if (!node.hasAttribute("data-puzzle-placeholder")) {
        appendText(result, "\n", inheritedMarks);
      }
      continue;
    }

    if (
      node.children.length === 1 &&
      node.firstElementChild?.tagName.toLowerCase() === "br" &&
      node.textContent === ""
    ) {
      // Browsers often represent an empty contenteditable block as <p><br></p>.
      continue;
    }

    const mark = MARK_TAGS[tag];
    const nextMarks = mark
      ? Array.from(new Set([...inheritedMarks, mark]))
      : inheritedMarks;

    // Unsupported elements are transparent: keep their readable children but
    // deliberately discard their styling, attributes and behavior.
    result.push(...readInlineNodes(Array.from(node.childNodes), nextMarks));
  }

  return normalizeInlines(result);
};

const createBlock = (
  variant: TextBlockVariant,
  children: TextInline[],
  forceHeading?: boolean,
): TextBlock => ({
  type: forceHeading || isHeadingVariant(variant) ? "heading" : "paragraph",
  variant,
  children: normalizeInlines(children),
});

const getBlockVariant = (element: Element): TextBlockVariant | undefined => {
  const provided = element.getAttribute("data-puzzle-variant");
  if (provided && VARIANTS.has(provided as TextBlockVariant)) {
    return provided as TextBlockVariant;
  }

  return HEADING_VARIANTS[element.tagName.toLowerCase()];
};

const containsBlockChild = (element: Element): boolean =>
  Array.from(element.children).some((child) =>
    ["p", "div", "h1", "h2", "h3", "h4", "ul", "ol", "li"].includes(
      child.tagName.toLowerCase(),
    ),
  );

const readHtmlBlocks = (nodes: NodeListOf<ChildNode> | ChildNode[]): TextBlock[] => {
  const blocks: TextBlock[] = [];
  let looseInlines: TextInline[] = [];

  const flushLoose = () => {
    if (!looseInlines.length) return;
    blocks.push(createBlock("body1", looseInlines));
    looseInlines = [];
  };

  const visit = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (looseInlines.length === 0 && !text.trim()) return;
      appendText(looseInlines, text, []);
      return;
    }

    if (!(node instanceof Element)) return;
    const tag = node.tagName.toLowerCase();
    if (["script", "style", "iframe", "object", "embed", "noscript"].includes(tag)) return;
    const isKnownBlock = ["p", "div", "h1", "h2", "h3", "h4"].includes(tag);

    if (isKnownBlock && containsBlockChild(node)) {
      flushLoose();
      for (const child of Array.from(node.childNodes)) visit(child);
      return;
    }

    if (isKnownBlock) {
      flushLoose();
      const variant = getBlockVariant(node) ?? "body1";
      const forceHeading = Boolean(HEADING_VARIANTS[tag]);
      blocks.push(createBlock(variant, readInlineNodes(Array.from(node.childNodes)), forceHeading));
      return;
    }

    if (tag === "li") {
      flushLoose();
      blocks.push(createBlock("body1", readInlineNodes(Array.from(node.childNodes))));
      return;
    }

    if (tag === "ul" || tag === "ol") {
      flushLoose();
      for (const child of Array.from(node.childNodes)) visit(child);
      return;
    }

    if (tag === "br") {
      appendText(looseInlines, "\n", []);
      return;
    }

    if (containsBlockChild(node)) {
      flushLoose();
      for (const child of Array.from(node.childNodes)) visit(child);
      return;
    }

    // Text directly inside an unknown wrapper is retained; the wrapper itself
    // and all unsupported attributes are discarded.
    looseInlines.push(...readInlineNodes([node]));
  };

  for (const node of Array.from(nodes)) visit(node);
  flushLoose();
  return blocks;
};

/** Parse HTML into the supported document model. Runs in a browser environment. */
export const parseHtmlToDocument = (html: string): TextDocument => {
  if (typeof DOMParser === "undefined") {
    const withoutUnsafeContent = html.replace(
      /<(script|style|iframe|object|embed|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      "",
    );
    return createTextDocument(withoutUnsafeContent.replace(/<[^>]*>/g, ""));
  }

  const parsed = new DOMParser().parseFromString(html, "text/html");
  const blocks = readHtmlBlocks(Array.from(parsed.body.childNodes));

  return normalizeTextDocument({
    type: "doc",
    content: blocks.length ? blocks : createTextDocument().content,
  });
};

const parseInlineMarkdown = (input: string): TextInline[] => {
  const pattern = /!\[([^\]]*)\]\([^)]+\)|\[([^\]]+)\]\([^)]+\)|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*(.+?)\*|_(.+?)_|`([^`]+)`/g;
  const result: TextInline[] = [];
  let previousIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    appendText(result, input.slice(previousIndex, match.index), []);

    if (match[1] !== undefined) {
      // Images are not supported nodes; preserve their useful alt text.
      appendText(result, match[1], []);
    } else if (match[2] !== undefined) {
      // Links are not supported nodes; preserve the link label only.
      appendText(result, match[2], []);
    } else if (match[3] !== undefined || match[4] !== undefined) {
      appendText(result, match[3] ?? match[4] ?? "", ["bold"]);
    } else if (match[5] !== undefined) {
      appendText(result, match[5], ["strike"]);
    } else if (match[6] !== undefined || match[7] !== undefined) {
      appendText(result, match[6] ?? match[7] ?? "", ["italic"]);
    } else if (match[8] !== undefined) {
      // Inline code is not supported; preserve its contents as regular text.
      appendText(result, match[8], []);
    }

    previousIndex = pattern.lastIndex;
  }

  appendText(result, input.slice(previousIndex), []);
  return normalizeInlines(result);
};

/**
 * Parse a small Markdown subset without a dependency. Unsupported constructs
 * (links, images, lists, quotes and code fences) are flattened to readable text.
 */
export const parseMarkdownToDocument = (markdown: string): TextDocument => {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  const blocks: TextBlock[] = [];
  let paragraphLines: string[] = [];
  let insideCodeFence = false;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const text = paragraphLines.join("\n");
    blocks.push(createBlock("body1", parseInlineMarkdown(text)));
    paragraphLines = [];
  };

  for (const line of lines) {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      flushParagraph();
      insideCodeFence = !insideCodeFence;
      continue;
    }

    if (!insideCodeFence && !line.trim()) {
      flushParagraph();
      continue;
    }

    if (!insideCodeFence) {
      const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
      if (heading) {
        flushParagraph();
        const level = heading[1].length;
        const variant = (`headline${level}`) as TextBlockVariant;
        blocks.push(createBlock(variant, parseInlineMarkdown(heading[2]), true));
        continue;
      }

      if (/^\s{0,3}(?:[-*_]\s*){3,}$/.test(line)) {
        flushParagraph();
        continue;
      }

      // Lists and block quotes are not part of this document model. Strip only
      // their Markdown markers while preserving their content as paragraphs.
      const listItem = line.match(/^\s{0,3}(?:[-+*]|\d+[.)])\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        blocks.push(createBlock("body1", parseInlineMarkdown(listItem[1])));
        continue;
      }

      const quote = line.match(/^\s{0,3}>\s?(.*)$/);
      if (quote) {
        paragraphLines.push(quote[1]);
        continue;
      }
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return normalizeTextDocument({
    type: "doc",
    content: blocks.length ? blocks : createTextDocument().content,
  });
};
