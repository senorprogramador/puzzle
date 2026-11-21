import {
  createTextDocument,
  getBlockText,
  isHeadingVariant,
  MAX_TEXT_LIST_INDENT,
  normalizeInlines,
  normalizeLinkHref,
  normalizeTextDocument,
} from "./text-document";
import { createTextListTree } from "./text-list-tree";
import type {
  TextAlign,
  TextBlock,
  TextBlockVariant,
  TextDocument,
  TextHeadingLevel,
  TextInline,
  TextListAttributes,
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
  code: "code",
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

    const nextMarks = new Set(inheritedMarks);
    const tagMark = MARK_TAGS[tag];
    if (tagMark) nextMarks.add(tagMark);
    const style = (node as HTMLElement).style;
    const fontWeight = style.fontWeight.toLowerCase();
    if (fontWeight === "bold" || Number.parseInt(fontWeight, 10) >= 600) {
      nextMarks.add("bold");
    }
    if (
      style.fontStyle === "italic" ||
      style.fontStyle === "oblique"
    ) {
      nextMarks.add("italic");
    }
    const textDecoration = `${style.textDecoration} ${style.textDecorationLine}`;
    if (textDecoration.includes("underline")) nextMarks.add("underline");
    if (textDecoration.includes("line-through")) nextMarks.add("strike");
    const normalizedMarks = Array.from(nextMarks);
    const nextLink =
      tag === "a"
        ? normalizeLinkHref(node.getAttribute("href") ?? "") ?? undefined
        : inheritedLink;

    // Unsupported elements are transparent: keep their readable children but
    // deliberately discard their styling, attributes and behavior.
    result.push(
      ...readInlineNodes(Array.from(node.childNodes), normalizedMarks, nextLink),
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
  listAttributes?: TextListAttributes,
  checked?: boolean,
  indent?: number,
): TextBlock => ({
  type: listType
    ? "listItem"
    : forceHeading || isHeadingVariant(variant)
      ? "heading"
      : "paragraph",
  variant,
  children: normalizeInlines(children),
  ...(align ? { align } : {}),
  ...(listType ? { listType } : {}),
  ...(listAttributes ? { listAttributes } : {}),
  ...(listType === "checklist" ? { checked: checked === true } : {}),
  ...(indent ? { indent } : {}),
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

const getBlockIndent = (element: Element): number | undefined => {
  const rawIndent = element.getAttribute("data-puzzle-indent");
  if (rawIndent === null) return undefined;
  const indent = Number(rawIndent);
  return Number.isInteger(indent) &&
    indent >= 0 &&
    indent <= MAX_TEXT_LIST_INDENT
    ? indent
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
    [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "hr",
    ].includes(child.tagName.toLowerCase()),
  );

const readHtmlBlocks = (nodes: NodeListOf<ChildNode> | ChildNode[]): TextBlock[] => {
  const blocks: TextBlock[] = [];
  let looseInlines: TextInline[] = [];

  const flushLoose = () => {
    if (!looseInlines.length) return;
    blocks.push(createBlock("body1", looseInlines));
    looseInlines = [];
  };

  const isListElement = (element: Element): boolean => {
    const tag = element.tagName.toLowerCase();
    return tag === "ul" || tag === "ol";
  };

  const readListAttributes = (
    element: Element,
    listType: TextListType,
  ): TextListAttributes | undefined => {
    if (listType === "checklist") {
      return {
        interactive:
          element.getAttribute("data-puzzle-list-interactive") === "true",
      };
    }
    if (listType !== "icon") return undefined;
    const size = Number(element.getAttribute("data-puzzle-list-icon-size"));
    return {
      icon: {
        name: element.getAttribute("data-puzzle-list-icon") ?? "",
        size: Number.isFinite(size) ? size : 18,
        color:
          element.getAttribute("data-puzzle-list-icon-color") ?? "currentColor",
      },
    };
  };

  const findCheckbox = (element: Element): HTMLInputElement | undefined => {
    for (const child of Array.from(element.children)) {
      if (isListElement(child)) continue;
      if (
        child.tagName.toLowerCase() === "input" &&
        child.getAttribute("type")?.toLowerCase() === "checkbox"
      ) {
        return child as HTMLInputElement;
      }
      const nested = findCheckbox(child);
      if (nested) return nested;
    }
    return undefined;
  };

  const readList = (element: Element, indent: number) => {
    const elementType = element.tagName.toLowerCase();
    const declaredType = element.getAttribute("data-puzzle-list-type");
    const containsTaskItems = Array.from(element.children).some(
      (child) =>
        child.tagName.toLowerCase() === "li" && findCheckbox(child) !== undefined,
    );
    const listType: TextListType =
      declaredType === "checklist" || declaredType === "icon"
        ? declaredType
        : containsTaskItems
          ? "checklist"
          : elementType === "ol"
            ? "ordered"
            : "bullet";
    const listAttributes = readListAttributes(element, listType);

    for (const child of Array.from(element.children)) {
      if (child.tagName.toLowerCase() !== "li") continue;
      const inlineNodes = Array.from(child.childNodes).filter(
        (node) =>
          !(
            node instanceof Element &&
            (isListElement(node) ||
              (node.tagName.toLowerCase() === "input" &&
                node.getAttribute("type")?.toLowerCase() === "checkbox"))
          ),
      );
      const checkbox = findCheckbox(child);
      const checked =
        child.getAttribute("data-puzzle-checked") === "true" ||
        checkbox?.checked === true ||
        checkbox?.hasAttribute("checked") === true;

      blocks.push(
        createBlock(
          getBlockVariant(child) ?? "body1",
          readInlineNodes(inlineNodes),
          false,
          getBlockAlign(child),
          listType,
          getBlockHeadingLevel(child),
          listAttributes,
          checked,
          indent,
        ),
      );

      for (const nested of Array.from(child.children)) {
        if (isListElement(nested)) readList(nested, indent + 1);
      }
    }
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
    if (tag === "hr") {
      flushLoose();
      blocks.push({
        type: "horizontalRule",
        variant: getBlockVariant(node) ?? "body1",
        children: [],
        ...(getBlockAlign(node) ? { align: getBlockAlign(node) } : {}),
        ...(getBlockIndent(node) ? { indent: getBlockIndent(node) } : {}),
      });
      return;
    }
    if (tag === "pre") {
      flushLoose();
      const text = readInlineNodes(Array.from(node.childNodes))
        .map((inline) => inline.text)
        .join("");
      blocks.push({
        type: "codeBlock",
        variant: getBlockVariant(node) ?? "body1",
        children: text ? [{ text }] : [],
        ...(getBlockAlign(node) ? { align: getBlockAlign(node) } : {}),
        ...(getBlockIndent(node) ? { indent: getBlockIndent(node) } : {}),
      });
      return;
    }
    if (tag === "blockquote") {
      flushLoose();
      const quoteBlocks = readHtmlBlocks(Array.from(node.childNodes));
      const align = getBlockAlign(node);
      const indent = getBlockIndent(node);
      if (quoteBlocks.length === 0) {
        blocks.push({
          type: "blockquote",
          variant: "body1",
          children: [],
          ...(align ? { align } : {}),
          ...(indent ? { indent } : {}),
        });
      } else {
        blocks.push(
          ...quoteBlocks.map((block) =>
            block.listType
              ? block
              : {
                  ...block,
                  type: "blockquote" as const,
                  variant: getBlockVariant(node) ?? block.variant,
                  ...(align ? { align } : {}),
                  ...(indent ? { indent } : {}),
                },
          ),
        );
      }
      return;
    }
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
          undefined,
          undefined,
          getBlockIndent(node),
        ),
      );
      return;
    }

    if (tag === "li") {
      flushLoose();
      const parentTag = node.parentElement?.tagName.toLowerCase();
      const listType: TextListType | undefined =
        parentTag === "ul" ? "bullet" : parentTag === "ol" ? "ordered" : undefined;
      blocks.push(
        createBlock(
          "body1",
          readInlineNodes(
            Array.from(node.childNodes).filter(
              (child) => !(child instanceof Element && isListElement(child)),
            ),
          ),
          false,
          getBlockAlign(node),
          listType,
        ),
      );
      return;
    }

    if (tag === "ul" || tag === "ol") {
      flushLoose();
      readList(node, 0);
      return;
    }

    if (tag === "br") {
      if (!node.hasAttribute("data-puzzle-placeholder")) {
        appendText(looseInlines, "\n", []);
      }
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
    /!\[(?<imageAlt>[^\]]*)\]\([^)]+\)|\[(?<linkText>[^\]]+)\]\((?<linkHref>[^)]+)\)|\*\*(?<boldA>.+?)\*\*|__(?<boldB>.+?)__|~~(?<strike>.+?)~~|\*(?<italicA>.+?)\*|_(?<italicB>.+?)_|(?<codeDelimiter>`+)(?<code>[\s\S]+?)\k<codeDelimiter>/g;
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
      appendText(result, groups.code, ["code"]);
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
  let quoteLines: string[] = [];
  let codeLines: string[] = [];
  let insideCodeFence = false;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const text = paragraphLines.join("\n");
    blocks.push(createBlock("body1", parseInlineMarkdown(text)));
    paragraphLines = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) return;
    blocks.push({
      type: "blockquote",
      variant: "body1",
      children: parseInlineMarkdown(quoteLines.join("\n")),
    });
    quoteLines = [];
  };

  const flushCode = () => {
    blocks.push({
      type: "codeBlock",
      variant: "body1",
      children: codeLines.length ? [{ text: codeLines.join("\n") }] : [],
    });
    codeLines = [];
  };

  for (const line of lines) {
    if (/^\s{0,3}(?:```|~~~)/.test(line)) {
      if (insideCodeFence) {
        insideCodeFence = false;
        flushCode();
      } else {
        flushParagraph();
        flushQuote();
        insideCodeFence = true;
      }
      continue;
    }

    if (insideCodeFence) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushQuote();
      continue;
    }

    const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      flushQuote();
      const level = heading[1]!.length;
      const variant = (`headline${level}`) as TextBlockVariant;
      blocks.push(createBlock(variant, parseInlineMarkdown(heading[2]!), true));
      continue;
    }

    if (/^\s{0,3}(?:[-*_]\s*){3,}$/.test(line)) {
      flushParagraph();
      flushQuote();
      blocks.push({
        type: "horizontalRule",
        variant: "body1",
        children: [],
      });
      continue;
    }

    const listItem = line.match(/^([ \t]*)([-+*]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      flushQuote();
      const marker = listItem[2]!;
      const content = listItem[3]!;
      const task = content.match(/^\[([ xX])\]\s+(.*)$/);
      const listType: TextListType = task
        ? "checklist"
        : /^\d/.test(marker)
          ? "ordered"
          : "bullet";
      const indent = Math.floor(
        listItem[1]!.replace(/\t/g, "  ").length / 2,
      );
      blocks.push(
        createBlock(
          "body1",
          parseInlineMarkdown(task ? task[2]! : content),
          false,
          undefined,
          listType,
          undefined,
          listType === "checklist" ? { interactive: false } : undefined,
          task ? /^[xX]$/.test(task[1]!) : undefined,
          indent,
        ),
      );
      continue;
    }

    const quote = line.match(/^\s{0,3}>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      quoteLines.push(quote[1]!);
      continue;
    }

    flushQuote();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushQuote();
  if (insideCodeFence) flushCode();
  return normalizeTextDocument({
    type: "doc",
    content: blocks.length ? blocks : createTextDocument().content,
  });
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const MARK_HTML: Record<TextMark, string> = {
  bold: "strong",
  italic: "em",
  underline: "u",
  strike: "s",
  code: "code",
};

const serializeInlineCode = (value: string) => {
  let delimiter = "`";
  while (value.includes(delimiter)) delimiter += "`";
  return `${delimiter}${value}${delimiter}`;
};

const serializeInlineToHtml = (inlines: TextInline[]): string =>
  inlines
    .map((inline) => {
      let output = inline.text
        .split("\n")
        .map(escapeHtml)
        .join("<br>");
      for (const mark of [...(inline.marks ?? [])].reverse()) {
        const tag = MARK_HTML[mark];
        output = `<${tag}>${output}</${tag}>`;
      }
      const href =
        typeof inline.link?.href === "string"
          ? normalizeLinkHref(inline.link.href)
          : null;
      if (href) output = `<a href="${escapeHtml(href)}">${output}</a>`;
      return output;
    })
    .join("");

const serializeListAttributesToHtml = (
  listType: TextListType,
  attributes: TextListAttributes | undefined,
): string => {
  if (listType === "checklist") {
    return ` data-puzzle-list-interactive="${attributes?.interactive === true}"`;
  }
  if (listType !== "icon" || !attributes?.icon) return "";
  return [
    ` data-puzzle-list-icon="${escapeHtml(attributes.icon.name)}"`,
    ` data-puzzle-list-icon-size="${attributes.icon.size}"`,
    ` data-puzzle-list-icon-color="${escapeHtml(attributes.icon.color)}"`,
  ].join("");
};

const serializeTextBlockToHtml = (block: TextBlock): string => {
  const attributes = [
    `data-puzzle-variant="${escapeHtml(block.variant)}"`,
    ...(block.align
      ? [`data-puzzle-align="${escapeHtml(block.align)}"`]
      : []),
    ...(block.indent && !block.listType
      ? [`data-puzzle-indent="${block.indent}"`]
      : []),
    ...(block.headingLevel
      ? [`data-puzzle-heading-level="${block.headingLevel}"`]
      : []),
  ].join(" ");
  const children = serializeInlineToHtml(block.children);
  if (block.type === "horizontalRule") return `<hr ${attributes}>`;
  if (block.type === "blockquote") {
    return `<blockquote ${attributes}>${children}</blockquote>`;
  }
  if (block.type === "codeBlock") {
    return `<pre ${attributes}><code>${escapeHtml(getBlockText(block))}</code></pre>`;
  }
  if (block.type !== "heading") return `<p ${attributes}>${children}</p>`;
  const level =
    block.headingLevel ??
    (block.variant === "display1" || block.variant === "headline1"
      ? 1
      : block.variant === "display2" || block.variant === "headline2"
        ? 2
        : block.variant === "headline3"
          ? 3
          : 4);
  return `<h${level} ${attributes}>${children}</h${level}>`;
};

export const serializeTextDocumentToHtml = (
  document: TextDocument,
): string => {
  const normalized = normalizeTextDocument(document);
  const entries = createTextListTree(normalized.content);

  const serializeEntries = (tree: typeof entries): string =>
    tree
      .map((entry) => {
        if (entry.type === "block") {
          return serializeTextBlockToHtml(entry.block);
        }

        const tag = entry.listType === "ordered" ? "ol" : "ul";
        const listAttributes = serializeListAttributesToHtml(
          entry.listType,
          entry.attributes,
        );
        const items = entry.items
          .map(({ block, children }) => {
            const attributes = [
              `data-puzzle-variant="${escapeHtml(block.variant)}"`,
              ...(block.align
                ? [`data-puzzle-align="${escapeHtml(block.align)}"`]
                : []),
              ...(block.headingLevel
                ? [`data-puzzle-heading-level="${block.headingLevel}"`]
                : []),
              `data-puzzle-checked="${block.checked === true}"`,
            ].join(" ");
            const marker =
              entry.listType === "checklist"
                ? `<input type="checkbox"${block.checked ? ' checked=""' : ""} disabled aria-hidden="true">`
                : entry.listType === "icon"
                  ? '<span data-puzzle-list-marker="icon" aria-hidden="true"></span>'
                  : "";
            return `<li ${attributes}>${marker}${serializeInlineToHtml(block.children)}${serializeEntries(children)}</li>`;
          })
          .join("");
        return `<${tag} data-puzzle-list-type="${entry.listType}"${listAttributes}>${items}</${tag}>`;
      })
      .join("");

  return serializeEntries(entries);
};

const serializeInlineToMarkdown = (inlines: TextInline[]): string =>
  inlines
    .map((inline) => {
      let output = inline.text;
      for (const mark of [...(inline.marks ?? [])].reverse()) {
        if (mark === "bold") output = `**${output}**`;
        else if (mark === "italic") output = `*${output}*`;
        else if (mark === "strike") output = `~~${output}~~`;
        else if (mark === "code") output = serializeInlineCode(output);
      }
      if (inline.link) {
        const href = normalizeLinkHref(inline.link.href);
        if (href) output = `[${output}](${href})`;
      }
      return output;
    })
    .join("");

const serializeFencedCode = (text: string): string => {
  const longestRun = (character: string) =>
    Math.max(
      0,
      ...[...text.matchAll(new RegExp(`${character}+`, "g"))].map(
        (match) => match[0].length,
      ),
    );
  const backticks = Math.max(3, longestRun("`") + 1);
  const tildes = Math.max(3, longestRun("~") + 1);
  const fence =
    backticks <= tildes
      ? "`".repeat(backticks)
      : "~".repeat(tildes);
  return `${fence}\n${text}\n${fence}`;
};

const serializeBlockToMarkdown = (block: TextBlock): string => {
  const text = serializeInlineToMarkdown(block.children);
  if (block.type === "horizontalRule") return "---";
  if (block.type === "blockquote") {
    return text
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  }
  if (block.type === "codeBlock") {
    return serializeFencedCode(getBlockText(block));
  }
  if (block.type !== "heading") return text;
  const level =
    block.headingLevel ??
    (block.variant === "display1" || block.variant === "headline1"
      ? 1
      : block.variant === "display2" || block.variant === "headline2"
        ? 2
        : block.variant === "headline3"
          ? 3
          : 4);
  return `${"#".repeat(Math.min(level, 4))} ${text}`;
};

export const serializeTextDocumentToMarkdown = (
  document: TextDocument,
): string => {
  const normalized = normalizeTextDocument(document);
  const entries = createTextListTree(normalized.content);

  const serializeEntries = (
    tree: typeof entries,
    depth = 0,
  ): string =>
    tree
      .map((entry) => {
        if (entry.type === "block") {
          return serializeBlockToMarkdown(entry.block);
        }
        return entry.items
          .map(({ block, children }, index) => {
            const indent = "  ".repeat(depth);
            const marker =
              entry.listType === "ordered"
                ? `${index + 1}.`
                : entry.listType === "checklist"
                  ? `- [${block.checked ? "x" : " "}]`
                  : "-";
            const text = serializeInlineToMarkdown(block.children);
            const nested = serializeEntries(children, depth + 1);
            return `${indent}${marker} ${text}${nested ? `\n${nested}` : ""}`;
          })
          .join("\n");
      })
      .join("\n\n");

  return serializeEntries(entries);
};
