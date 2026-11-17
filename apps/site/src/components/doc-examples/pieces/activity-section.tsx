import { useState } from "react";
import {
  ActivitySection,
  type ActivityItem,
  type ActivitySectionVariant,
} from "@puzzle-ui/pieces";
import { Avatar, Badge, Button, Tooltip } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const activities: ActivityItem[] = [
  {
    id: "activity-1",
    actor: (
      <Badge content="New" color="info">
        <Avatar alt="Alex Morgan" />
      </Badge>
    ),
    action: "updated the launch plan",
    description: "Moved the target date to November 30.",
    timestamp: "10 minutes ago",
    dateTime: "2026-11-17T17:20:00",
    category: "projects",
    group: "today",
    groupLabel: "Today",
    href: "/projects/launch",
    metadata: <Badge content="Project" color="info" />,
  },
  {
    id: "activity-2",
    actor: "Riley Chen",
    action: "completed a checklist",
    timestamp: "34 minutes ago",
    dateTime: "2026-11-17T16:56:00",
    category: "tasks",
    group: "today",
    groupLabel: "Today",
  },
  {
    id: "activity-3",
    actor: "Jordan Lee",
    action: "changed a workspace permission",
    description: "A new editor was added to the design workspace.",
    timestamp: "Yesterday",
    dateTime: "2026-11-16T15:40:00",
    category: "security",
    group: "yesterday",
    groupLabel: "Yesterday",
  },
];

const activityVariants: SectionVariantPreview<ActivitySectionVariant>[] = [
  { variant: "timeline", useCase: "Connect changes along a vertical thread." },
  { variant: "list", useCase: "Keep events compact and scannable." },
  { variant: "feed", useCase: "Show a conversational activity stream." },
  { variant: "grouped", useCase: "Separate records under date or topic headings." },
  { variant: "cards", useCase: "Give each record a distinct card." },
  { variant: "compact", useCase: "Fit recent updates into a dense dashboard." },
  { variant: "avatars", useCase: "Give actor identities more visual weight." },
  { variant: "audit", useCase: "Present a sequence of administrative changes." },
  { variant: "split", useCase: "Lay events out in two responsive columns." },
  { variant: "horizontal", useCase: "Scroll through a short event rail." },
];

export const ActivitySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ActivitySection"
    variants={activityVariants}
    buildCode={(variant) =>
      `<ActivitySection variant="${variant}" items={activities} />`
    }
    renderVariant={(variant) => (
      <ActivitySection
        title="Northstar team activity"
        variant={variant}
        items={activities}
      />
    )}
  />
);

export const ActivityFilteringExample = () => {
  const [filter, setFilter] = useState("all");
  const filteredItems =
    filter === "all"
      ? activities
      : activities.filter((item) => item.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter activity">
        {["all", "projects", "tasks", "security"].map((category) => (
          <Button
            key={category}
            variant={filter === category ? "primary" : "outline"}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category === "all"
              ? "All activity"
              : `${category[0]?.toUpperCase()}${category.slice(1)}`}
          </Button>
        ))}
        <Tooltip
          trigger={<Button variant="outline">About this feed</Button>}
        >
          Events and visibility are controlled by your application.
        </Tooltip>
      </div>
      <ActivitySection
        title="Team activity"
        variant="grouped"
        items={filteredItems}
        emptyState="No events match this filter."
      />
    </div>
  );
};
