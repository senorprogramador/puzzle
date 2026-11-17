import {
  CommerceBenefitsSection,
  type CommerceBenefitItem,
  type CommerceBenefitsVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const benefits: CommerceBenefitItem[] = [
  {
    id: "delivery",
    title: "Delivery options",
    description: "Add the delivery windows and regions your store supports.",
    icon: <span aria-hidden="true">D</span>,
    kind: "shipping",
    label: "Store-provided",
    href: "https://example.com/delivery",
  },
  {
    id: "returns",
    title: "Returns and exchanges",
    description: "Describe the return policy published by your retailer.",
    icon: <span aria-hidden="true">R</span>,
    kind: "returns",
    action: <a href="https://example.com/returns">Read return details</a>,
  },
  {
    id: "care",
    title: "Product care",
    description: "Share care guidance from the product maker.",
    icon: <span aria-hidden="true">C</span>,
    kind: "service",
  },
  {
    id: "checkout",
    title: "Checkout information",
    description: "Describe the payment security details provided by your checkout.",
    kind: "secure-checkout",
  },
];

const variants: SectionVariantPreview<CommerceBenefitsVariant>[] = [
  { variant: "grid", useCase: "Show several store policies in a balanced grid." },
  { variant: "inline", useCase: "Present brief service notes in one compact row." },
  { variant: "icons", useCase: "Lead each benefit with its consumer-provided icon." },
  { variant: "cards", useCase: "Separate each retailer-provided benefit into a card." },
  { variant: "banner", useCase: "Use a low-profile strip for store information." },
  { variant: "split", useCase: "Feature one service detail beside supporting items." },
  { variant: "compact", useCase: "Fit short store notes into a dense layout." },
  { variant: "trust", useCase: "Arrange the supplied trust and service information." },
  { variant: "shipping", useCase: "Emphasize items explicitly marked as shipping information." },
  { variant: "service", useCase: "Present retailer service policies as a simple list." },
];

export const CommerceBenefitsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CommerceBenefitsSection"
    variants={variants}
    buildCode={(variant) =>
      `<CommerceBenefitsSection variant="${variant}" items={benefits} />`
    }
    renderVariant={(variant) => (
      <CommerceBenefitsSection
        variant={variant}
        eyebrow="Morrow Home"
        title="Helpful store information"
        description="Illustrative copy only. Your application supplies and verifies every policy, delivery promise, and checkout statement."
        items={benefits}
      />
    )}
  />
);
