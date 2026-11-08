"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { Link } from "../link";
import "./tree-view.css";

type TreeViewSelectionMode = "none" | "single" | "multiple";
type TreeViewSize = "sm" | "md";

type TreeViewItem<TData = unknown> = {
  /** Stable, unique identifier for this node. */
  id: string;

  /** Visible node label. Supply textValue when the label is not plain text. */
  label: ReactNode;

  /** Optional destination. When supplied, the complete row renders as a Puzzle Link. */
  href?: string;

  /** Plain-text value used by typeahead when label is not a string or number. */
  textValue?: string;

  /** Optional icon displayed before the label. */
  icon?: ReactNode;

  /** Optional, non-interactive content displayed after the label. */
  endAdornment?: ReactNode;

  /** Child nodes for a loaded branch. Omit for a leaf or a lazily loaded branch. */
  children?: TreeViewItem<TData>[];

  /** Marks a node as expandable before its children have been loaded. */
  hasChildren?: boolean;

  /** Prevents selection and activation; branches can still expand so descendants remain accessible. */
  disabled?: boolean;

  /** Allows a node to be excluded from selection without disabling expansion. */
  selectable?: boolean;

  /** Optional application data associated with the node. */
  data?: TData;
};

type TreeViewItemState = {
  expanded: boolean;
  selected: boolean;
  focused: boolean;
  loading: boolean;
  disabled: boolean;
  hasChildren: boolean;
};

type TreeViewProps<TData = unknown> = Omit<
  ComponentPropsWithRef<"ul">,
  | "children"
  | "onKeyDown"
  | "onFocusCapture"
  | "onBlurCapture"
  | "role"
  | "tabIndex"
  | "aria-multiselectable"
> &
  (
    | { "aria-label": string; "aria-labelledby"?: string }
    | { "aria-labelledby": string; "aria-label"?: string }
  ) & {
    /** Hierarchical data rendered by the tree. Node IDs must be unique. */
    items: TreeViewItem<TData>[];

    /** Selection behavior. Defaults to single selection. */
    selectionMode?: TreeViewSelectionMode;

    /** Initial expanded node IDs for uncontrolled usage. Defaults to []. */
    defaultExpandedIds?: string[];

    /** Expanded node IDs for controlled usage. */
    expandedIds?: string[];

    /** Called with the next expanded node IDs. */
    onExpandedChange?: (expandedIds: string[]) => void;

    /** Initial selected node IDs for uncontrolled usage. Defaults to []. */
    defaultSelectedIds?: string[];

    /** Selected node IDs for controlled usage. */
    selectedIds?: string[];

    /** Called with the next selected node IDs. */
    onSelectionChange?: (selectedIds: string[]) => void;

    /** Initial roving-focus target. Defaults to the first selected node, then the first root node. */
    defaultFocusedId?: string;

    /** Called when keyboard or pointer interaction moves focus to another node. */
    onFocusedChange?: (focusedId: string) => void;

    /** Loads the children of a node marked with hasChildren when it is first expanded. */
    loadChildren?: (
      item: TreeViewItem<TData>,
    ) => Promise<TreeViewItem<TData>[]>;

    /** Called when lazy loading fails. Re-collapse and re-expand the node to retry. */
    onLoadChildrenError?: (item: TreeViewItem<TData>, error: unknown) => void;

    /** Called when a node is activated with Enter. */
    onItemActivate?: (item: TreeViewItem<TData>) => void;

    /** Determines whether an item matches the current route. */
    getItemActive?: (item: TreeViewItem<TData>) => boolean;

    /**
     * Custom node renderer. Replaces the icon, label and adornment of a row; the
     * expand indicator, row element and tree semantics are kept. Keep its contents non-interactive.
     */
    renderItem?: (
      item: TreeViewItem<TData>,
      state: TreeViewItemState,
    ) => ReactNode;

    /** Custom node-icon renderer. */
    renderIcon?: (
      item: TreeViewItem<TData>,
      state: TreeViewItemState,
    ) => ReactNode;

    /** Custom label renderer. Keep its contents non-interactive. */
    renderLabel?: (
      item: TreeViewItem<TData>,
      state: TreeViewItemState,
    ) => ReactNode;

    /** Clicking the label of a branch toggles it instead of selecting it. Defaults to false. */
    expandOnItemClick?: boolean;

    /** Visual density. Defaults to md. */
    size?: TreeViewSize;

    /** Indentation between hierarchy levels, in CSS units. Defaults to the theme spacing token. */
    indentation?: string | number;

    /** Enables character-based typeahead navigation. Defaults to true. */
    typeahead?: boolean;

    /** Text announced and displayed while lazy children are loading. */
    loadingLabel?: string;

    /** Text displayed when lazy loading fails. */
    loadErrorLabel?: string;

    /** Class applied to each tree item. */
    itemClassName?: string;
  };

const normalizeIds = (ids: string[] | undefined) =>
  Array.from(
    new Set(
      (ids ?? []).filter((id) => typeof id === "string" && id.length > 0),
    ),
  );

const getTextValue = <TData,>(item: TreeViewItem<TData>) => {
  if (item.textValue !== undefined) return item.textValue;

  if (typeof item.label === "string" || typeof item.label === "number") {
    return String(item.label);
  }

  return "";
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const TreeView = <TData,>({
  items,
  selectionMode = "single",
  defaultExpandedIds = [],
  expandedIds,
  onExpandedChange,
  defaultSelectedIds = [],
  selectedIds,
  onSelectionChange,
  defaultFocusedId,
  onFocusedChange,
  loadChildren,
  onLoadChildrenError,
  onItemActivate,
  getItemActive,
  renderItem,
  renderIcon,
  renderLabel,
  expandOnItemClick = false,
  typeahead = true,
  size = "md",
  indentation,
  loadingLabel = "Loading…",
  loadErrorLabel = "Could not load children. Collapse and expand to retry.",
  itemClassName,
  className,
  style,
  dir,
  ...rootProps
}: TreeViewProps<TData>) => {
  const generatedId = useId();
  const isExpandedControlled = expandedIds !== undefined;
  const isSelectionControlled = selectedIds !== undefined;

  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(() =>
    normalizeIds(defaultExpandedIds),
  );

  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(() =>
    normalizeIds(defaultSelectedIds),
  );

  const [focusedId, setFocusedId] = useState<string | undefined>(
    () =>
      defaultFocusedId ??
      (selectionMode === "none"
        ? undefined
        : normalizeIds(selectedIds ?? defaultSelectedIds)[0]) ??
      items[0]?.id,
  );

  const [loadedChildren, setLoadedChildren] = useState<
    Map<string, TreeViewItem<TData>[]>
  >(() => new Map());

  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const [loadErrors, setLoadErrors] = useState<Map<string, unknown>>(
    () => new Map(),
  );

  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const inFlightLoads = useRef(new Set<string>());
  const previousExpandedIds = useRef<string[] | null>(null);
  const pendingFocusId = useRef<string | null>(null);
  const focusWithinTree = useRef(false);
  const typeaheadState = useRef({ value: "", time: 0 });

  const currentExpandedIds = isExpandedControlled
    ? (expandedIds ?? [])
    : uncontrolledExpandedIds;

  const requestedSelectedIds = isSelectionControlled
    ? (selectedIds ?? [])
    : uncontrolledSelectedIds;

  const currentSelectedIds =
    selectionMode === "single"
      ? requestedSelectedIds.slice(0, 1)
      : requestedSelectedIds;

  const expandedSet = useMemo(
    () => new Set(normalizeIds(currentExpandedIds)),
    [currentExpandedIds],
  );

  const selectedSet = useMemo(
    () => new Set(normalizeIds(currentSelectedIds)),
    [currentSelectedIds],
  );

  const loadingSet = useMemo(() => new Set(loadingIds), [loadingIds]);

  const getChildren = useCallback(
    (item: TreeViewItem<TData>) =>
      item.children ?? loadedChildren.get(item.id) ?? [],
    [loadedChildren],
  );

  const hasChildren = useCallback(
    (item: TreeViewItem<TData>) => {
      if (item.children !== undefined || loadedChildren.has(item.id)) {
        return getChildren(item).length > 0;
      }

      return Boolean(item.hasChildren);
    },
    [getChildren, loadedChildren],
  );

  const visibleItems = useMemo(() => {
    const result: TreeViewItem<TData>[] = [];

    const visit = (nodes: TreeViewItem<TData>[]) => {
      nodes.forEach((item) => {
        result.push(item);

        const children = getChildren(item);

        if (
          expandedSet.has(item.id) &&
          hasChildren(item) &&
          children.length > 0
        ) {
          visit(children);
        }
      });
    };

    visit(items);

    return result;
  }, [items, expandedSet, getChildren, hasChildren]);

  const parentIds = useMemo(() => {
    const result = new Map<string, string>();

    const visit = (nodes: TreeViewItem<TData>[], parentId?: string) => {
      nodes.forEach((item) => {
        if (parentId !== undefined) {
          result.set(item.id, parentId);
        }

        visit(getChildren(item), item.id);
      });
    };

    visit(items);

    return result;
  }, [items, getChildren]);

  const visibleIds = useMemo(
    () => new Set(visibleItems.map((item) => item.id)),
    [visibleItems],
  );

  let effectiveFocusedId = focusedId;

  if (!effectiveFocusedId || !visibleIds.has(effectiveFocusedId)) {
    let ancestor = effectiveFocusedId;

    while (ancestor && !visibleIds.has(ancestor)) {
      ancestor = parentIds.get(ancestor);
    }

    effectiveFocusedId = ancestor ?? visibleItems[0]?.id;
  }

  useEffect(() => {
    if (pendingFocusId.current && visibleIds.has(pendingFocusId.current)) {
      itemRefs.current.get(pendingFocusId.current)?.focus();
      pendingFocusId.current = null;
    }
  }, [visibleItems, visibleIds]);

  useEffect(() => {
    if (focusedId !== effectiveFocusedId && effectiveFocusedId) {
      setFocusedId(effectiveFocusedId);
      onFocusedChange?.(effectiveFocusedId);

      if (focusWithinTree.current) {
        itemRefs.current.get(effectiveFocusedId)?.focus();
      }
    }
  }, [effectiveFocusedId, focusedId, onFocusedChange]);

  const commitExpandedIds = (nextIds: string[]) => {
    const next = normalizeIds(nextIds);

    if (!isExpandedControlled) {
      setUncontrolledExpandedIds(next);
    }

    onExpandedChange?.(next);
  };

  const commitSelectedIds = (nextIds: string[]) => {
    const next = normalizeIds(nextIds);

    if (!isSelectionControlled) {
      setUncontrolledSelectedIds(next);
    }

    onSelectionChange?.(next);
  };

  const loadNodeChildren = useCallback(
    async (item: TreeViewItem<TData>) => {
      if (!loadChildren || !item.hasChildren || item.children !== undefined) {
        return;
      }

      if (loadedChildren.has(item.id) || inFlightLoads.current.has(item.id)) {
        return;
      }

      inFlightLoads.current.add(item.id);
      setLoadingIds((current) => [...current, item.id]);

      setLoadErrors((current) => {
        const next = new Map(current);
        next.delete(item.id);
        return next;
      });

      try {
        const children = await loadChildren(item);

        setLoadedChildren((current) => {
          const next = new Map(current);
          next.set(item.id, children);
          return next;
        });
      } catch (error) {
        setLoadErrors((current) => {
          const next = new Map(current);
          next.set(item.id, error);
          return next;
        });

        onLoadChildrenError?.(item, error);
      } finally {
        inFlightLoads.current.delete(item.id);
        setLoadingIds((current) => current.filter((id) => id !== item.id));
      }
    },
    [loadChildren, loadedChildren, onLoadChildrenError],
  );

  // Also load branches that were expanded through default or controlled props.
  // Tracking newly expanded IDs avoids retrying a failed request on unrelated renders.
  useEffect(() => {
    const previous = new Set(previousExpandedIds.current ?? []);

    const newlyExpandedIds = currentExpandedIds.filter(
      (id) => !previous.has(id),
    );

    previousExpandedIds.current = normalizeIds(currentExpandedIds);

    newlyExpandedIds.forEach((id) => {
      const item = findItemById(items, id, getChildren);
      if (item) void loadNodeChildren(item);
    });
  }, [currentExpandedIds, items, getChildren, loadNodeChildren]);

  const toggleExpanded = (item: TreeViewItem<TData>) => {
    if (!hasChildren(item)) return;

    const next = new Set(currentExpandedIds);

    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
      void loadNodeChildren(item);
    }

    commitExpandedIds(Array.from(next));
  };

  const selectItem = (item: TreeViewItem<TData>, toggleSingle = false) => {
    if (
      selectionMode === "none" ||
      item.disabled ||
      item.selectable === false
    ) {
      return;
    }

    if (selectionMode === "single") {
      if (
        currentSelectedIds.length === 1 &&
        currentSelectedIds[0] === item.id
      ) {
        if (toggleSingle) commitSelectedIds([]);
        return;
      }

      commitSelectedIds([item.id]);
      return;
    }

    const next = new Set(currentSelectedIds);

    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }

    commitSelectedIds(Array.from(next));
  };

  const focusItem = (id: string) => {
    const element = itemRefs.current.get(id);

    if (element) {
      element.focus();
    } else {
      setFocusedId(id);
      onFocusedChange?.(id);
      pendingFocusId.current = id;
    }
  };

  const expandSiblings = (itemId: string) => {
    const parentId = parentIds.get(itemId);

    const parentItem = parentId
      ? findItemById(items, parentId, getChildren)
      : undefined;

    const siblings = parentItem ? getChildren(parentItem) : items;
    const next = new Set(currentExpandedIds);
    let changed = false;

    siblings.forEach((sibling) => {
      if (hasChildren(sibling) && !next.has(sibling.id)) {
        next.add(sibling.id);
        changed = true;
        void loadNodeChildren(sibling);
      }
    });

    if (changed) {
      commitExpandedIds(Array.from(next));
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    item: TreeViewItem<TData>,
    parentId?: string,
  ) => {
    const eventTarget = event.target as HTMLElement;

    if (eventTarget.closest('[role="treeitem"]') !== event.currentTarget) {
      return;
    }

    if (
      eventTarget.closest(
        "button, a, input, select, textarea, [contenteditable='true']",
      )
    ) {
      return;
    }

    const index = visibleItems.findIndex(
      (visibleItem) => visibleItem.id === item.id,
    );

    const inheritedDirection = event.currentTarget
      .closest("[dir]")
      ?.getAttribute("dir");

    const isRtl =
      dir === "rtl" || (dir === undefined && inheritedDirection === "rtl");

    const openKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const closeKey = isRtl ? "ArrowRight" : "ArrowLeft";
    let handled = false;

    switch (event.key) {
      case "ArrowDown":
        if (index < visibleItems.length - 1) {
          focusItem(visibleItems[index + 1].id);
        }

        handled = true;
        break;

      case "ArrowUp":
        if (index > 0) {
          focusItem(visibleItems[index - 1].id);
        }

        handled = true;
        break;

      case "Home":
        if (visibleItems[0]) {
          focusItem(visibleItems[0].id);
        }

        handled = true;
        break;

      case "End":
        if (visibleItems.length > 0) {
          focusItem(visibleItems[visibleItems.length - 1].id);
        }

        handled = true;
        break;

      case "Enter":
        if (item.href) {
          if (!item.disabled) {
            event.currentTarget
              .querySelector<HTMLAnchorElement>("a.puzzle-tree__row")
              ?.click();

            onItemActivate?.(item);
          }
        } else if (hasChildren(item)) {
          toggleExpanded(item);
          if (!item.disabled) onItemActivate?.(item);
        } else {
          selectItem(item);
          if (!item.disabled) onItemActivate?.(item);
        }

        handled = true;
        break;

      case " ":
      case "Spacebar":
        selectItem(item, true);
        handled = true;
        break;

      case "*":
        expandSiblings(item.id);
        handled = true;
        break;

      default:
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          if (!typeahead) break;

          const currentTime = event.timeStamp;
          const isExpired = currentTime - typeaheadState.current.time > 500;
          const previousValue = isExpired ? "" : typeaheadState.current.value;
          const normalizedPrevious = normalizeSearchText(previousValue);
          const normalizedKey = normalizeSearchText(event.key);

          const isRepeatedCharacter =
            normalizedPrevious.length > 0 &&
            [...normalizedPrevious].every(
              (character) => character === normalizedKey,
            );

          const searchValue = isRepeatedCharacter
            ? event.key
            : `${previousValue}${event.key}`;

          typeaheadState.current = {
            value: searchValue,
            time: currentTime,
          };

          const normalizedSearch = normalizeSearchText(searchValue);

          const orderedItems = [
            ...visibleItems.slice(index + 1),
            ...visibleItems.slice(0, index + 1),
          ];

          const match = orderedItems.find((candidate) =>
            normalizeSearchText(getTextValue(candidate)).startsWith(
              normalizedSearch,
            ),
          );

          if (match) {
            focusItem(match.id);
          }

          handled = true;
        }
    }

    if (event.key === openKey) {
      if (hasChildren(item)) {
        if (!expandedSet.has(item.id)) {
          toggleExpanded(item);
        } else {
          const firstChild = getChildren(item)[0];
          if (firstChild) focusItem(firstChild.id);
        }
      }

      handled = true;
    } else if (event.key === closeKey) {
      if (hasChildren(item) && expandedSet.has(item.id)) {
        toggleExpanded(item);
      } else if (parentId) {
        focusItem(parentId);
      }

      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  const handleItemClick = (
    event: MouseEvent<HTMLLIElement>,
    item: TreeViewItem<TData>,
  ) => {
    const target = event.target as HTMLElement;
    const targetTreeItem = target.closest('[role="treeitem"]');

    // Ignore bubbled clicks from descendants and clicks on custom interactive adornments.
    if (targetTreeItem !== event.currentTarget) return;

    if (
      target.closest(
        "button, a, input, select, textarea, [data-tree-stop-selection]",
      )
    ) {
      return;
    }

    focusItem(item.id);

    if (
      hasChildren(item) &&
      (target.closest("[data-tree-toggle]") || expandOnItemClick)
    ) {
      toggleExpanded(item);
      return;
    }

    selectItem(item);
  };

  /**
   * Handles pointer activation of a linked row.
   *
   * The row link is the navigation target, but the tree item remains the
   * roving-focus element. Clicking the expansion affordance is the exception:
   * it expands the branch and deliberately does not navigate.
   */
  const handleItemLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: TreeViewItem<TData>,
  ) => {
    const target = event.target as Element;

    if (target.closest("[data-tree-toggle]")) {
      event.preventDefault();
      event.stopPropagation();

      focusItem(item.id);
      toggleExpanded(item);
      return;
    }

    if (item.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    focusItem(item.id);
    selectItem(item);
  };

  const renderItems = (
    nodes: TreeViewItem<TData>[],
    depth = 0,
    parentId?: string,
  ): ReactNode =>
    nodes.map((item, index) => {
      const itemChildren = getChildren(item);
      const itemHasChildren = hasChildren(item);
      const expanded = itemHasChildren && expandedSet.has(item.id);
      const disabled = Boolean(item.disabled);
      const active = Boolean(getItemActive?.(item));

      const selected =
        selectionMode !== "none" &&
        selectedSet.has(item.id) &&
        item.selectable !== false &&
        !disabled;

      const loading = loadingSet.has(item.id);
      const focused = effectiveFocusedId === item.id;

      const itemState: TreeViewItemState = {
        expanded,
        selected,
        focused,
        loading,
        disabled,
        hasChildren: itemHasChildren,
      };

      const iconContent = renderIcon ? renderIcon(item, itemState) : item.icon;
      const itemId = `${generatedId}-item-${encodeURIComponent(item.id)}`;

      const selectable =
        selectionMode !== "none" && item.selectable !== false && !disabled;

      const hasLoadError = loadErrors.has(item.id);

      const rowContent = (
        <>
          {itemHasChildren ? (
            <span
              className="puzzle-tree__toggle"
              data-tree-toggle="true"
              data-expanded={expanded || undefined}
              aria-hidden="true"
            />
          ) : (
            <span className="puzzle-tree__toggle-spacer" aria-hidden="true" />
          )}

          {renderItem ? (
            renderItem(item, itemState)
          ) : (
            <>
              {iconContent != null && (
                <span className="puzzle-tree__icon" aria-hidden="true">
                  {iconContent}
                </span>
              )}

              <span className="puzzle-tree__label">
                {renderLabel ? renderLabel(item, itemState) : item.label}
              </span>

              {item.endAdornment != null && (
                <span className="puzzle-tree__adornment">
                  {item.endAdornment}
                </span>
              )}
            </>
          )}
        </>
      );

      const row =
        item.href !== undefined ? (
          <Link
            href={item.href}
            className="puzzle-tree__row"
            tabIndex={-1}
            aria-current={active ? "page" : undefined}
            aria-disabled={disabled || undefined}
            data-tree-row-link="true"
            onClick={(event) => handleItemLinkClick(event, item)}
          >
            {rowContent}
          </Link>
        ) : (
          <div className="puzzle-tree__row">{rowContent}</div>
        );

      return (
        <li
          key={item.id}
          ref={(element) => {
            if (element) {
              itemRefs.current.set(item.id, element);
            } else {
              itemRefs.current.delete(item.id);
            }
          }}
          id={itemId}
          role="treeitem"
          aria-level={depth + 1}
          aria-posinset={index + 1}
          aria-setsize={nodes.length}
          aria-expanded={itemHasChildren ? expanded : undefined}
          aria-selected={selectable ? selected : undefined}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
          tabIndex={focused ? 0 : -1}
          className={cn("puzzle-tree__item", itemClassName)}
          data-tree-item-id={item.id}
          data-active={active || undefined}
          data-selected={selected || undefined}
          data-disabled={disabled || undefined}
          data-expanded={itemHasChildren ? expanded : undefined}
          onFocus={(event) => {
            if (event.target !== event.currentTarget) return;

            if (focusedId !== item.id) {
              setFocusedId(item.id);
              onFocusedChange?.(item.id);
            }
          }}
          onClick={(event) => handleItemClick(event, item)}
          onKeyDown={(event) => handleKeyDown(event, item, parentId)}
        >
          {row}

          {itemHasChildren && expanded && (
            <ul className="puzzle-tree__group" role="group">
              {loading || hasLoadError ? (
                <li
                  role="none"
                  className={cn(
                    "puzzle-tree__status-row",
                    hasLoadError &&
                      !loading &&
                      "puzzle-tree__status-row--error",
                  )}
                >
                  <span role="status" aria-live="polite">
                    {loading ? loadingLabel : loadErrorLabel}
                  </span>
                </li>
              ) : null}

              {renderItems(itemChildren, depth + 1, item.id)}
            </ul>
          )}
        </li>
      );
    });

  const rootStyle = {
    ...style,
    ...(indentation !== undefined
      ? {
          "--puzzle-tree-indentation":
            typeof indentation === "number" ? `${indentation}px` : indentation,
        }
      : {}),
  } as CSSProperties;

  return (
    <ul
      {...rootProps}
      role="tree"
      aria-multiselectable={selectionMode === "multiple" || undefined}
      className={cn("puzzle-tree", `puzzle-tree--${size}`, className)}
      style={rootStyle}
      dir={dir}
      tabIndex={visibleItems.length === 0 ? 0 : undefined}
      onFocusCapture={() => {
        focusWithinTree.current = true;
      }}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        const target = event.target as HTMLElement;

        if (
          event.currentTarget.contains(target) &&
          ((nextTarget && !event.currentTarget.contains(nextTarget as Node)) ||
            (!nextTarget && target.isConnected))
        ) {
          focusWithinTree.current = false;
        }
      }}
    >
      {renderItems(items)}
    </ul>
  );
};

const findItemById = <TData,>(
  nodes: TreeViewItem<TData>[],
  id: string,
  getChildren: (item: TreeViewItem<TData>) => TreeViewItem<TData>[],
): TreeViewItem<TData> | undefined => {
  for (const item of nodes) {
    if (item.id === id) return item;

    const found = findItemById(getChildren(item), id, getChildren);
    if (found) return found;
  }

  return undefined;
};

export {
  TreeView,
  type TreeViewProps,
  type TreeViewItem,
  type TreeViewItemState,
  type TreeViewSelectionMode,
  type TreeViewSize,
};
