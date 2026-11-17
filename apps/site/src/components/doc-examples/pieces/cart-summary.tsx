import {
  CartSummarySection,
  type CartSummaryItem,
  type CartSummaryTotals,
  type CartSummaryVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const cartItems: CartSummaryItem[] = [
  {
    id: "coffee",
    name: "House Blend Coffee",
    quantity: 2,
    unitPrice: { amount: 18, currency: "USD" },
    lineTotal: { amount: 36, currency: "USD" },
    image: {
      src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=85",
      alt: "Bag of roasted coffee beans",
    },
    href: "/docs/pieces/components/cart-summary",
  },
  {
    id: "filter",
    name: "Reusable Coffee Filter",
    quantity: 1,
    unitPrice: { amount: 12, currency: "USD" },
    lineTotal: { amount: 12, currency: "USD" },
    image: {
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
      alt: "Coffee filter and pour-over equipment",
    },
  },
];

const totals: CartSummaryTotals = {
  subtotal: { amount: 48, currency: "USD" },
  discounts: [
    { id: "welcome", label: "Welcome offer", amount: { amount: -5, currency: "USD" } },
  ],
  shipping: { amount: 0, currency: "USD" },
  total: { amount: 43, currency: "USD" },
};

const variants: SectionVariantPreview<CartSummaryVariant>[] = [
  { variant: "sidebar", useCase: "Place supplied totals beside the item list." },
  { variant: "compact", useCase: "Use a short summary without product photos." },
  { variant: "full", useCase: "Show images, quantities, and supplied line totals." },
  { variant: "card", useCase: "Contain the complete summary in a card surface." },
  { variant: "sticky", useCase: "Keep the totals panel in view on wide screens." },
  { variant: "checkout", useCase: "Emphasize an order summary before checkout." },
  { variant: "split", useCase: "Separate items from the totals panel." },
  { variant: "minimal", useCase: "Use a restrained item list and supplied totals." },
  { variant: "detailed", useCase: "Show item descriptions and image details." },
  { variant: "mobile", useCase: "Prioritize a compact, narrow-screen summary." },
];

export const CartSummarySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CartSummarySection"
    variants={variants}
    buildCode={(variant) =>
      `<CartSummarySection variant="${variant}" items={cartItems} totals={totals} />`
    }
    renderVariant={(variant) => (
      <CartSummarySection
        variant={variant}
        eyebrow="Calico Coffee"
        title="Your selection"
        description="Example cart data only. The component does not update quantities, calculate totals, place orders, or process payment."
        items={cartItems}
        totals={totals}
        actions={<a href="/docs/pieces/components/cart-summary">Review order details</a>}
      />
    )}
  />
);
