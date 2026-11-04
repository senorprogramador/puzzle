import { Sidebar as PuzzleSidebar } from "@puzzle/ui/components/layout/sidebar";
import {
  TreeView,
  TreeViewItem,
} from "@puzzle/ui/components/navigation/tree-view";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

type TreeViewItemData = {
  href?: string;
};

const items: TreeViewItem<TreeViewItemData>[] = [
  {
    id: "components",
    label: "Components",
    children: [
      {
        id: "actions",
        label: "Actions",
        children: [
          {
            id: "button",
            label: "Button",
            data: { href: "/components/actions/button" },
          },
          {
            id: "button-group",
            label: "Button Group",
            data: { href: "/components/actions/button-group" },
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
        defaultExpandedIds={["components"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        renderItem={(item, state) => {
          if (!item.data?.href) {
            return null;
          }
          return (
            <Link
              className="puzzle-tree__row"
              to={item.data.href}
              tabIndex={-1}
            >
              <span className="puzzle-tree__label">{item.label}</span>
            </Link>
          );
        }}
        renderLabel={(item) => {
          if (!item.data?.href) {
            return item.label;
          }

          return (
            <Link
              onClick={() => setSelectedIds([item.id])}
              to={item.data.href}
              tabIndex={-1}
            >
              {item.label}
            </Link>
          );
        }}
      />
    </PuzzleSidebar>
  );
};

export { Sidebar };
