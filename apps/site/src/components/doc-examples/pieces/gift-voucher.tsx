import { GiftVoucherSection } from "@puzzle-ui/pieces";
import type { GiftVoucherOption } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";
import { sectionPreviewImages } from "../shared/section-preview-media";

const vouchers: GiftVoucherOption[] = [
  {
    id: "open-value",
    name: "A little time away",
    description: "Choose an open-value voucher for a future stay.",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "A small cabin at the edge of a forest",
    },
    price: { amount: 100, currency: "EUR" },
    category: "Gift vouchers",
    featured: true,
    purchaseHref: "https://example.test/vouchers/open-value",
  },
  {
    id: "weekend",
    name: "A weekend for two",
    description: "Two nights with breakfast in a private room.",
    price: { amount: 260, currency: "EUR" },
    category: "Stay packages",
    arrangement: "Two nights with breakfast",
    purchaseHref: "https://example.test/vouchers/weekend",
  },
  {
    id: "dinner",
    name: "A dinner for two",
    description: "A seasonal dinner prepared by the kitchen.",
    price: { amount: 85, currency: "EUR" },
    category: "Dining",
    arrangement: "Seasonal set menu",
  },
];

const variants = [
  { variant: "grid", useCase: "Browse voucher values and arrangements." },
  { variant: "featured", useCase: "Emphasize one supplied gift option." },
  { variant: "category", useCase: "Group vouchers by their supplied category." },
] as const satisfies readonly SectionVariantPreview<
  "grid" | "featured" | "category"
>[];

export const GiftVoucherSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="GiftVoucherSection"
    variants={variants}
    buildCode={(variant) =>
      `<GiftVoucherSection variant="${variant}" vouchers={vouchers} locale="en-GB" />`
    }
    renderVariant={(variant) => (
      <GiftVoucherSection
        title="Give someone a slower stay"
        description="Purchase links are supplied by the accommodation."
        variant={variant}
        vouchers={vouchers}
        locale="en-GB"
      />
    )}
  />
);
