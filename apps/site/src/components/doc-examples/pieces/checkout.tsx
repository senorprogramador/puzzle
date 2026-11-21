import { useState } from "react";
import {
  CheckoutSection,
  PaymentMethodSelector,
} from "@puzzle-ui/pieces";
import type { CheckoutSectionVariant } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const paymentMethods = [
  {
    id: "card",
    label: "Card",
    provider: "Example provider",
    description: "Secure card payment handled by your server integration.",
  },
  {
    id: "invoice",
    label: "Invoice",
    description: "Pay against an existing invoice.",
  },
];

export const PaymentMethodSelectorExample = () => (
  <PaymentMethodSelector methods={paymentMethods} defaultValue="card" />
);

const paymentMethodVariants: SectionVariantPreview<"default" | "disabled">[] = [
  { variant: "default", useCase: "Show methods available for this order." },
  { variant: "disabled", useCase: "Disable choices while payment is processing." },
];

export const PaymentMethodSelectorVariantsExample = () => (
  <SectionVariantPreviews
    componentName="PaymentMethodSelector"
    variants={paymentMethodVariants}
    buildCode={(variant) =>
      `<PaymentMethodSelector methods={paymentMethods} disabled={${variant === "disabled"}} />`
    }
    renderVariant={(variant) => (
      <PaymentMethodSelector
        methods={paymentMethods}
        defaultValue="card"
        disabled={variant === "disabled"}
      />
    )}
  />
);

export const CheckoutSectionExample = ({
  variant = "split",
}: {
  variant?: CheckoutSectionVariant;
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitted, setSubmitted] = useState(false);

  return (
    <CheckoutSection
      eyebrow="Calico Coffee"
      title="Complete your order"
      description="Every value and action is supplied by the application."
      variant={variant}
      steps={[
        { id: "details", title: "Details", completed: true },
        { id: "payment", title: "Payment" },
      ]}
      currentStepId="payment"
      customerDetails={
        <label>
          Email address
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </label>
      }
      payment={
        <PaymentMethodSelector
          methods={[
            {
              id: "card",
              label: "Card",
              provider: "Example provider",
              description: "Secure card payment handled by your server integration.",
            },
            {
              id: "invoice",
              label: "Invoice",
              description: "Pay against an existing invoice.",
            },
          ]}
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        />
      }
      summary={
        <dl>
          <div>
            <dt>House Blend Coffee × 2</dt>
            <dd>$36.00</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>$0.00</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>$36.00</dd>
          </div>
        </dl>
      }
      onSubmit={() => setSubmitted(true)}
      success={submitted ? "Your example order was submitted." : undefined}
    />
  );
};

const checkoutVariants: SectionVariantPreview<CheckoutSectionVariant>[] = [
  { variant: "form", useCase: "Stack checkout fields in one column." },
  { variant: "split", useCase: "Keep checkout content beside the summary." },
  { variant: "compact", useCase: "Use tighter spacing for smaller flows." },
  { variant: "multi-step", useCase: "Show a multi-step checkout progress bar." },
  { variant: "sidebar", useCase: "Keep the summary in a sidebar on wide screens." },
];

export const CheckoutSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CheckoutSection"
    variants={checkoutVariants}
    buildCode={(variant) => `<CheckoutSection variant="${variant}" />`}
    renderVariant={(variant) => <CheckoutSectionExample variant={variant} />}
  />
);
