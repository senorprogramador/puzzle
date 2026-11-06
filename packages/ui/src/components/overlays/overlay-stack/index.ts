import {
  createContext,
  createElement,
  useContext,
  type PropsWithChildren,
} from "react";

type OverlayRegistrationOptions = {
  modal?: boolean;
  getContent?: () => HTMLElement | null;
  getLayer?: () => HTMLElement | null;
};

type OverlayEntry = {
  onEscape: () => void;
  priority: number;
  order: number;
  modal: boolean;
  getContent?: () => HTMLElement | null;
  getLayer?: () => HTMLElement | null;
  previousFocus: HTMLElement | null;
  lastFocused: HTMLElement | null;
};

type InertSnapshot = {
  inert: boolean;
  ariaHidden: string | null;
};

type OverlayStack = {
  entries: OverlayEntry[];
  nextOrder: number;
  inertSnapshots: Map<HTMLElement, InertSnapshot>;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleFocusIn: (event: FocusEvent) => void;
  syncIsolation: () => void;
};

type OverlayRegistration = (() => void) & {
  isTop: () => boolean;
};

type OverlayStackProviderProps = PropsWithChildren<{
  priority: number;
}>;

const OverlayPriorityContext = createContext(0);

const overlayStacks = new WeakMap<Document, OverlayStack>();

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const focusElement = (element: HTMLElement | null) => {
  if (!element?.isConnected) {
    return;
  }

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
};

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    if (
      element.hidden ||
      element.closest("[hidden], [inert], [aria-hidden='true']") ||
      element.getAttribute("aria-disabled") === "true"
    ) {
      return false;
    }

    const style = element.ownerDocument.defaultView?.getComputedStyle(element);

    return style?.display !== "none" && style?.visibility !== "hidden";
  });
};

const getTopOverlay = (entries: OverlayEntry[]) => {
  return entries.reduce<OverlayEntry | undefined>((top, entry) => {
    if (
      !top ||
      entry.priority > top.priority ||
      (entry.priority === top.priority && entry.order > top.order)
    ) {
      return entry;
    }

    return top;
  }, undefined);
};

const focusInitial = (entry: OverlayEntry) => {
  const content = entry.getContent?.();

  if (!content) {
    return;
  }

  const autofocus = content.querySelector<HTMLElement>("[autofocus]");

  const focusable = getFocusableElements(content);

  const target = autofocus ?? focusable[0] ?? content;

  if (target === content && !content.hasAttribute("tabindex")) {
    content.setAttribute("tabindex", "-1");
  }

  focusElement(target);
};

const restoreInertSnapshots = (stack: OverlayStack) => {
  for (const [element, snapshot] of stack.inertSnapshots) {
    element.inert = snapshot.inert;

    if (snapshot.ariaHidden === null) {
      element.removeAttribute("aria-hidden");
    } else {
      element.setAttribute("aria-hidden", snapshot.ariaHidden);
    }
  }

  stack.inertSnapshots.clear();
};

const getBodyBranch = (
  element: HTMLElement,
  body: HTMLElement,
): HTMLElement | null => {
  let current: HTMLElement | null = element;

  while (current?.parentElement && current.parentElement !== body) {
    current = current.parentElement;
  }

  return current?.parentElement === body ? current : null;
};

const syncModalIsolation = (stack: OverlayStack) => {
  restoreInertSnapshots(stack);

  const top = getTopOverlay(stack.entries);

  // A non-modal overlay above a modal must remain interactive.
  if (!top?.modal) {
    return;
  }

  const content = top.getContent?.();
  const layer = top.getLayer?.() ?? content;

  if (!content || !layer) {
    return;
  }

  const body = content.ownerDocument.body;
  const activeBranch = getBodyBranch(layer, body);

  if (!activeBranch) {
    return;
  }

  for (const child of Array.from(body.children)) {
    if (!(child instanceof content.ownerDocument.defaultView!.HTMLElement)) {
      continue;
    }

    if (child === activeBranch || child.contains(activeBranch)) {
      continue;
    }

    stack.inertSnapshots.set(child, {
      inert: child.inert,
      ariaHidden: child.getAttribute("aria-hidden"),
    });

    child.inert = true;
    child.setAttribute("aria-hidden", "true");
  }
};

const createOverlayStack = (ownerDocument: Document): OverlayStack => {
  const stack: OverlayStack = {
    entries: [],
    nextOrder: 0,
    inertSnapshots: new Map(),

    syncIsolation: () => {
      syncModalIsolation(stack);
    },

    handleKeyDown: (event) => {
      const top = getTopOverlay(stack.entries);

      if (!top) {
        return;
      }

      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        event.stopPropagation();

        top.onEscape();
        return;
      }

      // Only the topmost modal controls Tab navigation.
      if (event.key !== "Tab" || !top.modal) {
        return;
      }

      const content = top.getContent?.();

      if (!content) {
        return;
      }

      const focusable = getFocusableElements(content);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = ownerDocument.activeElement;

      if (!first || !last) {
        event.preventDefault();
        focusElement(content);
        return;
      }

      if (event.shiftKey) {
        if (active === first || !content.contains(active)) {
          event.preventDefault();
          focusElement(last);
        }

        return;
      }

      if (active === last || !content.contains(active)) {
        event.preventDefault();
        focusElement(first);
      }
    },

    handleFocusIn: (event) => {
      const top = getTopOverlay(stack.entries);

      if (!top?.modal) {
        return;
      }

      const content = top.getContent?.();

      if (!content) {
        return;
      }

      const target = event.target;

      if (target instanceof ownerDocument.defaultView!.HTMLElement) {
        if (content.contains(target)) {
          top.lastFocused = target;
          return;
        }
      }

      const lastFocused = top.lastFocused;

      focusElement(
        lastFocused?.isConnected && content.contains(lastFocused)
          ? lastFocused
          : (getFocusableElements(content)[0] ?? content),
      );
    },
  };

  ownerDocument.addEventListener("keydown", stack.handleKeyDown, true);

  ownerDocument.addEventListener("focusin", stack.handleFocusIn, true);

  return stack;
};

const registerOverlay = (
  ownerDocument: Document,
  onEscape: () => void,
  priority = 0,
  options: OverlayRegistrationOptions = {},
): OverlayRegistration => {
  const stack =
    overlayStacks.get(ownerDocument) ?? createOverlayStack(ownerDocument);

  overlayStacks.set(ownerDocument, stack);

  const activeElement = ownerDocument.activeElement;

  const entry: OverlayEntry = {
    onEscape,
    priority,
    order: stack.nextOrder++,
    modal: options.modal ?? false,
    getContent: options.getContent,
    getLayer: options.getLayer,
    previousFocus:
      activeElement instanceof ownerDocument.defaultView!.HTMLElement
        ? activeElement
        : null,
    lastFocused: null,
  };

  stack.entries.push(entry);
  stack.syncIsolation();

  if (entry.modal) {
    focusInitial(entry);
  }

  const unregister = (() => {
    const index = stack.entries.indexOf(entry);

    if (index === -1) {
      return;
    }

    const wasTop = getTopOverlay(stack.entries) === entry;

    stack.entries.splice(index, 1);
    stack.syncIsolation();

    if (stack.entries.length === 0) {
      ownerDocument.removeEventListener("keydown", stack.handleKeyDown, true);

      ownerDocument.removeEventListener("focusin", stack.handleFocusIn, true);

      overlayStacks.delete(ownerDocument);
    }

    if (!wasTop || !entry.modal) {
      return;
    }

    Promise.resolve().then(() => {
      const nextTop = getTopOverlay(stack.entries);

      // Als een overlay boven de gesloten overlay actief blijft,
      // moet focus binnen die overlay blijven.
      if (nextTop?.modal) {
        const content = nextTop.getContent?.();

        if (content && !content.contains(ownerDocument.activeElement)) {
          focusInitial(nextTop);
        }

        return;
      }

      // Herstel focus alleen als er geen modal overlay meer actief is.
      if (entry.previousFocus?.isConnected) {
        focusElement(entry.previousFocus);
      }
    });
  }) as OverlayRegistration;

  unregister.isTop = () => {
    return getTopOverlay(stack.entries) === entry;
  };

  return unregister;
};

const OverlayStackProvider = ({
  priority,
  children,
}: OverlayStackProviderProps) => {
  return createElement(
    OverlayPriorityContext.Provider,
    { value: priority },
    children,
  );
};

const useOverlayPriority = () => useContext(OverlayPriorityContext);

export { OverlayStackProvider, registerOverlay, useOverlayPriority };

export type { OverlayRegistration, OverlayRegistrationOptions };
