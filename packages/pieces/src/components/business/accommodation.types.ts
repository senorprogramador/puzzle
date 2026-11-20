import type { ReactNode } from "react";
import type { CommerceMoney } from "../commerce/shared.types";
import type { EditorialImage } from "../content/shared";

export type AccommodationStats = {
  capacity?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
};

export type AccommodationFeature = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export type AccommodationBadge = {
  id: string;
  content: ReactNode;
};

export type AccommodationOverviewItem = AccommodationStats & {
  id: string;
  name: string;
  description?: ReactNode;
  image?: EditorialImage;
  price?: CommerceMoney;
  priceNote?: ReactNode;
  badges?: readonly AccommodationBadge[];
  highlights?: readonly AccommodationFeature[];
  href?: string;
  action?: ReactNode;
  featured?: boolean;
};

export type AccommodationSleepingArrangement = {
  id: string;
  name: ReactNode;
  description: ReactNode;
};

export type AccommodationDetails = AccommodationStats & {
  name: ReactNode;
  description?: ReactNode;
  sleepingArrangements?: readonly AccommodationSleepingArrangement[];
  highlights?: readonly AccommodationFeature[];
};

export type Amenity = AccommodationFeature & {
  content?: ReactNode;
};

export type AmenityCategory = {
  id: string;
  name: ReactNode;
  items: readonly Amenity[];
};
