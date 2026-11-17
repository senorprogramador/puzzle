import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type LocationSectionVariant =
  | "map"
  | "split"
  | "cards"
  | "offices"
  | "single"
  | "directions"
  | "image"
  | "gallery"
  | "hours"
  | "interactive";

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export type LocationOpeningHours = {
  day: ReactNode;
  hours: ReactNode;
};

export type LocationItem = {
  id: string;
  name: ReactNode;
  address?: ReactNode;
  phone?: string;
  email?: string;
  coordinates?: LocationCoordinates;
  openingHours?: readonly LocationOpeningHours[];
  directionsHref?: string;
  image?: ReactNode;
  mapSlot?: ReactNode;
  description?: ReactNode;
};

export type LocationSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: LocationSectionVariant;
    locations: readonly LocationItem[];
    selectedLocationId?: string;
    defaultSelectedLocationId?: string;
    onLocationSelect?: (locationId: string) => void;
    mapSlot?: ReactNode;
    mapLabel?: string;
    className?: string;
  };
