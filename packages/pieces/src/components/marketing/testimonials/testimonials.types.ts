import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type TestimonialsVariant =
  | "grid"
  | "cards"
  | "carousel"
  | "featured"
  | "quote"
  | "masonry"
  | "split"
  | "video"
  | "avatar-grid"
  | "wall"
  | "minimal"
  | "editorial"
  | "rating"
  | "dark";

export type TestimonialItem = {
  id: string;
  quote: ReactNode;
  author: string;
  role?: string;
  organization?: string;
  avatar?: ReactNode;
  companyLogo?: ReactNode;
  rating?: number;
  media?: ReactNode;
  featured?: boolean;
};

export type TestimonialsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: TestimonialsVariant;
    items: readonly TestimonialItem[];
    carouselLabel?: string;
  };
