import {
  ContentSection,
  type ContentSectionVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages, SectionPreviewImage } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const variants: SectionVariantPreview<ContentSectionVariant>[] = [
  { variant: "single-column", useCase: "Keep long-form copy in one readable flow." },
  { variant: "two-column", useCase: "Balance two flexible content slots." },
  { variant: "three-column", useCase: "Arrange three supporting editorial points." },
  { variant: "split", useCase: "Pair the main story with a related sidebar." },
  { variant: "image-left", useCase: "Place supporting media before the copy." },
  { variant: "image-right", useCase: "Place supporting media after the copy." },
  { variant: "media", useCase: "Give an image or media slot equal prominence." },
  { variant: "editorial", useCase: "Use a generous text-and-image composition." },
  { variant: "quote", useCase: "Present supplied copy as a cited quotation." },
  { variant: "narrow", useCase: "Constrain the measure for focused reading." },
  { variant: "wide", useCase: "Give the content a wider page measure." },
  { variant: "full-width", useCase: "Let the section use the available width." },
];

const columns = [
  <p key="one">Made for everyday rituals, with honest materials and a light touch.</p>,
  <p key="two">Designed to be repaired, shared, and kept for a long time.</p>,
  <p key="three">Considered details make familiar routines feel a little calmer.</p>,
];

export const ContentSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ContentSection"
    variants={variants}
    buildCode={(variant) =>
      `<ContentSection variant="${variant}" image={storyImage}>…</ContentSection>`
    }
    renderVariant={(variant) => (
      <ContentSection
        variant={variant}
        eyebrow="Our point of view"
        title="Objects with a longer story"
        description="Thoughtful design starts with what we choose to keep."
        image={{
          src: sectionPreviewImages.product,
          alt: "Natural materials and tools on a studio worktable",
          width: 1200,
          height: 800,
          caption: "A selection of materials in the Morrow studio.",
        }}
        media={
          <SectionPreviewImage
            src={sectionPreviewImages.workspace}
            alt="A calm, light-filled creative studio"
          />
        }
        columns={
          variant === "two-column"
            ? columns.slice(0, 2)
            : variant === "three-column"
              ? columns
              : undefined
        }
        sidebar={<p>Made with care in small, considered batches.</p>}
        attribution={variant === "quote" ? "Mara Chen, founder" : undefined}
      >
        <p>
          We believe useful things can be beautiful without asking for
          attention. Each collection begins with a simple question: will this
          make an ordinary day feel more considered?
        </p>
      </ContentSection>
    )}
  />
);
