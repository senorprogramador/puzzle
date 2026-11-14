import { useId, useState, useSyncExternalStore } from "react";

import { Sidebar as PuzzleSidebar } from "@puzzle-ui/ui/components/layout/sidebar";
import {
  TreeView,
  type TreeViewItem,
} from "@puzzle-ui/ui/components/navigation/tree-view";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Autocomplete, Button, Stack, Transition } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";
import { BREAKPOINTS } from "@puzzle-ui/theme";

import { items } from "./constants";
import { stringWithCasing } from "@puzzle-ui/core/string";

import "./sidebar.css";

// Matches the mobile breakpoint in sidebar.css and PageLayout.
const MOBILE_QUERY = `(max-width: ${BREAKPOINTS.tablet - 0.02}px)`;

const subscribeToMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
};

const useIsMobile = () =>
  useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );

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
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const panelId = useId();

  if (pathname !== expandedPathname) {
    setExpandedPathname(pathname);
    setOpen(false);
    const pathIds = getPathExpandedIds(pathname);

    if (pathIds.some((id) => !expandedIds.includes(id))) {
      setExpandedIds([...new Set([...expandedIds, ...pathIds])]);
    }
  }

  return (
    <PuzzleSidebar className="puzzle-site-sidebar">
      <Button
        variant="ghost"
        fullWidth
        className="puzzle-site-sidebar__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        trailing={
          <Icon
            name="akar-icons:chevron-down"
            aria-hidden="true"
            className="puzzle-site-sidebar__chevron"
          />
        }
      >
        Documentation menu
      </Button>

      {/* Always mounted: on wider screens CSS keeps the panel expanded. */}
      <Transition
        visible={open}
        as="div"
        template="accordion"
        unmountOnExit={false}
        id={panelId}
        className="puzzle-site-sidebar__panel"
        inert={isMobile && !open}
      >
        <div className="puzzle-site-sidebar__panel-inner">
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
        </div>
      </Transition>
    </PuzzleSidebar>
  );
};

export { Sidebar };
