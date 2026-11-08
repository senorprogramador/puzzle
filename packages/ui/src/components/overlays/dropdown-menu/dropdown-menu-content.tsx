"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

import { cn } from "@puzzle/core";

import { useDropdownMenuContext } from "./dropdown-menu.context";
import {
  findMenuItemIndexByText,
  findNextMenuItemIndex,
  focusElement,
  getEnabledMenuItems,
} from "./dropdown-menu.utils";

import type { DropdownMenuContentProps } from "./dropdown-menu.types";

const DropdownMenuContent = ({
  children,
  id,
  className,
  style,
  maxHeight = "min(24rem, calc(100dvh - 2rem))",
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...contentProps
}: DropdownMenuContentProps) => {
  const context = useDropdownMenuContext();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    typeaheadRef.current = "";

    if (typeaheadTimerRef.current !== null) {
      clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = null;
    }

    if (!context.open) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const items = getEnabledMenuItems(menu);
    const target =
      context.focusPositionRef.current === "last"
        ? items[items.length - 1]
        : items[0];

    focusElement(target ?? menu);
  }, [context.open, context.focusPositionRef]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current !== null) {
        clearTimeout(typeaheadTimerRef.current);
      }
    },
    [],
  );

  const focusIndex = (items: HTMLElement[], index: number) => {
    if (index >= 0 && index < items.length) {
      focusElement(items[index]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    if (event.key === "Tab") {
      const ownerDocument = event.currentTarget.ownerDocument;
      const trigger = context.triggerRef.current;
      const tabbableSelector = [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        "input:not([disabled]):not([type='hidden'])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "iframe",
        "object",
        "embed",
        "summary",
        "audio[controls]",
        "video[controls]",
        "[contenteditable='true']",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");
      const tabbableElements = Array.from(
        ownerDocument.querySelectorAll<HTMLElement>(tabbableSelector),
      ).filter((element) => {
        if (
          element === menu ||
          menu.contains(element) ||
          element.hidden ||
          element.tabIndex < 0 ||
          element.getAttribute("aria-disabled") === "true" ||
          element.closest("[hidden], [inert], [aria-hidden='true']")
        ) {
          return false;
        }

        const computedStyle = ownerDocument.defaultView?.getComputedStyle(
          element,
        );

        return (
          computedStyle?.display !== "none" &&
          computedStyle?.visibility !== "hidden"
        );
      });
      const triggerIndex = trigger ? tabbableElements.indexOf(trigger) : -1;
      const direction = event.shiftKey ? -1 : 1;
      const targetIndex = triggerIndex + direction;
      const target =
        triggerIndex >= 0 && tabbableElements.length > 0
          ? tabbableElements[
              (targetIndex + tabbableElements.length) % tabbableElements.length
            ]
          : undefined;

      context.changeOpen(false);

      if (target) {
        event.preventDefault();
        focusElement(target);
      }

      return;
    }

    const items = getEnabledMenuItems(menu);
    const activeIndex = items.indexOf(
      menu.ownerDocument.activeElement as HTMLElement,
    );

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const startIndex =
        activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;
      const nextIndex = findNextMenuItemIndex(
        items.map(() => ({ disabled: false })),
        startIndex,
        direction,
      );
      focusIndex(items, nextIndex);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusIndex(items, event.key === "Home" ? 0 : items.length - 1);
      return;
    }

    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const nextBuffer = `${typeaheadRef.current}${event.key}`;
    const repeatedCharacter = [...nextBuffer].every(
      (character) =>
        character.toLocaleLowerCase() === nextBuffer[0].toLocaleLowerCase(),
    );
    const query = repeatedCharacter ? event.key : nextBuffer;
    typeaheadRef.current = query;

    if (typeaheadTimerRef.current !== null) {
      clearTimeout(typeaheadTimerRef.current);
    }

    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadRef.current = "";
      typeaheadTimerRef.current = null;
    }, 500);

    const nextIndex = findMenuItemIndexByText(
      items.map((item) => ({
        text:
          item.dataset.textValue ??
          item.querySelector(".puzzle-dropdown-menu__item-label")?.textContent ??
          item.textContent ??
          "",
      })),
      query,
      activeIndex,
    );

    focusIndex(items, nextIndex);
  };

  return (
    <div
      {...contentProps}
      ref={menuRef}
      id={id ?? context.contentId}
      className={cn("puzzle-dropdown-menu__content", className)}
      role="menu"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabel ? undefined : (ariaLabelledBy ?? context.triggerId)
      }
      tabIndex={-1}
      data-state={context.open ? "open" : "closed"}
      style={{ ...style, maxHeight }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

export { DropdownMenuContent };
