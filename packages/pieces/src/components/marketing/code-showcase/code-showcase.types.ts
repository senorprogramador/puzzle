import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type CodeShowcaseVariant =
  | "single"
  | "tabs"
  | "split"
  | "editor"
  | "terminal"
  | "multi-language"
  | "numbered"
  | "comparison"
  | "installation"
  | "playground"
  | "featured"
  | "compact";

export type CodeSnippet = {
  id: string;
  language: string;
  code: string;
  title?: string;
  filename?: string;
  highlightedLines?: readonly number[];
};

export type CodeShowcaseSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CodeShowcaseVariant;
    items: readonly CodeSnippet[];
    copyable?: boolean;
    showLineNumbers?: boolean;
    editable?: boolean;
    onCopy?: (code: string) => void;
    onCopyError?: (error: unknown) => void;
  };
