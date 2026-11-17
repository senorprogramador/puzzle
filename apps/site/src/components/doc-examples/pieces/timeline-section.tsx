import {
  TimelineSection,
  type TimelineEvent,
  type TimelineSectionVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const events: TimelineEvent[] = [
  {
    id: "first-sketch",
    title: "A shared notebook",
    date: "2021-02-10",
    description:
      "Mara and Elliot begin collecting ideas for a more thoughtful homewares studio.",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "A notebook and pencil on the studio worktable",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "first-collection",
    title: "The first collection",
    date: "2022-09-18",
    description:
      "A small set of lighting and textiles arrives, made in partnership with local makers.",
  },
  {
    id: "open-studio",
    title: "Doors open at the studio",
    date: "2024-04-06",
    description:
      "The team welcomes neighbors for workshops, shared meals, and a first look at new work.",
    action: <a href="/journal/open-studio">Visit the studio story</a>,
  },
  {
    id: "next-chapter",
    title: "A new chapter in the making",
    date: "2025-06-01",
    description:
      "New collaborations are underway, with the same focus on useful, lasting objects.",
  },
];

const variants: SectionVariantPreview<TimelineSectionVariant>[] = [
  { variant: "vertical", useCase: "Follow events in a clear top-to-bottom sequence." },
  { variant: "horizontal", useCase: "Browse milestones along a horizontal rail." },
  { variant: "alternating", useCase: "Alternate event cards across the timeline." },
  { variant: "centered", useCase: "Place the timeline node between alternating events." },
  { variant: "cards", useCase: "Give each event a distinct content surface." },
  { variant: "milestones", useCase: "Emphasize important dates and turning points." },
  { variant: "history", useCase: "Give historical dates and details a calmer hierarchy." },
  { variant: "editorial", useCase: "Pair timeline events with editorial imagery." },
  { variant: "compact", useCase: "Fit a concise chronology into a smaller area." },
  { variant: "numbered", useCase: "Number each step in the sequence." },
  { variant: "connected", useCase: "Make the relationship between events explicit." },
  { variant: "split", useCase: "Separate event dates from their descriptions." },
];

export const TimelineSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="TimelineSection"
    variants={variants}
    buildCode={(variant) =>
      `<TimelineSection variant="${variant}" items={events} />`
    }
    renderVariant={(variant) => (
      <TimelineSection
        variant={variant}
        eyebrow="Our story"
        title="Growing with intention"
        description="A few moments that shaped the Morrow studio."
        items={events}
      />
    )}
  />
);
