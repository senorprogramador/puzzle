import {
  ProductGallerySection,
  type ProductGalleryImage,
  type ProductGalleryVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const productImages: ProductGalleryImage[] = [
  {
    id: "front",
    src: sectionPreviewImages.product,
    alt: "Stoneware pour-over set viewed from the front",
    caption: "Chalk glaze",
  },
  {
    id: "side",
    src: sectionPreviewImages.workspace,
    alt: "Stoneware pour-over set beside a ceramic cup",
    caption: "Side view",
  },
  {
    id: "detail",
    src: sectionPreviewImages.dashboard,
    alt: "Close detail of the stoneware glaze",
    caption: "Glaze detail",
  },
  {
    id: "table",
    src: sectionPreviewImages.team,
    alt: "Pour-over set prepared for a morning coffee",
    caption: "On the table",
  },
];

const variants: SectionVariantPreview<ProductGalleryVariant>[] = [
  { variant: "grid", useCase: "Show every product image in an even grid." },
  { variant: "masonry", useCase: "Let image content flow through masonry columns." },
  { variant: "featured", useCase: "Pair a large selected image with supporting views." },
  { variant: "carousel", useCase: "Navigate the selected image with buttons or arrow keys." },
  { variant: "thumbnails", useCase: "Select the main image with keyboard-operable tabs." },
  { variant: "split", useCase: "Place the main view beside a thumbnail rail." },
  { variant: "editorial", useCase: "Use a large image and generous supporting space." },
  { variant: "fullscreen", useCase: "Open the main image in an accessible lightbox." },
  { variant: "stacked", useCase: "Stack full-width images in a vertical sequence." },
  { variant: "collage", useCase: "Give the lead image more area in a collage." },
  { variant: "horizontal", useCase: "Scroll thumbnails horizontally beneath the main image." },
  { variant: "vertical", useCase: "Place the main image beside a vertical thumbnail rail." },
];

export const ProductGallerySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ProductGallerySection"
    variants={variants}
    buildCode={(variant) =>
      `<ProductGallerySection variant="${variant}" images={productImages} lightbox zoom />`
    }
    renderVariant={(variant) => (
      <ProductGallerySection
        variant={variant}
        eyebrow="Atelier Ceramics"
        title="Stoneware pour-over set"
        description="Illustrative product photography for a fictional ceramics shop."
        images={productImages}
        lightbox
        zoom
      />
    )}
  />
);
