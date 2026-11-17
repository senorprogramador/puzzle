import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type FAQVariant =
  | "accordion"
  | "two-column"
  | "grid"
  | "cards"
  | "split"
  | "grouped"
  | "categorized"
  | "searchable"
  | "minimal"
  | "bordered"
  | "numbered"
  | "featured";

export type FAQItem = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
  category?: string;
  searchText?: string;
  featured?: boolean;
};

export type FAQSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: FAQVariant;
    items: readonly FAQItem[];
    expandMode?: "single" | "multiple";
    searchLabel?: string;
    searchPlaceholder?: string;
    emptyState?: ReactNode;
  };
