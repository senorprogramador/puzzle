import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Sidebar as PuzzleSidebar } from "@puzzle-ui/ui/components/layout/sidebar";
import { TreeView } from "@puzzle-ui/ui/components/navigation/tree-view";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Autocomplete, Button, Stack, Transition } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons";
import { BREAKPOINTS } from "@puzzle-ui/theme";

import { items } from "./sidebar/index";
import {
  findNavigationPath,
  getDocumentationSearchOptions,
  getPathExpandedIds,
  mergeExpandedIds,
  normalizePath,
} from "./sidebar/helpers";
import type { DocumentationPage } from "./sidebar/types";

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

const Sidebar = ({ pages }: { pages: DocumentationPage[] }) => {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const [expandedIds, setExpandedIds] = useState(() =>
    getPathExpandedIds(pathname),
  );
  const [expandedPathname, setExpandedPathname] = useState(pathname);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const searchOptions = useMemo(
    () => getDocumentationSearchOptions(pages),
    [pages],
  );

  if (pathname !== expandedPathname) {
    setExpandedPathname(pathname);
    setOpen(false);
    const pathIds = getPathExpandedIds(pathname);

    if (pathIds.some((id) => !expandedIds.includes(id))) {
      setExpandedIds(mergeExpandedIds(expandedIds, pathname));
    }
  }

  useEffect(() => {
    if (isMobile) return;

    const active = panelRef.current?.querySelector<HTMLElement>(
      '[data-active="true"] > .puzzle-tree__row',
    );
    const sidebar = panelRef.current?.closest<HTMLElement>(".puzzle-site-sidebar");
    if (!active || !sidebar) return;

    const row = active.getBoundingClientRect();
    const viewport = sidebar.getBoundingClientRect();
    if (row.top < viewport.top) sidebar.scrollTop += row.top - viewport.top;
    else if (row.bottom > viewport.bottom)
      sidebar.scrollTop += row.bottom - viewport.bottom;
  }, [pathname, expandedIds, isMobile]);

  return (
    <PuzzleSidebar
      as="nav"
      aria-label="Documentation"
      className="puzzle-site-sidebar"
    >
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
        <div
          ref={panelRef}
          className="puzzle-site-sidebar__panel-inner"
          onClickCapture={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest("a[href]") &&
              !event.target.closest("[data-tree-toggle]") &&
              !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
            ) {
              setOpen(false);
            }
          }}
        >
          <Stack direction="col">
            <Autocomplete
              placeholder="Search"
              aria-label="Search documentation"
              options={searchOptions}
              onChange={(value) => {
                if (value !== undefined) {
                  setOpen(false);
                  void navigate({ to: value });
                }
              }}
            />

            <TreeView
              aria-label="Documentation pages"
              className="puzzle-site-sidebar__tree"
              items={items}
              selectionMode="none"
              defaultFocusedId={findNavigationPath(items, pathname).at(-1)?.id}
              expandedIds={expandedIds}
              onExpandedChange={setExpandedIds}
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
