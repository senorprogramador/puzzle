import type { CompanyInfoProps } from "@puzzle-ui/ui";
import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { EditorialImage } from "../../content/shared";
import type {
  BusinessMetricItem,
  BusinessProfile,
  BusinessTimelineItem,
  BusinessValue,
} from "../shared.types";

export type AboutSectionVariant =
  | "split"
  | "centered"
  | "editorial"
  | "image-led"
  | "story"
  | "timeline"
  | "stats"
  | "team"
  | "mission"
  | "values"
  | "asymmetric"
  | "full-width";

export type AboutStory = {
  title?: ReactNode;
  description: ReactNode;
  image?: EditorialImage;
};

export type AboutSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: AboutSectionVariant;
    company?: Omit<CompanyInfoProps, "className">;
    story?: AboutStory;
    mission?: ReactNode;
    vision?: ReactNode;
    images?: readonly EditorialImage[];
    stats?: readonly BusinessMetricItem[];
    values?: readonly BusinessValue[];
    timeline?: readonly BusinessTimelineItem[];
    team?: readonly BusinessProfile[];
  };
