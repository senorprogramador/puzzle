import {
  ProductDetailsSection,
  type ProductDetailsData,
  type ProductDetailsVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const product: ProductDetailsData = {
  id: "pour-over",
  name: "Stoneware Pour-over Set",
  description:
    "A considered coffee ritual with a reusable steel filter and a hand-finished stoneware dripper.",
  media: [
    {
      src: sectionPreviewImages.product,
      alt: "Stoneware pour-over set with a ceramic cup",
    },
    {
      src: sectionPreviewImages.workspace,
      alt: "Pour-over set arranged on a kitchen counter",
    },
  ],
  price: { amount: 68, currency: "USD" },
  compareAtPrice: { amount: 78, currency: "USD" },
  rating: { value: 4.8, count: 32 },
  labels: [{ id: "hand-finished", content: "Hand finished" }],
  availability: <p>Example availability copy supplied by the retailer.</p>,
  variantSelector: (
    <label>
      Glaze
      <select defaultValue="chalk">
        <option value="chalk">Chalk</option>
        <option value="sand">Sand</option>
      </select>
    </label>
  ),
  features: ["Glazed stoneware", "Reusable stainless filter"],
  specifications: [
    { id: "material", label: "Material", value: "Stoneware and steel" },
    { id: "capacity", label: "Capacity", value: "350 ml" },
    { id: "care", label: "Care", value: "Hand wash recommended" },
  ],
  comparison: {
    comparisonName: "Compact pour-over",
    rows: [
      { id: "capacity", label: "Capacity", productValue: "350 ml", comparisonValue: "250 ml" },
      { id: "filter", label: "Filter", productValue: "Reusable steel", comparisonValue: "Paper" },
    ],
  },
  actions: <a href="/docs/pieces/components/product-details">View product details</a>,
};

const variants: SectionVariantPreview<ProductDetailsVariant>[] = [
  { variant: "split", useCase: "Place product media beside its details." },
  { variant: "gallery", useCase: "Give several product images room to breathe." },
  { variant: "editorial", useCase: "Pair product storytelling with a large image." },
  { variant: "tabs", useCase: "Switch between the supplied description, features, and specs." },
  { variant: "accordion", useCase: "Expand product details with accessible disclosures." },
  { variant: "specifications", useCase: "Emphasize a consumer-provided specifications list." },
  { variant: "features", useCase: "Present the supplied product features prominently." },
  { variant: "comparison", useCase: "Compare values explicitly supplied by the retailer." },
  { variant: "compact", useCase: "Keep one primary image beside concise details." },
  { variant: "full-width", useCase: "Use a wider section for images and specification content." },
  { variant: "sticky", useCase: "Keep product media in view beside the details." },
  { variant: "media-led", useCase: "Lead with product imagery and supporting details." },
];

export const ProductDetailsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ProductDetailsSection"
    variants={variants}
    buildCode={(variant) =>
      `<ProductDetailsSection variant="${variant}" product={product} locale="en-US" />`
    }
    renderVariant={(variant) => (
      <ProductDetailsSection
        variant={variant}
        eyebrow="Morrow Kitchen"
        title="A slower morning ritual"
        description="Illustrative product details for a fictional home and kitchen retailer."
        product={product}
        locale="en-US"
      />
    )}
  />
);
