import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type ChangelogSectionVariant =
  | "timeline"
  | "list"
  | "cards"
  | "grouped"
  | "versioned"
  | "featured"
  | "compact"
  | "release-notes"
  | "categories"
  | "split"
  | "vertical"
  | "horizontal";

export type ChangelogCategory = {
  name: string;
  changes?: readonly ReactNode[];
};

export type ChangelogRelease = {
  id: string;
  version: string;
  date?: string;
  type?: string;
  description?: ReactNode;
  categories?: readonly ChangelogCategory[];
  href?: string;
  featured?: boolean;
  group?: string;
};

export type ChangelogSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ChangelogSectionVariant;
    items: readonly ChangelogRelease[];
    featuredRelease?: ChangelogRelease;
  };
