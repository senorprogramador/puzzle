import { cn, formatDate, formatNumber } from "@puzzle-ui/core";
import { Button, Card, Heading, Text } from "@puzzle-ui/ui";
import { validateContentIds } from "../../content/shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { CommerceImageView } from "../commerce-image";
import { formatMoney } from "../shared";
import type {
  StaySummaryPriceLine,
  StaySummarySectionProps,
} from "./stay-summary-section.types";

import "./stay-summary-section.css";

const formatStayDate = (
  date: Date | null,
  locale: string,
  timeZone?: string,
) =>
  date
    ? formatDate(
        date,
        locale,
        timeZone
          ? { dateStyle: "medium", timeZone }
          : { dateStyle: "medium" },
      )
    : "Not selected";

const PriceLine = ({
  line,
  locale,
}: {
  line: StaySummaryPriceLine;
  locale: string;
}) => (
  <div data-kind={line.kind ?? "rate"}>
    <dt>{line.label}</dt>
    <dd>{formatMoney(line.amount, locale)}</dd>
  </div>
);

const StaySummarySection = ({
  accommodation,
  checkIn,
  checkOut,
  guests,
  nights,
  priceLines = [],
  subtotal,
  total,
  variant = "default",
  locale,
  timeZone,
  totalLabel = "Total",
  editLabel = "Change stay",
  continueLabel = "Continue",
  onEdit,
  onContinue,
  children,
  className,
  ...sectionProps
}: StaySummarySectionProps) => {
  validateContentIds(priceLines, "Stay summary price lines");

  if (
    !Number.isSafeInteger(guests.adults) ||
    guests.adults < 0 ||
    !Number.isSafeInteger(guests.children) ||
    guests.children < 0
  ) {
    throw new RangeError(
      "Stay summary guest counts must be non-negative safe integers.",
    );
  }

  if (nights !== undefined && (!Number.isSafeInteger(nights) || nights < 0)) {
    throw new RangeError("Stay summary nights must be a non-negative integer.");
  }

  const resolvedLocale =
    locale ?? Intl.NumberFormat().resolvedOptions().locale;
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-stay-summary", className)}
      family="stay-summary"
      variant={variant}
    >
      <div className="puzzle-stay-summary__layout">
        <div className="puzzle-stay-summary__stay">
          <div className="puzzle-stay-summary__accommodation">
            <CommerceImageView
              image={accommodation.image}
              label="Accommodation image"
            />
            <div className="puzzle-stay-summary__accommodation-copy">
              <Heading level="headline3" as="h3">
                {accommodation.name}
              </Heading>
              {accommodation.description ? (
                <Text as="p">{accommodation.description}</Text>
              ) : null}
            </div>
          </div>

          <dl className="puzzle-stay-summary__details">
            <div>
              <dt>Check-in</dt>
              <dd>{formatStayDate(checkIn, resolvedLocale, timeZone)}</dd>
            </div>
            <div>
              <dt>Check-out</dt>
              <dd>{formatStayDate(checkOut, resolvedLocale, timeZone)}</dd>
            </div>
            <div>
              <dt>Adults</dt>
              <dd>{formatNumber(guests.adults, resolvedLocale)}</dd>
            </div>
            <div>
              <dt>Children</dt>
              <dd>{formatNumber(guests.children, resolvedLocale)}</dd>
            </div>
            {nights !== undefined ? (
              <div>
                <dt>Nights</dt>
                <dd>{formatNumber(nights, resolvedLocale)}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <Card
          as="aside"
          variant="outlined"
          className="puzzle-stay-summary__price-card"
        >
          <Heading level="headline3" as="h3">
            Price summary
          </Heading>
          <dl className="puzzle-stay-summary__prices">
            {subtotal ? (
              <div data-kind="subtotal">
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotal, resolvedLocale)}</dd>
              </div>
            ) : null}
            {priceLines.map((line) => (
              <PriceLine
                key={line.id}
                line={line}
                locale={resolvedLocale}
              />
            ))}
            <div className="puzzle-stay-summary__total" data-kind="total">
              <dt>{totalLabel}</dt>
              <dd>{formatMoney(total, resolvedLocale)}</dd>
            </div>
          </dl>

          {onEdit || onContinue ? (
            <div className="puzzle-stay-summary__actions">
              {onEdit ? (
                <Button type="button" variant="secondary" onClick={onEdit}>
                  {editLabel}
                </Button>
              ) : null}
              {onContinue ? (
                <Button type="button" onClick={onContinue}>
                  {continueLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </Card>
      </div>
      {children}
    </MarketingSection>
  );
};

export { StaySummarySection };
