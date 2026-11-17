import { Badge, Card } from "@puzzle-ui/ui";
import type { ElementType, ReactNode } from "react";
import { useId, useState } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  PricingBillingInterval,
  PricingCalculator,
  PricingFeature,
  PricingPlan,
  PricingPlanPrice,
  PricingSectionProps,
  PricingVariant,
} from "./pricing.types";
import "./pricing.css";

const validatePricingProps = ({
  plans,
  intervals,
  selectedInterval,
  defaultInterval,
  calculator,
}: {
  plans: readonly PricingPlan[];
  intervals: readonly PricingBillingInterval[];
  selectedInterval?: string;
  defaultInterval?: string;
  calculator?: PricingCalculator;
}) => {
  const intervalIds = new Set<string>();

  intervals.forEach(({ id }) => {
    if (!id.trim() || intervalIds.has(id)) {
      throw new TypeError("Billing interval IDs must be non-empty and unique.");
    }

    intervalIds.add(id);
  });

  plans.forEach((plan) => {
    const priceIntervalIds = new Set<string>();
    let staticPrices = 0;

    plan.prices?.forEach(({ intervalId }) => {
      if (intervalId === undefined) {
        staticPrices += 1;
        return;
      }

      if (!intervalId.trim() || priceIntervalIds.has(intervalId)) {
        throw new TypeError(
          `Price interval IDs for plan "${plan.id}" must be non-empty and unique.`,
        );
      }

      if (intervals.length && !intervalIds.has(intervalId)) {
        throw new RangeError(
          `Unknown price interval "${intervalId}" for plan "${plan.id}".`,
        );
      }

      priceIntervalIds.add(intervalId);
    });

    if (staticPrices > 1) {
      throw new TypeError(
        `Plan "${plan.id}" can only have one price without an interval ID.`,
      );
    }

    if (!intervals.length && priceIntervalIds.size > 1) {
      throw new RangeError(
        `Pass billingIntervals to select a price for plan "${plan.id}".`,
      );
    }
  });

  if (defaultInterval !== undefined && !intervalIds.has(defaultInterval)) {
    throw new RangeError(
      `Unknown default billing interval "${defaultInterval}".`,
    );
  }

  if (selectedInterval !== undefined && !intervalIds.has(selectedInterval)) {
    throw new RangeError(`Unknown billing interval "${selectedInterval}".`);
  }

  if (calculator) {
    const step = calculator.step ?? 1;
    const initialValue = calculator.initialValue ?? calculator.min;

    if (
      !Number.isFinite(calculator.min) ||
      !Number.isFinite(calculator.max) ||
      calculator.max < calculator.min ||
      !Number.isFinite(step) ||
      step <= 0 ||
      !Number.isFinite(initialValue) ||
      initialValue < calculator.min ||
      initialValue > calculator.max
    ) {
      throw new RangeError(
        "Pricing calculator bounds, step, and initial value must be finite and valid.",
      );
    }
  }
};

const getPlanPrice = (
  plan: PricingPlan,
  intervalId: string | undefined,
  hasIntervals: boolean,
) => {
  if (!plan.prices?.length) {
    return undefined;
  }

  if (intervalId) {
    return (
      plan.prices.find((price) => price.intervalId === intervalId) ??
      plan.prices.find((price) => price.intervalId === undefined)
    );
  }

  const fixedPrice = plan.prices.find((price) => price.intervalId === undefined);

  if (fixedPrice) {
    return fixedPrice;
  }

  return !hasIntervals && plan.prices.length === 1
    ? plan.prices[0]
    : undefined;
};

const PriceDisplay = ({
  plan,
  price,
}: {
  plan: PricingPlan;
  price?: PricingPlanPrice;
}) => (
  <div className="puzzle-pricing__price">
    {price ? (
      <>
        {price.originalAmount != null ? (
          <del className="puzzle-pricing__original-price">
            {price.currency}
            {price.originalAmount}
          </del>
        ) : null}
        <p className="puzzle-pricing__amount">
          {price.currency}
          <strong>{price.amount}</strong>
          {price.interval ? (
            <span className="puzzle-pricing__interval">{price.interval}</span>
          ) : null}
        </p>
        {price.discount != null ? (
          <Badge content={price.discount} className="puzzle-pricing__discount" />
        ) : null}
      </>
    ) : null}
    {plan.customPricing != null ? (
      <div className="puzzle-pricing__custom">{plan.customPricing}</div>
    ) : null}
  </div>
);

const PricingPlanCard = ({
  plan,
  price,
}: {
  plan: PricingPlan;
  price?: PricingPlanPrice;
}) => (
  <Card
    as="article"
    className="puzzle-pricing__plan"
    variant="outlined"
    data-highlighted={plan.highlighted || undefined}
  >
    {plan.badge != null ? (
      <Badge content={plan.badge} className="puzzle-pricing__badge" />
    ) : null}
    <h3>{plan.name}</h3>
    {plan.description ? (
      <p className="puzzle-pricing__description">{plan.description}</p>
    ) : null}
    <PriceDisplay plan={plan} price={price} />
    {plan.usage != null ? (
      <div className="puzzle-pricing__usage">{plan.usage}</div>
    ) : null}
    {plan.features?.length ? (
      <ul className="puzzle-pricing__features">
        {plan.features.map((feature) => (
          <li key={feature.id} data-included={feature.included ?? true}>
            {feature.label}
            {feature.value != null ? (
              <span className="puzzle-pricing__feature-value">
                {feature.value}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    ) : null}
    {plan.cta ? (
      <div className="puzzle-pricing__cta">{plan.cta}</div>
    ) : null}
  </Card>
);

const getComparisonRows = (plans: readonly PricingPlan[]) => {
  const rows = new Map<string, PricingFeature>();

  plans.forEach((plan) =>
    plan.features?.forEach((feature) => {
      if (!rows.has(feature.id)) {
        rows.set(feature.id, feature);
      }
    }),
  );

  return [...rows.values()];
};

const renderFeatureValue = (
  plan: PricingPlan,
  rowId: string,
): ReactNode => {
  const feature = plan.features?.find(({ id }) => id === rowId);

  if (feature?.value != null) {
    return feature.value;
  }

  if (!feature || feature.included === false) {
    return <span aria-label="Not included">Not included</span>;
  }

  return <span>Included</span>;
};

const PricingComparisonTable = ({
  plans,
  getPrice,
}: {
  plans: readonly PricingPlan[];
  getPrice: (plan: PricingPlan) => PricingPlanPrice | undefined;
}) => {
  const rows = getComparisonRows(plans);

  return (
    <div className="puzzle-pricing__table-scroll" tabIndex={0}>
      <table className="puzzle-pricing__table">
        <caption>Plan comparison</caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Price</th>
            {plans.map((plan) => (
              <td key={plan.id}>
                <PriceDisplay plan={plan} price={getPrice(plan)} />
              </td>
            ))}
          </tr>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              {plans.map((plan) => (
                <td key={plan.id}>{renderFeatureValue(plan, row.id)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PricingCalculatorControl = ({
  calculator,
  value,
  variant,
  onChange,
}: {
  calculator: PricingCalculator;
  value: number;
  variant: PricingVariant;
  onChange: (value: number) => void;
}) => {
  const inputId = useId();
  const formattedValue = calculator.formatValue
    ? calculator.formatValue(value)
    : String(value);

  return (
    <div
      className="puzzle-pricing__calculator"
      data-layout={variant}
    >
      <label htmlFor={inputId}>{calculator.label}</label>
      <input
        id={inputId}
        type="range"
        min={calculator.min}
        max={calculator.max}
        step={calculator.step ?? 1}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      <output htmlFor={inputId}>
        {formattedValue}
        {calculator.unit != null ? <> {calculator.unit}</> : null}
      </output>
      {variant === "calculator" && calculator.renderEstimate ? (
        <div className="puzzle-pricing__estimate">
          {calculator.renderEstimate(value)}
        </div>
      ) : null}
    </div>
  );
};

const PricingSection = <C extends ElementType = "section">({
  variant = "cards",
  plans,
  billingIntervals = [],
  billingInterval,
  defaultBillingInterval,
  onBillingIntervalChange,
  calculator,
  children,
  className,
  ...sectionProps
}: PricingSectionProps<C>) => {
  validatePricingProps({
    plans,
    intervals: billingIntervals,
    selectedInterval: billingInterval,
    defaultInterval: defaultBillingInterval,
    calculator,
  });

  const intervalIds = new Set(billingIntervals.map(({ id }) => id));
  const [uncontrolledInterval, setUncontrolledInterval] = useState(
    defaultBillingInterval ?? billingIntervals[0]?.id ?? "",
  );
  const [requestedCalculatorValue, setRequestedCalculatorValue] = useState(
    calculator?.initialValue ?? calculator?.min ?? 0,
  );
  const selectedInterval =
    billingInterval ??
    (intervalIds.has(uncontrolledInterval)
      ? uncontrolledInterval
      : billingIntervals[0]?.id);
  const currentCalculatorValue = calculator
    ? Math.max(
        calculator.min,
        Math.min(calculator.max, requestedCalculatorValue),
      )
    : 0;
  const billingGroupId = useId();
  const getPrice = (plan: PricingPlan) =>
    getPlanPrice(plan, selectedInterval, billingIntervals.length > 0);
  const featuredPlan = plans.find((plan) => plan.highlighted) ?? plans[0];
  const otherPlans = plans.filter((plan) => plan !== featuredPlan);

  const renderPlanList = (planItems: readonly PricingPlan[]) => (
    <ul className="puzzle-pricing__plans">
      {planItems.map((plan) => (
        <li key={plan.id}>
          <PricingPlanCard
            plan={plan}
            price={getPrice(plan)}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      fullWidth={sectionProps.fullWidth ?? variant === "table"}
      className={`puzzle-pricing ${className ?? ""}`.trim()}
      family="pricing"
      variant={variant}
    >
      {billingIntervals.length > 1 ? (
        <fieldset className="puzzle-pricing__billing">
          <legend>Billing interval</legend>
          {billingIntervals.map((interval) => (
            <label key={interval.id}>
              <input
                type="radio"
                name={billingGroupId}
                value={interval.id}
                checked={selectedInterval === interval.id}
                onChange={() => {
                  if (billingInterval === undefined) {
                    setUncontrolledInterval(interval.id);
                  }
                  onBillingIntervalChange?.(interval.id);
                }}
              />
              {interval.label}
            </label>
          ))}
        </fieldset>
      ) : null}
      {billingIntervals.length === 1 ? (
        <p className="puzzle-pricing__single-interval">
          {billingIntervals[0]?.label}
        </p>
      ) : null}
      {calculator && (variant === "slider" || variant === "calculator") ? (
        <PricingCalculatorControl
          calculator={calculator}
          value={currentCalculatorValue}
          variant={variant}
          onChange={(value) => {
            setRequestedCalculatorValue(value);
            calculator.onValueChange?.(value);
          }}
        />
      ) : null}
      {plans.length && variant === "table" ? (
        <PricingComparisonTable plans={plans} getPrice={getPrice} />
      ) : plans.length && variant === "comparison" ? (
        <div className="puzzle-pricing__comparison">
          {plans.map((plan) => (
            <section key={plan.id}>
              <h3>{plan.name}</h3>
              <PriceDisplay plan={plan} price={getPrice(plan)} />
              {plan.features?.length ? (
                <ul className="puzzle-pricing__features">
                  {plan.features.map((feature) => (
                    <li key={feature.id}>
                      {feature.label}
                      {feature.value != null ? <>: {feature.value}</> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      ) : plans.length && variant === "split" ? (
        <div className="puzzle-pricing__split">
          {featuredPlan ? renderPlanList([featuredPlan]) : null}
          {otherPlans.length ? renderPlanList(otherPlans) : null}
        </div>
      ) : plans.length && variant === "featured" ? (
        <div className="puzzle-pricing__featured">
          {featuredPlan ? renderPlanList([featuredPlan]) : null}
          {otherPlans.length ? renderPlanList(otherPlans) : null}
        </div>
      ) : plans.length ? (
        renderPlanList(plans)
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { PricingSection };
