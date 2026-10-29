import type {
  TextBlock,
  TextDocument,
  TextInline,
  TextMark,
  TextPoint,
  TextSelection,
  TextBlockVariant,
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

export const createTextSelection = (
  block = 0,
  offset = 0,
): TextSelection => ({
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

export const normalizeInlines = (inlines: TextInline[]): TextInline[] => {
  const result: TextInline[] = [];

  for (const inline of inlines) {
    if (!inline.text) continue;

    const marks = normalizeMarks(inline.marks);
    const previous = result[result.length - 1];

    if (previous && sameMarks(previous.marks, marks)) {
      previous.text += inline.text;
      continue;
    }

    result.push({
      text: inline.text,
      ...(marks.length ? { marks } : {}),
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
            return [{ text: inline.text, marks }];
          }),
        );

        return [
          {
            type:
              candidate.type === "heading" && isHeadingVariant(variant)
                ? "heading"
                : "paragraph",
            variant,
            children,
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
        ...(inline.marks?.length ? { marks: [...inline.marks] } : {}),
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
      result.push({ ...inline, ...(inline.marks ? { marks: [...inline.marks] } : {}) });
    } else {
      const leftLength = Math.max(0, from - start);
      const rightStart = Math.max(0, to - start);
      const marks = inline.marks ?? [];

      if (leftLength > 0) {
        result.push({ text: inline.text.slice(0, leftLength), ...(marks.length ? { marks: [...marks] } : {}) });
      }

      const middleEnd = Math.min(inline.text.length, to - start);
      if (middleEnd > leftLength) {
        result.push({
          text: inline.text.slice(leftLength, middleEnd),
          marks: transform([...marks]),
        });
      }

      if (rightStart < inline.text.length) {
        result.push({
          text: inline.text.slice(Math.max(0, rightStart)),
          ...(marks.length ? { marks: [...marks] } : {}),
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
): TextDocument => {
  if (isCollapsedSelection(selection)) return document;

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

  return { type: "doc", content };
};

export const setTextVariant = (
  document: TextDocument,
  selection: TextSelection,
  variant: TextBlockVariant,
): TextDocument => {
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;

  return {
    type: "doc",
    content: document.content.map((block, index) => {
      if (index < start.block || index > lastBlock) return block;
      return {
        ...block,
        type: isHeadingVariant(variant) ? "heading" : "paragraph",
        variant,
      };
    }),
  };
};

const inlineWithOffset = (
  inlines: TextInline[],
  offset: number,
): { before: TextInline[]; after: TextInline[] } => ({
  before: sliceInlines(inlines, 0, offset),
  after: sliceInlines(inlines, offset, inlines.reduce((sum, item) => sum + item.text.length, 0)),
});

export const insertDocumentAtSelection = (
  document: TextDocument,
  selection: TextSelection,
  insertedDocument: TextDocument,
): { document: TextDocument; selection: TextSelection } => {
  const source = normalizeTextDocument(document);
  const inserted = normalizeTextDocument(insertedDocument);
  const { start, end } = getOrderedSelection(selection);
  const startIndex = Math.max(0, Math.min(start.block, source.content.length - 1));
  const endIndex = Math.max(startIndex, Math.min(end.block, source.content.length - 1));
  const startBlock = source.content[startIndex];
  const endBlock = source.content[endIndex];
  const startOffset = Math.max(0, Math.min(start.offset, getBlockLength(startBlock)));
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
  const rightSurvives = suffix.length > 0 || endOffset < getBlockLength(endBlock);
  const first = insertedBlocks[0];
  const last = insertedBlocks[insertedBlocks.length - 1];
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
        variant: separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
        children: separatePrefix
          ? first.children
          : normalizeInlines([...prefix, ...first.children]),
      });
      if (separateSuffix) {
        replacement.push({ ...endBlock, children: suffix });
      } else {
        const finalIndex = replacement.length - 1;
        replacement[finalIndex] = {
          ...replacement[finalIndex],
          children: normalizeInlines([...replacement[finalIndex].children, ...suffix]),
        };
      }
    } else {
      const useInsertedStyle = !leftSurvives && !rightSurvives;
      replacement.push({
        type: useInsertedStyle ? first.type : startBlock.type,
        variant: useInsertedStyle ? first.variant : startBlock.variant,
        children: normalizeInlines([...prefix, ...first.children, ...suffix]),
      });
    }
  } else {
    replacement.push({
      type: separatePrefix || !leftSurvives ? first.type : startBlock.type,
      variant: separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
      children: separatePrefix
        ? first.children
        : normalizeInlines([...prefix, ...first.children]),
    });

    for (let index = 1; index < insertedBlocks.length - 1; index += 1) {
      replacement.push(insertedBlocks[index]);
    }

    if (separateSuffix) {
      replacement.push(last);
      replacement.push({ ...endBlock, children: suffix });
    } else {
      replacement.push({
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
  const caretBlock = replacement[Math.max(0, caretReplacementIndex)];
  const suffixLength = suffix.reduce((total, inline) => total + inline.text.length, 0);
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
): { document: TextDocument; selection: TextSelection } => {
  const inserted: TextDocument = {
    type: "doc",
    content: text.split("\n").map((line) => ({
      type: "paragraph",
      variant: "body1",
      children: line ? [{ text: line, ...(marks.length ? { marks: [...marks] } : {}) }] : [],
    })),
  };
  return insertDocumentAtSelection(document, selection, inserted);
};
