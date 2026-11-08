import type { MutableRefObject, Ref } from "react";

export type MenuItemLike = {
  disabled?: boolean;
  text?: string;
};

const normalizeMenuText = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleLowerCase();

const findNextMenuItemIndex = <T extends MenuItemLike>(
  items: readonly T[],
  currentIndex: number,
  direction: -1 | 1,
  loop = true,
): number => {
  if (items.length === 0) {
    return -1;
  }

  for (let step = 1; step <= items.length; step += 1) {
    let index = currentIndex + step * direction;

    if (loop) {
      index = (index + items.length) % items.length;
    } else if (index < 0 || index >= items.length) {
      return -1;
    }

    if (!items[index].disabled) {
      return index;
    }
  }

  return -1;
};

const findMenuItemIndexByText = <T extends MenuItemLike>(
  items: readonly T[],
  query: string,
  currentIndex = -1,
): number => {
  const normalizedQuery = normalizeMenuText(query);

  if (!normalizedQuery || items.length === 0) {
    return -1;
  }

  for (let step = 1; step <= items.length; step += 1) {
    const index = (currentIndex + step + items.length) % items.length;
    const item = items[index];

    if (
      !item.disabled &&
      normalizeMenuText(item.text ?? "").startsWith(normalizedQuery)
    ) {
      return index;
    }
  }

  return -1;
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as MutableRefObject<T | null>).current = value;
  }
};

const getEnabledMenuItems = (menu: HTMLElement): HTMLElement[] =>
  Array.from(
    menu.querySelectorAll<HTMLElement>(
      '[data-puzzle-dropdown-menu-item="true"]',
    ),
  ).filter(
    (item) =>
      item.getAttribute("aria-disabled") !== "true" &&
      !("disabled" in item && Boolean((item as HTMLButtonElement).disabled)) &&
      !item.hasAttribute("hidden") &&
      !item.closest("[hidden], [inert], [aria-hidden='true']"),
  );

const focusElement = (element: HTMLElement | undefined): void => {
  if (!element) {
    return;
  }

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }

  element.scrollIntoView?.({ block: "nearest" });
};

export {
  findMenuItemIndexByText,
  findNextMenuItemIndex,
  focusElement,
  getEnabledMenuItems,
  normalizeMenuText,
  setRef,
};
