import { DEFAULT_COLOR_SCHEME, THEME_TOKEN_REGISTRY } from "@puzzle-ui/theme";
import type {
  TextBlock,
  TextBlockType,
  TextDocument,
  TextInline,
  TextLink,
  TextMark,
  TextPoint,
  TextSelection,
  TextBlockVariant,
  TextAlign,
  TextListAttributes,
  TextListSelectionState,
  TextListType,
  TextDocumentStatistics,
  TextSearchMatch,
  TextSearchOptions,
  TextSlashCommandMatch,
  TextTransaction,
} from "./text-editor.types";

export const MAX_TEXT_LIST_INDENT = 8;

export const TEXT_HEADING_VARIANTS = Array.from(
  new Set(THEME_TOKEN_REGISTRY.flatMap(({ group }) => {
    const match = /^typography\.roles\.((?:display|headline)\d+)$/.exec(group);
    return match ? [match[1] as TextBlockVariant] : [];
  })),
);
const HEADING_VARIANTS = new Set(TEXT_HEADING_VARIANTS);

const MARK_ORDER: TextMark[] = ["bold", "italic", "underline", "strike", "code"];
const DEFAULT_LIST_ICON = "mdi:circle";
const CSS_COLOR_NAMES = new Set([
  "black",
  "blue",
  "brown",
  "cyan",
  "gray",
  "green",
  "grey",
  "lime",
  "magenta",
  "maroon",
  "navy",
  "olive",
  "orange",
  "pink",
  "purple",
  "rebeccapurple",
  "red",
  "silver",
  "teal",
  "transparent",
  "white",
  "yellow",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isTextListType = (value: unknown): value is TextListType =>
  value === "bullet" ||
  value === "ordered" ||
  value === "checklist" ||
  value === "icon";

export const isValidTextListIconName = (name: unknown): name is string => {
  if (
    typeof name !== "string" ||
    !/^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9_-]*$/i.test(name)
  ) {
    return false;
  }
  const prefix = name.slice(0, name.indexOf(":")).toLowerCase();
  return !["blob", "data", "file", "http", "https", "javascript", "url"].includes(
    prefix,
  );
};

export const isSafeTextListIconColor = (color: unknown): color is string =>
  typeof color === "string" &&
  (color === "currentColor" ||
    /^#[\da-f]{3,4}(?:[\da-f]{2}){0,2}$/i.test(color) ||
    /^(?:rgb|hsl)a?\(\s*[-+.%\d\s,/]+\)$/i.test(color) ||
    CSS_COLOR_NAMES.has(color.toLowerCase()));

const normalizeListAttributes = (
  value: unknown,
  listType: TextListType,
): TextListAttributes | undefined => {
  const attributes = isRecord(value) ? value : {};

  if (listType === "checklist") {
    return {
      interactive:
        typeof attributes.interactive === "boolean"
          ? attributes.interactive
          : false,
    };
  }

  if (listType !== "icon") return undefined;

  const icon = isRecord(attributes.icon) ? attributes.icon : {};
  const size =
    typeof icon.size === "number" && Number.isFinite(icon.size)
      ? Math.round(Math.max(8, Math.min(64, icon.size)))
      : 18;

  return {
    icon: {
      name: isValidTextListIconName(icon.name) ? icon.name : DEFAULT_LIST_ICON,
      size,
      color: isSafeTextListIconColor(icon.color) ? icon.color : "currentColor",
    },
  };
};

export const normalizeLinkHref = (href: string): string | null => {
  const normalized = href.trim();
  if (!normalized || /[\u0000-\u001f\u007f]/.test(normalized)) return null;

  const scheme = normalized.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && !["http", "https", "mailto", "tel"].includes(scheme)) {
    return null;
  }

  return normalized;
};

const normalizeLink = (link: unknown): TextLink | undefined => {
  if (!isRecord(link) || typeof link.href !== "string") return undefined;
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

export const getTextStatistics = (
  document: TextDocument,
): TextDocumentStatistics => {
  const text = document.content.map(getBlockText).join("\n");
  const words =
    text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
  return {
    wordCount: words.length,
    characterCount: Array.from(text).length,
  };
};

export const getSlashCommandAtSelection = (
  document: TextDocument,
  selection: TextSelection,
): TextSlashCommandMatch | null => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  if (!isCollapsedSelection(normalizedSelection)) return null;
  const block = document.content[normalizedSelection.focus.block];
  if (!block) return null;
  const prefix = getBlockText(block).slice(0, normalizedSelection.focus.offset);
  const slash = prefix.lastIndexOf("/");
  if (slash < 0 || (slash > 0 && !/\s/u.test(prefix[slash - 1]!))) return null;
  const query = prefix.slice(slash + 1);
  if (/\s/u.test(query)) return null;
  return {
    query,
    start: {
      block: normalizedSelection.focus.block,
      offset: slash,
    },
    end: normalizedSelection.focus,
  };
};

const foldSearchText = (
  text: string,
  caseSensitive: boolean,
): { value: string; starts: number[]; ends: number[] } => {
  if (caseSensitive) {
    return {
      value: text,
      starts: Array.from({ length: text.length }, (_, index) => index),
      ends: Array.from({ length: text.length }, (_, index) => index + 1),
    };
  }

  let value = "";
  const starts: number[] = [];
  const ends: number[] = [];
  for (let offset = 0; offset < text.length; ) {
    const point = text.codePointAt(offset);
    if (point === undefined) break;
    const source = String.fromCodePoint(point);
    const folded = source.toLowerCase();
    value += folded;
    for (let index = 0; index < folded.length; index += 1) {
      starts.push(offset);
      ends.push(offset + source.length);
    }
    offset += source.length;
  }
  return { value, starts, ends };
};

const isWordCharacter = (value: string | undefined): boolean =>
  value !== undefined && /[\p{L}\p{N}_]/u.test(value);

export const findTextInDocument = (
  document: TextDocument,
  query: string,
  { caseSensitive = false, wholeWord = false }: TextSearchOptions = {},
): TextSearchMatch[] => {
  if (!query) return [];
  const needle = caseSensitive ? query : query.toLowerCase();
  const matches: TextSearchMatch[] = [];

  document.content.forEach((block, blockIndex) => {
    const text = getBlockText(block);
    const folded = foldSearchText(text, caseSensitive);
    let searchOffset = 0;
    while (searchOffset <= folded.value.length - needle.length) {
      const found = folded.value.indexOf(needle, searchOffset);
      if (found < 0) break;
      const start = folded.starts[found] ?? 0;
      const end = folded.ends[found + needle.length - 1] ?? text.length;
      const previousCharacter = Array.from(text.slice(0, start)).at(-1);
      const nextCharacter = Array.from(text.slice(end))[0];
      if (
        !wholeWord ||
        (!isWordCharacter(previousCharacter) &&
          !isWordCharacter(nextCharacter))
      ) {
        matches.push({
          start: { block: blockIndex, offset: start },
          end: { block: blockIndex, offset: end },
        });
      }
      searchOffset = found + Math.max(needle.length, 1);
    }
  });

  return matches;
};

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
  marks.includes("code")
    ? ["code"]
    : MARK_ORDER.filter(
        (mark) => mark !== "code" && marks.includes(mark),
      );

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
    const link = marks.includes("code") ? undefined : normalizeLink(inline.link);
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
  value === "strike" ||
  value === "code";

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

export const normalizeTextDocument = (input: unknown): TextDocument => {
  const source = isRecord(input) && Array.isArray(input.content)
    ? input.content
    : [];
  let previousIndent = -1;

  const content = source.flatMap((rawCandidate): TextBlock[] => {
    if (!isRecord(rawCandidate)) {
      previousIndent = -1;
      return [];
    }
    const rawChildren = rawCandidate.children;
    if (!Array.isArray(rawChildren)) {
      previousIndent = -1;
      return [];
    }

    const candidate = rawCandidate;
    const variant = isTextVariant(candidate.variant) ? candidate.variant : "body1";
    const children = normalizeInlines(
      rawChildren.flatMap((rawInline) => {
        if (!isRecord(rawInline) || typeof rawInline.text !== "string") return [];
        const marks = Array.isArray(rawInline.marks)
          ? rawInline.marks.filter(isTextMark)
          : [];
        const link = normalizeLink(rawInline.link);
        return [{ text: rawInline.text, marks, ...(link ? { link } : {}) }];
      }),
    );

    const listType = isTextListType(candidate.listType)
      ? candidate.listType
      : undefined;
    const align =
      candidate.align === "left" ||
      candidate.align === "center" ||
      candidate.align === "right" ||
      candidate.align === "justify"
        ? candidate.align
        : undefined;
    const type = listType
      ? "listItem"
      : candidate.type === "heading" && isHeadingVariant(variant)
        ? "heading"
        : candidate.type === "blockquote"
          ? "blockquote"
          : candidate.type === "codeBlock"
            ? "codeBlock"
            : candidate.type === "horizontalRule" && children.length === 0
              ? "horizontalRule"
              : "paragraph";
    const listAttributes = listType
      ? normalizeListAttributes(candidate.listAttributes, listType)
      : undefined;
    const headingLevel =
      (type === "heading" || type === "listItem") &&
      Number.isInteger(candidate.headingLevel) &&
      Number(candidate.headingLevel) >= 1 &&
      Number(candidate.headingLevel) <= 6
        ? (Number(candidate.headingLevel) as TextBlock["headingLevel"])
        : undefined;
    const candidateIndent =
      typeof candidate.indent === "number" && Number.isFinite(candidate.indent)
        ? Math.trunc(candidate.indent)
        : 0;
    const indent = listType
      ? Math.max(
          0,
          Math.min(MAX_TEXT_LIST_INDENT, previousIndent + 1, candidateIndent),
        )
      : Math.max(0, Math.min(MAX_TEXT_LIST_INDENT, candidateIndent));

    previousIndent = listType ? indent : -1;

    return [
      {
        type,
        variant,
        children,
        ...(listType ? { listType } : {}),
        ...(listAttributes ? { listAttributes } : {}),
        ...(listType === "checklist"
          ? { checked: candidate.checked === true }
          : {}),
        ...(indent > 0 ? { indent } : {}),
        ...(align ? { align } : {}),
        ...(headingLevel ? { headingLevel } : {}),
      } satisfies TextBlock,
    ];
  });

  return {
    type: "doc",
    content: content.length
      ? content
      : [{ type: "paragraph", variant: "body1", children: [] }],
  };
};

const sameValue = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameValue(value, right[index]))
    );
  }
  if (!isRecord(left) || !isRecord(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) =>
        key === rightKeys[index] && sameValue(left[key], right[key]),
    )
  );
};

/**
 * Validate untrusted document data without including document text in issues.
 * The schema is additive and intentionally has no version field; legacy
 * documents are recovered by normalization.
 */
export const validateTextDocument = (
  input: unknown,
): import("./text-editor.types").TextDocumentValidationResult => {
  const issues: import("./text-editor.types").TextDocumentValidationIssue[] = [];
  const addIssue = (
    path: string,
    code: string,
    message: string,
  ) => issues.push({ path, code, message });

  if (!isRecord(input)) {
    addIssue("$", "invalid-document", "Expected a document object.");
    return { status: "invalid", issues };
  }
  if (input.schemaVersion !== undefined) {
    addIssue(
      "$.schemaVersion",
      "unsupported-schema-version",
      "This document format does not define schema versions.",
    );
    return { status: "invalid", issues };
  }
  if (input.type !== "doc" || !Array.isArray(input.content)) {
    addIssue("$", "invalid-document", "Expected a doc with a content array.");
    return { status: "invalid", issues };
  }

  let invalidStructure = false;
  if (input.content.length === 0) {
    addIssue("$.content", "empty-content", "An empty document needs a default paragraph.");
  }
  input.content.forEach((candidate, blockIndex) => {
    const path = `$.content[${blockIndex}]`;
    if (!isRecord(candidate)) {
      invalidStructure = true;
      addIssue(path, "invalid-block", "Expected a block with a children array.");
      return;
    }
    const children = candidate.children;
    if (!Array.isArray(children)) {
      invalidStructure = true;
      addIssue(path, "invalid-block", "Expected a block with a children array.");
      return;
    }
    if (
      candidate.type !== "paragraph" &&
      candidate.type !== "heading" &&
      candidate.type !== "listItem" &&
      candidate.type !== "blockquote" &&
      candidate.type !== "codeBlock" &&
      candidate.type !== "horizontalRule"
    ) {
      invalidStructure = true;
      addIssue(`${path}.type`, "invalid-block-type", "Unsupported block type.");
    }
    if (candidate.type === "horizontalRule" && children.length > 0) {
      addIssue(
        `${path}.children`,
        "invalid-horizontal-rule-content",
        "Horizontal rules cannot contain text.",
      );
    }
    children.forEach((inline, inlineIndex) => {
      if (!isRecord(inline) || typeof inline.text !== "string") {
        invalidStructure = true;
        addIssue(
          `${path}.children[${inlineIndex}]`,
          "invalid-inline",
          "Expected an inline text object.",
        );
        return;
      }
      if (
        inline.marks !== undefined &&
        (!Array.isArray(inline.marks) || !inline.marks.every(isTextMark))
      ) {
        addIssue(
          `${path}.children[${inlineIndex}].marks`,
          "invalid-inline-marks",
          "Inline marks contain unsupported values.",
        );
      }
      if (
        inline.link !== undefined &&
        (!isRecord(inline.link) ||
          typeof inline.link.href !== "string" ||
          normalizeLinkHref(inline.link.href) === null)
      ) {
        addIssue(
          `${path}.children[${inlineIndex}].link`,
          "invalid-link",
          "Inline link is not a supported safe URL.",
        );
      }
    });

    const listTypeProvided = Object.hasOwn(candidate, "listType");
    const listType = candidate.listType;
    if (listTypeProvided && !isTextListType(listType)) {
      addIssue(`${path}.listType`, "invalid-list-type", "Unsupported list type.");
    }
    if (listType === "checklist") {
      if (candidate.checked !== undefined && typeof candidate.checked !== "boolean") {
        addIssue(`${path}.checked`, "invalid-checked-state", "Expected a boolean checked state.");
      }
      const attributes = candidate.listAttributes;
      if (
        attributes !== undefined &&
        (!isRecord(attributes) ||
          (attributes.interactive !== undefined &&
            typeof attributes.interactive !== "boolean"))
      ) {
        addIssue(
          `${path}.listAttributes`,
          "invalid-list-attributes",
          "Checklist attributes require a boolean interactive value.",
        );
      }
    } else if (listType === "icon") {
      const attributes = isRecord(candidate.listAttributes)
        ? candidate.listAttributes
        : {};
      const icon = isRecord(attributes.icon) ? attributes.icon : {};
      if (
        !isValidTextListIconName(icon.name) ||
        typeof icon.size !== "number" ||
        !Number.isFinite(icon.size) ||
        icon.size < 8 ||
        icon.size > 64 ||
        !isSafeTextListIconColor(icon.color)
      ) {
        addIssue(
          `${path}.listAttributes.icon`,
          "invalid-icon-attributes",
          "Icon lists require a valid identifier, size, and color.",
        );
      }
    } else if (candidate.listAttributes !== undefined) {
      addIssue(
        `${path}.listAttributes`,
        "invalid-list-attributes",
        "Only checklist and icon lists accept list attributes.",
      );
    }
    if (listType !== "checklist" && candidate.checked !== undefined) {
      addIssue(
        `${path}.checked`,
        "invalid-checked-state",
        "Checked state is only supported on checklist items.",
      );
    }
    if (
      candidate.indent !== undefined &&
      (!Number.isInteger(candidate.indent) ||
        Number(candidate.indent) < 0 ||
        Number(candidate.indent) > MAX_TEXT_LIST_INDENT)
    ) {
      addIssue(
        `${path}.indent`,
        "invalid-indentation",
        `Indentation must be an integer from 0 to ${MAX_TEXT_LIST_INDENT}.`,
      );
    }
  });

  if (invalidStructure) return { status: "invalid", issues };
  const normalized = normalizeTextDocument(input);
  if (!sameValue(input, normalized)) {
    addIssue(
      "$",
      "normalization-required",
      "Document data requires normalization before use.",
    );
  }

  return {
    status: issues.length === 0 ? "valid" : "recoverable",
    issues,
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
  clearLinks = false,
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
          ...copyInlineAttributes(
            inline,
            transform([...marks]),
            clearLinks ? null : undefined,
          ),
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
        if (addMark) {
          if (mark === "code") next.clear();
          else next.delete("code");
          next.add(mark);
        } else {
          next.delete(mark);
        }
        return normalizeMarks([...next]);
      }, mark === "code" && addMark),
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

export const setBlockType = (
  document: TextDocument,
  selection: TextSelection,
  blockType: "paragraph" | "blockquote" | "codeBlock",
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    const {
      listType: _listType,
      listAttributes: _listAttributes,
      checked: _checked,
      indent: _indent,
      headingLevel: _headingLevel,
      ...rest
    } = block;
    const children =
      blockType === "codeBlock"
        ? block.children.map(({ text }) => ({ text }))
        : block.children;
    if (
      block.type === blockType &&
      children === block.children &&
      block.listType === undefined
    ) {
      return block;
    }
    return {
      ...rest,
      type: blockType,
      ...(blockType === "paragraph" || blockType === "codeBlock"
        ? { variant: "body1" as const }
        : {}),
      ...(!block.listType && block.indent ? { indent: block.indent } : {}),
      children,
    };
  });

export const insertHorizontalRule = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction =>
  insertDocumentAtSelection(document, selection, {
    type: "doc",
    content: [
      { type: "horizontalRule", variant: "body1", children: [] },
      { type: "paragraph", variant: "body1", children: [] },
    ],
  });

export const clearFormatting = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    const children = normalizeInlines(
      block.children.map(({ text }) => ({ text })),
    );
    const {
      align: _align,
      headingLevel: _headingLevel,
      indent: _indent,
      ...rest
    } = block;
    const type: TextBlockType = block.listType
      ? "listItem"
      : "paragraph";
    if (
      block.type === type &&
      block.variant === "body1" &&
      !block.align &&
      !block.headingLevel &&
      children.every((inline, index) => inline === block.children[index])
    ) {
      return block;
    }
    return {
      ...rest,
      type,
      variant: "body1",
      ...(block.listType && block.indent ? { indent: block.indent } : {}),
      children,
    };
  });

/** Clear inline marks and links without changing the selected blocks. */
export const clearInlineFormatting = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction => {
  if (isCollapsedSelection(selection)) return { document, selection };
  const { start, end } = getOrderedSelection(selection);
  return {
    document: {
      ...document,
      content: document.content.map((block, index) => {
        if (index < start.block || index > end.block) return block;
        const from = index === start.block ? start.offset : 0;
        const to = index === end.block ? end.offset : getBlockLength(block);
        if (to <= from) return block;
        return {
          ...block,
          children: transformInlineRange(block.children, from, to, () => [], true),
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
  const separatePrefix = leftSurvives && first.type !== "paragraph";
  const separateSuffix = rightSurvives && last.type !== "paragraph";
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

export const exitEmptyTextBlock = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction | null => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  if (!isCollapsedSelection(normalizedSelection)) return null;
  const { block: blockIndex, offset } = normalizedSelection.focus;
  const block = document.content[blockIndex];
  if (!block || (block.type !== "blockquote" && block.type !== "codeBlock")) return null;

  const text = getBlockText(block);
  const lineStart = offset === 0 ? 0 : text.lastIndexOf("\n", offset - 1) + 1;
  const nextBreak = text.indexOf("\n", offset);
  const lineEnd = nextBreak === -1 ? text.length : nextBreak;
  if (text.slice(lineStart, lineEnd).trim()) return null;

  const before = sliceInlines(block.children, 0, Math.max(0, lineStart - 1));
  const after = sliceInlines(block.children, Math.min(text.length, lineEnd + 1), text.length);
  const replacement: TextBlock[] = [];
  if (before.length) replacement.push({ ...block, children: before });
  const paragraphIndex = blockIndex + replacement.length;
  replacement.push({ ...block, type: "paragraph", variant: "body1", children: [] });
  if (after.length) replacement.push({ ...block, children: after });
  const caret = { block: paragraphIndex, offset: 0 };
  return {
    document: {
      type: "doc",
      content: [
        ...document.content.slice(0, blockIndex),
        ...replacement,
        ...document.content.slice(blockIndex + 1),
      ],
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
  const normalizedDocument = normalizeTextDocument(document);
  const normalizedSelection = normalizeTextSelection(
    normalizedDocument,
    selection,
  );
  const { start, end } = getOrderedSelection(normalizedSelection);
  const codeBlock = normalizedDocument.content[start.block];
  if (start.block === end.block && codeBlock?.type === "codeBlock") {
    const length = getBlockLength(codeBlock);
    const children = normalizeInlines([
      ...sliceInlines(codeBlock.children, 0, start.offset),
      ...(text
        ? [{ text, ...(marks.length ? { marks: [...marks] } : {}) }]
        : []),
      ...sliceInlines(codeBlock.children, end.offset, length),
    ]);
    const content = [...normalizedDocument.content];
    content[start.block] = { ...codeBlock, children };
    const caret = { block: start.block, offset: start.offset + text.length };
    return {
      document: { type: "doc", content },
      selection: { anchor: caret, focus: caret },
    };
  }

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

export const deleteTextAtSelection = (
  document: TextDocument,
  selection: TextSelection,
  direction: "backward" | "forward",
): TextTransaction => {
  const normalizedDocument = normalizeTextDocument(document);
  const normalizedSelection = normalizeTextSelection(
    normalizedDocument,
    selection,
  );
  if (!isCollapsedSelection(normalizedSelection)) {
    return insertTextAtSelection(normalizedDocument, normalizedSelection, "");
  }

  const point = normalizedSelection.focus;
  const block = normalizedDocument.content[point.block];
  if (!block) return { document: normalizedDocument, selection: normalizedSelection };
  const length = getBlockLength(block);
  if (direction === "backward" && point.offset === 0) {
    return { document: normalizedDocument, selection: normalizedSelection };
  }
  if (direction === "forward" && point.offset >= length) {
    return { document: normalizedDocument, selection: normalizedSelection };
  }

  let startOffset = point.offset;
  let endOffset = point.offset;
  if (direction === "backward") {
    startOffset -= 1;
    const text = getBlockText(block);
    if (
      startOffset > 0 &&
      /[\uDC00-\uDFFF]/.test(text[startOffset]!) &&
      /[\uD800-\uDBFF]/.test(text[startOffset - 1]!)
    ) {
      startOffset -= 1;
    }
  } else {
    endOffset += 1;
    const text = getBlockText(block);
    if (
      endOffset < text.length &&
      /[\uD800-\uDBFF]/.test(text[point.offset]!) &&
      /[\uDC00-\uDFFF]/.test(text[endOffset]!)
    ) {
      endOffset += 1;
    }
  }

  return insertTextAtSelection(
    normalizedDocument,
    {
      anchor: { block: point.block, offset: startOffset },
      focus: { block: point.block, offset: endOffset },
    },
    "",
  );
};

export const replaceAllText = (
  document: TextDocument,
  selection: TextSelection,
  query: string,
  replacement: string,
  options: TextSearchOptions = {},
): TextTransaction => {
  const matches = findTextInDocument(document, query, options);
  if (matches.length === 0) return { document, selection };

  let nextDocument = document;
  let nextSelection = selection;
  for (const match of [...matches].reverse()) {
    const transaction = insertTextAtSelection(
      nextDocument,
      { anchor: match.start, focus: match.end },
      replacement,
    );
    nextDocument = transaction.document;
    nextSelection = transaction.selection;
  }
  return { document: nextDocument, selection: nextSelection };
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

export const normalizeTextSelection = (
  document: TextDocument,
  selection: TextSelection,
): TextSelection => {
  const lastBlock = Math.max(0, document.content.length - 1);
  const normalizePoint = ({ block, offset }: TextPoint): TextPoint => {
    const blockIndex = Number.isFinite(block)
      ? Math.max(0, Math.min(lastBlock, Math.trunc(block)))
      : 0;
    const textBlock = document.content[blockIndex];
    return {
      block: blockIndex,
      offset:
        textBlock && Number.isFinite(offset)
          ? Math.max(0, Math.min(getBlockLength(textBlock), Math.trunc(offset)))
          : 0,
    };
  };

  return {
    anchor: normalizePoint(selection.anchor),
    focus: normalizePoint(selection.focus),
  };
};

const getSelectedBlockRange = (
  document: TextDocument,
  selection: TextSelection,
) => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  const { start, end } = getOrderedSelection(normalizedSelection);
  const lastBlock = isCollapsedSelection(normalizedSelection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;

  return {
    selection: normalizedSelection,
    startBlock: Math.max(0, start.block),
    endBlock: Math.max(start.block, lastBlock),
  };
};

const updateSelectedBlocks = (
  document: TextDocument,
  selection: TextSelection,
  transform: (block: TextBlock) => TextBlock,
): TextTransaction => {
  const range = getSelectedBlockRange(document, selection);
  let changed = false;
  const content = document.content.map((block, index) => {
    if (index < range.startBlock || index > range.endBlock) return block;
    const next = transform(block);
    if (next !== block) changed = true;
    return next;
  });

  return {
    document: changed ? { type: "doc", content } : document,
    selection: range.selection,
  };
};

/** Apply a list type without toggling an already active list off. */
export const applyListType = (
  document: TextDocument,
  selection: TextSelection,
  listType: TextListType,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    if (block.listType === listType) return block;
    const attributes = normalizeListAttributes(
      listType === "icon"
        ? { icon: { color: DEFAULT_COLOR_SCHEME.light.primary } }
        : undefined,
      listType,
    );
    const {
      listType: _previousListType,
      listAttributes: _previousListAttributes,
      checked: previousChecked,
      indent: previousIndent,
      ...rest
    } = block;
    return {
      ...rest,
      type: "listItem",
      listType,
      ...(attributes ? { listAttributes: attributes } : {}),
      ...(listType === "checklist"
        ? { checked: previousChecked === true }
        : {}),
      ...(block.listType && previousIndent ? { indent: previousIndent } : {}),
    };
  });

/** Preserve the legacy toggle behavior; use removeList for explicit removal. */
export const setListType = (
  document: TextDocument,
  selection: TextSelection,
  listType: TextListType | null,
): TextTransaction => {
  if (listType === null) return removeList(document, selection);
  const range = getSelectedBlockRange(document, selection);
  const selected = document.content.slice(range.startBlock, range.endBlock + 1);
  if (
    selected.length > 0 &&
    selected.every((block) => block.listType === listType)
  ) {
    return removeList(document, range.selection);
  }
  return applyListType(document, range.selection, listType);
};

/** Remove list formatting without changing text, marks, alignment, or variant. */
export const removeList = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    if (!block.listType && block.type !== "listItem") return block;
    const {
      listType: _listType,
      listAttributes: _listAttributes,
      checked: _checked,
      indent: _indent,
      headingLevel: _headingLevel,
      ...rest
    } = block;
    return { ...rest, type: "paragraph" };
  });

export const setListAttributes = (
  document: TextDocument,
  selection: TextSelection,
  attributes: TextListAttributes,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    if (block.listType !== "checklist" && block.listType !== "icon") {
      return block;
    }

    const current = block.listAttributes ?? {};
    const next = normalizeListAttributes(
      {
        ...current,
        ...attributes,
        ...(attributes.icon
          ? { icon: { ...current.icon, ...attributes.icon } }
          : {}),
      },
      block.listType,
    );
    if (sameValue(current, next)) return block;
    return { ...block, ...(next ? { listAttributes: next } : {}) };
  });

export const setListChecked = (
  document: TextDocument,
  selection: TextSelection,
  checked: boolean,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) =>
    block.listType !== "checklist" || block.checked === checked
      ? block
      : { ...block, checked },
  );

export const setListInteractive = (
  document: TextDocument,
  selection: TextSelection,
  interactive: boolean,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) => {
    if (block.listType !== "checklist") return block;
    const current = block.listAttributes ?? { interactive: false };
    if (current.interactive === interactive) return block;
    return {
      ...block,
      listAttributes: { ...current, interactive },
    };
  });

export const setListIndent = (
  document: TextDocument,
  selection: TextSelection,
  indent: number,
): TextTransaction => {
  const safeIndent = Number.isFinite(indent)
    ? Math.max(0, Math.min(MAX_TEXT_LIST_INDENT, Math.trunc(indent)))
    : 0;
  const transaction = updateSelectedBlocks(document, selection, (block) => {
    if (!block.listType || block.indent === (safeIndent || undefined)) {
      return block;
    }
    const { indent: _currentIndent, ...rest } = block;
    return {
      ...rest,
      ...(safeIndent > 0 ? { indent: safeIndent } : {}),
    };
  });
  if (transaction.document === document) return transaction;

  const normalized = normalizeTextDocument(transaction.document);
  return {
    document:
      JSON.stringify(normalized) === JSON.stringify(document)
        ? document
        : normalized,
    selection: transaction.selection,
  };
};

export const shiftListIndent = (
  document: TextDocument,
  selection: TextSelection,
  direction: -1 | 1,
): TextTransaction => {
  const transaction = updateSelectedBlocks(document, selection, (block) => {
    if (!block.listType) return block;
    const indent = Math.max(0, Math.min(MAX_TEXT_LIST_INDENT, (block.indent ?? 0) + direction));
    if (indent === (block.indent ?? 0)) return block;
    const { indent: _previousIndent, ...rest } = block;
    return { ...rest, ...(indent ? { indent } : {}) };
  });
  if (transaction.document === document) return transaction;
  const normalized = normalizeTextDocument(transaction.document);
  return {
    document: sameValue(normalized, document) ? document : normalized,
    selection: transaction.selection,
  };
};

export const setBlockIndent = (
  document: TextDocument,
  selection: TextSelection,
  indent: number,
): TextTransaction => {
  const safeIndent = Number.isFinite(indent)
    ? Math.max(0, Math.min(MAX_TEXT_LIST_INDENT, Math.trunc(indent)))
    : 0;
  return updateSelectedBlocks(document, selection, (block) => {
    if (block.listType || block.indent === (safeIndent || undefined)) {
      return block;
    }
    const { indent: _currentIndent, ...rest } = block;
    return {
      ...rest,
      ...(safeIndent > 0 ? { indent: safeIndent } : {}),
    };
  });
};

/** Toggle each selected checklist item independently. */
export const toggleListItemChecked = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction =>
  updateSelectedBlocks(document, selection, (block) =>
    block.listType === "checklist"
      ? { ...block, checked: block.checked !== true }
      : block,
  );

export const splitListItemAtSelection = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  const { start, end } = getOrderedSelection(normalizedSelection);
  const block = document.content[start.block];
  if (!block?.listType) return { document, selection: normalizedSelection };

  const collapsed = isCollapsedSelection(normalizedSelection);
  if (collapsed && getBlockLength(block) === 0) {
    return block.indent
      ? setListIndent(document, normalizedSelection, block.indent - 1)
      : removeList(document, normalizedSelection);
  }

  const lastBlock = document.content[end.block];
  if (!lastBlock?.listType) {
    return { document, selection: normalizedSelection };
  }
  const startOffset = start.offset;
  const endOffset = end.offset;
  const before = sliceInlines(block.children, 0, startOffset);
  const after = sliceInlines(
    lastBlock.children,
    endOffset,
    getBlockLength(lastBlock),
  );
  const left: TextBlock = {
    ...block,
    children: before,
    ...(block.listType === "checklist" ? { checked: block.checked === true } : {}),
  };
  const right: TextBlock = {
    ...lastBlock,
    children: after,
    ...(lastBlock.listType === "checklist" ? { checked: false } : {}),
  };
  if (
    block.listType === "checklist" &&
    lastBlock.listType === "checklist" &&
    start.block === end.block &&
    startOffset === 0
  ) {
    left.checked = false;
    right.checked = block.checked === true;
  }

  const content = [
    ...document.content.slice(0, start.block),
    left,
    right,
    ...document.content.slice(end.block + 1),
  ];
  const caret = { block: start.block + 1, offset: 0 };
  return {
    document: normalizeTextDocument({ type: "doc", content }),
    selection: { anchor: caret, focus: caret },
  };
};

export const mergeListItemBackward = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  if (
    !isCollapsedSelection(normalizedSelection) ||
    normalizedSelection.focus.offset !== 0
  ) {
    return { document, selection: normalizedSelection };
  }

  const blockIndex = normalizedSelection.focus.block;
  const block = document.content[blockIndex];
  if (!block?.listType) return { document, selection: normalizedSelection };

  const previous = document.content[blockIndex - 1];
  if (
    !previous ||
    previous.listType !== block.listType ||
    (previous.indent ?? 0) !== (block.indent ?? 0) ||
    !sameValue(previous.listAttributes, block.listAttributes)
  ) {
    return block.indent
      ? setListIndent(document, normalizedSelection, block.indent - 1)
      : removeList(document, normalizedSelection);
  }

  const previousLength = getBlockLength(previous);
  const content = [
    ...document.content.slice(0, blockIndex - 1),
    {
      ...previous,
      children: normalizeInlines([...previous.children, ...block.children]),
    },
    ...document.content.slice(blockIndex + 1),
  ];
  const caret = { block: blockIndex - 1, offset: previousLength };
  return {
    document: { type: "doc", content },
    selection: { anchor: caret, focus: caret },
  };
};

export const applyMarkdownShortcut = (
  document: TextDocument,
  selection: TextSelection,
): TextTransaction | null => {
  const normalizedSelection = normalizeTextSelection(document, selection);
  if (!isCollapsedSelection(normalizedSelection)) return null;

  const blockIndex = normalizedSelection.focus.block;
  const block = document.content[blockIndex];
  if (!block || block.type !== "paragraph") return null;

  const text = getBlockText(block);
  if (normalizedSelection.focus.offset !== text.length) return null;

  const heading = text.match(/^(#{1,4}) $/);
  const checklist = text.match(/^(?:[-+*] )?\[([ xX])\] $/);
  const list = text.match(/^([-+*]|\d+[.)]) $/);
  const quote = text === "> ";
  const codeBlock = text === "```";
  if (!heading && !checklist && !list && !quote && !codeBlock) return null;

  const markerLength = text.length;
  const children = sliceInlines(
    block.children,
    markerLength,
    getBlockLength(block),
  );
  let nextBlock: TextBlock;
  if (heading) {
    const level = heading[1]!.length;
    nextBlock = {
      ...block,
      type: "heading",
      variant: (`headline${level}`) as TextBlockVariant,
      headingLevel: level as TextBlock["headingLevel"],
      children,
    };
  } else if (quote || codeBlock) {
    nextBlock = {
      ...block,
      type: quote ? "blockquote" : "codeBlock",
      variant: "body1",
      children,
    };
  } else {
    const listType: TextListType = checklist
      ? "checklist"
      : list && /^\d/.test(list[1]!)
        ? "ordered"
        : "bullet";
    nextBlock = {
      ...block,
      type: "listItem",
      listType,
      children,
      ...(listType === "checklist"
        ? {
            listAttributes: { interactive: false },
            checked: checklist ? /^[xX]$/.test(checklist[1]!) : false,
          }
        : {}),
    };
  }

  const content = [...document.content];
  content[blockIndex] = nextBlock;
  const caret = { block: blockIndex, offset: 0 };
  return {
    document: { type: "doc", content },
    selection: { anchor: caret, focus: caret },
  };
};


export const getListType = (
  document: TextDocument,
  selection: TextSelection,
  listType: TextListType,
): boolean => {
  const state = getListSelectionState(document, selection);
  return state.status === "active" && state.listType === listType;
};

export const getListSelectionState = (
  document: TextDocument,
  selection: TextSelection,
): TextListSelectionState => {
  if (document.content.length === 0) return { status: "disabled" };

  const { startBlock, endBlock } = getSelectedBlockRange(document, selection);
  const selected = document.content.slice(startBlock, endBlock + 1);
  if (selected.length === 0) return { status: "disabled" };

  const listed = selected.filter((block) => block.listType !== undefined);
  if (listed.length === 0) return { status: "inactive" };
  const first = listed[0]!;
  const sameConfiguration = listed.every(
    (block) =>
      block.listType === first.listType &&
      sameValue(block.listAttributes, first.listAttributes),
  );
  if (listed.length !== selected.length || !sameConfiguration) {
    return { status: "mixed" };
  }

  return {
    status: "active",
    listType: first.listType,
    ...(first.listAttributes ? { attributes: first.listAttributes } : {}),
  };
};
