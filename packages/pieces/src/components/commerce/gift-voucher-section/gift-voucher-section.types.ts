import type { ElementType, ReactNode } from "react";
import type {
  ProductGridItem,
  ProductGridSectionProps,
} from "../product-grid";

export type GiftVoucherOption = Omit<
  ProductGridItem,
  "action" | "href"
> & {
  arrangement?: ReactNode;
  purchaseHref?: string;
  purchaseAction?: ReactNode;
  purchaseLabel?: ReactNode;
};

export type GiftVoucherSectionProps<C extends ElementType = "section"> =
  Omit<ProductGridSectionProps<C>, "items"> & {
    vouchers: readonly GiftVoucherOption[];
    purchaseLabel?: ReactNode;
    emptyState?: ReactNode;
  };
