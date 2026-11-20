import type { ElementType, ReactNode } from "react";
import type {
  ResourceItem,
  ResourceSectionProps,
} from "../resource-section";

export type LocalGuideItem = Omit<
  ResourceItem,
  "download" | "href" | "metadata" | "type" | "updatedAt"
> & {
  href?: string;
  kind?: string;
  distance?: ReactNode;
  travelTime?: ReactNode;
};

export type LocalGuideSectionProps<C extends ElementType = "section"> =
  Omit<
    ResourceSectionProps<C>,
    "featuredResourceId" | "items" | "searchable"
  > & {
    places: readonly LocalGuideItem[];
    featuredPlaceId?: string;
    mapSlot?: ReactNode;
    mapLabel?: string;
    distanceLabel?: ReactNode;
    travelTimeLabel?: ReactNode;
  };
