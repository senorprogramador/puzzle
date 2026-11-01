import type { TypographyStyle } from "@puzzle/theme";

type TextMark = "bold" | "italic" | "underline" | "strike";

type TextInline = {
  text: string;
  marks?: TextMark[];
};

type TextBlockType = "paragraph" | "heading" | "listItem";
type TextAlign = "left" | "center" | "right" | "justify";
type TextListType = "bullet" | "ordered";

type TextBlock = {
  type: TextBlockType;
  variant: TypographyStyle;
  children: TextInline[];
  align?: TextAlign;
  listType?: TextListType;
};

/**
 * Small, serializable document format. It deliberately contains no HTML or DOM
 * nodes, so documents can be persisted, validated, rendered or transformed.
 */
type TextDocument = {
  type: "doc";
  content: TextBlock[];
};

type TextPoint = {
  block: number;
  offset: number;
};

type TextSelection = {
  anchor: TextPoint;
  focus: TextPoint;
};

type TextBlockVariant = TypographyStyle;

export type {
  TextMark,
  TextInline,
  TextBlockType,
  TextAlign,
  TextListType,
  TextBlock,
  TextDocument,
  TextPoint,
  TextSelection,
  TextBlockVariant,
};
