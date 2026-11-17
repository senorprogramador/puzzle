import {
  UseCasesSection,
  type UseCaseItem,
  type UseCasesVariant,
} from "@puzzle-ui/pieces";
import {
  sectionPreviewImages,
  SectionPreviewImage,
} from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const useCaseItems: UseCaseItem[] = [
  {
    id: "product",
    title: "Plan a product launch",
    description:
      "Keep launch decisions, owners, and milestones in one shared view.",
    persona: "Product manager",
    industry: "Software",
    category: "Planning",
    benefits: ["Align work across teams", "Make dependencies visible"],
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.dashboard}
        alt="A product launch dashboard with milestone cards"
      />
    ),
    action: <a href="https://example.com/product-launch">Explore the workflow</a>,
    featured: true,
  },
  {
    id: "operations",
    title: "Coordinate recurring operations",
    description:
      "Turn repeatable handoffs into a process teams can review and improve.",
    persona: "Operations lead",
    industry: "Professional services",
    category: "Delivery",
    benefits: ["Document ownership", "Review work in progress"],
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.workspace}
        alt="A team workspace organizing recurring operational work"
      />
    ),
  },
  {
    id: "customer-success",
    title: "Prepare customer reviews",
    description:
      "Bring account context and next steps together before each conversation.",
    persona: "Customer success manager",
    industry: "SaaS",
    category: "Customer success",
    benefits: ["Share a current account view", "Track follow-up actions"],
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.team}
        alt="Colleagues reviewing customer notes together"
      />
    ),
  },
];

const variants: SectionVariantPreview<UseCasesVariant>[] = [
  { variant: "grid", useCase: "Scan use cases in a balanced grid." },
  { variant: "cards", useCase: "Give every use case a distinct card." },
  { variant: "tabs", useCase: "Switch between detailed use-case stories." },
  { variant: "split", useCase: "Feature one use case beside supporting stories." },
  { variant: "alternating", useCase: "Alternate media and narrative down the page." },
  { variant: "persona", useCase: "Lead with the persona the workflow serves." },
  { variant: "industry", useCase: "Organize content around an industry audience." },
  { variant: "bento", useCase: "Give a selected use case extra grid space." },
  { variant: "featured", useCase: "Open with a prominent use-case story." },
  { variant: "list", useCase: "Keep descriptions and benefits in a compact list." },
  { variant: "editorial", useCase: "Tell longer use-case stories with generous media." },
  { variant: "carousel", useCase: "Browse a horizontally scrollable set of stories." },
  { variant: "categorized", useCase: "Group related workflows by category." },
];

export const UseCasesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="UseCasesSection"
    variants={variants}
    buildCode={(variant) =>
      `<UseCasesSection variant="${variant}" items={useCases} filterable />`
    }
    renderVariant={(variant) => (
      <UseCasesSection
        variant={variant}
        eyebrow="Workflows by team"
        title="Make the next step easier to see"
        description="Illustrative workflows for teams that coordinate launches, operations, and customer work."
        items={useCaseItems}
        filterable
      />
    )}
  />
);
