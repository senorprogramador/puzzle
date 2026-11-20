import { cn } from "@puzzle-ui/core";
import { Badge, Button, Card, Heading, Text } from "@puzzle-ui/ui";
import { validateContentIds } from "../../content/shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { formatMoney } from "../shared";
import type { ReactNode } from "react";
import type {
  RatePlan,
  RatePlansSectionProps,
} from "./rate-plans-section.types";

import "./rate-plans-section.css";

const RatePlanCard = ({
  plan,
  locale,
  recommendedLabel,
  selectLabel,
}: {
  plan: RatePlan;
  locale: string;
  recommendedLabel: ReactNode;
  selectLabel: ReactNode;
}) => (
  <Card
    as="article"
    variant="outlined"
    className="puzzle-rate-plans__card"
    data-featured={plan.featured || undefined}
  >
    {plan.featured ? (
      <Badge
        className="puzzle-rate-plans__recommended"
        content={plan.recommendedLabel ?? recommendedLabel}
        color="primary"
      />
    ) : null}
    <Heading level="headline3" as="h3">
      {plan.name}
    </Heading>
    {plan.description ? <Text as="p">{plan.description}</Text> : null}
    {plan.arrangement ? (
      <div className="puzzle-rate-plans__arrangement">{plan.arrangement}</div>
    ) : null}

    <dl className="puzzle-rate-plans__prices">
      <div>
        <dt>Per night</dt>
        <dd>{formatMoney(plan.pricePerNight, locale)}</dd>
      </div>
      {plan.weeklyPrice ? (
        <div>
          <dt>Weekly price</dt>
          <dd>{formatMoney(plan.weeklyPrice, locale)}</dd>
        </div>
      ) : null}
    </dl>

    {plan.includedServices?.length ? (
      <ul className="puzzle-rate-plans__services">
        {plan.includedServices.map((service) => (
          <li key={service.id}>
            <span>{service.label}</span>
            {service.description ? <Text as="span">{service.description}</Text> : null}
          </li>
        ))}
      </ul>
    ) : null}

    {plan.cancellation ? (
      <div className="puzzle-rate-plans__cancellation">
        <Text as="p">{plan.cancellation}</Text>
      </div>
    ) : null}

    {typeof plan.onSelect === "function" ? (
      <Button
        type="button"
        disabled={plan.disabled}
        onClick={plan.onSelect}
      >
        {plan.actionLabel ?? selectLabel}
      </Button>
    ) : (
      <div className="puzzle-rate-plans__action">{plan.action}</div>
    )}
  </Card>
);

const RatePlansSection = ({
  plans,
  locale,
  recommendedLabel = "Recommended",
  selectLabel = "Choose this rate",
  emptyState = "No rates are available.",
  children,
  className,
  ...sectionProps
}: RatePlansSectionProps) => {
  validateContentIds(plans, "Rate plans");
  plans.forEach((plan) =>
    validateContentIds(
      plan.includedServices ?? [],
      `Services for rate plan "${plan.id}"`,
    ),
  );

  const resolvedLocale =
    locale ?? Intl.NumberFormat().resolvedOptions().locale;
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-rate-plans", className)}
      family="rate-plans"
      variant="cards"
    >
      {plans.length ? (
        <ul className="puzzle-rate-plans__grid">
          {plans.map((plan) => (
            <li key={plan.id}>
              <RatePlanCard
                plan={plan}
                locale={resolvedLocale}
                recommendedLabel={recommendedLabel}
                selectLabel={selectLabel}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="puzzle-rate-plans__empty" role="status">
          {emptyState}
        </div>
      )}
      {children}
    </MarketingSection>
  );
};

export { RatePlansSection };
