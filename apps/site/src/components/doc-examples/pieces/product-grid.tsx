import {
  ProductGridSection,
  type ProductGridItem,
  type ProductGridVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const products: ProductGridItem[] = [
  {
    id: "ridge-shell",
    name: "Ridge Shell Jacket",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "Weatherproof shell jacket arranged for an outdoor trip",
    },
    price: { amount: 148, currency: "USD" },
    compareAtPrice: { amount: 168, currency: "USD" },
    labels: [{ id: "new", content: "New" }],
    rating: { value: 4.8, count: 36 },
    category: "Outerwear",
    collection: "Trail essentials",
    href: "https://example.com/products/ridge-shell",
    featured: true,
  },
  {
    id: "day-pack",
    name: "Field Daypack",
    image: {
      src: sectionPreviewImages.product,
      alt: "Daypack ready for a weekend trail",
    },
    price: { amount: 86, currency: "USD" },
    rating: { value: 4.6, count: 21 },
    category: "Packs",
    collection: "Trail essentials",
    href: "https://example.com/products/day-pack",
  },
  {
    id: "camp-mug",
    name: "Double-wall Camp Mug",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "Camp mug beside a notebook on a wooden table",
    },
    price: { amount: 28, currency: "USD" },
    category: "Camp kitchen",
    collection: "Camp kitchen",
    href: "https://example.com/products/camp-mug",
  },
  {
    id: "merino-blanket",
    name: "Merino Camp Blanket",
    image: {
      src: sectionPreviewImages.team,
      alt: "Folded wool blanket ready for a campsite",
    },
    price: { amount: 112, currency: "USD" },
    compareAtPrice: { amount: 128, currency: "USD" },
    labels: [{ id: "limited", content: "Small batch" }],
    category: "Camp comfort",
    collection: "Trail essentials",
    href: "https://example.com/products/camp-blanket",
  },
];

const variants: SectionVariantPreview<ProductGridVariant>[] = [
  { variant: "grid", useCase: "Browse a balanced product catalog." },
  { variant: "masonry", useCase: "Let product descriptions create a staggered rhythm." },
  { variant: "featured", useCase: "Separate one featured product from the collection." },
  { variant: "horizontal", useCase: "Scroll through a horizontal product rail." },
  { variant: "carousel", useCase: "Navigate products with explicit previous and next controls." },
  { variant: "compact", useCase: "Fit shorter product cards into a dense catalog." },
  { variant: "editorial", useCase: "Lead with a product story and supporting items." },
  { variant: "collection", useCase: "Group products by their supplied collection name." },
  { variant: "category", useCase: "Group products by their supplied category." },
  { variant: "list", useCase: "Show product information in compact rows." },
  { variant: "asymmetric", useCase: "Vary item width across a product grid." },
  { variant: "bento", useCase: "Give featured products a larger grid area." },
  { variant: "mixed", useCase: "Pair a primary product with a mixed supporting grid." },
  { variant: "minimal", useCase: "Use a low-chrome catalog presentation." },
];

export const ProductGridSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ProductGridSection"
    variants={variants}
    buildCode={(variant) =>
      `<ProductGridSection variant="${variant}" items={products} locale="en-US" />`
    }
    renderVariant={(variant) => (
      <ProductGridSection
        variant={variant}
        eyebrow="Northline Supply"
        title="Field-tested everyday gear"
        description="Illustrative catalog data for a fictional outdoor shop."
        items={products}
        locale="en-US"
      />
    )}
  />
);
