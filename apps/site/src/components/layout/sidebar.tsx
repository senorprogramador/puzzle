import { useState } from "react";

import { Sidebar as PuzzleSidebar } from "@puzzle-ui/ui/components/layout/sidebar";
import {
  TreeView,
  type TreeViewItem,
} from "@puzzle-ui/ui/components/navigation/tree-view";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Autocomplete, Stack } from "@puzzle-ui/ui";

import { items } from "./constants";
import { stringWithCasing } from "@puzzle-ui/core/string";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

const findAncestorIds = (
  nodes: TreeViewItem[],
  pathname: string,
  ancestors: string[] = [],
): string[] | null => {
  for (const node of nodes) {
    if (node.href && normalizePath(node.href) === pathname) {
      return ancestors;
    }

    if (node.children) {
      const found = findAncestorIds(node.children, pathname, [
        ...ancestors,
        node.id,
      ]);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

const getPathExpandedIds = (pathname: string) =>
  findAncestorIds(items, normalizePath(pathname)) ?? [];

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
  label:
    typeof item.label === "string"
      ? item.label
      : stringWithCasing(item.id, "pascalcase"),
  value: item.href,
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pathname = useLocation({ select: (location) => location.pathname });
  const [expandedIds, setExpandedIds] = useState(() =>
    getPathExpandedIds(pathname),
  );
  const [expandedPathname, setExpandedPathname] = useState(pathname);

  if (pathname !== expandedPathname) {
    setExpandedPathname(pathname);
    const pathIds = getPathExpandedIds(pathname);

    if (pathIds.some((id) => !expandedIds.includes(id))) {
      setExpandedIds([...new Set([...expandedIds, ...pathIds])]);
    }
  }

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
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemActive={(item) =>
            item.href !== undefined &&
            normalizePath(item.href) === normalizePath(pathname)
          }
        />
      </Stack>
    </PuzzleSidebar>
  );
};

export { Sidebar };
