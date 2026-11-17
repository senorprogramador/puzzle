import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { EditorialAuthor, EditorialImage } from "../shared";

export type BlogSectionVariant =
  | "grid"
  | "featured"
  | "list"
  | "masonry"
  | "carousel"
  | "editorial"
  | "magazine"
  | "split"
  | "compact"
  | "categories"
  | "latest"
  | "horizontal"
  | "cards";

export type BlogArticle = {
  id: string;
  title: string;
  excerpt?: string;
  image?: EditorialImage;
  author?: EditorialAuthor;
  date?: string;
  category?: string;
  readingTime?: string | number;
  href?: string;
  featured?: boolean;
};

export type BlogSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: BlogSectionVariant;
    items: readonly BlogArticle[];
    featuredArticle?: BlogArticle;
  };
