import type { TypographyStyle } from "@puzzle-ui/theme";

type TextMark = "bold" | "italic" | "underline" | "strike" | "code";

type TextLink = {
  href: string;
};

type TextInline = {
  text: string;
  marks?: TextMark[];
  link?: TextLink;
};

type TextBlockType =
  | "paragraph"
  | "heading"
  | "listItem"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule";
type TextAlign = "left" | "center" | "right" | "justify";
type TextListType = "bullet" | "ordered" | "checklist" | "icon";
type TextListIcon = {
  name: string;
  size: number;
  color: string;
};
type TextListAttributes = {
  interactive?: boolean;
  icon?: TextListIcon;
};
type TextHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TextBlock = {
  type: TextBlockType;
  variant: TypographyStyle;
  children: TextInline[];
  align?: TextAlign;
  listType?: TextListType;
  listAttributes?: TextListAttributes;
  checked?: boolean;
  indent?: number;
  /** Semantic heading level, independent of the visual `variant`. */
  headingLevel?: TextHeadingLevel;
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

type TextTransaction = {
  document: TextDocument;
  selection: TextSelection;
};

type TextDocumentValidationIssue = {
  path: string;
  code: string;
  message: string;
};

type TextDocumentValidationResult = {
  status: "valid" | "recoverable" | "invalid";
  issues: TextDocumentValidationIssue[];
};

type TextListSelectionState = {
  status: "inactive" | "active" | "mixed" | "disabled";
  listType?: TextListType;
  attributes?: TextListAttributes;
};

type TextDocumentStatistics = {
  wordCount: number;
  characterCount: number;
};

type TextSearchOptions = {
  caseSensitive?: boolean;
  wholeWord?: boolean;
};

type TextSearchMatch = {
  start: TextPoint;
  end: TextPoint;
};

type TextSlashCommandMatch = {
  query: string;
  start: TextPoint;
  end: TextPoint;
};

type TextEditorShortcutCommand =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "undo"
  | "redo"
  | "clearFormatting";

type TextEditorShortcutModifier = "mod" | "ctrl" | "meta" | "alt" | "shift";

type TextEditorShortcut = {
  id: string;
  key: string;
  modifiers: readonly TextEditorShortcutModifier[];
  command: TextEditorShortcutCommand;
};

type TextBlockVariant = TypographyStyle;

export type {
  TextMark,
  TextLink,
  TextInline,
  TextBlockType,
  TextAlign,
  TextListType,
  TextListIcon,
  TextListAttributes,
  TextHeadingLevel,
  TextBlock,
  TextDocument,
  TextPoint,
  TextSelection,
  TextTransaction,
  TextDocumentValidationIssue,
  TextDocumentValidationResult,
  TextListSelectionState,
  TextDocumentStatistics,
  TextSearchOptions,
  TextSearchMatch,
  TextSlashCommandMatch,
  TextEditorShortcutCommand,
  TextEditorShortcutModifier,
  TextEditorShortcut,
  TextBlockVariant,
};
