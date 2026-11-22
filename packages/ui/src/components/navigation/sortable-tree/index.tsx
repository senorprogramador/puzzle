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
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import "./sortable-tree.css";

type SortableTreeSelectionMode = "none" | "single" | "multiple";
type SortableTreeSize = "sm" | "md";
type SortableTreeDropPosition = "before" | "inside" | "after";

type SortableTreeItem<TData = unknown> = {
  id: string;
  label: ReactNode;
  textValue?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  actions?: ReactNode;
  children?: SortableTreeItem<TData>[];
  disabled?: boolean;
  selectable?: boolean;
  data?: TData;
};

type SortableTreeItemState = {
  expanded: boolean;
  selected: boolean;
  focused: boolean;
  dragging: boolean;
  dropTarget: boolean;
  canDrop: boolean;
  disabled: boolean;
  hasChildren: boolean;
  depth: number;
};

type SortableTreeMove = {
  id: string;
  targetId?: string;
  parentId: string | null;
  index: number;
  position: SortableTreeDropPosition;
};

type SortableTreeProps<TData = unknown> = Omit<
  ComponentPropsWithRef<"ul">,
  | "children"
  | "onKeyDown"
  | "onClick"
  | "onFocusCapture"
  | "onBlurCapture"
  | "onDragOver"
  | "onDrop"
  | "onDragStart"
  | "onDragEnd"
> &
  (
    | { "aria-label": string; "aria-labelledby"?: string }
    | { "aria-labelledby": string; "aria-label"?: string }
  ) & {
    items: SortableTreeItem<TData>[];
    onMove?: (move: SortableTreeMove) => void;
    onItemsChange?: (items: SortableTreeItem<TData>[]) => void;
    onReorder?: (move: SortableTreeMove) => void;
    maxDepth?: number;
    canMove?: (move: SortableTreeMove) => boolean;
    selectionMode?: SortableTreeSelectionMode;
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    onExpandedChange?: (ids: string[]) => void;
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    defaultFocusedId?: string;
    onFocusedChange?: (id: string) => void;
    onItemActivate?: (item: SortableTreeItem<TData>) => void;
    renderItem?: (
      item: SortableTreeItem<TData>,
      state: SortableTreeItemState,
    ) => ReactNode;
    renderIcon?: (
      item: SortableTreeItem<TData>,
      state: SortableTreeItemState,
    ) => ReactNode;
    renderLabel?: (
      item: SortableTreeItem<TData>,
      state: SortableTreeItemState,
    ) => ReactNode;
    renderActions?: (
      item: SortableTreeItem<TData>,
      state: SortableTreeItemState,
    ) => ReactNode;
    expandOnItemClick?: boolean;
    size?: SortableTreeSize;
    indentation?: string | number;
    dragHandleLabel?: (item: SortableTreeItem<TData>) => string;
    keyboardInstructions?: string;
    invalidMoveLabel?: string;
    moveAnnouncement?: (item: SortableTreeItem<TData>, move: SortableTreeMove) => string;
    dropAnnouncement?: (item: SortableTreeItem<TData>, move: SortableTreeMove) => string;
    itemClassName?: string;
  };

type FlatNode<TData> = {
  item: SortableTreeItem<TData>;
  depth: number;
  parentId: string | null;
  index: number;
};

type DragState = {
  id: string;
  mode: "keyboard" | "pointer" | "native";
  pointerId?: number;
  move?: SortableTreeMove;
};

const normalizeIds = (ids: string[] | undefined) =>
  Array.from(new Set((ids ?? []).filter((id) => id.length > 0)));

const textValue = <TData,>(item: SortableTreeItem<TData>) =>
  item.textValue ?? (typeof item.label === "string" || typeof item.label === "number"
    ? String(item.label)
    : item.id);

const itemById = <TData,>(
  nodes: SortableTreeItem<TData>[],
  id: string,
): SortableTreeItem<TData> | undefined => {
  for (const item of nodes) {
    if (item.id === id) return item;
    const found = itemById(item.children ?? [], id);
    if (found) return found;
  }
  return undefined;
};

const flatten = <TData,>(
  nodes: SortableTreeItem<TData>[],
  expanded: Set<string>,
  result: FlatNode<TData>[] = [],
  depth = 1,
  parentId: string | null = null,
) => {
  nodes.forEach((item, index) => {
    result.push({ item, depth, parentId, index });
    if (expanded.has(item.id) && item.children?.length) {
      flatten(item.children, expanded, result, depth + 1, item.id);
    }
  });
  return result;
};

const flattenAll = <TData,>(
  nodes: SortableTreeItem<TData>[],
  result: FlatNode<TData>[] = [],
  depth = 1,
  parentId: string | null = null,
) => {
  nodes.forEach((item, index) => {
    result.push({ item, depth, parentId, index });
    flattenAll(item.children ?? [], result, depth + 1, item.id);
  });
  return result;
};

const containsId = <TData,>(
  item: SortableTreeItem<TData>,
  id: string,
): boolean =>
  item.children?.some((child) => child.id === id || containsId(child, id)) ??
  false;

const treeDepth = <TData,>(item: SortableTreeItem<TData>): number =>
  1 + Math.max(0, ...(item.children ?? []).map(treeDepth));

const removeNode = <TData,>(
  nodes: SortableTreeItem<TData>[],
  id: string,
): { node?: SortableTreeItem<TData>; nodes: SortableTreeItem<TData>[] } => {
  const directIndex = nodes.findIndex((item) => item.id === id);
  if (directIndex !== -1) {
    const node = nodes[directIndex];
    return {
      node,
      nodes: nodes.filter((_, index) => index !== directIndex),
    };
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const item = nodes[index]!;
    const result = removeNode(item.children ?? [], id);
    if (result.node) {
      const next = [...nodes];
      next[index] = { ...item, children: result.nodes };
      return { node: result.node, nodes: next };
    }
  }

  return { nodes };
};

const insertNode = <TData,>(
  nodes: SortableTreeItem<TData>[],
  node: SortableTreeItem<TData>,
  parentId: string | null,
  index: number,
): SortableTreeItem<TData>[] => {
  if (parentId === null) {
    const next = [...nodes];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, node);
    return next;
  }

  return nodes.map((item) =>
    item.id === parentId
      ? {
          ...item,
          children: [
            ...(item.children ?? []).slice(0, Math.max(0, index)),
            node,
            ...(item.children ?? []).slice(Math.max(0, index)),
          ],
        }
      : item.children
        ? { ...item, children: insertNode(item.children, node, parentId, index) }
        : item,
  );
};

const applyMove = <TData,>(
  items: SortableTreeItem<TData>[],
  move: SortableTreeMove,
): SortableTreeItem<TData>[] => {
  const removed = removeNode(items, move.id);
  if (!removed.node) return items;
  const source = flattenAll(items).find(({ item }) => item.id === move.id);
  const sourceWasBeforeTarget =
    source?.parentId === move.parentId &&
    source.index < move.index &&
    move.position !== "inside";
  const index = sourceWasBeforeTarget ? move.index - 1 : move.index;
  return insertNode(removed.nodes, removed.node, move.parentId, index);
};

const SortableTree = <TData,>({
  items,
  onMove,
  onItemsChange,
  onReorder,
  maxDepth,
  canMove,
  selectionMode = "single",
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  defaultFocusedId,
  onFocusedChange,
  onItemActivate,
  renderItem,
  renderIcon,
  renderLabel,
  renderActions,
  expandOnItemClick = true,
  size = "md",
  indentation,
  dragHandleLabel = (item) => `Drag ${textValue(item)}`,
  keyboardInstructions = "Press Space to lift an item. Use the arrow keys to move it, Space to drop, or Escape to cancel.",
  invalidMoveLabel = "That item cannot be moved there.",
  moveAnnouncement = (item, move) =>
    `${textValue(item)} moved ${move.position} ${move.targetId ? textValue(itemById(items, move.targetId) ?? item) : "the root"}.`,
  dropAnnouncement = (item) => `${textValue(item)} dropped.`,
  itemClassName,
  className,
  style,
  ...rootProps
}: SortableTreeProps<TData>) => {
  const generatedId = useId();
  const instructionsId = `${generatedId}-instructions`;
  const isExpandedControlled = expandedIds !== undefined;
  const isSelectedControlled = selectedIds !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(() =>
    normalizeIds(defaultExpandedIds),
  );
  const [uncontrolledSelected, setUncontrolledSelected] = useState(() =>
    normalizeIds(defaultSelectedIds),
  );
  const [focusedId, setFocusedId] = useState(
    () => defaultFocusedId ?? normalizeIds(selectedIds ?? defaultSelectedIds)[0] ?? items[0]?.id,
  );
  const [drag, setDrag] = useState<DragState>();
  const [announcement, setAnnouncement] = useState("");
  const pointerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  const currentExpanded = isExpandedControlled ? expandedIds! : uncontrolledExpanded;
  const currentSelected = isSelectedControlled ? selectedIds! : uncontrolledSelected;
  const expandedSet = useMemo(() => new Set(normalizeIds(currentExpanded)), [currentExpanded]);
  const selectedSet = useMemo(() => new Set(normalizeIds(currentSelected)), [currentSelected]);
  const visible = useMemo(() => flatten(items, expandedSet), [items, expandedSet]);
  const visibleIds = useMemo(() => new Set(visible.map(({ item }) => item.id)), [visible]);
  const effectiveFocusedId = visibleIds.has(focusedId ?? "") ? focusedId : visible[0]?.item.id;

  useEffect(() => {
    if (effectiveFocusedId && effectiveFocusedId !== focusedId) {
      setFocusedId(effectiveFocusedId);
      onFocusedChange?.(effectiveFocusedId);
    }
  }, [effectiveFocusedId, focusedId, onFocusedChange]);

  useEffect(
    () => () => {
      if (pointerTimer.current) clearTimeout(pointerTimer.current);
    },
    [],
  );

  const focusItem = useCallback(
    (id: string) => {
      setFocusedId(id);
      onFocusedChange?.(id);
      itemRefs.current.get(id)?.focus();
    },
    [onFocusedChange],
  );

  const commitExpanded = (next: string[]) => {
    const value = normalizeIds(next);
    if (!isExpandedControlled) setUncontrolledExpanded(value);
    onExpandedChange?.(value);
  };

  const commitSelected = (next: string[]) => {
    const value = normalizeIds(next);
    if (!isSelectedControlled) setUncontrolledSelected(value);
    onSelectionChange?.(value);
  };

  const toggleExpanded = (item: SortableTreeItem<TData>) => {
    if (!item.children?.length) return;
    const next = new Set(currentExpanded);
    if (next.has(item.id)) next.delete(item.id);
    else next.add(item.id);
    commitExpanded([...next]);
  };

  const selectItem = (item: SortableTreeItem<TData>, toggle = false) => {
    if (selectionMode === "none" || item.disabled || item.selectable === false) return;
    if (selectionMode === "single") {
      commitSelected(toggle && selectedSet.has(item.id) ? [] : [item.id]);
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(item.id)) next.delete(item.id);
    else next.add(item.id);
    commitSelected([...next]);
  };

  const makeMove = useCallback(
    (id: string, targetId: string, position: SortableTreeDropPosition): SortableTreeMove | undefined => {
      const allNodes = flattenAll(items);
      const source = visible.find(({ item }) => item.id === id) ?? allNodes.find(({ item }) => item.id === id);
      const target = visible.find(({ item }) => item.id === targetId) ?? allNodes.find(({ item }) => item.id === targetId);
      if (!source || !target || id === targetId) return;
      const targetItem = target.item;
      if (containsId(source.item, targetId) || targetItem.disabled) return;
      const parentId = position === "inside" ? targetId : target.parentId;
      const index =
        position === "inside"
          ? targetItem.children?.length ?? 0
          : target.index + (position === "after" ? 1 : 0);
      const move = { id, targetId, parentId, index, position };
      const destinationDepth =
        position === "inside" ? target.depth + treeDepth(source.item) : target.depth - 1 + treeDepth(source.item);
      if (maxDepth !== undefined && destinationDepth > maxDepth) return;
      if (canMove && !canMove(move)) return;
      return move;
    },
    [canMove, items, maxDepth, visible],
  );

  const commitMove = (move: SortableTreeMove | undefined) => {
    if (!move) {
      setAnnouncement(invalidMoveLabel);
      return;
    }
    const item = itemById(items, move.id);
    if (!item) return;
    onMove?.(move);
    onReorder?.(move);
    onItemsChange?.(applyMove(items, move));
    setAnnouncement(dropAnnouncement(item, move));
    setDrag(undefined);
  };

  const startDrag = (item: SortableTreeItem<TData>, mode: DragState["mode"], pointerId?: number) => {
    if (item.disabled) return;
    setDrag({ id: item.id, mode, pointerId });
    setAnnouncement(`${textValue(item)} lifted. ${keyboardInstructions}`);
  };

  const positionFromEvent = (event: DragEvent<HTMLLIElement> | PointerEvent<HTMLElement>, target: FlatNode<TData>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const position: SortableTreeDropPosition =
      offset < rect.height * 0.25 ? "before" : offset > rect.height * 0.75 ? "after" : "inside";
    return makeMove(drag?.id ?? "", target.item.id, position);
  };

  const updatePointerTarget = (event: PointerEvent<HTMLElement>) => {
    if (!drag || drag.mode !== "pointer" || drag.pointerId !== event.pointerId) return;
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-sortable-tree-item-id]");
    const id = element?.dataset.sortableTreeItemId;
    const target = id ? visible.find((entry) => entry.item.id === id) : undefined;
    if (!target) return;
    const move = positionFromEvent({ ...event, currentTarget: element! } as PointerEvent<HTMLElement>, target);
    setDrag((current) => (current ? { ...current, move } : current));
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, item: SortableTreeItem<TData>) => {
    if (item.disabled || (event.pointerType !== "touch" && event.pointerType !== "pen")) return;
    pointerTimer.current = setTimeout(() => {
      startDrag(item, "pointer", event.pointerId);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }, 180);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (pointerTimer.current) clearTimeout(pointerTimer.current);
    if (drag?.mode === "pointer" && drag.pointerId === event.pointerId) commitMove(drag.move);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, node: FlatNode<TData>) => {
    const item = node.item;
    if ((event.target as HTMLElement).closest("button, a, input, select, textarea, [data-sortable-tree-stop]")) return;
    const index = visible.findIndex(({ item: candidate }) => candidate.id === item.id);
    const rtl = rootProps.dir === "rtl";
    if (drag?.id === item.id) {
      if (event.key === "Escape") {
        setDrag(undefined);
        setAnnouncement(`${textValue(item)} movement cancelled.`);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        commitMove(drag.move);
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = index + (event.key === "ArrowDown" ? 1 : -1);
        const target = visible[nextIndex];
        if (target) {
          const move = makeMove(item.id, target.item.id, event.key === "ArrowDown" ? "after" : "before");
          setDrag((current) => (current ? { ...current, move } : current));
          if (move) setAnnouncement(moveAnnouncement(item, move));
          else setAnnouncement(invalidMoveLabel);
        }
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const direction = rtl ? (event.key === "ArrowLeft" ? "inside" : "before") : event.key === "ArrowRight" ? "inside" : "before";
        const target = visible[index + (direction === "inside" ? -1 : 1)];
        if (target) {
          const move = makeMove(item.id, target.item.id, direction === "inside" ? "inside" : "before");
          setDrag((current) => (current ? { ...current, move } : current));
          setAnnouncement(move ? moveAnnouncement(item, move) : invalidMoveLabel);
        }
      }
      return;
    }

    switch (event.key) {
      case " ":
        event.preventDefault();
        startDrag(item, "keyboard");
        return;
      case "ArrowDown":
        if (visible[index + 1]) focusItem(visible[index + 1]!.item.id);
        event.preventDefault();
        return;
      case "ArrowUp":
        if (visible[index - 1]) focusItem(visible[index - 1]!.item.id);
        event.preventDefault();
        return;
      case "ArrowRight":
      case "ArrowLeft": {
        const open = rtl ? event.key === "ArrowLeft" : event.key === "ArrowRight";
        if (item.children?.length && open) toggleExpanded(item);
        else if (item.children?.length && !open && expandedSet.has(item.id)) toggleExpanded(item);
        else if (!open && node.parentId) focusItem(node.parentId);
        event.preventDefault();
        return;
      }
      case "Enter":
        onItemActivate?.(item);
        if (item.children?.length) toggleExpanded(item);
        else selectItem(item);
        event.preventDefault();
    }
  };

  const renderNodes = (nodes: SortableTreeItem<TData>[], depth = 1, parentId: string | null = null): ReactNode =>
    nodes.map((item, index) => {
      const node = visible.find(({ item: candidate }) => candidate.id === item.id) ?? { item, depth, parentId, index };
      const expanded = Boolean(item.children?.length && expandedSet.has(item.id));
      const selected = selectionMode !== "none" && selectedSet.has(item.id) && !item.disabled && item.selectable !== false;
      const dragging = drag?.id === item.id;
      const dropTarget = drag?.move?.targetId === item.id;
      const canDrop = dropTarget && drag?.move !== undefined;
      const state: SortableTreeItemState = {
        expanded,
        selected,
        focused: effectiveFocusedId === item.id,
        dragging,
        dropTarget,
        canDrop,
        disabled: Boolean(item.disabled),
        hasChildren: Boolean(item.children?.length),
        depth,
      };
      const content = renderItem ? renderItem(item, state) : (
        <>
          {renderIcon?.(item, state) ?? (item.icon ? <span className="puzzle-sortable-tree__icon" aria-hidden="true">{item.icon}</span> : null)}
          <span className="puzzle-sortable-tree__label">{renderLabel?.(item, state) ?? item.label}</span>
          {item.endAdornment}
        </>
      );
      const actions = renderActions?.(item, state) ?? item.actions;
      return (
        <li
          key={item.id}
          ref={(element) => {
            if (element) itemRefs.current.set(item.id, element);
            else itemRefs.current.delete(item.id);
          }}
          role="treeitem"
          aria-level={depth}
          aria-posinset={index + 1}
          aria-setsize={nodes.length}
          aria-expanded={item.children?.length ? expanded : undefined}
          aria-selected={selectionMode !== "none" ? selected : undefined}
          aria-disabled={item.disabled || undefined}
          aria-grabbed={dragging || undefined}
          tabIndex={effectiveFocusedId === item.id ? 0 : -1}
          className={cn("puzzle-sortable-tree__item", itemClassName)}
          data-sortable-tree-item-id={item.id}
          data-dragging={dragging || undefined}
          data-drop-target={dropTarget || undefined}
          data-drop-position={dropTarget ? drag?.move?.position : undefined}
          onFocus={(event) => {
            if (event.target !== event.currentTarget) return;
            focusItem(item.id);
          }}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("button, a, input, select, textarea, [data-sortable-tree-stop]")) return;
            focusItem(item.id);
            if (item.children?.length && expandOnItemClick) toggleExpanded(item);
            else selectItem(item);
          }}
          onKeyDown={(event) => handleKeyDown(event, node)}
          onDragOver={(event) => {
            if (!drag) return;
            event.preventDefault();
            const move = positionFromEvent(event, node);
            setDrag((current) => (current ? { ...current, move } : current));
          }}
          onDrop={(event) => {
            event.preventDefault();
            commitMove(positionFromEvent(event, node));
          }}
        >
          <div className="puzzle-sortable-tree__row">
            <button
              type="button"
              className="puzzle-sortable-tree__handle"
              aria-label={dragHandleLabel(item)}
              aria-describedby={instructionsId}
              disabled={item.disabled}
              draggable={!item.disabled}
              data-sortable-tree-handle
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => handlePointerDown(event, item)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  if (drag?.id === item.id) commitMove(drag.move);
                  else startDrag(item, "keyboard");
                }
              }}
              onDragStart={(event) => {
                event.stopPropagation();
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", item.id);
                startDrag(item, "native");
              }}
              onDragEnd={() => setDrag(undefined)}
            >
              <span aria-hidden="true">⋮⋮</span>
            </button>
            {item.children?.length ? (
              <button
                type="button"
                className="puzzle-sortable-tree__toggle"
                aria-label={expanded ? `Collapse ${textValue(item)}` : `Expand ${textValue(item)}`}
                aria-expanded={expanded}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleExpanded(item);
                }}
              >
                <span aria-hidden="true" />
              </button>
            ) : <span className="puzzle-sortable-tree__toggle-spacer" aria-hidden="true" />}
            <div className="puzzle-sortable-tree__content">{content}</div>
            {actions ? <div className="puzzle-sortable-tree__actions" data-sortable-tree-stop>{actions}</div> : null}
          </div>
          {expanded ? (
            <ul role="group" className="puzzle-sortable-tree__group">
              {renderNodes(item.children!, depth + 1, item.id)}
            </ul>
          ) : null}
        </li>
      );
    });

  const rootStyle = {
    ...style,
    ...(indentation !== undefined
      ? { "--puzzle-sortable-tree-indentation": typeof indentation === "number" ? `${indentation}px` : indentation }
      : {}),
  } as CSSProperties;

  return (
    <div className="puzzle-sortable-tree">
      <ul
        {...rootProps}
        role="tree"
        aria-multiselectable={selectionMode === "multiple" || undefined}
        aria-describedby={instructionsId}
        className={cn("puzzle-sortable-tree__root", `puzzle-sortable-tree--${size}`, className)}
        style={rootStyle}
        tabIndex={visible.length ? undefined : 0}
        onPointerMove={updatePointerTarget}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {renderNodes(items)}
      </ul>
      <span id={instructionsId} className="puzzle-sortable-tree__visually-hidden">{keyboardInstructions}</span>
      <span className="puzzle-sortable-tree__visually-hidden" role="status" aria-live="polite">{announcement}</span>
    </div>
  );
};

export {
  SortableTree,
  type SortableTreeProps,
  type SortableTreeItem,
  type SortableTreeItemState,
  type SortableTreeMove,
  type SortableTreeDropPosition,
  type SortableTreeSelectionMode,
  type SortableTreeSize,
};
