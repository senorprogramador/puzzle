import { cn } from "@puzzle-ui/core";
import type { CommerceMoney, CommerceRating } from "./shared.types";
import "./shared.css";

const formatMoney = (money: CommerceMoney, locale = "en-US") => {
  if (!Number.isFinite(money.amount)) {
    throw new RangeError("Currency amount must be a finite number.");
  }

  if (typeof money.currency !== "string" || money.currency.trim() === "") {
    throw new TypeError("Currency must be a non-empty ISO 4217 code.");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).format(money.amount);
};

const formatQuantity = (quantity: number, locale = "en-US") => {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new RangeError("Quantity must be a non-negative safe integer.");
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(quantity);
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
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
    rating.value,
  );

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
