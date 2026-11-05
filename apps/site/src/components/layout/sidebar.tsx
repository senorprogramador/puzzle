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
        id: "actions",
        label: "Actions",
        children: [
          {
            id: "button-group",
            label: "Button Group",
            href: "/docs/components/actions/button-group",
          },
          {
            id: "button",
            label: "Button",
            href: "/docs/components/actions/button",
          },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <PuzzleSidebar>
      <TreeView
        aria-label="Navigation"
        items={items}
        selectionMode="single"
        defaultExpandedIds={["components", "actions"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getItemActive={(item) => {
          const matchRoute = useMatchRoute();
          return Boolean(
            item.href &&
            matchRoute({
              to: item.href,
              fuzzy: false,
            }),
          );
        }}
      />
    </PuzzleSidebar>
  );
};

export { Sidebar };
