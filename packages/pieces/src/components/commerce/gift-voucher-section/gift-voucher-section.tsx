import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import { ProductGridSection } from "../product-grid";
import type { ProductGridItem } from "../product-grid";
import type { GiftVoucherSectionProps } from "./gift-voucher-section.types";
import "./gift-voucher-section.css";

const GiftVoucherSection = <C extends ElementType = "section">({
  vouchers,
  purchaseLabel = "View gift voucher",
  emptyState,
  className,
  children,
  ...sectionProps
}: GiftVoucherSectionProps<C>) => {
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;
  const items: ProductGridItem[] = vouchers.map((voucher) => {
    const {
      arrangement,
      purchaseAction,
      purchaseHref,
      purchaseLabel: itemPurchaseLabel,
      labels,
      ...product
    } = voucher;
    const arrangementLabel =
      arrangement !== undefined && arrangement !== null
        ? [{ id: `${voucher.id}-arrangement`, content: arrangement }]
        : [];
    const action =
      purchaseAction ??
      (purchaseHref ? (
        <a
          className="puzzle-gift-voucher-section__action"
          href={purchaseHref}
        >
          {itemPurchaseLabel ?? purchaseLabel}
        </a>
      ) : undefined);

    return {
      ...product,
      labels: [...(labels ?? []), ...arrangementLabel],
      href: purchaseHref,
      action,
    };
  });

  return (
    <ProductGridSection<C>
      {...nativeProps}
      className={`puzzle-gift-voucher-section ${className ?? ""}`.trim()}
      items={items}
    >
      {!vouchers.length ? emptyState : null}
      {children}
    </ProductGridSection>
  );
};

export { GiftVoucherSection };
