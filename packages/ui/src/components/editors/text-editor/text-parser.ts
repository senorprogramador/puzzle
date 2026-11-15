import {
  createTextDocument,
  isHeadingVariant,
  normalizeInlines,
  normalizeLinkHref,
  normalizeTextDocument,
} from "./text-document";
import type {
  TextAlign,
  TextBlock,
  TextBlockVariant,
  TextDocument,
  TextHeadingLevel,
  TextInline,
  TextListType,
  TextMark,
} from "./text-editor.types";

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
  h5: "headline4",
  h6: "headline4",
};

const HEADING_LEVELS: Record<string, TextHeadingLevel> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

const appendText = (
  target: TextInline[],
  text: string,
  marks: TextMark[],
  href?: string,
) => {
  if (!text) return;
  target.push({
    text,
    ...(marks.length ? { marks: [...marks] } : {}),
    ...(href ? { link: { href } } : {}),
  });
};

const readInlineNodes = (
  nodes: NodeListOf<ChildNode> | ChildNode[],
  inheritedMarks: TextMark[] = [],
  inheritedLink?: string,
): TextInline[] => {
  const result: TextInline[] = [];

  for (const node of Array.from(nodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(result, node.textContent ?? "", inheritedMarks, inheritedLink);
      continue;
    }

    if (!(node instanceof Element)) continue;
    const tag = node.tagName.toLowerCase();
    if (["script", "style", "iframe", "object", "embed", "noscript"].includes(tag)) continue;

    if (tag === "br") {
      if (!node.hasAttribute("data-puzzle-placeholder")) {
        appendText(result, "\n", inheritedMarks, inheritedLink);
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
    const nextLink =
      tag === "a"
        ? normalizeLinkHref(node.getAttribute("href") ?? "") ?? undefined
        : inheritedLink;

    // Unsupported elements are transparent: keep their readable children but
    // deliberately discard their styling, attributes and behavior.
    result.push(
      ...readInlineNodes(Array.from(node.childNodes), nextMarks, nextLink),
    );
  }

  return normalizeInlines(result);
};

const createBlock = (
  variant: TextBlockVariant,
  children: TextInline[],
  forceHeading?: boolean,
  align?: TextAlign,
  listType?: TextListType,
  headingLevel?: TextHeadingLevel,
): TextBlock => ({
  type: listType ? "listItem" : forceHeading || isHeadingVariant(variant) ? "heading" : "paragraph",
  variant,
  children: normalizeInlines(children),
  ...(align ? { align } : {}),
  ...(listType ? { listType } : {}),
  ...(headingLevel ? { headingLevel } : {}),
});

const getBlockAlign = (element: Element): TextAlign | undefined => {
  const align =
    element.getAttribute("data-puzzle-align") ??
    (element as HTMLElement).style.textAlign;
  return align === "left" || align === "center" || align === "right" || align === "justify"
    ? align
    : undefined;
};

const getBlockVariant = (element: Element): TextBlockVariant | undefined => {
  const provided = element.getAttribute("data-puzzle-variant");
  if (provided && VARIANTS.has(provided as TextBlockVariant)) {
    return provided as TextBlockVariant;
  }

  return HEADING_VARIANTS[element.tagName.toLowerCase()];
};

const getBlockHeadingLevel = (
  element: Element,
): TextHeadingLevel | undefined => {
  const provided = element.getAttribute("data-puzzle-heading-level");
  if (provided) {
    const level = Number(provided);
    if (Number.isInteger(level) && level >= 1 && level <= 6) {
      return level as TextHeadingLevel;
    }
  }

  return HEADING_LEVELS[element.tagName.toLowerCase()];
};

const containsBlockChild = (element: Element): boolean =>
  Array.from(element.children).some((child) =>
    ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"].includes(
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
    const isKnownBlock = [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ].includes(tag);

    if (isKnownBlock && containsBlockChild(node)) {
      flushLoose();
      for (const child of Array.from(node.childNodes)) visit(child);
      return;
    }

    if (isKnownBlock) {
      flushLoose();
      const variant = getBlockVariant(node) ?? "body1";
      const forceHeading = Boolean(HEADING_VARIANTS[tag]);
      const dataListType = node.getAttribute("data-puzzle-list-type");
      const listType: TextListType | undefined = dataListType === "bullet" || dataListType === "ordered" ? dataListType : undefined;
      blocks.push(
        createBlock(
          variant,
          readInlineNodes(Array.from(node.childNodes)),
          forceHeading,
          getBlockAlign(node),
          listType,
          getBlockHeadingLevel(node),
        ),
      );
      return;
    }

    if (tag === "li") {
      flushLoose();
      const parentTag = node.parentElement?.tagName.toLowerCase();
      const listType: TextListType | undefined = parentTag === "ul" ? "bullet" : parentTag === "ol" ? "ordered" : undefined;
      blocks.push(createBlock("body1", readInlineNodes(Array.from(node.childNodes)), false, getBlockAlign(node), listType));
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
  const pattern =
    /!\[(?<imageAlt>[^\]]*)\]\([^)]+\)|\[(?<linkText>[^\]]+)\]\((?<linkHref>[^)]+)\)|\*\*(?<boldA>.+?)\*\*|__(?<boldB>.+?)__|~~(?<strike>.+?)~~|\*(?<italicA>.+?)\*|_(?<italicB>.+?)_|`(?<code>[^`]+)`/g;
  const result: TextInline[] = [];
  let previousIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    appendText(result, input.slice(previousIndex, match.index), []);
    const groups = match.groups!;

    if (groups.imageAlt !== undefined) {
      // Images are not supported nodes; preserve their useful alt text.
      appendText(result, groups.imageAlt, []);
    } else if (groups.linkText !== undefined) {
      appendText(
        result,
        groups.linkText,
        [],
        normalizeLinkHref(groups.linkHref!) ?? undefined,
      );
    } else if (groups.boldA !== undefined || groups.boldB !== undefined) {
      appendText(result, groups.boldA ?? groups.boldB ?? "", ["bold"]);
    } else if (groups.strike !== undefined) {
      appendText(result, groups.strike, ["strike"]);
    } else if (groups.italicA !== undefined || groups.italicB !== undefined) {
      appendText(result, groups.italicA ?? groups.italicB ?? "", ["italic"]);
    } else if (groups.code !== undefined) {
      // Inline code is not supported; preserve its contents as regular text.
      appendText(result, groups.code, []);
    }

    previousIndex = pattern.lastIndex;
  }

  appendText(result, input.slice(previousIndex), []);
  return normalizeInlines(result);
};

/**
 * Parse a small Markdown subset without a dependency. Unsupported constructs
 * are flattened to readable text; supported inline marks, headings and lists remain semantic.
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
        const level = heading[1]!.length;
        const variant = (`headline${level}`) as TextBlockVariant;
        blocks.push(createBlock(variant, parseInlineMarkdown(heading[2]!), true));
        continue;
      }

      if (/^\s{0,3}(?:[-*_]\s*){3,}$/.test(line)) {
        flushParagraph();
        continue;
      }

      const listItem = line.match(/^\s{0,3}([-+*]|\d+[.)])\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        const listType: TextListType = /^\d/.test(listItem[1]!) ? "ordered" : "bullet";
        blocks.push(createBlock("body1", parseInlineMarkdown(listItem[2]!), false, undefined, listType));
        continue;
      }

      const quote = line.match(/^\s{0,3}>\s?(.*)$/);
      if (quote) {
        paragraphLines.push(quote[1]!);
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
