import { useState } from "react";
import { ActivitySection, type ActivityItem } from "@puzzle-ui/pieces";
import { Avatar, Badge, Button, Tooltip } from "@puzzle-ui/ui";

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
