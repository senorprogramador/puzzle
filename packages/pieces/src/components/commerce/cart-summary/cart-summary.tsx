import { Card } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import {
  CommercePrice,
  formatQuantity,
} from "../shared";
import { CommerceImageView } from "../commerce-image";
import type {
  CartSummaryItem,
  CartSummarySectionProps,
  CartSummaryTotals,
  CartSummaryVariant,
} from "./cart-summary.types";
import "./cart-summary.css";

const validateItems = (items: readonly CartSummaryItem[]) => {
  const ids = new Set<string>();

  items.forEach((item) => {
    if (!item.id.trim() || ids.has(item.id)) {
      throw new TypeError("Cart summary item IDs must be non-empty and unique.");
    }

    ids.add(item.id);

    if (!Number.isSafeInteger(item.quantity) || item.quantity < 0) {
      throw new RangeError(
        `Quantity for cart item "${item.id}" must be a non-negative safe integer.`,
      );
    }
  });
};

const CartItemRow = ({
  item,
  locale,
  variant,
}: {
  item: CartSummaryItem;
  locale: string;
  variant: CartSummaryVariant;
}) => (
  <li>
    <article className="puzzle-cart-summary__item">
      {variant !== "compact" && variant !== "mobile" ? (
        <CommerceImageView image={item.image} label={item.name} />
      ) : null}
      <div className="puzzle-cart-summary__item-copy">
        <h3>
          {item.href ? <a href={item.href}>{item.name}</a> : item.name}
        </h3>
        {item.description ? <p>{item.description}</p> : null}
        <p className="puzzle-cart-summary__quantity">
          Quantity: {formatQuantity(item.quantity, locale)}
        </p>
        <div className="puzzle-cart-summary__unit-price">
          <span>Each</span>
          <CommercePrice price={item.unitPrice} locale={locale} />
        </div>
      </div>
      {item.lineTotal ? (
        <CommercePrice
          price={item.lineTotal}
          locale={locale}
          className="puzzle-cart-summary__line-total"
        />
      ) : null}
    </article>
  </li>
);

const SummaryTotals = ({
  totals,
  locale,
}: {
  totals: CartSummaryTotals;
  locale: string;
}) => (
  <dl className="puzzle-cart-summary__totals">
    {totals.subtotal ? (
      <div>
        <dt>Subtotal</dt>
        <dd>
          <CommercePrice price={totals.subtotal} locale={locale} />
        </dd>
      </div>
    ) : null}
    {totals.discounts?.map((discount) => (
      <div key={discount.id}>
        <dt>{discount.label}</dt>
        <dd>
          <CommercePrice price={discount.amount} locale={locale} />
        </dd>
      </div>
    ))}
    {totals.shipping ? (
      <div>
        <dt>Shipping</dt>
        <dd>
          <CommercePrice price={totals.shipping} locale={locale} />
        </dd>
      </div>
    ) : null}
    {totals.total ? (
      <div className="puzzle-cart-summary__total">
        <dt>Total</dt>
        <dd>
          <CommercePrice price={totals.total} locale={locale} />
        </dd>
      </div>
    ) : null}
  </dl>
);

const hasTotals = (totals?: CartSummaryTotals) =>
  Boolean(
    totals?.subtotal ||
      totals?.shipping ||
      totals?.total ||
      totals?.discounts?.length,
  );

const CartSummarySection = <C extends ElementType = "section">({
  variant = "card",
  items,
  totals,
  emptyState = "Your cart is empty.",
  locale = "en-US",
  actions,
  children,
  className,
  ...sectionProps
}: CartSummarySectionProps<C>) => {
  validateItems(items);
  const showTotals = items.length > 0 && hasTotals(totals);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-cart-summary ${className ?? ""}`.trim()}
      family="cart-summary"
      variant={variant}
    >
      {items.length ? (
        <div className="puzzle-cart-summary__layout">
          <ul className="puzzle-cart-summary__items">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                locale={locale}
                variant={variant}
              />
            ))}
          </ul>
          {showTotals && totals ? (
            <Card
              as="aside"
              className="puzzle-cart-summary__summary"
              variant="outlined"
            >
              <h3>Order summary</h3>
              <SummaryTotals totals={totals} locale={locale} />
              {actions ? (
                <div className="puzzle-cart-summary__actions">{actions}</div>
              ) : null}
            </Card>
          ) : actions ? (
            <div className="puzzle-cart-summary__actions">{actions}</div>
          ) : null}
        </div>
      ) : (
        <div className="puzzle-cart-summary__empty" role="status">
          {emptyState}
          {actions ? (
            <div className="puzzle-cart-summary__actions">{actions}</div>
          ) : null}
        </div>
      )}
      {children}
    </MarketingSection>
  );
};

export { CartSummarySection };
