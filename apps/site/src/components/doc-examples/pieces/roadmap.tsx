import {
  RoadmapSection,
  type RoadmapItem,
  type RoadmapVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const roadmapItems: RoadmapItem[] = [
  {
    id: "sso",
    title: "Identity provider setup",
    description: "Document a path for organization-managed sign-in.",
    status: "in-progress",
    statusLabel: "In progress",
    date: "Q1 2027",
    group: "Q1 2027",
    release: "Spring release",
    progress: 45,
  },
  {
    id: "exports",
    title: "Workspace data exports",
    description: "Plan an export flow for workspace administrators.",
    status: "planned",
    date: "Q2 2027",
    group: "Q2 2027",
    release: "Summer release",
  },
  {
    id: "templates",
    title: "Reusable project templates",
    description: "Explore how teams can share repeatable project structures.",
    status: "completed",
    statusLabel: "Example shipped",
    date: "Q4 2026",
    group: "Q4 2026",
    release: "Winter release",
    progress: 100,
  },
];

const variants: SectionVariantPreview<RoadmapVariant>[] = [
  { variant: "timeline", useCase: "Connect milestones along a vertical timeline." },
  { variant: "quarters", useCase: "Arrange milestones into quarter-like groups." },
  { variant: "columns", useCase: "Lay out custom groups as scrolling columns." },
  { variant: "cards", useCase: "Give each roadmap item a distinct card." },
  { variant: "list", useCase: "Keep dates and status in a compact list." },
  { variant: "progress", useCase: "Show only the progress values supplied for items." },
  { variant: "horizontal", useCase: "Scroll milestones along a horizontal timeline." },
  { variant: "vertical", useCase: "Use a simple vertical sequence without card chrome." },
  { variant: "grouped", useCase: "Separate items with headings for their groups." },
  { variant: "kanban", useCase: "Group items into columns by status." },
  { variant: "milestones", useCase: "Number ordered milestones along a connector." },
  { variant: "release", useCase: "Group milestones by their supplied release label." },
];

export const RoadmapSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="RoadmapSection"
    variants={variants}
    buildCode={(variant) =>
      `<RoadmapSection variant="${variant}" items={roadmapItems} />`
    }
    renderVariant={(variant) => (
      <RoadmapSection
        variant={variant}
        eyebrow="Product direction"
        title="A transparent view of planned work"
        description="Illustrative milestone data. Status and progress are exactly the values supplied by the product team."
        items={roadmapItems}
      />
    )}
  />
);
