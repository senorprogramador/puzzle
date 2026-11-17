import {
  CategoriesSection,
  type CategoriesVariant,
  type CategoryItem,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const categories: CategoryItem[] = [
  {
    id: "lighting",
    title: "Lighting",
    description: "Soft light for considered rooms.",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "Pendant lighting over a quiet dining space",
    },
    href: "/docs/pieces/components/categories",
    featured: true,
  },
  {
    id: "textiles",
    title: "Textiles",
    description: "Natural layers for every season.",
    image: {
      src: sectionPreviewImages.product,
      alt: "Neutral home textiles folded on a chair",
    },
    href: "/docs/pieces/components/categories",
  },
  {
    id: "tableware",
    title: "Tableware",
    description: "Everyday pieces made to be used.",
    image: {
      src: sectionPreviewImages.dashboard,
      alt: "Ceramic tableware arranged for a shared meal",
    },
    href: "/docs/pieces/components/categories",
  },
];

const variants: SectionVariantPreview<CategoriesVariant>[] = [
  { variant: "grid", useCase: "Browse category cards in a responsive grid." },
  { variant: "image-grid", useCase: "Prioritize category imagery in a clean grid." },
  { variant: "cards", useCase: "Give each category a distinct card surface." },
  { variant: "horizontal", useCase: "Scroll through categories in a horizontal rail." },
  { variant: "carousel", useCase: "Move between categories with explicit controls." },
  { variant: "editorial", useCase: "Pair a lead category with supporting collections." },
  { variant: "featured", useCase: "Emphasize the category marked as featured." },
  { variant: "split", useCase: "Set a featured category beside a supporting list." },
  { variant: "list", useCase: "Present categories as full-width rows." },
  { variant: "compact", useCase: "Fit small category cards into a denser layout." },
];

export const CategoriesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CategoriesSection"
    variants={variants}
    buildCode={(variant) =>
      `<CategoriesSection variant="${variant}" items={categories} />`
    }
    renderVariant={(variant) => (
      <CategoriesSection
        variant={variant}
        eyebrow="Morrow Home"
        title="Shop by room and ritual"
        description="Illustrative collections for a fictional homewares store."
        items={categories}
      />
    )}
  />
);
