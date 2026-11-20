import { HostProfileSection } from "@puzzle-ui/pieces";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";
import { sectionPreviewImages } from "../shared/section-preview-media";

const host = {
  id: "mara",
  name: "Mara Jensen",
  role: "Owner and host",
  avatar: {
    src: sectionPreviewImages.portraitOne,
    alt: "Portrait of Mara Jensen",
  },
  biography: "A local host who loves sharing the quieter corners of the coast.",
  languages: ["Dutch", "English", "German"],
  story:
    "Mara grew up nearby and has welcomed travelers to the house for more than a decade.",
  contactAction: <a href="mailto:mara@example.test">Contact Mara</a>,
};

const variants = [
  { variant: "compact", useCase: "Keep the host introduction brief." },
  { variant: "profile", useCase: "Give the profile and story more room." },
] as const satisfies readonly SectionVariantPreview<"compact" | "profile">[];

export const HostProfileSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="HostProfileSection"
    variants={variants}
    buildCode={(variant) =>
      `<HostProfileSection variant="${variant}" host={host} />`
    }
    renderVariant={(variant) => (
      <HostProfileSection
        title="Meet your host"
        variant={variant}
        host={host}
      />
    )}
  />
);
