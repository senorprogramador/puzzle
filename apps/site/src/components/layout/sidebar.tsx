import { useState } from "react";
import { Sidebar as PuzzleSidebar } from "@puzzle/ui/components/layout/sidebar";
import {
  TreeView,
  type TreeViewItem,
} from "@puzzle/ui/components/navigation/tree-view";
import { useMatchRoute } from "@tanstack/react-router";

const items: TreeViewItem[] = [
  {
    id: "components",
    label: "Components",
    children: [
      {
        id: "ui",
        label: "UI",
        children: [
          {
            id: "actions",
            label: "Actions",
            children: [
              {
                id: "button-group",
                label: "Button Group",
                href: "/docs/components/ui/actions/button-group",
              },
              {
                id: "button",
                label: "Button",
                href: "/docs/components/ui/actions/button",
              },
              {
                id: "toggle-group",
                label: "Toggle Group",
                href: "/docs/components/ui/actions/toggle-group",
              },
            ],
          },
          {
            id: "data-display",
            label: "Data Display",
            children: [
              {
                id: "avatar",
                label: "Avatar",
                href: "/docs/components/ui/data-display/avatar",
              },
              {
                id: "badge",
                label: "Badge",
                href: "/docs/components/ui/data-display/badge",
              },
              {
                id: "card",
                label: "Card",
                href: "/docs/components/ui/data-display/card",
              },
              {
                id: "image",
                label: "Image",
                href: "/docs/components/ui/data-display/image",
              },
              {
                id: "paper",
                label: "Paper",
                href: "/docs/components/ui/data-display/paper",
              },
              {
                id: "progress",
                label: "Progress",
                href: "/docs/components/ui/data-display/progress",
              },
              {
                id: "skeleton",
                label: "Skeleton",
                href: "/docs/components/ui/data-display/skeleton",
              },
            ],
          },
          {
            id: "forms",
            label: "Forms",
            children: [
              {
                id: "date-picker",
                label: "Date Picker",
                href: "/docs/components/ui/forms/date-picker",
              },
              {
                id: "select",
                label: "Select",
                href: "/docs/components/ui/forms/select",
              },
              {
                id: "slider",
                label: "Slider",
                href: "/docs/components/ui/forms/slider",
              },
              {
                id: "stepper",
                label: "Stepper",
                href: "/docs/components/ui/forms/stepper",
              },
            ],
          },
          {
            id: "navigation",
            label: "Navigation",
            children: [
              {
                id: "accordion",
                label: "Accordion",
                href: "/docs/components/ui/navigation/accordion",
              },
              {
                id: "carousel",
                label: "Carousel",
                href: "/docs/components/ui/navigation/carousel",
              },
              {
                id: "tabs",
                label: "Tabs",
                href: "/docs/components/ui/navigation/tabs",
              },
            ],
          },
          {
            id: "overlays",
            label: "Overlays",
            children: [
              {
                id: "popover",
                label: "Popover",
                href: "/docs/components/ui/overlays/popover",
              },
              {
                id: "tooltip",
                label: "Tooltip",
                href: "/docs/components/ui/overlays/tooltip",
              },
            ],
          },
          {
            id: "utilities",
            label: "Utilities",
            children: [
              {
                id: "preview",
                label: "Preview",
                href: "/docs/components/ui/utilities/preview",
              },
            ],
          },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const matchRoute = useMatchRoute();

  return (
    <PuzzleSidebar>
      <TreeView
        aria-label="Navigation"
        items={items}
        selectionMode="single"
        defaultExpandedIds={[
          "components",
          "ui",
          "actions",
          "data-display",
          "forms",
          "navigation",
          "overlays",
          "utilities",
        ]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getItemActive={(item) =>
          Boolean(
            item.href &&
            matchRoute({
              to: item.href,
              fuzzy: false,
            }),
          )
        }
      />
    </PuzzleSidebar>
  );
};

export { Sidebar };
