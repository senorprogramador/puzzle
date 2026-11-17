import {
  PricingSection,
  type PricingBillingInterval,
  type PricingCalculator,
  type PricingPlan,
  type PricingVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const billingIntervals: PricingBillingInterval[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annually" },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For a small team organizing its first shared workflows.",
    prices: [
      { intervalId: "monthly", currency: "$", amount: 18, interval: "per month" },
      {
        intervalId: "annual",
        currency: "$",
        amount: 180,
        interval: "per year",
        originalAmount: 216,
        discount: "Example annual price",
      },
    ],
    features: [
      { id: "projects", label: "Projects", value: "5" },
      { id: "seats", label: "Team members", value: "3" },
      { id: "support", label: "Email support", included: true },
    ],
    cta: <a href="/docs/pieces/components/pricing">Choose Starter</a>,
  },
  {
    id: "team",
    name: "Team",
    description: "For teams coordinating work across several functions.",
    prices: [
      { intervalId: "monthly", currency: "$", amount: 49, interval: "per month" },
      { intervalId: "annual", currency: "$", amount: 490, interval: "per year" },
    ],
    features: [
      { id: "projects", label: "Projects", value: "Unlimited" },
      { id: "seats", label: "Team members", value: "25" },
      { id: "support", label: "Email support", included: true },
    ],
    badge: "Popular example",
    highlighted: true,
    cta: <a href="/docs/pieces/components/pricing">Choose Team</a>,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations that need a tailored agreement.",
    customPricing: <a href="mailto:sales@northstar.studio">Talk to sales</a>,
    usage: "Usage terms are defined by the customer agreement.",
    features: [
      { id: "projects", label: "Projects", value: "Configured per agreement" },
      { id: "seats", label: "Team members", value: "Configured per agreement" },
      { id: "support", label: "Email support", included: true },
    ],
  },
];

const calculator: PricingCalculator = {
  label: "Monthly events",
  min: 1000,
  max: 10000,
  step: 1000,
  initialValue: 3000,
  formatValue: (value) => `${value} events`,
  renderEstimate: (value) => (
    <p>Example estimate: ${(value / 1000) * 8} per month.</p>
  ),
};

const variants: SectionVariantPreview<PricingVariant>[] = [
  { variant: "cards", useCase: "Compare plan cards in a familiar pricing grid." },
  { variant: "horizontal", useCase: "Browse plans in a horizontal rail." },
  { variant: "comparison", useCase: "Compare plan details in aligned columns." },
  { variant: "toggle", useCase: "Switch between consumer-supplied billing prices." },
  { variant: "table", useCase: "Use a semantic table for detailed comparison." },
  { variant: "featured", useCase: "Emphasize the plan marked as highlighted." },
  { variant: "compact", useCase: "Fit shorter plan summaries into less space." },
  { variant: "split", useCase: "Set a featured plan apart from supporting plans." },
  { variant: "enterprise", useCase: "Make customer-supplied custom pricing prominent." },
  { variant: "usage-based", useCase: "Show customer-provided usage terms beside plan details." },
  { variant: "subscription", useCase: "Make a supplied subscription interval easy to scan." },
  { variant: "tiered", useCase: "Arrange plans as progressive tiers." },
  { variant: "minimal", useCase: "Use a restrained, low-chrome pricing layout." },
  { variant: "slider", useCase: "Pair plans with an optional usage slider." },
  { variant: "calculator", useCase: "Render an estimate only when you provide its function." },
];

export const PricingSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="PricingSection"
    variants={variants}
    buildCode={(variant) =>
      [
        `<PricingSection variant="${variant}" plans={pricingPlans}`,
        "  billingIntervals={billingIntervals}",
        variant === "slider" || variant === "calculator"
          ? "  calculator={calculator}"
          : null,
        " />",
      ]
        .filter(Boolean)
        .join("\n")
    }
    renderVariant={(variant) => (
      <PricingSection
        variant={variant}
        eyebrow="Example pricing"
        title="Choose the plan that fits your workflow"
        description="Illustrative plan data for a fictional SaaS product. Prices and discounts are supplied values, not calculated by the component."
        plans={pricingPlans}
        billingIntervals={billingIntervals}
        defaultBillingInterval="monthly"
        calculator={
          variant === "slider" || variant === "calculator"
            ? calculator
            : undefined
        }
      />
    )}
  />
);
