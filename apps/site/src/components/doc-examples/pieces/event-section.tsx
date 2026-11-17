import { EventSection, type EventSectionVariant } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const events = [
  {
    id: "studio-summit",
    title: "Northstar product summit",
    startDate: "2026-12-04T09:00:00Z",
    endDate: "2026-12-04T16:00:00Z",
    dateLabel: "December 4, 2026",
    endLabel: "4:00 PM UTC",
    description:
      "A day of practical product talks and small-group conversations.",
    location: "Amsterdam · Northstar Studio",
    category: "Conference",
    price: "€120",
    href: "/docs/pieces/components/event-section",
    featured: true,
  },
  {
    id: "agency-workshop",
    title: "Agency planning workshop",
    startDate: "2026-12-12T10:00:00Z",
    endDate: "2026-12-12T12:30:00Z",
    dateLabel: "December 12, 2026",
    description: "Bring one active project and leave with a clearer plan.",
    location: "Online",
    category: "Workshop",
    price: "Free",
    href: "/docs/pieces/components/event-section",
  },
  {
    id: "research-lab",
    title: "Customer research lab",
    startDate: "2026-10-24T13:00:00Z",
    endDate: "2026-10-24T15:00:00Z",
    dateLabel: "October 24, 2026",
    description: "An earlier session with notes and a recording available.",
    location: "Online",
    category: "Workshop",
    href: "/docs/pieces/components/event-section",
  },
];

const variants: SectionVariantPreview<EventSectionVariant>[] = [
  { variant: "grid", useCase: "Browse upcoming programs in a card grid." },
  { variant: "list", useCase: "Scan dates, categories, and venues quickly." },
  { variant: "featured", useCase: "Promote a highlighted event." },
  { variant: "calendar", useCase: "Group dates into a calendar-oriented list." },
  { variant: "timeline", useCase: "Present events as a chronological timeline." },
  { variant: "upcoming", useCase: "Focus on events that have not ended." },
  { variant: "past", useCase: "Review previously held events." },
  { variant: "cards", useCase: "Give events distinct card surfaces." },
  { variant: "split", useCase: "Separate featured and supporting events." },
  { variant: "carousel", useCase: "Scroll through events with the UI carousel." },
];

export const EventSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="EventSection"
    variants={variants}
    buildCode={(variant) =>
      `<EventSection variant="${variant}" events={events} referenceDate={referenceDate} />`
    }
    renderVariant={(variant) => (
      <EventSection
        title="Northstar events"
        description="Talks and workshops for product teams and independent agencies."
        variant={variant}
        events={events}
        referenceDate="2026-11-17T12:00:00Z"
      />
    )}
  />
);

export const EventFilteringExample = () => (
  <EventSection
    title="Events for product teams"
    variant="upcoming"
    events={events}
    referenceDate="2026-11-17T12:00:00Z"
  />
);
