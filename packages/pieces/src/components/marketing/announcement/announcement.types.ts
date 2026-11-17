import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type AnnouncementVariant =
  | "bar"
  | "dismissible"
  | "centered"
  | "split"
  | "promotional"
  | "countdown"
  | "ticker"
  | "multi-message"
  | "floating"
  | "minimal";

export type AnnouncementItem = {
  id: string;
  message: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  dismissLabel?: string;
};

type AnnouncementSectionBaseProps<C extends ElementType> =
  Omit<MarketingSectionBaseProps<C>, "actions" | "description" | "eyebrow" | "title"> & {
    dismissible?: boolean;
    dismissLabel?: string;
    icon?: ReactNode;
    message?: ReactNode;
    action?: ReactNode;
  };

export type AnnouncementSectionProps<C extends ElementType = "section"> =
  AnnouncementSectionBaseProps<C> &
    (
      | {
          variant?: Exclude<AnnouncementVariant, "countdown" | "multi-message">;
          countdownTarget?: never;
          announcements?: never;
        }
      | {
          variant: "countdown";
          countdownTarget: Date | string;
          announcements?: never;
        }
      | {
          variant: "multi-message";
          announcements: readonly AnnouncementItem[];
          countdownTarget?: never;
          message?: never;
          icon?: never;
          action?: never;
        }
    );
