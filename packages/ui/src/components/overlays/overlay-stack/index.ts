type OverlayEntry = {
  onEscape: () => void;
};

type OverlayStack = {
  entries: OverlayEntry[];
  handleKeyDown: (event: KeyboardEvent) => void;
};

const overlayStacks = new WeakMap<Document, OverlayStack>();

const createOverlayStack = (ownerDocument: Document): OverlayStack => {
  const stack: OverlayStack = {
    entries: [],
    handleKeyDown: (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const topOverlay = stack.entries.at(-1);

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
): (() => void) => {
  const stack =
    overlayStacks.get(ownerDocument) ?? createOverlayStack(ownerDocument);

  overlayStacks.set(ownerDocument, stack);

  const entry: OverlayEntry = { onEscape };

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

export { registerOverlay };
