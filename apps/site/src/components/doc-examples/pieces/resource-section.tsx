import { ResourceSection, type ResourceSectionVariant } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const resources = [
  {
    id: "launch-kit",
    title: "SaaS launch kit",
    description:
      "A practical checklist for planning a calm, coordinated product launch.",
    category: "Launch planning",
    type: "Download",
    href: "/resources/northstar-launch-checklist.txt",
    download: true,
    featured: true,
  },
  {
    id: "research-guide",
    title: "Customer research field guide",
    description:
      "A lightweight guide to interviews, notes, and shared product decisions.",
    category: "Research",
    type: "Guide",
    href: "/docs/pieces/components/resource-section",
  },
  {
    id: "onboarding-webinar",
    title: "Designing a clearer onboarding flow",
    description:
      "A recorded conversation with product leaders from independent agencies.",
    category: "Education",
    type: "Webinar",
    href: "/docs/pieces/components/resource-section",
  },
];

const variants: SectionVariantPreview<ResourceSectionVariant>[] = [
  { variant: "grid", useCase: "Browse a general-purpose resource collection." },
  { variant: "featured", useCase: "Lead with a recommended guide." },
  { variant: "downloads", useCase: "Present downloadable templates and files." },
  { variant: "categories", useCase: "Filter resources by subject." },
  { variant: "list", useCase: "Keep descriptions readable in a vertical list." },
  { variant: "cards", useCase: "Give each resource a distinct card." },
  { variant: "library", useCase: "Build a broad learning library." },
  { variant: "split", useCase: "Pair a featured item with supporting resources." },
  { variant: "filterable", useCase: "Search and filter the supplied collection." },
  { variant: "webinars", useCase: "Show webinar and education recordings." },
];

export const ResourceSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ResourceSection"
    variants={variants}
    buildCode={(variant) =>
      `<ResourceSection variant="${variant}" items={resources} searchable filterable />`
    }
    renderVariant={(variant) => (
      <ResourceSection
        title="Northstar resource library"
        description="Guides and sessions for teams building better products."
        variant={variant}
        items={resources}
      />
    )}
  />
);

export const ResourceLibraryExample = () => (
  <ResourceSection
    title="Explore the Northstar library"
    variant="filterable"
    items={resources}
    featuredResourceId="launch-kit"
  />
);
