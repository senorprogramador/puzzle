import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type EventSectionVariant =
  | "grid"
  | "list"
  | "featured"
  | "calendar"
  | "timeline"
  | "upcoming"
  | "past"
  | "cards"
  | "split"
  | "carousel";

export type EventTimeframe = "all" | "upcoming" | "past";

export type EventItem = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  dateLabel?: ReactNode;
  endLabel?: ReactNode;
  description?: ReactNode;
  location?: ReactNode;
  category?: string;
  price?: ReactNode;
  href?: string;
  image?: ReactNode;
  featured?: boolean;
};

export type EventSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: EventSectionVariant;
    events: readonly EventItem[];
    featuredEventId?: string;
    filterable?: boolean;
    referenceDate?: string | Date;
    emptyState?: ReactNode;
  };
