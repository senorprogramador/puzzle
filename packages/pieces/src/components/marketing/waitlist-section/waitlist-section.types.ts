import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type WaitlistSectionVariant =
  | "centered"
  | "split"
  | "countdown"
  | "progress"
  | "referral"
  | "launch"
  | "early-access"
  | "card"
  | "social-proof"
  | "multi-step";

export type WaitlistCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds?: number;
};

export type WaitlistProgress = {
  value: number;
  max?: number;
  label?: ReactNode;
};

export type WaitlistSectionProps = Omit<
  MarketingSectionBaseProps<"section">,
  "as" | "onSubmit"
> & {
    variant?: WaitlistSectionVariant;
    signup?: ReactNode;
    onSubmit?: (email: string) => void | Promise<void>;
    submitLabel?: ReactNode;
    emailLabel?: string;
    emailPlaceholder?: string;
    loading?: boolean;
    success?: ReactNode;
    error?: ReactNode;
    countdown?: WaitlistCountdown;
    progress?: WaitlistProgress;
    socialProof?: ReactNode;
    referralInfo?: ReactNode;
  };
