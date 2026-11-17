import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { EditorialImage } from "../shared";

export type TimelineSectionVariant =
  | "vertical"
  | "horizontal"
  | "alternating"
  | "centered"
  | "cards"
  | "milestones"
  | "history"
  | "editorial"
  | "compact"
  | "numbered"
  | "connected"
  | "split";

export type TimelineEvent = {
  id: string;
  title: string;
  date?: string;
  description?: ReactNode;
  image?: EditorialImage;
  icon?: ReactNode;
  action?: ReactNode;
};

export type TimelineSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: TimelineSectionVariant;
    items: readonly TimelineEvent[];
  };
