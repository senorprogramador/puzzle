import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { GuestCount } from "../../business/accommodation.types";
import type { CommerceImage, CommerceMoney } from "../shared.types";

export type StaySummaryAccommodation = {
  name: ReactNode;
  description?: ReactNode;
  image?: CommerceImage;
};

export type StaySummaryPriceKind = "rate" | "discount" | "fee" | "service";

export type StaySummaryPriceLine = {
  id: string;
  label: ReactNode;
  amount: CommerceMoney;
  kind?: StaySummaryPriceKind;
};

export type StaySummaryVariant = "default" | "compact";

export type StaySummarySectionProps = MarketingSectionBaseProps<"section"> & {
  accommodation: StaySummaryAccommodation;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
  nights?: number;
  priceLines?: readonly StaySummaryPriceLine[];
  subtotal?: CommerceMoney;
  total: CommerceMoney;
  variant?: StaySummaryVariant;
  locale?: string;
  timeZone?: string;
  totalLabel?: ReactNode;
  editLabel?: ReactNode;
  continueLabel?: ReactNode;
  onEdit?: () => void;
  onContinue?: () => void;
};
