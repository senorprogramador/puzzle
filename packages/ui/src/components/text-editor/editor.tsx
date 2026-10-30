"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { cn } from "@puzzle/core";
import {
  applyMark,
  createTextDocument,
  createTextSelection,
  getOrderedSelection,
  insertDocumentAtSelection,
  insertTextAtSelection,
  isCollapsedSelection,
  normalizeTextDocument,
  setTextVariant,
  setTextAlign,
  setListType,
  getListType,
  getTextAlign,
} from "./text-document";
import { parseHtmlToDocument, parseMarkdownToDocument } from "./text-parser";
import type {
  TextBlockVariant,
  TextDocument,
  TextMark,
  TextPoint,
  TextSelection,
  TextAlign,
  TextListType,
} from "./text-editor.types";
import "./text-editor.css";

export type TextEditorHandle = {
  focus: () => void;
  getDocument: () => TextDocument;
  getSelection: () => TextSelection;
  getActiveMarks: () => TextMark[];
  isActive: (mark: TextMark) => boolean;
  getActiveTextVariant: () => TextBlockVariant | null;
  isTextVariantActive: (variant: TextBlockVariant) => boolean;
  toggleMark: (mark: TextMark) => void;
  setTextVariant: (variant: TextBlockVariant) => void;
  setTextAlign: (align: TextAlign) => void;
  isTextAlignActive: (align: TextAlign) => boolean;
  setListType: (listType: TextListType | null) => void;
  isListTypeActive: (listType: TextListType) => boolean;
  insertText: (text: string) => void;
  replaceSelection: (document: TextDocument) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export type EditorProps = {
  /** Controlled document. Use the same object emitted by onChange when updating it. */
  value?: TextDocument;
  /** Initial document for uncontrolled use. */
  defaultValue?: TextDocument;
  onChange?: (document: TextDocument) => void;
  onSelectionChange?: (selection: TextSelection) => void;
  onActiveMarksChange?: (marks: TextMark[]) => void;
  onActiveTextVariantChange?: (variant: TextBlockVariant | null) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
};

type HistoryEntry = {
  document: TextDocument;
  selection: TextSelection;
};

type HistoryState = {
  undo: HistoryEntry[];
  redo: HistoryEntry[];
  lastInputType: string;
  lastInputAt: number;
};

type DomPoint = {
  node: Node;
  offset: number;
};

const isInside = (root: HTMLElement, node: Node | null): node is Node =>
  node != null && (node === root || root.contains(node));

const nodeTextLength = (node: Node): number => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent?.length ?? 0;
  if (node instanceof Element && node.tagName.toLowerCase() === "br") {
    return node.hasAttribute("data-puzzle-placeholder") ? 0 : 1;
  }

  return Array.from(node.childNodes).reduce(
    (total, child) => total + nodeTextLength(child),
    0,
  );
};

const measureBeforePoint = (
  current: Node,
  target: Node,
  targetOffset: number,
): number | null => {
  if (current === target) {
    if (current.nodeType === Node.TEXT_NODE) {
      return Math.max(
        0,
        Math.min(targetOffset, current.textContent?.length ?? 0),
      );
    }

    return Array.from(current.childNodes)
      .slice(0, targetOffset)
      .reduce((total, child) => total + nodeTextLength(child), 0);
  }

  let total = 0;
  for (const child of Array.from(current.childNodes)) {
    if (child === target || child.contains(target)) {
      const nested = measureBeforePoint(child, target, targetOffset);
      return nested == null ? null : total + nested;
    }
    total += nodeTextLength(child);
  }

  return null;
};

const pointFromDom = (
  root: HTMLElement,
  node: Node,
  offset: number,
): TextPoint | null => {
  if (!isInside(root, node)) return null;

  if (node === root) {
    const blocks = Array.from(root.children) as HTMLElement[];
    if (!blocks.length) return null;
    const blockIndex = Math.max(0, Math.min(offset, blocks.length - 1));
    const blockElement = blocks[blockIndex];
    return {
      block: blockIndex,
      offset: offset >= blocks.length ? nodeTextLength(blockElement) : 0,
    };
  }

  const markedBlock =
    node instanceof Element
      ? node.closest<HTMLElement>("[data-puzzle-editor-block]")
      : node.parentElement?.closest<HTMLElement>("[data-puzzle-editor-block]");
  let directChild: Node | null = node;
  while (directChild && directChild.parentNode !== root) {
    directChild = directChild.parentNode;
  }
  const blockElement =
    markedBlock ?? (directChild instanceof HTMLElement ? directChild : null);

  if (!blockElement || !root.contains(blockElement)) return null;

  const block = Array.from(root.children).indexOf(blockElement);
  if (block < 0) return null;

  const measured = measureBeforePoint(blockElement, node, offset);
  const contentLength = nodeTextLength(blockElement);
  return {
    block,
    offset: Math.max(0, Math.min(measured ?? 0, contentLength)),
  };
};

const selectionFromDom = (root: HTMLElement): TextSelection | null => {
  const selection = window.getSelection();
  if (!selection?.anchorNode || !selection.focusNode) return null;
  if (
    !root.contains(selection.anchorNode) ||
    !root.contains(selection.focusNode)
  ) {
    return null;
  }

  const anchor = pointFromDom(
    root,
    selection.anchorNode,
    selection.anchorOffset,
  );
  const focus = pointFromDom(root, selection.focusNode, selection.focusOffset);
  return anchor && focus ? { anchor, focus } : null;
};

const collectDomPoints = (
  root: HTMLElement,
): {
  points: Array<{
    start: number;
    length: number;
    node: Node;
    kind: "text" | "break";
  }>;
  length: number;
} => {
  const points: Array<{
    start: number;
    length: number;
    node: Node;
    kind: "text" | "break";
  }> = [];
  let length = 0;

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLength = node.textContent?.length ?? 0;
      if (nodeLength) {
        points.push({ start: length, length: nodeLength, node, kind: "text" });
        length += nodeLength;
      }
      return;
    }

    if (node instanceof Element && node.tagName.toLowerCase() === "br") {
      if (!node.hasAttribute("data-puzzle-placeholder")) {
        points.push({ start: length, length: 1, node, kind: "break" });
        length += 1;
      }
      return;
    }

    for (const child of Array.from(node.childNodes)) visit(child);
  };

  visit(root);
  return { points, length };
};

const domPointFromPoint = (
  blockElement: HTMLElement,
  targetOffset: number,
): DomPoint => {
  const { points, length } = collectDomPoints(blockElement);
  const offset = Math.max(0, Math.min(targetOffset, length));

  for (const point of points) {
    const end = point.start + point.length;
    if (point.kind === "text" && offset <= end) {
      return {
        node: point.node,
        offset: Math.max(0, Math.min(offset - point.start, point.length)),
      };
    }

    if (point.kind === "break" && offset <= end) {
      const br = point.node as Element;
      const parent = br.parentNode;
      if (!parent) break;
      const index = Array.prototype.indexOf.call(
        parent.childNodes,
        br,
      ) as number;
      return {
        node: parent,
        offset: index + (offset === end ? 1 : 0),
      };
    }
  }

  const last = points[points.length - 1];
  if (last?.kind === "text") {
    return { node: last.node, offset: last.length };
  }

  return { node: blockElement, offset: blockElement.childNodes.length };
};

const setDomSelection = (root: HTMLElement, selection: TextSelection) => {
  const anchorBlock = root.children.item(
    selection.anchor.block,
  ) as HTMLElement | null;
  const focusBlock = root.children.item(
    selection.focus.block,
  ) as HTMLElement | null;
  if (!anchorBlock || !focusBlock) return;

  const anchor = domPointFromPoint(anchorBlock, selection.anchor.offset);
  const focus = domPointFromPoint(focusBlock, selection.focus.offset);
  const domSelection = window.getSelection();
  if (!domSelection) return;

  try {
    if (typeof domSelection.setBaseAndExtent === "function") {
      domSelection.setBaseAndExtent(
        anchor.node,
        anchor.offset,
        focus.node,
        focus.offset,
      );
      return;
    }

    const range = window.document.createRange();
    const ordered = getOrderedSelection(selection);
    const startBlock = root.children.item(
      ordered.start.block,
    ) as HTMLElement | null;
    const endBlock = root.children.item(
      ordered.end.block,
    ) as HTMLElement | null;
    if (!startBlock || !endBlock) return;
    const start = domPointFromPoint(startBlock, ordered.start.offset);
    const end = domPointFromPoint(endBlock, ordered.end.offset);
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    domSelection.removeAllRanges();
    domSelection.addRange(range);
  } catch {
    // The DOM may have changed between render and selection restoration.
  }
};

/**
 * Render the canonical document into a contenteditable element without making
 * React responsible for its children. Browsers mutate contenteditable DOM while
 * editing (for example, Backspace may remove a placeholder <br> itself). React
 * must therefore not reconcile those descendants as React-owned nodes.
 */
const renderDocumentToDom = (root: HTMLElement, textDocument: TextDocument) => {
  const fragment = window.document.createDocumentFragment();

  for (const block of textDocument.content) {
    const blockElement = window.document.createElement("p");
    blockElement.className = `puzzle-text-editor__block puzzle-typography-${block.variant}`;
    blockElement.dataset.puzzleEditorBlock = "true";
    blockElement.dataset.puzzleVariant = block.variant;
    if (block.align) {
      blockElement.dataset.puzzleAlign = block.align;
      blockElement.style.textAlign = block.align;
    }
    if (block.listType) blockElement.dataset.puzzleListType = block.listType;

    if (!block.children.length) {
      const placeholder = window.document.createElement("br");
      placeholder.dataset.puzzlePlaceholder = "true";
      blockElement.appendChild(placeholder);
    } else {
      for (const inline of block.children) {
        const inlineElement = window.document.createElement("span");
        const content = window.document.createDocumentFragment();
        const parts = inline.text.split("\n");

        parts.forEach((part, index) => {
          if (index > 0)
            content.appendChild(window.document.createElement("br"));
          if (part) content.appendChild(window.document.createTextNode(part));
        });

        let node: Node = content;
        for (const mark of [...(inline.marks ?? [])].reverse()) {
          const tagName =
            mark === "bold"
              ? "strong"
              : mark === "italic"
                ? "em"
                : mark === "underline"
                  ? "u"
                  : "s";
          const wrapper = window.document.createElement(tagName);
          wrapper.appendChild(node);
          node = wrapper;
        }

        inlineElement.appendChild(node);
        blockElement.appendChild(inlineElement);
      }
    }

    fragment.appendChild(blockElement);
  }

  root.replaceChildren(fragment);
};

const isMark = (value: string): value is TextMark =>
  value === "bold" ||
  value === "italic" ||
  value === "underline" ||
  value === "strike";

const documentsEqual = (left: TextDocument, right: TextDocument): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const getMarksForSelection = (
  document: TextDocument,
  selection: TextSelection,
  pendingMarks: TextMark[] = [],
  pendingMarksOverride = false,
): TextMark[] => {
  if (isCollapsedSelection(selection)) {
    if (pendingMarksOverride) return [...pendingMarks];
    const block = document.content[selection.focus.block];
    if (!block) return [];
    const offset = selection.focus.offset;
    let position = 0;
    let previous: TextMark[] | undefined;
    for (const inline of block.children) {
      const end = position + inline.text.length;
      if (offset > position && offset <= end) return [...(inline.marks ?? [])];
      if (offset === position && previous) return [...previous];
      if (offset < end) return [...(inline.marks ?? [])];
      previous = inline.marks ?? [];
      position = end;
    }
    return [...(previous ?? [])];
  }
  const { start, end } = getOrderedSelection(selection);
  let commonMarks: Set<TextMark> | null = null;
  let foundText = false;
  document.content.forEach((block, blockIndex) => {
    if (blockIndex < start.block || blockIndex > end.block) return;
    const from = blockIndex === start.block ? start.offset : 0;
    const to =
      blockIndex === end.block
        ? end.offset
        : block.children.reduce(
            (total, inline) => total + inline.text.length,
            0,
          );
    if (to <= from) return;
    let position = 0;
    for (const inline of block.children) {
      const inlineStart = position;
      const inlineEnd = inlineStart + inline.text.length;
      position = inlineEnd;
      if (inlineEnd <= from || inlineStart >= to) continue;
      foundText = true;
      const marks = new Set(inline.marks ?? []);
      commonMarks =
        commonMarks == null
          ? marks
          : new Set([...commonMarks].filter((mark) => marks.has(mark)));
    }
  });
  return foundText && commonMarks ? [...commonMarks] : [];
};

const getVariantForSelection = (
  document: TextDocument,
  selection: TextSelection,
): TextBlockVariant | null => {
  if (!document.content.length) return null;
  const { start, end } = getOrderedSelection(selection);
  const lastBlock = isCollapsedSelection(selection)
    ? start.block
    : end.offset === 0 && end.block > start.block
      ? end.block - 1
      : end.block;
  const variants = document.content
    .slice(start.block, lastBlock + 1)
    .map((block) => block.variant);
  return variants.length && variants.every((variant) => variant === variants[0])
    ? variants[0]
    : null;
};

const Editor = forwardRef<TextEditorHandle, EditorProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onSelectionChange,
      onActiveMarksChange,
      onActiveTextVariantChange,
      placeholder,
      className,
      readOnly = false,
      autoFocus = false,
      "aria-label": ariaLabel = "Text editor",
    },
    forwardedRef,
  ) => {
    const [documentState, setDocumentState] = useState<TextDocument>(() =>
      normalizeTextDocument(value ?? defaultValue ?? createTextDocument()),
    );
    const [selectionState, setSelectionState] = useState<TextSelection>(() =>
      createTextSelection(),
    );
    const editableRef = useRef<HTMLDivElement | null>(null);
    const documentRef = useRef(documentState);
    const selectionRef = useRef(selectionState);
    const restoreSelectionRef = useRef<TextSelection | null>(null);
    // Contenteditable descendants are managed imperatively, never by React.
    // Skip rendering after native input because the browser has already edited
    // the DOM and rebuilding it would disrupt composition/selection.
    const renderDomOnDocumentChangeRef = useRef(true);
    const inputTypeRef = useRef("");
    const selectionBeforeInputRef = useRef<TextSelection>(selectionState);
    const pendingMarksRef = useRef<TextMark[]>([]);
    const pendingMarksOverrideRef = useRef(false);
    const historyRef = useRef<HistoryState>({
      undo: [],
      redo: [],
      lastInputType: "",
      lastInputAt: 0,
    });

    const updateSelection = useCallback(
      (nextSelection: TextSelection) => {
        selectionRef.current = nextSelection;
        setSelectionState(nextSelection);
        onSelectionChange?.(nextSelection);
        onActiveMarksChange?.(
          getMarksForSelection(
            documentRef.current,
            nextSelection,
            pendingMarksRef.current,
            pendingMarksOverrideRef.current,
          ),
        );
        onActiveTextVariantChange?.(
          getVariantForSelection(documentRef.current, nextSelection),
        );
      },
      [onSelectionChange, onActiveMarksChange, onActiveTextVariantChange],
    );

    const restoreSelection = useCallback((nextSelection: TextSelection) => {
      const root = editableRef.current;
      if (!root) return;
      setDomSelection(root, nextSelection);
    }, []);

    const focus = useCallback(() => {
      const root = editableRef.current;
      if (!root) return;
      root.focus({ preventScroll: true });
      restoreSelection(selectionRef.current);
    }, [restoreSelection]);

    const clearTypingGroup = useCallback(() => {
      historyRef.current.lastInputAt = 0;
      historyRef.current.lastInputType = "";
    }, []);

    const pushHistory = useCallback(
      (document: TextDocument, selection: TextSelection) => {
        historyRef.current.undo.push({ document, selection });
        if (historyRef.current.undo.length > 100)
          historyRef.current.undo.shift();
        historyRef.current.redo = [];
        clearTypingGroup();
      },
      [clearTypingGroup],
    );

    const emitDocument = useCallback(
      (nextDocument: TextDocument, nextSelection = selectionRef.current) => {
        const normalized = normalizeTextDocument(nextDocument);
        renderDomOnDocumentChangeRef.current = true;
        documentRef.current = normalized;
        restoreSelectionRef.current = nextSelection;
        updateSelection(nextSelection);
        setDocumentState(normalized);
        onChange?.(normalized);
      },
      [onChange, updateSelection],
    );

    const commitTransform = useCallback(
      (nextDocument: TextDocument, nextSelection = selectionRef.current) => {
        if (documentsEqual(documentRef.current, nextDocument)) {
          updateSelection(nextSelection);
          restoreSelectionRef.current = nextSelection;
          return;
        }

        pushHistory(documentRef.current, selectionRef.current);
        emitDocument(nextDocument, nextSelection);
      },
      [emitDocument, pushHistory, updateSelection],
    );

    const undo = useCallback(() => {
      const history = historyRef.current;
      const previous = history.undo.pop();
      if (!previous) return;
      history.redo.push({
        document: documentRef.current,
        selection: selectionRef.current,
      });
      clearTypingGroup();
      emitDocument(previous.document, previous.selection);
    }, [clearTypingGroup, emitDocument]);

    const redo = useCallback(() => {
      const history = historyRef.current;
      const next = history.redo.pop();
      if (!next) return;
      history.undo.push({
        document: documentRef.current,
        selection: selectionRef.current,
      });
      clearTypingGroup();
      emitDocument(next.document, next.selection);
    }, [clearTypingGroup, emitDocument]);

    const getActiveMarks = useCallback(
      (): TextMark[] =>
        getMarksForSelection(
          documentRef.current,
          selectionRef.current,
          pendingMarksRef.current,
          pendingMarksOverrideRef.current,
        ),
      [],
    );

    const isActive = useCallback(
      (mark: TextMark): boolean => getActiveMarks().includes(mark),
      [getActiveMarks],
    );

    const getActiveTextVariant = useCallback(
      (): TextBlockVariant | null =>
        getVariantForSelection(documentRef.current, selectionRef.current),
      [],
    );

    const isTextVariantActive = useCallback(
      (variant: TextBlockVariant): boolean =>
        getActiveTextVariant() === variant,
      [getActiveTextVariant],
    );

    const toggleMark = useCallback(
      (mark: TextMark) => {
        focus();
        const selection = selectionRef.current;
        if (isCollapsedSelection(selection)) {
          const pending = new Set(getActiveMarks());
          if (pending.has(mark)) pending.delete(mark);
          else pending.add(mark);
          pendingMarksRef.current = ["bold", "italic", "underline", "strike"]
            .filter(isMark)
            .filter((item) => pending.has(item));
          pendingMarksOverrideRef.current = true;
          onActiveMarksChange?.(
            getMarksForSelection(
              documentRef.current,
              selectionRef.current,
              pendingMarksRef.current,
              true,
            ),
          );
          return;
        }

        commitTransform(applyMark(documentRef.current, selection, mark));
      },
      [commitTransform, focus, getActiveMarks, onActiveMarksChange],
    );

    const changeVariant = useCallback(
      (variant: TextBlockVariant) => {
        focus();
        commitTransform(
          setTextVariant(documentRef.current, selectionRef.current, variant),
        );
      },
      [commitTransform, focus],
    );

    const changeAlign = useCallback(
      (align: TextAlign) => {
        focus();
        commitTransform(
          setTextAlign(documentRef.current, selectionRef.current, align),
        );
      },
      [commitTransform, focus],
    );

    const isTextAlignActive = useCallback((align: TextAlign): boolean => {
      const currentAlign = getTextAlign(
        documentRef.current,
        selectionRef.current,
      );
      return (
        currentAlign === align || (currentAlign === null && align === "left")
      );
    }, []);

    const changeListType = useCallback(
      (listType: TextListType | null) => {
        focus();
        commitTransform(
          setListType(documentRef.current, selectionRef.current, listType),
        );
      },
      [commitTransform, focus],
    );

    const isListTypeActive = useCallback((listType: TextListType): boolean => {
      return getListType(documentRef.current, selectionRef.current, listType);
    }, []);

    const replaceSelection = useCallback(
      (insertedDocument: TextDocument) => {
        focus();
        const result = insertDocumentAtSelection(
          documentRef.current,
          selectionRef.current,
          insertedDocument,
        );
        pendingMarksRef.current = [];
        pendingMarksOverrideRef.current = false;
        commitTransform(result.document, result.selection);
      },
      [commitTransform, focus],
    );

    const insertText = useCallback(
      (text: string) => {
        focus();
        const result = insertTextAtSelection(
          documentRef.current,
          selectionRef.current,
          text,
          pendingMarksRef.current,
        );
        pendingMarksRef.current = [];
        pendingMarksOverrideRef.current = false;
        commitTransform(result.document, result.selection);
      },
      [commitTransform, focus],
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        focus,
        getDocument: () => documentRef.current,
        getSelection: () => selectionRef.current,
        getActiveMarks,
        isActive,
        getActiveTextVariant,
        isTextVariantActive,
        toggleMark,
        setTextVariant: changeVariant,
        setTextAlign: changeAlign,
        isTextAlignActive,
        setListType: changeListType,
        isListTypeActive,
        insertText,
        replaceSelection,
        undo,
        redo,
        canUndo: () => historyRef.current.undo.length > 0,
        canRedo: () => historyRef.current.redo.length > 0,
      }),
      [
        changeAlign,
        changeListType,
        changeVariant,
        focus,
        isTextAlignActive,
        getActiveMarks,
        getActiveTextVariant,
        insertText,
        isActive,
        isTextVariantActive,
        redo,
        replaceSelection,
        toggleMark,
        undo,
      ],
    );

    useEffect(() => {
      if (!value || value === documentRef.current) return;
      const normalized = normalizeTextDocument(value);
      renderDomOnDocumentChangeRef.current = true;
      documentRef.current = normalized;
      const selection = createTextSelection();
      selectionRef.current = selection;
      restoreSelectionRef.current = selection;
      historyRef.current = {
        undo: [],
        redo: [],
        lastInputType: "",
        lastInputAt: 0,
      };
      setDocumentState(normalized);
      updateSelection(selection);
    }, [value, updateSelection]);

    useLayoutEffect(() => {
      const root = editableRef.current;
      if (!root) return;

      if (renderDomOnDocumentChangeRef.current) {
        renderDocumentToDom(root, documentState);
      }
      // Each document-state commit consumes the render decision. Native input
      // skips a DOM render; commands/external value changes explicitly enable it.
      renderDomOnDocumentChangeRef.current = true;

      const selection = restoreSelectionRef.current;
      if (!selection) return;
      restoreSelectionRef.current = null;
      restoreSelection(selection);
    }, [documentState, restoreSelection]);

    useEffect(() => {
      onActiveMarksChange?.(getActiveMarks());
      onActiveTextVariantChange?.(getActiveTextVariant());
    }, [
      getActiveMarks,
      getActiveTextVariant,
      onActiveMarksChange,
      onActiveTextVariantChange,
    ]);

    useEffect(() => {
      if (autoFocus) focus();
    }, [autoFocus, focus]);

    useEffect(() => {
      const onSelectionChangeInDocument = () => {
        const root = editableRef.current;
        if (!root) return;
        const next = selectionFromDom(root);
        if (!next) return;
        const current = selectionRef.current;
        if (
          next.anchor.block === current.anchor.block &&
          next.anchor.offset === current.anchor.offset &&
          next.focus.block === current.focus.block &&
          next.focus.offset === current.focus.offset
        ) {
          return;
        }
        updateSelection(next);
      };

      window.document.addEventListener(
        "selectionchange",
        onSelectionChangeInDocument,
      );
      return () =>
        window.document.removeEventListener(
          "selectionchange",
          onSelectionChangeInDocument,
        );
    }, [updateSelection]);

    const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
      const nativeEvent = event.nativeEvent as InputEvent;
      const inputType = nativeEvent.inputType ?? "";
      inputTypeRef.current = inputType;
      selectionBeforeInputRef.current =
        selectionFromDom(event.currentTarget) ?? selectionRef.current;

      if (inputType === "historyUndo") {
        event.preventDefault();
        undo();
      } else if (inputType === "historyRedo") {
        event.preventDefault();
        redo();
      }
    };

    const handleInput = (event: FormEvent<HTMLDivElement>) => {
      const root = event.currentTarget;
      const previousDocument = documentRef.current;
      const beforeSelection = selectionBeforeInputRef.current;
      const inputType = inputTypeRef.current;
      let nextDocument = parseHtmlToDocument(root.innerHTML);
      const nextSelection = selectionFromDom(root) ?? selectionRef.current;

      if (
        pendingMarksRef.current.length &&
        isCollapsedSelection(beforeSelection) &&
        (inputType === "insertText" || inputType === "insertCompositionText")
      ) {
        const insertedRange = {
          anchor: beforeSelection.anchor,
          focus: nextSelection.focus,
        };
        if (!isCollapsedSelection(insertedRange)) {
          for (const mark of pendingMarksRef.current) {
            nextDocument = applyMark(nextDocument, insertedRange, mark, true);
          }
        }
      }

      if (documentsEqual(previousDocument, nextDocument)) {
        updateSelection(nextSelection);
        return;
      }

      const now = Date.now();
      const canGroup =
        isCollapsedSelection(beforeSelection) &&
        (inputType === "insertText" ||
          inputType === "insertCompositionText" ||
          inputType === "deleteContentBackward" ||
          inputType === "deleteContentForward") &&
        historyRef.current.lastInputType === inputType &&
        now - historyRef.current.lastInputAt < 800;

      if (!canGroup) {
        historyRef.current.undo.push({
          document: previousDocument,
          selection: beforeSelection,
        });
        if (historyRef.current.undo.length > 100)
          historyRef.current.undo.shift();
      }

      historyRef.current.redo = [];
      historyRef.current.lastInputType = inputType;
      historyRef.current.lastInputAt = now;
      documentRef.current = normalizeTextDocument(nextDocument);
      if (
        inputType === "insertText" ||
        inputType === "insertCompositionText" ||
        inputType === "insertFromPaste"
      ) {
        pendingMarksRef.current = [];
        pendingMarksOverrideRef.current = false;
      }
      restoreSelectionRef.current = nextSelection;
      updateSelection(nextSelection);
      renderDomOnDocumentChangeRef.current = false;
      setDocumentState(documentRef.current);
      onChange?.(documentRef.current);
    };

    const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
      if (readOnly) return;
      event.preventDefault();
      const currentSelection = selectionFromDom(event.currentTarget);
      if (currentSelection) updateSelection(currentSelection);
      const html = event.clipboardData.getData("text/html");
      const plainText = event.clipboardData.getData("text/plain");
      if (!html.trim() && !plainText) return;
      const parsed = html.trim()
        ? parseHtmlToDocument(html)
        : parseMarkdownToDocument(plainText);
      replaceSelection(parsed);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) return;
      const key = event.key.toLowerCase();

      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      } else if (key === "b") {
        event.preventDefault();
        toggleMark("bold");
      } else if (key === "i") {
        event.preventDefault();
        toggleMark("italic");
      } else if (key === "u") {
        event.preventDefault();
        toggleMark("underline");
      } else if (key === "x" && event.shiftKey) {
        event.preventDefault();
        toggleMark("strike");
      }
    };

    const handleKeyUp = () => {
      const root = editableRef.current;
      const next = root ? selectionFromDom(root) : null;
      if (next) updateSelection(next);
    };

    const handleMouseUp = () => {
      const root = editableRef.current;
      const next = root ? selectionFromDom(root) : null;
      if (next) updateSelection(next);
    };

    return (
      <div
        ref={editableRef}
        className={cn("puzzle-text-editor", className)}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        role="textbox"
        aria-label={ariaLabel}
        aria-multiline="true"
        aria-readonly={readOnly || undefined}
        data-placeholder={placeholder}
        data-empty={
          documentState.content.every((block) =>
            block.children.every((inline) => !inline.text),
          )
            ? "true"
            : undefined
        }
        spellCheck
        onBeforeInput={handleBeforeInput}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onFocus={handleKeyUp}
      />
    );
  },
);

Editor.displayName = "Editor";

export { Editor };
