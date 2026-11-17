import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type HowItWorksVariant =
  | "steps"
  | "numbered"
  | "timeline"
  | "cards"
  | "alternating"
  | "horizontal"
  | "vertical"
  | "connected"
  | "image-steps"
  | "video-steps"
  | "process"
  | "split"
  | "carousel"
  | "editorial";

export type HowItWorksItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
  action?: ReactNode;
  content?: ReactNode;
};

export type HowItWorksSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: HowItWorksVariant;
    steps: readonly HowItWorksItem[];
    carouselLabel?: string;
  };
