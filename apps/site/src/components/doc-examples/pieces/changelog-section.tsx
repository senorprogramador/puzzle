import {
  ChangelogSection,
  type ChangelogRelease,
  type ChangelogSectionVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const releases: ChangelogRelease[] = [
  {
    id: "2-4",
    version: "2.4.0",
    date: "2025-05-12",
    type: "Feature release",
    description:
      "A quieter, more focused workspace for teams building thoughtful products.",
    categories: [
      {
        name: "New",
        changes: [
          "Editorial collections now support shared review.",
          "Saved views keep recurring research close at hand.",
        ],
      },
      {
        name: "Improved",
        changes: ["Keyboard navigation is more consistent across the workspace."],
      },
    ],
    href: "/releases/2.4.0",
    group: "Spring 2025",
    featured: true,
  },
  {
    id: "2-3",
    version: "2.3.1",
    date: "2025-03-07",
    type: "Patch",
    description: "A small set of reliability and accessibility improvements.",
    categories: [
      {
        name: "Fixed",
        changes: ["Resolved an issue with long project names in compact navigation."],
      },
    ],
    group: "Spring 2025",
  },
  {
    id: "2-2",
    version: "2.2.0",
    date: "2024-11-18",
    type: "Minor release",
    description: "New ways to share work and gather feedback.",
    categories: [
      {
        name: "New",
        changes: ["Added public read-only project links."],
      },
    ],
    group: "Autumn 2024",
  },
  {
    id: "2-1",
    version: "2.1.0",
    date: "2024-06-04",
    type: "Minor release",
    description: "More flexible filters for growing teams.",
    categories: [
      {
        name: "Improved",
        changes: ["Saved filters can now be shared with a workspace."],
      },
    ],
    group: "Summer 2024",
  },
];

const variants: SectionVariantPreview<ChangelogSectionVariant>[] = [
  { variant: "timeline", useCase: "Connect releases along a chronological line." },
  { variant: "list", useCase: "Keep release details in a straightforward list." },
  { variant: "cards", useCase: "Separate releases into responsive cards." },
  { variant: "grouped", useCase: "Group releases by the supplied release group." },
  { variant: "versioned", useCase: "Give version numbers a prominent position." },
  { variant: "featured", useCase: "Lead with one featured release." },
  { variant: "compact", useCase: "Show a concise release history." },
  { variant: "release-notes", useCase: "Use an open, document-like notes layout." },
  { variant: "categories", useCase: "Organize releases by their primary change category." },
  { variant: "split", useCase: "Separate the latest release from supporting notes." },
  { variant: "vertical", useCase: "Stack releases in a vertical chronology." },
  { variant: "horizontal", useCase: "Browse release cards along a horizontal rail." },
];

export const ChangelogSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ChangelogSection"
    variants={variants}
    buildCode={(variant) =>
      `<ChangelogSection variant="${variant}" items={releases} />`
    }
    renderVariant={(variant) => (
      <ChangelogSection
        variant={variant}
        eyebrow="What's new"
        title="Updates from the Morrow workspace"
        description="Product changes, improvements, and fixes."
        items={releases}
      />
    )}
  />
);
