import { useState } from "react";
import { Sidebar as PuzzleSidebar } from "@puzzle/ui/components/layout/sidebar";
import {
  TreeView,
  type TreeViewItem,
} from "@puzzle/ui/components/navigation/tree-view";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { Autocomplete, Stack } from "@puzzle/ui";
import { stringWithCasing } from "@puzzle/core";
import { items } from "./constants";

const findComponentItems = (
  items: TreeViewItem[] | TreeViewItem,
): TreeViewItem[] => {
  if (Array.isArray(items)) {
    return items.flatMap((item) => findComponentItems(item));
  }
  if (items.children) {
    return findComponentItems(items.children).flat();
  }
  return [items];
};

const componentItems = findComponentItems(items).map((item) => ({
  label: stringWithCasing(item.id, "pascalcase"),
  value: item.href,
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const matchRoute = useMatchRoute();

  return (
    <PuzzleSidebar>
      <Stack direction="col">
        <Autocomplete
          placeholder="Search"
          options={componentItems}
          onChange={(value) => {
            navigate({ to: value });
          }}
        />
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
            "layout",
            "navigation",
            "overlays",
            "typography",
            "utilities",
            "theme",
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
      </Stack>
    </PuzzleSidebar>
  );
};

export { Sidebar };
