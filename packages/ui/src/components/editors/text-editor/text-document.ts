import type {
  TextBlock,
  TextDocument,
  TextInline,
  TextLink,
  TextMark,
  TextPoint,
  TextSelection,
  TextBlockVariant,
  TextAlign,
  TextListType,
  TextTransaction,
} from "./text-editor.types";

const HEADING_VARIANTS = new Set<TextBlockVariant>([
  "display1",
  "display2",
  "headline1",
  "headline2",
  "headline3",
  "headline4",
]);

const MARK_ORDER: TextMark[] = ["bold", "italic", "underline", "strike"];

export const normalizeLinkHref = (href: string): string | null => {
  const normalized = href.trim();
  if (!normalized || /[\u0000-\u001f\u007f]/.test(normalized)) return null;

  const scheme = normalized.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && !["http", "https", "mailto", "tel"].includes(scheme)) {
    return null;
  }

  return normalized;
};

const normalizeLink = (link?: TextLink): TextLink | undefined => {
  if (!link || typeof link.href !== "string") return undefined;
  const href = normalizeLinkHref(link.href);
  return href ? { href } : undefined;
};

export const isHeadingVariant = (variant: TextBlockVariant): boolean =>
  HEADING_VARIANTS.has(variant);

export const createTextDocument = (text = ""): TextDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      variant: "body1",
      children: text ? [{ text }] : [],
    },
  ],
});

export const createTextSelection = (block = 0, offset = 0): TextSelection => ({
  anchor: { block, offset },
  focus: { block, offset },
});

export const getBlockText = (block: TextBlock): string =>
  block.children.map((child) => child.text).join("");

export const getBlockLength = (block: TextBlock): number =>
  block.children.reduce((length, child) => length + child.text.length, 0);

export const isCollapsedSelection = (selection: TextSelection): boolean =>
  selection.anchor.block === selection.focus.block &&
  selection.anchor.offset === selection.focus.offset;

export const getOrderedSelection = (
  selection: TextSelection,
): { start: TextPoint; end: TextPoint } => {
  const { anchor, focus } = selection;
  if (
    anchor.block < focus.block ||
    (anchor.block === focus.block && anchor.offset <= focus.offset)
  ) {
    return { start: anchor, end: focus };
  }

  return { start: focus, end: anchor };
};

const normalizeMarks = (marks: TextMark[] = []): TextMark[] =>
  MARK_ORDER.filter((mark) => marks.includes(mark));

const sameMarks = (left: TextMark[] = [], right: TextMark[] = []): boolean => {
  const a = normalizeMarks(left);
  const b = normalizeMarks(right);
  return a.length === b.length && a.every((mark, index) => mark === b[index]);
};

const sameLink = (left?: TextLink, right?: TextLink): boolean =>
  left?.href === right?.href;

const copyInlineAttributes = (
  inline: TextInline,
  marks = inline.marks,
  link: TextLink | null | undefined = normalizeLink(inline.link),
): Pick<TextInline, "marks" | "link"> => {
  return {
    ...(marks?.length ? { marks: [...marks] } : {}),
    ...(link ? { link: { ...link } } : {}),
  };
};

export const normalizeInlines = (inlines: TextInline[]): TextInline[] => {
  const result: TextInline[] = [];

  for (const inline of inlines) {
    if (!inline.text) continue;

    const marks = normalizeMarks(inline.marks);
    const link = normalizeLink(inline.link);
    const previous = result[result.length - 1];

    if (
      previous &&
      sameMarks(previous.marks, marks) &&
      sameLink(previous.link, link)
    ) {
      previous.text += inline.text;
      continue;
    }

    result.push({
      text: inline.text,
      ...(marks.length ? { marks } : {}),
      ...(link ? { link } : {}),
    });
  }

  return result;
};

const isTextMark = (value: unknown): value is TextMark =>
  value === "bold" ||
  value === "italic" ||
  value === "underline" ||
  value === "strike";

const isTextVariant = (value: unknown): value is TextBlockVariant =>
  value === "display1" ||
  value === "display2" ||
  value === "headline1" ||
  value === "headline2" ||
  value === "headline3" ||
  value === "headline4" ||
  value === "subtitle1" ||
  value === "subtitle2" ||
  value === "body1" ||
  value === "body2" ||
  value === "button" ||
  value === "caption" ||
  value === "overline";

export const normalizeTextDocument = (input: TextDocument): TextDocument => {
  const content = Array.isArray(input?.content)
    ? input.content.flatMap((candidate) => {
        if (!candidate || !Array.isArray(candidate.children)) return [];

        const variant = isTextVariant(candidate.variant)
          ? candidate.variant
          : "body1";

        const children = normalizeInlines(
          candidate.children.flatMap((inline) => {
            if (!inline || typeof inline.text !== "string") return [];
            const marks = Array.isArray(inline.marks)
              ? inline.marks.filter(isTextMark)
              : [];
            const link = normalizeLink(inline.link);
            return [{ text: inline.text, marks, ...(link ? { link } : {}) }];
          }),
        );

        const listType =
          candidate.listType === "bullet" || candidate.listType === "ordered"
            ? candidate.listType
            : undefined;
        const align =
          candidate.align === "left" ||
          candidate.align === "center" ||
          candidate.align === "right" ||
          candidate.align === "justify"
            ? (candidate.align as TextAlign)
            : undefined;

        const type = listType
          ? "listItem"
          : candidate.type === "heading" && isHeadingVariant(variant)
            ? "heading"
            : "paragraph";
        const headingLevel =
          type === "heading" &&
          Number.isInteger(candidate.headingLevel) &&
          candidate.headingLevel! >= 1 &&
          candidate.headingLevel! <= 6
            ? candidate.headingLevel
            : undefined;

        return [
          {
            type: listType
              ? "listItem"
              : candidate.type === "heading" && isHeadingVariant(variant)
                ? "heading"
                : "paragraph",
            variant,
            children,
            ...(listType ? { listType } : {}),
            ...(align ? { align } : {}),
            ...(headingLevel ? { headingLevel } : {}),
          } satisfies TextBlock,
        ];
      })
    : [];

  return {
    type: "doc",
    content: content.length
      ? content
      : [{ type: "paragraph", variant: "body1", children: [] }],
  };
};

const sliceInlines = (
  inlines: TextInline[],
  from: number,
  to: number,
): TextInline[] => {
  if (to <= from) return [];

  const result: TextInline[] = [];
  let position = 0;

  for (const inline of inlines) {
    const start = position;
    const end = position + inline.text.length;
    const overlapStart = Math.max(start, from);
    const overlapEnd = Math.min(end, to);

    if (overlapStart < overlapEnd) {
      result.push({
        text: inline.text.slice(overlapStart - start, overlapEnd - start),
        ...copyInlineAttributes(inline),
      });
    }

    position = end;
    if (position >= to) break;
  }

  return normalizeInlines(result);
};

const transformInlineRange = (
  inlines: TextInline[],
  from: number,
  to: number,
  transform: (marks: TextMark[]) => TextMark[],
): TextInline[] => {
  if (to <= from) return inlines.map((inline) => ({ ...inline }));

  const result: TextInline[] = [];
  let position = 0;

  for (const inline of inlines) {
    const start = position;
    const end = start + inline.text.length;

    if (end <= from || start >= to) {
      result.push({
        ...inline,
        ...copyInlineAttributes(inline),
      });
    } else {
      const leftLength = Math.max(0, from - start);
      const rightStart = Math.max(0, to - start);
      const marks = inline.marks ?? [];

      if (leftLength > 0) {
        result.push({
          text: inline.text.slice(0, leftLength),
          ...copyInlineAttributes(inline, marks),
        });
      }

      const middleEnd = Math.min(inline.text.length, to - start);
      if (middleEnd > leftLength) {
        result.push({
          text: inline.text.slice(leftLength, middleEnd),
          ...copyInlineAttributes(inline, transform([...marks])),
        });
      }

      if (rightStart < inline.text.length) {
        result.push({
          text: inline.text.slice(Math.max(0, rightStart)),
          ...copyInlineAttributes(inline, marks),
        });
      }
    }

    position = end;
  }

  return normalizeInlines(result);
};

export const applyMark = (
  document: TextDocument,
  selection: TextSelection,
  mark: TextMark,
  force?: boolean,
): TextTransaction => {
  if (isCollapsedSelection(selection)) return { document, selection };

  const { start, end } = getOrderedSelection(selection);
  const allMarked = document.content.every((block, index) => {
    if (index < start.block || index > end.block) return true;
    const from = index === start.block ? start.offset : 0;
    const to = index === end.block ? end.offset : getBlockLength(block);
    if (to <= from) return true;

    let position = 0;
    for (const inline of block.children) {
      const inlineStart = position;
      const inlineEnd = position + inline.text.length;
      position = inlineEnd;
      if (inlineEnd <= from || inlineStart >= to) continue;
      if (!inline.marks?.includes(mark)) return false;
    }
    return true;
  });

  const addMark = force ?? !allMarked;
  const content = document.content.map((block, index) => {
    if (index < start.block || index > end.block) return block;
    const from = index === start.block ? start.offset : 0;
    const to = index === end.block ? end.offset : getBlockLength(block);
    if (to <= from) return block;

    return {
      ...block,
      children: transformInlineRange(block.children, from, to, (marks) => {
        const next = new Set(marks);
        if (addMark) next.add(mark);
        else next.delete(mark);
        return MARK_ORDER.filter((item) => next.has(item));
      }),
    };
  });

  return { document: { type: "doc", content }, selection };
};

const getLinkRangeAtOffset = (
  inlines: TextInline[],
  offset: number,
): { from: number; to: number; href: string } | null => {
  let position = 0;
  let matchIndex = -1;

  for (let index = 0; index < inlines.length; index += 1) {
    const inline = inlines[index]!;
    const end = position + inline.text.length;
    if (
      inline.link &&
      ((offset > position && offset <= end) ||
        (offset === position && offset < end))
    ) {
      matchIndex = index;
      break;
    }
    position = end;
  }

  if (matchIndex < 0) return null;

  const href = inlines[matchIndex]!.link!.href;
  let firstIndex = matchIndex;
  let lastIndex = matchIndex;
  while (firstIndex > 0 && inlines[firstIndex - 1]!.link?.href === href) {
    firstIndex -= 1;
  }
  while (
    lastIndex < inlines.length - 1 &&
    inlines[lastIndex + 1]!.link?.href === href
  ) {
    lastIndex += 1;
  }

  const from = inlines
    .slice(0, firstIndex)
    .reduce((length, inline) => length + inline.text.length, 0);
  const to =
    from +
    inlines
      .slice(firstIndex, lastIndex + 1)
      .reduce((length, inline) => length + inline.text.length, 0);
  return { from, to, href };
};

const transformInlineLinkRange = (
  inlines: TextInline[],
  from: number,
  to: number,
  href: string | null,
): TextInline[] => {
  const result: TextInline[] = [];
  let position = 0;

  for (const inline of inlines) {
    const start = position;
    const end = start + inline.text.length;
    if (end <= from || start >= to) {
      result.push({ text: inline.text, ...copyInlineAttributes(inline) });
    } else {
      const leftLength = Math.max(0, from - start);
      const rightStart = Math.max(0, to - start);
      if (leftLength > 0) {
        result.push({
          text: inline.text.slice(0, leftLength),
          ...copyInlineAttributes(inline),
        });
      }
      const middleEnd = Math.min(inline.text.length, to - start);
      if (middleEnd > leftLength) {
        result.push({
          text: inline.text.slice(leftLength, middleEnd),
          ...copyInlineAttributes(
            inline,
            undefined,
            href ? { href } : null,
          ),
        });
      }
      if (rightStart < inline.text.length) {
        result.push({
          text: inline.text.slice(Math.max(0, rightStart)),
          ...copyInlineAttributes(inline),
        });
      }
    }
    position = end;
  }

  return normalizeInlines(result);
};

export const getTextLink = (
  document: TextDocument,
  selection: TextSelection,
): string | null => {
  if (isCollapsedSelection(selection)) {
    const block = document.content[selection.focus.block];
    return block
      ? getLinkRangeAtOffset(block.children, selection.focus.offset)?.href ?? null
      : null;
  }

  const { start, end } = getOrderedSelection(selection);
  let href: string | null = null;
  let foundText = false;

  for (
    let blockIndex = start.block;
    blockIndex <= end.block;
    blockIndex += 1
  ) {
    const block = document.content[blockIndex];
    if (!block) continue;
    const from = blockIndex === start.block ? start.offset : 0;
    const to = blockIndex === end.block ? end.offset : getBlockLength(block);
    let position = 0;

    for (const inline of block.children) {
      const inlineStart = position;
      const inlineEnd = inlineStart + inline.text.length;
      position = inlineEnd;
      if (inlineEnd <= from || inlineStart >= to) continue;
      const inlineHref = inline.link?.href;
      if (!inlineHref || (href !== null && href !== inlineHref)) return null;
      href = inlineHref;
      foundText = true;
    }
  }

  return foundText ? href : null;
};

export const setTextLink = (
  document: TextDocument,
  selection: TextSelection,
  href: string | null,
): TextTransaction => {
  const normalizedHref =
    href === null ? null : normalizeLinkHref(href);
  if (href !== null && normalizedHref === null) return { document, selection };

  if (isCollapsedSelection(selection)) {
    const block = document.content[selection.focus.block];
    const range = block
      ? getLinkRangeAtOffset(block.children, selection.focus.offset)
      : null;
    if (!range) return { document, selection };

    return {
      document: {
        type: "doc",
        content: document.content.map((item, index) =>
          index === selection.focus.block
            ? {
                ...item,
                children: transformInlineLinkRange(
                  item.children,
                  range.from,
                  range.to,
                  normalizedHref,
                ),
              }
            : item,
        ),
      },
      selection,
    };
  }

  const { start, end } = getOrderedSelection(selection);
  const content = document.content.map((block, index) => {
    if (index < start.block || index > end.block) return block;
    const from = index === start.block ? start.offset : 0;
    const to = index === end.block ? end.offset : getBlockLength(block);
    if (to <= from) return block;
    return {
      ...block,
      children: transformInlineLinkRange(block.children, from, to, normalizedHref),
    };
  });

  return { document: { type: "doc", content }, selection };
};

export const setTextVariant = (
  document: TextDocument,
  selection: TextSelection,
  variant: TextBlockVariant,
): TextTransaction => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;

  return {
    document: {
      type: "doc",
      content: document.content.map((block, index) => {
        if (index < start.block || index > lastBlock) return block;
        return {
          ...block,
          type: block.listType
            ? "listItem"
            : isHeadingVariant(variant)
              ? "heading"
              : "paragraph",
          variant,
        };
      }),
    },
    selection,
  };
};

const inlineWithOffset = (
  inlines: TextInline[],
  offset: number,
): { before: TextInline[]; after: TextInline[] } => ({
  before: sliceInlines(inlines, 0, offset),
  after: sliceInlines(
    inlines,
    offset,
    inlines.reduce((sum, item) => sum + item.text.length, 0),
  ),
});

export const insertDocumentAtSelection = (
  document: TextDocument,
  selection: TextSelection,
  insertedDocument: TextDocument,
): TextTransaction => {
  const source = normalizeTextDocument(document);
  const inserted = normalizeTextDocument(insertedDocument);
  const { start, end } = getOrderedSelection(selection);
  const startIndex = Math.max(
    0,
    Math.min(start.block, source.content.length - 1),
  );
  const endIndex = Math.max(
    startIndex,
    Math.min(end.block, source.content.length - 1),
  );
  const startBlock = source.content[startIndex]!;
  const endBlock = source.content[endIndex]!;
  const startOffset = Math.max(
    0,
    Math.min(start.offset, getBlockLength(startBlock)),
  );
  const endOffset = Math.max(0, Math.min(end.offset, getBlockLength(endBlock)));
  const prefix = inlineWithOffset(startBlock.children, startOffset).before;
  const suffix = inlineWithOffset(endBlock.children, endOffset).after;
  const insertedBlocks = inserted.content.map((block) => ({
    ...block,
    children: block.children.map((inline) => ({
      ...inline,
      ...(inline.marks ? { marks: [...inline.marks] } : {}),
    })),
  }));

  const leftSurvives = prefix.length > 0 || startOffset > 0;
  const rightSurvives =
    suffix.length > 0 || endOffset < getBlockLength(endBlock);
  const first = insertedBlocks[0]!;
  const last = insertedBlocks[insertedBlocks.length - 1]!;
  const separatePrefix = leftSurvives && first.type === "heading";
  const separateSuffix = rightSurvives && last.type === "heading";
  const replacement: TextBlock[] = [];

  if (separatePrefix) {
    replacement.push({
      ...startBlock,
      children: prefix,
    });
  }

  if (insertedBlocks.length === 1) {
    if (separatePrefix || separateSuffix) {
      replacement.push({
        ...first,
        type: separatePrefix || !leftSurvives ? first.type : startBlock.type,
        variant:
          separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
        children: separatePrefix
          ? first.children
          : normalizeInlines([...prefix, ...first.children]),
      });
      if (separateSuffix) {
        replacement.push({ ...endBlock, children: suffix });
      } else {
        const finalIndex = replacement.length - 1;
        replacement[finalIndex] = {
          ...replacement[finalIndex]!,
          children: normalizeInlines([
            ...replacement[finalIndex]!.children,
            ...suffix,
          ]),
        };
      }
    } else {
      const useInsertedStyle = !leftSurvives && !rightSurvives;
      replacement.push({
        ...(useInsertedStyle ? first : startBlock),
        type: useInsertedStyle ? first.type : startBlock.type,
        variant: useInsertedStyle ? first.variant : startBlock.variant,
        children: normalizeInlines([...prefix, ...first.children, ...suffix]),
      });
    }
  } else {
    replacement.push({
      ...(separatePrefix || !leftSurvives ? first : startBlock),
      type: separatePrefix || !leftSurvives ? first.type : startBlock.type,
      variant:
        separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
      children: separatePrefix
        ? first.children
        : normalizeInlines([...prefix, ...first.children]),
    });

    for (let index = 1; index < insertedBlocks.length - 1; index += 1) {
      replacement.push(insertedBlocks[index]!);
    }

    if (separateSuffix) {
      replacement.push(last);
      replacement.push({ ...endBlock, children: suffix });
    } else {
      replacement.push({
        ...(rightSurvives ? endBlock : last),
        type: rightSurvives ? endBlock.type : last.type,
        variant: rightSurvives ? endBlock.variant : last.variant,
        children: normalizeInlines([...last.children, ...suffix]),
      });
    }
  }

  const content = [
    ...source.content.slice(0, startIndex),
    ...replacement,
    ...source.content.slice(endIndex + 1),
  ];
  const caretReplacementIndex = separateSuffix
    ? replacement.length - 2
    : replacement.length - 1;
  const caretBlock = replacement[Math.max(0, caretReplacementIndex)]!;
  const suffixLength = suffix.reduce(
    (total, inline) => total + inline.text.length,
    0,
  );
  const caretOffset = separateSuffix
    ? getBlockLength(caretBlock)
    : Math.max(0, getBlockLength(caretBlock) - suffixLength);
  const caret = {
    block: startIndex + Math.max(0, caretReplacementIndex),
    offset: caretOffset,
  };

  return {
    document: {
      type: "doc",
      content: content.length ? content : createTextDocument().content,
    },
    selection: { anchor: caret, focus: caret },
  };
};

export const insertTextAtSelection = (
  document: TextDocument,
  selection: TextSelection,
  text: string,
  marks: TextMark[] = [],
): TextTransaction => {
  const inserted: TextDocument = {
    type: "doc",
    content: text.split("\n").map((line) => ({
      type: "paragraph",
      variant: "body1",
      children: line
        ? [{ text: line, ...(marks.length ? { marks: [...marks] } : {}) }]
        : [],
    })),
  };
  return insertDocumentAtSelection(document, selection, inserted);
};

/** Apply text alignment to every block touched by the current selection. */
export const setTextAlign = (
  document: TextDocument,
  selection: TextSelection,
  align: TextAlign,
): TextTransaction => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;
  return {
    document: {
      type: "doc",
      content: document.content.map((block, index) => {
        if (index < start.block || index > lastBlock) return block;
        return { ...block, align };
      }),
    },
    selection,
  };
};

export const getTextAlign = (
  document: TextDocument,
  selection: TextSelection,
): TextAlign | null => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;
  const selected = document.content.slice(start.block, lastBlock + 1);
  if (selected.length === 0) return null;
  const align = selected[0]!.align ?? null;
  return selected.every((block) => (block.align ?? null) === align)
    ? align
    : null;
};

/** Toggle a list type for the selected blocks; null removes list formatting. */
export const setListType = (
  document: TextDocument,
  selection: TextSelection,
  listType: TextListType | null,
): TextTransaction => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;
  const selected = document.content.slice(start.block, lastBlock + 1);
  const remove =
    listType != null &&
    selected.length > 0 &&
    selected.every((block) => block.listType === listType);
  return {
    document: {
      type: "doc",
      content: document.content.map((block, index) => {
        if (index < start.block || index > lastBlock) return block;
        if (remove || listType == null) {
          const { listType: _listType, ...rest } = block;
          return {
            ...rest,
            type: block.type === "listItem" ? "paragraph" : block.type,
          };
        }
        return { ...block, type: "listItem", listType };
      }),
    },
    selection,
  };
};

export const getListType = (
  document: TextDocument,
  selection: TextSelection,
  listType: TextListType,
): boolean => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;
  const selected = document.content.slice(start.block, lastBlock + 1);
  return (
    selected.length > 0 &&
    selected.every((block) => block.listType === listType)
  );
};
