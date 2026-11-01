import {
  createContext,
  createElement,
  useContext,
  type PropsWithChildren,
} from "react";

type OverlayEntry = {
  onEscape: () => void;
  priority: number;
  order: number;
};

type OverlayStack = {
  entries: OverlayEntry[];
  nextOrder: number;
  handleKeyDown: (event: KeyboardEvent) => void;
};

const OverlayPriorityContext = createContext(0);

const overlayStacks = new WeakMap<Document, OverlayStack>();

const createOverlayStack = (ownerDocument: Document): OverlayStack => {
  const stack: OverlayStack = {
    entries: [],
    nextOrder: 0,
    handleKeyDown: (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const topOverlay = stack.entries.reduce<OverlayEntry | undefined>(
        (top, entry) => {
          if (
            !top ||
            entry.priority > top.priority ||
            (entry.priority === top.priority && entry.order > top.order)
          ) {
            return entry;
          }

          return top;
        },
        undefined,
      );

      if (!topOverlay) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      topOverlay.onEscape();
    },
  };

  ownerDocument.addEventListener("keydown", stack.handleKeyDown);

  return stack;
};

const registerOverlay = (
  ownerDocument: Document,
  onEscape: () => void,
  priority = 0,
): (() => void) => {
  const stack =
    overlayStacks.get(ownerDocument) ?? createOverlayStack(ownerDocument);

  overlayStacks.set(ownerDocument, stack);

  const entry: OverlayEntry = {
    onEscape,
    priority,
    order: stack.nextOrder++,
  };

  stack.entries.push(entry);

  return () => {
    const index = stack.entries.indexOf(entry);

    if (index !== -1) {
      stack.entries.splice(index, 1);
    }

    if (stack.entries.length === 0) {
      ownerDocument.removeEventListener("keydown", stack.handleKeyDown);
      overlayStacks.delete(ownerDocument);
    }
  };
};

type OverlayStackProviderProps = PropsWithChildren<{
  priority: number;
}>;

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
