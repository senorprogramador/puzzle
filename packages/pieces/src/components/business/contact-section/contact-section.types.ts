import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type {
  BusinessContactDepartment,
  BusinessContactItem,
} from "../shared.types";

export type ContactSectionVariant =
  | "split"
  | "centered"
  | "form"
  | "card"
  | "map"
  | "details"
  | "minimal"
  | "full-width"
  | "departments"
  | "multi-column"
  | "editorial"
  | "support"
  | "inquiry";

export type ContactSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ContactSectionVariant;
    address?: ReactNode;
    phone?: string;
    email?: string;
    openingHours?: ReactNode;
    details?: readonly BusinessContactItem[];
    departments?: readonly BusinessContactDepartment[];
    formSlot?: ReactNode;
    mapSlot?: ReactNode;
    mapLabel?: string;
    successSlot?: ReactNode;
  };
