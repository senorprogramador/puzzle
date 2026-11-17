import {
  GallerySection,
  type GalleryItem,
  type GallerySectionVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const images: GalleryItem[] = [
  {
    id: "studio",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "A bright Morrow studio with a shared worktable",
      width: 1200,
      height: 800,
    },
    caption: "The studio, just after opening",
    href: "/journal/our-studio",
    featured: true,
  },
  {
    id: "landscape",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "A quiet mountain lake at the end of the day",
      width: 1200,
      height: 800,
    },
    caption: "A slower afternoon outdoors",
  },
  {
    id: "objects",
    image: {
      src: sectionPreviewImages.product,
      alt: "Hand-finished objects arranged on a wooden table",
      width: 1200,
      height: 900,
    },
    caption: "Pieces made to be used",
  },
  {
    id: "team",
    image: {
      src: sectionPreviewImages.team,
      alt: "The Morrow team sharing lunch around a table",
      width: 1200,
      height: 800,
    },
    caption: "A table with room for one more",
  },
];

const variants: SectionVariantPreview<GallerySectionVariant>[] = [
  { variant: "grid", useCase: "Show a balanced set of images in a responsive grid." },
  { variant: "masonry", useCase: "Let image heights flow through responsive columns." },
  { variant: "justified", useCase: "Pack images into a denser, varied grid." },
  { variant: "bento", useCase: "Give a featured image more space in a bento layout." },
  { variant: "featured", useCase: "Emphasize the image marked as featured." },
  { variant: "carousel", useCase: "Browse a keyboard-focusable horizontal image rail." },
  { variant: "collage", useCase: "Create a mixed-size editorial collage." },
  { variant: "editorial", useCase: "Use a relaxed, magazine-like composition." },
  { variant: "fullscreen", useCase: "Open large images in a full-screen lightbox." },
  { variant: "thumbnails", useCase: "Keep images compact with captions below." },
  { variant: "horizontal", useCase: "Scroll through a horizontal image sequence." },
  { variant: "vertical", useCase: "Stack images for a single-column story." },
  { variant: "asymmetric", useCase: "Balance large and small images asymmetrically." },
  { variant: "mixed", useCase: "Combine flexible image sizes in a dense grid." },
  { variant: "portfolio", useCase: "Present a portfolio in a responsive masonry flow." },
];

export const GallerySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="GallerySection"
    variants={variants}
    buildCode={(variant) =>
      `<GallerySection variant="${variant}" items={images} lightbox />`
    }
    renderVariant={(variant) => (
      <GallerySection
        variant={variant}
        eyebrow="Morrow, in detail"
        title="A place for considered things"
        description="Scenes from the studio, the landscape, and everyday life."
        items={images}
        lightbox
      />
    )}
  />
);
