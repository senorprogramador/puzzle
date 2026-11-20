"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefCallback,
} from "react";

export type RovingFocusOrientation = "horizontal" | "vertical" | "both";

export type RovingFocusItem = {
  id: string;
  disabled?: boolean;
};

export type UseRovingFocusOptions = {
  items: readonly RovingFocusItem[];
  orientation?: RovingFocusOrientation;
  dir?: "ltr" | "rtl";
  loop?: boolean;
  initialActiveId?: string;
};

export type UseRovingFocusReturn<T extends HTMLElement> = {
  activeId: string | undefined;
  getItemRef: (id: string) => RefCallback<T>;
  getItemTabIndex: (id: string, disabled?: boolean) => 0 | -1;
  focusItem: (id: string) => void;
  onItemFocus: (id: string) => void;
  onItemKeyDown: (event: KeyboardEvent<T>, id: string) => void;
};

const useRovingFocus = <T extends HTMLElement>({
  items,
  orientation = "horizontal",
  dir = "ltr",
  loop = true,
  initialActiveId,
}: UseRovingFocusOptions): UseRovingFocusReturn<T> => {
  const itemRefs = useRef(new Map<string, T>());
  const callbackRefs = useRef(new Map<string, RefCallback<T>>());
  const itemsRef = useRef(items);

  itemsRef.current = items;

  const [activeId, setActiveId] = useState<string | undefined>(() => {
    const initialItem = items.find(
      (item) => item.id === initialActiveId && !item.disabled,
    );

    return initialItem?.id ?? items.find((item) => !item.disabled)?.id;
  });

  const resolvedActiveId =
    items.find((item) => item.id === activeId && !item.disabled)?.id ??
    items.find((item) => !item.disabled)?.id;

  useEffect(() => {
    if (activeId !== resolvedActiveId) {
      setActiveId(resolvedActiveId);
    }
  }, [activeId, resolvedActiveId]);

  const getItemRef = useCallback((id: string): RefCallback<T> => {
    const existingCallback = callbackRefs.current.get(id);

    if (existingCallback) {
      return existingCallback;
    }

    const callback: RefCallback<T> = (node) => {
      if (node) {
        itemRefs.current.set(id, node);
        return;
      }

      itemRefs.current.delete(id);

      if (callbackRefs.current.get(id) === callback) {
        callbackRefs.current.delete(id);
      }
    };

    callbackRefs.current.set(id, callback);

    return callback;
  }, []);

  const focusItem = useCallback((id: string) => {
    const item = itemsRef.current.find(
      (candidate) => candidate.id === id && !candidate.disabled,
    );
    const element = itemRefs.current.get(id);

    if (!item || !element) {
      return;
    }

    setActiveId(id);
    element.focus();
  }, []);

  const getItemTabIndex = useCallback(
    (id: string, disabled = false): 0 | -1 => {
      if (disabled || resolvedActiveId === undefined) {
        return -1;
      }

      return id === resolvedActiveId ? 0 : -1;
    },
    [resolvedActiveId],
  );

  const onItemFocus = useCallback((id: string) => {
    const item = itemsRef.current.find(
      (candidate) => candidate.id === id && !candidate.disabled,
    );

    if (item) {
      setActiveId(id);
    }
  }, []);

  const onItemKeyDown = useCallback(
    (event: KeyboardEvent<T>, id: string) => {
      if (event.defaultPrevented) {
        return;
      }

      const enabledItems = itemsRef.current.filter((item) => !item.disabled);

      if (enabledItems.length === 0) {
        return;
      }

      const currentIndex = enabledItems.findIndex((item) => item.id === id);

      if (currentIndex === -1) {
        return;
      }

      let nextIndex: number | undefined;
      let direction: number | undefined;

      switch (event.key) {
        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = enabledItems.length - 1;
          break;

        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            direction = dir === "rtl" ? -1 : 1;
          }
          break;

        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            direction = dir === "rtl" ? 1 : -1;
          }
          break;

        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            direction = 1;
          }
          break;

        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            direction = -1;
          }
          break;
      }

      if (direction !== undefined) {
        const candidateIndex = currentIndex + direction;

        nextIndex = loop
          ? (candidateIndex + enabledItems.length) % enabledItems.length
          : Math.min(Math.max(candidateIndex, 0), enabledItems.length - 1);
      }

      if (nextIndex === undefined) {
        return;
      }

      const nextItem = enabledItems[nextIndex];

      if (!nextItem) {
        return;
      }

      event.preventDefault();
      focusItem(nextItem.id);
    },
    [dir, focusItem, loop, orientation],
  );

  return {
    activeId: resolvedActiveId,
    getItemRef,
    getItemTabIndex,
    focusItem,
    onItemFocus,
    onItemKeyDown,
  };
};

export { useRovingFocus };
