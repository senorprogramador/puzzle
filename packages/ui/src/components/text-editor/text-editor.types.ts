import type { TypographyStyle } from "@puzzle/theme";

export type TextMark = "bold" | "italic" | "underline" | "strike";

export type TextInline = {
  text: string;
  marks?: TextMark[];
};

export type TextBlockType = "paragraph" | "heading" | "listItem";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextListType = "bullet" | "ordered";

export type TextBlock = {
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
export type TextDocument = {
  type: "doc";
  content: TextBlock[];
};

export type TextPoint = {
  block: number;
  offset: number;
};

export type TextSelection = {
  anchor: TextPoint;
  focus: TextPoint;
};

export type TextBlockVariant = TypographyStyle;
