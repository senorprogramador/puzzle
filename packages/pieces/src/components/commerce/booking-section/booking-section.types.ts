import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type BookingSectionVariant =
  | "calendar"
  | "form"
  | "split"
  | "availability"
  | "appointment"
  | "event"
  | "accommodation"
  | "restaurant"
  | "multi-step"
  | "sidebar"
  | "compact";

export type BookingStep = {
  id: string;
  title: ReactNode;
  completed?: boolean;
  disabled?: boolean;
};

export type BookingSectionProps = Omit<
  MarketingSectionBaseProps<"section">,
  "as" | "onSubmit"
> & {
    variant?: BookingSectionVariant;
    bookingDetails?: ReactNode;
    calendar?: ReactNode;
    availability?: ReactNode;
    formSlot?: ReactNode;
    priceSummary?: ReactNode;
    steps?: readonly BookingStep[];
    currentStepId?: string;
    onStepChange?: (stepId: string) => void;
    onSubmit?: (formData: FormData) => void | Promise<void>;
    submitLabel?: ReactNode;
    loading?: boolean;
    success?: ReactNode;
    error?: ReactNode;
  };
