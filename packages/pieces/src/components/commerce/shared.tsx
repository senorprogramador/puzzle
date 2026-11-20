import { cn, formatCurrency, formatNumber } from "@puzzle-ui/core";
import type { CommerceMoney, CommerceRating } from "./shared.types";
import "./shared.css";

const formatMoney = (money: CommerceMoney, locale = "en-US") => {
  return formatCurrency(money.amount, money.currency, locale);
};

const formatQuantity = (quantity: number, locale = "en-US") => {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new RangeError("Quantity must be a non-negative safe integer.");
  }

  return formatNumber(quantity, locale, { maximumFractionDigits: 0 });
};

const validateCommerceRating = (
  itemId: string,
  rating?: CommerceRating,
) => {
  if (!rating) {
    return;
  }

  const max = rating.max ?? 5;

  if (!Number.isFinite(max) || max <= 0) {
    throw new RangeError(`Rating max for item "${itemId}" must be positive.`);
  }

  if (!Number.isFinite(rating.value) || rating.value < 0 || rating.value > max) {
    throw new RangeError(
      `Rating for item "${itemId}" must be between 0 and ${max}.`,
    );
  }

  if (
    rating.count !== undefined &&
    (!Number.isSafeInteger(rating.count) || rating.count < 0)
  ) {
    throw new RangeError(
      `Rating count for item "${itemId}" must be a non-negative integer.`,
    );
  }
};

const formatRating = (rating: CommerceRating, locale = "en-US") =>
  formatNumber(rating.value, locale, { maximumFractionDigits: 1 });

const CommercePrice = ({
  price,
  compareAtPrice,
  locale = "en-US",
  className,
}: {
  price: CommerceMoney;
  compareAtPrice?: CommerceMoney;
  locale?: string;
  className?: string;
}) => (
  <div className={cn("puzzle-commerce__price", className)}>
    <span className="puzzle-commerce__current-price">
      {formatMoney(price, locale)}
    </span>
    {compareAtPrice ? (
      <del className="puzzle-commerce__compare-price">
        {formatMoney(compareAtPrice, locale)}
      </del>
    ) : null}
  </div>
);

export {
  CommercePrice,
  formatMoney,
  formatQuantity,
  formatRating,
  validateCommerceRating,
};
