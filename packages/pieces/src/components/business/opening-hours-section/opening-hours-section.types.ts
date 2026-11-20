import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type OpeningHoursWeekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type OpeningHoursInterval = {
  opensAt: string;
  closesAt: string;
  label?: ReactNode;
};

export type OpeningHoursDay = {
  day: OpeningHoursWeekday;
  intervals: readonly OpeningHoursInterval[];
};

export type OpeningHoursSeason = {
  id: string;
  label: ReactNode;
  startDate: string;
  endDate: string;
  days: readonly OpeningHoursDay[];
};

export type OpeningHoursException = {
  id: string;
  label: ReactNode;
  startDate: string;
  endDate: string;
  intervals: readonly OpeningHoursInterval[];
};

export type OpeningHours = {
  days: readonly OpeningHoursDay[];
  seasons?: readonly OpeningHoursSeason[];
  exceptions?: readonly OpeningHoursException[];
  timeZone?: string;
};

export type OpeningHoursStatus = "open" | "closed" | "unknown";
export type OpeningHoursVariant = "compact" | "expanded";

export type OpeningHoursSectionProps = MarketingSectionBaseProps<"section"> & {
  openingHours: OpeningHours;
  variant?: OpeningHoursVariant;
  showStatus?: boolean;
  statusAt?: Date;
  locale?: string;
  openLabel?: ReactNode;
  closedLabel?: ReactNode;
  unknownStatusLabel?: ReactNode;
  unknownHoursLabel?: ReactNode;
  currentStatusLabel?: ReactNode;
  timeZoneLabel?: ReactNode;
  exceptionsLabel?: ReactNode;
  seasonsLabel?: ReactNode;
  className?: string;
};
