import type { ElementType, ReactNode } from "react";
import type { ServicesSectionProps } from "../services-section";
import type { BusinessService } from "../shared.types";

export type ServiceOption = Omit<BusinessService, "pricing"> & {
  inclusion?: "included" | "optional";
  price?: ReactNode;
};

export type ServiceOptionsSectionProps<C extends ElementType = "section"> =
  Omit<ServicesSectionProps<C>, "featuredService" | "items"> & {
    services: readonly ServiceOption[];
    featuredServiceId?: string;
    includedLabel?: ReactNode;
    optionalLabel?: ReactNode;
  };
