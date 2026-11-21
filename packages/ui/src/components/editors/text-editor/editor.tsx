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
import { createPortal } from "react-dom";
import { cn } from "@puzzle-ui/core";
import { Icon } from "@puzzle-ui/icons";
import {
  applyMark,
  createTextDocument,
  createTextSelection,
  getOrderedSelection,
  insertDocumentAtSelection,
  insertTextAtSelection,
  exitEmptyTextBlock,
  deleteTextAtSelection,
  isCollapsedSelection,
  getBlockLength,
  getTextLink,
  normalizeTextDocument,
  normalizeTextSelection,
  normalizeLinkHref,
  setTextLink,
  setTextVariant,
  setBlockType,
  insertHorizontalRule,
  clearFormatting,
  clearInlineFormatting,
  setTextAlign,
  setListType,
  applyListType,
  getListType,
  getListSelectionState,
  removeList,
  setListAttributes,
  setListChecked,
  setListIndent,
  shiftListIndent,
  setBlockIndent,
  setListInteractive,
  toggleListItemChecked,
  splitListItemAtSelection,
  mergeListItemBackward,
  applyMarkdownShortcut,
  findTextInDocument,
  getTextStatistics,
  getSlashCommandAtSelection,
  replaceAllText as replaceAllTextTransaction,
  getTextAlign,
} from "./text-document";
import { parseHtmlToDocument, parseMarkdownToDocument } from "./text-parser";
import { createTextListTree } from "./text-list-tree";
import type {
  TextBlock,
  TextBlockVariant,
  TextDocument,
  TextMark,
  TextPoint,
  TextSelection,
  TextAlign,
  TextListAttributes,
  TextListSelectionState,
  TextListType,
  TextTransaction,
  TextDocumentStatistics,
  TextSearchMatch,
  TextSearchOptions,
  TextSlashCommandMatch,
  TextEditorShortcut,
} from "./text-editor.types";
import "./text-editor.css";

type TextEditorHandle = {
  focus: () => void;
  getDocument: () => TextDocument;
  getSelection: () => TextSelection;
  getActiveMarks: () => TextMark[];
  isActive: (mark: TextMark) => boolean;
  getActiveTextVariant: () => TextBlockVariant | null;
  isTextVariantActive: (variant: TextBlockVariant) => boolean;
  toggleMark: (mark: TextMark) => void;
  setTextVariant: (variant: TextBlockVariant) => void;
  setBlockStyle: (variant: TextBlockVariant) => void;
  setBlockType: (blockType: "paragraph" | "blockquote" | "codeBlock") => void;
  insertHorizontalRule: () => void;
  clearFormatting: () => void;
  clearInlineFormatting: () => void;
  setTextAlign: (align: TextAlign) => void;
  isTextAlignActive: (align: TextAlign) => boolean;
  setListType: (listType: TextListType | null) => void;
  applyListType: (listType: TextListType) => void;
  isListTypeActive: (listType: TextListType) => boolean;
  getListSelectionState: () => TextListSelectionState;
  removeList: () => void;
  setListAttributes: (attributes: TextListAttributes, options?: { preserveFocus?: boolean }) => void;
  beginListAttributePreview: () => void;
  previewListAttributes: (attributes: TextListAttributes) => void;
  finishListAttributePreview: (commit: boolean) => void;
  setListChecked: (checked: boolean) => void;
  setListInteractive: (interactive: boolean) => void;
  setListIndent: (indent: number) => void;
  shiftListIndent: (direction: -1 | 1) => void;
  setBlockIndent: (indent: number) => void;
  toggleListItemChecked: () => void;
  getActiveLink: () => string | null;
  setLink: (href: string | null) => boolean;
  insertText: (text: string) => void;
  replaceSelection: (document: TextDocument) => void;
  getTextStatistics: () => TextDocumentStatistics;
  getSlashCommand: () => TextSlashCommandMatch | null;
  findText: (query: string, options?: TextSearchOptions) => TextSearchMatch[];
  replaceAllText: (
    query: string,
    replacement: string,
    options?: TextSearchOptions,
  ) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

type TextEditorCommands = TextEditorHandle;

type EditorProps = {
  /** Controlled document. Structurally equal updates preserve the current selection. */
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
  shortcuts?: readonly TextEditorShortcut[];
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

type ApplyTransactionOptions = {
  renderDom?: boolean;
  emitChange?: boolean;
  skipIfDocumentEqual?: boolean;
};

type CommitTransactionOptions = {
  groupInputType?: string;
  renderDom?: boolean;
};

const isInside = (root: HTMLElement, node: Node | null): node is Node =>
  node != null && (node === root || root.contains(node));

const isElementNode = (node: Node): node is Element =>
  node.nodeType === Node.ELEMENT_NODE;

const getEditorBlocks = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>("[data-puzzle-editor-block]"));

const nodeTextLength = (node: Node): number => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent?.length ?? 0;
  if (isElementNode(node)) {
    if (
      node.hasAttribute("data-puzzle-editor-control") ||
      ["ul", "ol"].includes(node.tagName.toLowerCase())
    ) {
      return 0;
    }
    if (node.tagName.toLowerCase() === "br") {
      return node.hasAttribute("data-puzzle-placeholder") ? 0 : 1;
    }
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
    const blocks = getEditorBlocks(root);
    if (!blocks.length) return null;
    const child = root.childNodes.item(offset);
    const blockElement =
      child && isElementNode(child)
        ? child.matches("[data-puzzle-editor-block]")
          ? (child as HTMLElement)
          : child.querySelector<HTMLElement>("[data-puzzle-editor-block]")
        : null;
    const mappedIndex = blockElement ? blocks.indexOf(blockElement) : -1;
    const blockIndex =
      offset >= root.childNodes.length
        ? blocks.length - 1
        : mappedIndex >= 0
          ? mappedIndex
          : Math.max(0, Math.min(offset, blocks.length - 1));
    const resolvedBlock = blocks[blockIndex]!;
    return {
      block: blockIndex,
      offset:
        offset >= root.childNodes.length ? nodeTextLength(resolvedBlock) : 0,
    };
  }

  const element = isElementNode(node) ? node : node.parentElement;
  const markedBlock = element?.closest<HTMLElement>(
    "[data-puzzle-editor-block]",
  );
  if (!markedBlock || !root.contains(markedBlock)) return null;

  const block = getEditorBlocks(root).indexOf(markedBlock);
  if (block < 0) return null;

  const measured = measureBeforePoint(markedBlock, node, offset);
  const contentLength = nodeTextLength(markedBlock);
  return {
    block,
    offset: Math.max(0, Math.min(measured ?? 0, contentLength)),
  };
};

const selectionFromDom = (root: HTMLElement): TextSelection | null => {
  const selection = root.ownerDocument.defaultView?.getSelection();
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
    if (
      isElementNode(node) &&
      (node.hasAttribute("data-puzzle-editor-control") ||
        ["ul", "ol"].includes(node.tagName.toLowerCase()))
    ) {
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLength = node.textContent?.length ?? 0;
      if (nodeLength) {
        points.push({ start: length, length: nodeLength, node, kind: "text" });
        length += nodeLength;
      }
      return;
    }

    if (isElementNode(node) && node.tagName.toLowerCase() === "br") {
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
  const blocks = getEditorBlocks(root);
  const anchorBlock = blocks[selection.anchor.block] ?? null;
  const focusBlock = blocks[selection.focus.block] ?? null;
  if (!anchorBlock || !focusBlock) return;

  const anchor = domPointFromPoint(anchorBlock, selection.anchor.offset);
  const focus = domPointFromPoint(focusBlock, selection.focus.offset);
  const domSelection = root.ownerDocument.defaultView?.getSelection();
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

    const range = root.ownerDocument.createRange();
    const ordered = getOrderedSelection(selection);
    const startBlock = blocks[ordered.start.block] ?? null;
    const endBlock = blocks[ordered.end.block] ?? null;
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
const renderDocumentToDom = (
  root: HTMLElement,
  textDocument: TextDocument,
  readOnly = false,
) => {
  const ownerDocument = root.ownerDocument;
  const fragment = ownerDocument.createDocumentFragment();

  const createBlockElement = (
    block: TextBlock,
    blockIndex: number,
    tagName: "p" | "li" | "blockquote" | "pre" | "hr",
  ) => {
    const blockElement = ownerDocument.createElement(tagName);
    blockElement.className = `puzzle-text-editor__block puzzle-typography-${block.variant}`;
    blockElement.dataset.puzzleEditorBlock = "true";
    blockElement.dataset.puzzleBlockIndex = String(blockIndex);
    blockElement.dataset.puzzleBlockType = block.type;
    blockElement.dataset.puzzleVariant = block.variant;
    if (block.headingLevel) {
      blockElement.dataset.puzzleHeadingLevel = String(block.headingLevel);
    }
    if (block.align) {
      blockElement.dataset.puzzleAlign = block.align;
      blockElement.style.textAlign = block.align;
    }
    if (block.indent && !block.listType) {
      blockElement.dataset.puzzleIndent = String(block.indent);
      blockElement.style.marginInlineStart = `calc(${block.indent} * var(--puzzle-space-4, 1rem))`;
    }
    if (block.type === "horizontalRule") {
      blockElement.setAttribute("role", "separator");
      blockElement.setAttribute("aria-label", "Horizontal rule");
      blockElement.contentEditable = "false";
      return blockElement;
    }

    if (!block.children.length) {
      const placeholder = ownerDocument.createElement("br");
      placeholder.dataset.puzzlePlaceholder = "true";
      blockElement.appendChild(placeholder);
    } else {
      for (const inline of block.children) {
        const inlineElement = ownerDocument.createElement("span");
        const content = ownerDocument.createDocumentFragment();
        if (block.type === "codeBlock") {
          content.appendChild(ownerDocument.createTextNode(inline.text));
        } else {
          const parts = inline.text.split("\n");
          parts.forEach((part, index) => {
            if (index > 0) content.appendChild(ownerDocument.createElement("br"));
            if (part) content.appendChild(ownerDocument.createTextNode(part));
          });
        }

        let node: Node = content;
        for (const mark of [...(inline.marks ?? [])].reverse()) {
          const tagName =
            mark === "bold"
              ? "strong"
              : mark === "italic"
                ? "em"
                : mark === "underline"
                  ? "u"
                  : mark === "strike"
                    ? "s"
                    : "code";
          const wrapper = ownerDocument.createElement(tagName);
          wrapper.appendChild(node);
          node = wrapper;
        }

        if (inline.link) {
          const anchor = ownerDocument.createElement("a");
          anchor.href = inline.link.href;
          anchor.appendChild(node);
          node = anchor;
        }

        inlineElement.appendChild(node);
        blockElement.appendChild(inlineElement);
      }
    }
    return blockElement;
  };

  const appendEntries = (
    parent: DocumentFragment | HTMLElement,
    entries: ReturnType<typeof createTextListTree>,
  ) => {
    for (const entry of entries) {
      if (entry.type === "block") {
        const tagName =
          entry.block.type === "blockquote"
            ? "blockquote"
            : entry.block.type === "codeBlock"
              ? "pre"
              : entry.block.type === "horizontalRule"
                ? "hr"
                : "p";
        parent.appendChild(
          createBlockElement(entry.block, entry.blockIndex, tagName),
        );
        continue;
      }

      const listElement = ownerDocument.createElement(
        entry.listType === "ordered" ? "ol" : "ul",
      );
      listElement.className = `puzzle-text-editor__list puzzle-text-editor__list--${entry.listType}`;
      listElement.dataset.puzzleListType = entry.listType;
      if (entry.attributes?.interactive !== undefined) {
        listElement.dataset.puzzleListInteractive = String(
          entry.attributes.interactive,
        );
      }
      if (entry.attributes?.icon) {
        listElement.dataset.puzzleListIcon = entry.attributes.icon.name;
        listElement.dataset.puzzleListIconSize = String(
          entry.attributes.icon.size,
        );
        listElement.dataset.puzzleListIconColor = entry.attributes.icon.color;
      }

      for (const item of entry.items) {
        const { block, blockIndex } = item;
        const itemElement = createBlockElement(block, blockIndex, "li");
        itemElement.dataset.puzzleListType = entry.listType;
        if (entry.listType === "checklist") {
          itemElement.dataset.puzzleChecked = String(block.checked === true);
          const checkbox = ownerDocument.createElement("button");
          checkbox.type = "button";
          checkbox.setAttribute("role", "checkbox");
          checkbox.setAttribute(
            "aria-checked",
            String(block.checked === true),
          );
          checkbox.setAttribute(
            "aria-label",
            block.checked
              ? "Mark checklist item incomplete"
              : "Mark checklist item complete",
          );
          checkbox.dataset.puzzleEditorControl = "checklist";
          checkbox.dataset.puzzleBlockIndex = String(blockIndex);
          checkbox.contentEditable = "false";
          checkbox.disabled =
            readOnly || block.listAttributes?.interactive !== true;
          checkbox.className = "puzzle-text-editor__checkbox";
          itemElement.insertBefore(checkbox, itemElement.firstChild);
        }
        if (entry.listType === "icon") {
          const marker = ownerDocument.createElement("span");
          marker.className = "puzzle-text-editor__icon";
          marker.dataset.puzzleEditorControl = "icon";
          marker.setAttribute("aria-hidden", "true");
          marker.contentEditable = "false";
          marker.dataset.puzzleIconName =
            block.listAttributes?.icon?.name ?? "mdi:circle";
          marker.dataset.puzzleIconSize = String(
            block.listAttributes?.icon?.size ?? 18,
          );
          marker.dataset.puzzleIconColor =
            block.listAttributes?.icon?.color ?? "currentColor";
          itemElement.insertBefore(marker, itemElement.firstChild);
        }

        listElement.appendChild(itemElement);
        appendEntries(itemElement, item.children);
      }

      parent.appendChild(listElement);
    }
  }

  appendEntries(
    fragment,
    createTextListTree(textDocument.content),
  );
  root.replaceChildren(fragment);
};

const isMark = (value: string): value is TextMark =>
  value === "bold" ||
  value === "italic" ||
  value === "underline" ||
  value === "strike" ||
  value === "code";

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
    ? variants[0]!
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
      shortcuts = [],
    },
    forwardedRef,
  ) => {
    const [documentState, setDocumentState] = useState<TextDocument>(() =>
      normalizeTextDocument(value ?? defaultValue ?? createTextDocument()),
    );
    const editableRef = useRef<HTMLDivElement | null>(null);
    const [iconMarkers, setIconMarkers] = useState<HTMLElement[]>([]);
    const documentRef = useRef(documentState);
    const selectionRef = useRef(createTextSelection());
    const restoreSelectionRef = useRef<TextSelection | null>(null);
    // Contenteditable descendants are managed imperatively, never by React.
    // Skip rendering after native input because the browser has already edited
    // the DOM and rebuilding it would disrupt composition/selection.
    const renderDomOnDocumentChangeRef = useRef(true);
    const inputTypeRef = useRef("");
    const selectionBeforeInputRef = useRef<TextSelection>(selectionRef.current);
    const pendingMarksRef = useRef<TextMark[]>([]);
    const pendingMarksOverrideRef = useRef(false);
    const compositionRef = useRef<{
      document: TextDocument;
      selection: TextSelection;
    } | null>(null);
    const historyRef = useRef<HistoryState>({
      undo: [],
      redo: [],
      lastInputType: "",
      lastInputAt: 0,
    });
    const listPreviewRef = useRef<HistoryEntry | null>(null);

    const updateSelection = useCallback(
      (nextSelection: TextSelection) => {
        selectionRef.current = nextSelection;
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
      const selection = selectionRef.current;
      // Focusing the editor can synchronously report a collapsed DOM selection.
      root.focus({ preventScroll: true });
      updateSelection(selection);
      restoreSelection(selection);
    }, [restoreSelection, updateSelection]);

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

    const applyTransaction = useCallback(
      (
        transaction: TextTransaction,
        {
          renderDom = true,
          emitChange = true,
          skipIfDocumentEqual = false,
        }: ApplyTransactionOptions = {},
      ): boolean => {
        const normalized = normalizeTextDocument(transaction.document);
        if (
          skipIfDocumentEqual &&
          documentsEqual(documentRef.current, normalized)
        ) {
          return false;
        }

        renderDomOnDocumentChangeRef.current = renderDom;
        documentRef.current = normalized;
        restoreSelectionRef.current = transaction.selection;
        updateSelection(transaction.selection);
        setDocumentState(normalized);
        if (emitChange) onChange?.(normalized);
        return true;
      },
      [onChange, updateSelection],
    );

    const commitTransaction = useCallback(
      (
        transaction: TextTransaction,
        {
          groupInputType,
          renderDom = true,
        }: CommitTransactionOptions = {},
      ) => {
        if (documentsEqual(documentRef.current, transaction.document)) {
          updateSelection(transaction.selection);
          restoreSelectionRef.current = transaction.selection;
          return;
        }

        const now = Date.now();
        const canGroup =
          groupInputType !== undefined &&
          isCollapsedSelection(selectionRef.current) &&
          historyRef.current.lastInputType === groupInputType &&
          now - historyRef.current.lastInputAt < 800;
        if (canGroup) {
          historyRef.current.redo = [];
        } else {
          pushHistory(documentRef.current, selectionRef.current);
        }
        if (groupInputType) {
          historyRef.current.lastInputType = groupInputType;
          historyRef.current.lastInputAt = now;
        }
        applyTransaction(transaction, { renderDom });
      },
      [applyTransaction, pushHistory, updateSelection],
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
      applyTransaction({
        document: previous.document,
        selection: previous.selection,
      });
    }, [applyTransaction, clearTypingGroup]);

    const redo = useCallback(() => {
      const history = historyRef.current;
      const next = history.redo.pop();
      if (!next) return;
      history.undo.push({
        document: documentRef.current,
        selection: selectionRef.current,
      });
      clearTypingGroup();
      applyTransaction({ document: next.document, selection: next.selection });
    }, [applyTransaction, clearTypingGroup]);

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
          if (mark === "code") {
            if (pending.has(mark)) pending.delete(mark);
            else {
              pending.clear();
              pending.add(mark);
            }
          } else if (pending.has(mark)) {
            pending.delete(mark);
          } else {
            pending.delete("code");
            pending.add(mark);
          }
          pendingMarksRef.current = [
            "bold",
            "italic",
            "underline",
            "strike",
            "code",
          ]
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

        commitTransaction(applyMark(documentRef.current, selection, mark));
      },
      [commitTransaction, focus, getActiveMarks, onActiveMarksChange],
    );

    const changeVariant = useCallback(
      (variant: TextBlockVariant) => {
        focus();
        commitTransaction(
          setTextVariant(documentRef.current, selectionRef.current, variant),
        );
      },
      [commitTransaction, focus],
    );

    const changeBlockStyle = useCallback(
      (variant: TextBlockVariant) => {
        focus();
        const paragraph = setBlockType(documentRef.current, selectionRef.current, "paragraph");
        commitTransaction(setTextVariant(paragraph.document, paragraph.selection, variant));
      },
      [commitTransaction, focus],
    );

    const changeBlockType = useCallback(
      (blockType: "paragraph" | "blockquote" | "codeBlock") => {
        focus();
        commitTransaction(
          setBlockType(
            documentRef.current,
            selectionRef.current,
            blockType,
          ),
        );
      },
      [commitTransaction, focus],
    );

    const insertRule = useCallback(() => {
      focus();
      commitTransaction(
        insertHorizontalRule(
          documentRef.current,
          selectionRef.current,
        ),
      );
    }, [commitTransaction, focus]);

    const clearAllFormatting = useCallback(() => {
      focus();
      commitTransaction(
        clearFormatting(documentRef.current, selectionRef.current),
      );
    }, [commitTransaction, focus]);

    const clearInline = useCallback(() => {
      focus();
      if (isCollapsedSelection(selectionRef.current)) {
        pendingMarksRef.current = [];
        pendingMarksOverrideRef.current = true;
        onActiveMarksChange?.([]);
        return;
      }
      commitTransaction(
        clearInlineFormatting(documentRef.current, selectionRef.current),
      );
    }, [commitTransaction, focus, onActiveMarksChange]);

    const changeAlign = useCallback(
      (align: TextAlign) => {
        focus();
        commitTransaction(
          setTextAlign(documentRef.current, selectionRef.current, align),
        );
      },
      [commitTransaction, focus],
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
        commitTransaction(
          setListType(documentRef.current, selectionRef.current, listType),
        );
      },
      [commitTransaction, focus],
    );

    const applyCurrentListType = useCallback(
      (listType: TextListType) => {
        commitTransaction(
          applyListType(
            documentRef.current,
            selectionRef.current,
            listType,
          ),
        );
      },
      [commitTransaction],
    );

    const changeListAttributes = useCallback(
      (attributes: TextListAttributes, options?: { preserveFocus?: boolean }) => {
        if (!options?.preserveFocus) focus();
        commitTransaction(
          setListAttributes(
            documentRef.current,
            selectionRef.current,
            attributes,
          ),
        );
      },
      [commitTransaction, focus],
    );

    const beginListAttributePreview = useCallback(() => {
      if (!listPreviewRef.current) {
        listPreviewRef.current = {
          document: documentRef.current,
          selection: selectionRef.current,
        };
      }
    }, []);

    const previewListAttributes = useCallback((attributes: TextListAttributes) => {
      const preview = listPreviewRef.current;
      if (!preview) return;
      const transaction = setListAttributes(
        preview.document,
        preview.selection,
        attributes,
      );
      applyTransaction(transaction, { skipIfDocumentEqual: true });
    }, [applyTransaction]);

    const finishListAttributePreview = useCallback((commit: boolean) => {
      const preview = listPreviewRef.current;
      if (!preview) return;
      listPreviewRef.current = null;
      if (documentsEqual(preview.document, documentRef.current)) return;
      if (commit) {
        pushHistory(preview.document, preview.selection);
        updateSelection({
          anchor: { ...preview.selection.anchor },
          focus: { ...preview.selection.focus },
        });
      } else {
        applyTransaction(preview);
      }
    }, [applyTransaction, pushHistory, updateSelection]);

    const changeListChecked = useCallback(
      (checked: boolean) => {
        commitTransaction(
          setListChecked(documentRef.current, selectionRef.current, checked),
        );
      },
      [commitTransaction],
    );

    const changeListInteractive = useCallback(
      (interactive: boolean) => {
        commitTransaction(
          setListInteractive(
            documentRef.current,
            selectionRef.current,
            interactive,
          ),
        );
      },
      [commitTransaction],
    );

    const changeListIndent = useCallback(
      (indent: number) => {
        focus();
        commitTransaction(
          setListIndent(documentRef.current, selectionRef.current, indent),
        );
      },
      [commitTransaction, focus],
    );

    const shiftCurrentListIndent = useCallback(
      (direction: -1 | 1) => {
        focus();
        commitTransaction(shiftListIndent(documentRef.current, selectionRef.current, direction));
      },
      [commitTransaction, focus],
    );

    const changeBlockIndent = useCallback(
      (indent: number) => {
        focus();
        commitTransaction(
          setBlockIndent(documentRef.current, selectionRef.current, indent),
        );
      },
      [commitTransaction, focus],
    );

    const removeCurrentList = useCallback(() => {
      focus();
      commitTransaction(
        removeList(documentRef.current, selectionRef.current),
      );
    }, [commitTransaction, focus]);

    const toggleCurrentListItemChecked = useCallback(() => {
      focus();
      commitTransaction(
        toggleListItemChecked(
          documentRef.current,
          selectionRef.current,
        ),
      );
    }, [commitTransaction, focus]);

    const toggleListItemAtIndex = useCallback(
      (blockIndex: number) => {
        if (!Number.isInteger(blockIndex)) return;
        const currentSelection = selectionRef.current;
        const transaction = toggleListItemChecked(
          documentRef.current,
          createTextSelection(blockIndex),
        );
        commitTransaction({
          ...transaction,
          selection: currentSelection,
        }, { renderDom: false });
        const updatedBlock = documentRef.current.content[blockIndex];
        const root = editableRef.current;
        const checkbox = root?.querySelector<HTMLButtonElement>(
          `[data-puzzle-editor-control="checklist"][data-puzzle-block-index="${blockIndex}"]`,
        );
        if (checkbox && updatedBlock?.listType === "checklist") {
          const checked = updatedBlock.checked === true;
          checkbox.setAttribute("aria-checked", String(checked));
          checkbox.setAttribute(
            "aria-label",
            checked
              ? "Mark checklist item incomplete"
              : "Mark checklist item complete",
          );
          checkbox.closest<HTMLElement>("[data-puzzle-editor-block]")?.setAttribute(
            "data-puzzle-checked",
            String(checked),
          );
        }
      },
      [commitTransaction],
    );

    const getCurrentListSelectionState =
      useCallback((): TextListSelectionState => {
        return getListSelectionState(
          documentRef.current,
          selectionRef.current,
        );
      }, []);

    const isListTypeActive = useCallback((listType: TextListType): boolean => {
      return getListType(documentRef.current, selectionRef.current, listType);
    }, []);

    const getActiveLink = useCallback(
      (): string | null =>
        getTextLink(documentRef.current, selectionRef.current),
      [],
    );

    const changeLink = useCallback(
      (href: string | null): boolean => {
        const normalizedHref =
          href === null ? null : normalizeLinkHref(href);
        if (href !== null && normalizedHref === null) return false;

        focus();
        const document = documentRef.current;
        const selection = selectionRef.current;
        const existingHref = getTextLink(document, selection);
        const transaction = setTextLink(document, selection, normalizedHref);
        if (documentsEqual(document, transaction.document)) {
          return normalizedHref !== null && existingHref === normalizedHref;
        }

        commitTransaction(transaction);
        return true;
      },
      [commitTransaction, focus],
    );

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
        commitTransaction(result);
      },
      [commitTransaction, focus],
    );

    const getCurrentTextStatistics = useCallback(
      () => getTextStatistics(documentRef.current),
      [],
    );

    const getCurrentSlashCommand = useCallback(
      () =>
        getSlashCommandAtSelection(
          documentRef.current,
          selectionRef.current,
        ),
      [],
    );

    const findText = useCallback(
      (query: string, options?: TextSearchOptions) =>
        findTextInDocument(documentRef.current, query, options),
      [],
    );

    const replaceAll = useCallback(
      (
        query: string,
        replacement: string,
        options?: TextSearchOptions,
      ) => {
        focus();
        commitTransaction(
          replaceAllTextTransaction(
            documentRef.current,
            selectionRef.current,
            query,
            replacement,
            options,
          ),
        );
      },
      [commitTransaction, focus],
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
        commitTransaction(result);
      },
      [commitTransaction, focus],
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
        setBlockStyle: changeBlockStyle,
        setBlockType: changeBlockType,
        insertHorizontalRule: insertRule,
        clearFormatting: clearAllFormatting,
        clearInlineFormatting: clearInline,
        setTextAlign: changeAlign,
        isTextAlignActive,
        setListType: changeListType,
        applyListType: applyCurrentListType,
        isListTypeActive,
        getListSelectionState: getCurrentListSelectionState,
        removeList: removeCurrentList,
        setListAttributes: changeListAttributes,
        beginListAttributePreview,
        previewListAttributes,
        finishListAttributePreview,
        setListChecked: changeListChecked,
        setListInteractive: changeListInteractive,
        setListIndent: changeListIndent,
        shiftListIndent: shiftCurrentListIndent,
        setBlockIndent: changeBlockIndent,
        toggleListItemChecked: toggleCurrentListItemChecked,
        getActiveLink,
        setLink: changeLink,
        insertText,
        replaceSelection,
        getTextStatistics: getCurrentTextStatistics,
        getSlashCommand: getCurrentSlashCommand,
        findText,
        replaceAllText: replaceAll,
        undo,
        redo,
        canUndo: () => historyRef.current.undo.length > 0,
        canRedo: () => historyRef.current.redo.length > 0,
      }),
      [
        changeAlign,
        changeListType,
        applyCurrentListType,
        changeListAttributes,
        beginListAttributePreview,
        previewListAttributes,
        finishListAttributePreview,
        changeListChecked,
        changeListIndent,
        shiftCurrentListIndent,
        changeBlockIndent,
        changeListInteractive,
        changeVariant,
        changeBlockStyle,
        changeBlockType,
        insertRule,
        clearAllFormatting,
        clearInline,
        changeLink,
        focus,
        getCurrentListSelectionState,
        getCurrentTextStatistics,
        getCurrentSlashCommand,
        findText,
        isTextAlignActive,
        getActiveMarks,
        getActiveLink,
        getActiveTextVariant,
        insertText,
        isActive,
        isTextVariantActive,
        redo,
        removeCurrentList,
        replaceAll,
        replaceSelection,
        toggleMark,
        toggleCurrentListItemChecked,
        undo,
      ],
    );

    useEffect(() => {
      if (!value || value === documentRef.current) return;
      const preview = listPreviewRef.current;
      const selection = preview
        ? normalizeTextSelection(normalizeTextDocument(value), preview.selection)
        : createTextSelection();
      const applied = applyTransaction(
        { document: value, selection },
        { emitChange: false, skipIfDocumentEqual: true },
      );
      if (!applied) return;

      if (preview) {
        listPreviewRef.current = { document: documentRef.current, selection };
      }
      historyRef.current = {
        undo: [],
        redo: [],
        lastInputType: "",
        lastInputAt: 0,
      };
    }, [applyTransaction, value]);

    useLayoutEffect(() => {
      const root = editableRef.current;
      if (!root) return;

      if (renderDomOnDocumentChangeRef.current) {
        renderDocumentToDom(root, documentState, readOnly);
        const markers = Array.from(root.querySelectorAll<HTMLElement>(
          '[data-puzzle-editor-control="icon"]',
        ));
        setIconMarkers((current) =>
          current.length === 0 && markers.length === 0 ? current : markers,
        );
      }
      // Each document-state commit consumes the render decision. Native input
      // skips a DOM render; commands/external value changes explicitly enable it.
      renderDomOnDocumentChangeRef.current = true;

      const selection = restoreSelectionRef.current;
      if (!selection) return;
      restoreSelectionRef.current = null;
      if (root.contains(root.ownerDocument.activeElement)) {
        restoreSelection(selection);
      }
    }, [documentState, readOnly, restoreSelection]);

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
      const ownerDocument = editableRef.current?.ownerDocument;
      if (!ownerDocument) return;

      const onSelectionChangeInDocument = () => {
        const root = editableRef.current;
        if (!root) return;
        const activeElement = root.ownerDocument.activeElement;
        // Selection changes in toolbar controls must not replace the editor range.
        if (activeElement !== root.ownerDocument.body && !root.contains(activeElement)) return;
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

      ownerDocument.addEventListener(
        "selectionchange",
        onSelectionChangeInDocument,
      );
      return () =>
        ownerDocument.removeEventListener(
          "selectionchange",
          onSelectionChangeInDocument,
        );
    }, [updateSelection]);

    useEffect(() => {
      const root = editableRef.current;
      if (!root) return;

      const handleBeforeInput = (event: InputEvent) => {
        const inputType = event.inputType ?? "";
        inputTypeRef.current = inputType;
        const selection =
          selectionFromDom(root) ?? selectionRef.current;
        selectionBeforeInputRef.current = selection;
        if (compositionRef.current || event.isComposing) return;

        const block = documentRef.current.content[selection.focus.block];
        const exitBlock = inputType === "insertParagraph" && !readOnly
          ? exitEmptyTextBlock(documentRef.current, selection)
          : null;
        if (
          exitBlock
        ) {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(exitBlock);
        } else if (
          !readOnly &&
          block?.type === "codeBlock" &&
          (inputType === "deleteContentBackward" ||
            inputType === "deleteContentForward")
        ) {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(
            deleteTextAtSelection(
              documentRef.current,
              selection,
              inputType === "deleteContentBackward"
                ? "backward"
                : "forward",
            ),
            { groupInputType: inputType },
          );
        } else if (
          !readOnly &&
          inputType === "insertText" &&
          block?.type === "codeBlock" &&
          typeof event.data === "string"
        ) {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(
            insertTextAtSelection(
              documentRef.current,
              selection,
              event.data,
            ),
            { groupInputType: inputType },
          );
        } else if (
          !readOnly &&
          inputType === "insertParagraph" &&
          block?.type === "codeBlock"
        ) {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(
            insertTextAtSelection(
              documentRef.current,
              selection,
              "\n",
            ),
          );
        } else if (
          !readOnly &&
          inputType === "insertParagraph" &&
          block?.listType
        ) {
          const transaction = splitListItemAtSelection(
            documentRef.current,
            selection,
          );
          if (!documentsEqual(documentRef.current, transaction.document)) {
            event.preventDefault();
            updateSelection(selection);
            commitTransaction(transaction);
          }
        } else if (
          !readOnly &&
          inputType === "deleteContentBackward" &&
          isCollapsedSelection(selection) &&
          selection.focus.offset === 0 &&
          block?.listType
        ) {
          event.preventDefault();
          commitTransaction(
            mergeListItemBackward(documentRef.current, selection),
          );
        } else if (inputType === "historyUndo") {
          event.preventDefault();
          undo();
        } else if (inputType === "historyRedo") {
          event.preventDefault();
          redo();
        }
      };

      root.addEventListener("beforeinput", handleBeforeInput);
      return () => root.removeEventListener("beforeinput", handleBeforeInput);
    }, [commitTransaction, readOnly, redo, undo, updateSelection]);

    const handleInput = (event: FormEvent<HTMLDivElement>) => {
      const root = event.currentTarget;
      const inputEvent = event.nativeEvent as InputEvent;
      const previousDocument = documentRef.current;
      const beforeSelection = selectionBeforeInputRef.current;
      const inputType = inputTypeRef.current;
      let nextDocument = parseHtmlToDocument(root.innerHTML);
      let nextSelection = selectionFromDom(root) ?? selectionRef.current;
      const inputBlock = previousDocument.content[beforeSelection.focus.block];
      const nextInputBlock = nextDocument.content[beforeSelection.focus.block];
      if (
        inputType === "insertText" &&
        !compositionRef.current &&
        !inputEvent.isComposing &&
        inputBlock?.type === "codeBlock" &&
        nextInputBlock?.type === "codeBlock" &&
        isCollapsedSelection(beforeSelection) &&
        typeof inputEvent.data === "string"
      ) {
        const point = {
          block: beforeSelection.focus.block,
          offset: Math.min(
            getBlockLength(nextInputBlock),
            beforeSelection.focus.offset + inputEvent.data.length,
          ),
        };
        nextSelection = { anchor: point, focus: point };
      }

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
            nextDocument = applyMark(
              nextDocument,
              insertedRange,
              mark,
              true,
            ).document;
          }
        }
      }

      const shortcut =
        inputType === "insertText" &&
        !compositionRef.current &&
        !inputEvent.isComposing
          ? applyMarkdownShortcut(nextDocument, nextSelection)
          : null;
      if (shortcut) {
        nextDocument = shortcut.document;
        nextSelection = shortcut.selection;
      }

      if (documentsEqual(previousDocument, nextDocument)) {
        updateSelection(nextSelection);
        return;
      }

      if (compositionRef.current || inputEvent.isComposing) {
        applyTransaction(
          { document: nextDocument, selection: nextSelection },
          { renderDom: shortcut !== null },
        );
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
      if (
        inputType === "insertText" ||
        inputType === "insertCompositionText" ||
        inputType === "insertFromPaste"
      ) {
        pendingMarksRef.current = [];
        pendingMarksOverrideRef.current = false;
      }
      applyTransaction(
        { document: nextDocument, selection: nextSelection },
        { renderDom: shortcut !== null },
      );
    };

    const handleCompositionStart = () => {
      compositionRef.current = {
        document: documentRef.current,
        selection: selectionRef.current,
      };
      clearTypingGroup();
    };

    const handleCompositionEnd = () => {
      const composition = compositionRef.current;
      if (!composition) return;

      queueMicrotask(() => {
        if (compositionRef.current !== composition) return;
        compositionRef.current = null;
        if (!documentsEqual(composition.document, documentRef.current)) {
          pushHistory(composition.document, composition.selection);
        } else {
          clearTypingGroup();
        }
        const selection = selectionRef.current;
        updateSelection({
          anchor: { ...selection.anchor },
          focus: { ...selection.focus },
        });
      });
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
      if (compositionRef.current || event.nativeEvent.isComposing) return;
      if (readOnly) return;

      for (const shortcut of shortcuts) {
        const modifiers = new Set(shortcut.modifiers);
        const modPressed = event.metaKey || event.ctrlKey;
        const matches =
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!modifiers.has("mod") || modPressed) &&
          (!modifiers.has("ctrl") || event.ctrlKey) &&
          (!modifiers.has("meta") || event.metaKey) &&
          (!modifiers.has("alt") || event.altKey) &&
          (!modifiers.has("shift") || event.shiftKey) &&
          (modifiers.has("mod") || modifiers.has("ctrl") || !event.ctrlKey) &&
          (modifiers.has("mod") || modifiers.has("meta") || !event.metaKey) &&
          (modifiers.has("alt") || !event.altKey) &&
          (modifiers.has("shift") || !event.shiftKey);
        if (!matches) continue;

        event.preventDefault();
        if (
          shortcut.command === "bold" ||
          shortcut.command === "italic" ||
          shortcut.command === "underline" ||
          shortcut.command === "strike" ||
          shortcut.command === "code"
        ) {
          toggleMark(shortcut.command);
        } else if (shortcut.command === "undo") {
          undo();
        } else if (shortcut.command === "redo") {
          redo();
        } else if (shortcut.command === "clearFormatting") {
          clearAllFormatting();
        }
        return;
      }

      if (event.key === "Enter") {
        const root = editableRef.current;
        const selection = root
          ? selectionFromDom(root) ?? selectionRef.current
          : selectionRef.current;
        const block = documentRef.current.content[selection.focus.block];
        const exitBlock = !readOnly && !event.shiftKey
          ? exitEmptyTextBlock(documentRef.current, selection)
          : null;
        if (exitBlock) {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(exitBlock);
          return;
        } else if (!readOnly && block?.type === "codeBlock") {
          event.preventDefault();
          updateSelection(selection);
          commitTransaction(
            insertTextAtSelection(
              documentRef.current,
              selection,
              "\n",
            ),
          );
          return;
        }
      }
      if (event.key === "Tab") {
        const selection = selectionRef.current;
        const block = documentRef.current.content[selection.focus.block];
        if (!readOnly && block && block.type !== "horizontalRule") {
          event.preventDefault();
          const currentIndent = block.indent ?? 0;
          if (block.listType) {
            shiftCurrentListIndent(event.shiftKey ? -1 : 1);
          } else {
            changeBlockIndent(currentIndent + (event.shiftKey ? -1 : 1));
          }
        }
        return;
      }

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
      } else if (key === "`") {
        event.preventDefault();
        toggleMark("code");
      } else if (
        event.shiftKey &&
        (key === "s" || key === "x")
      ) {
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
      <>
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
        onInput={handleInput}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onFocus={handleKeyUp}
        onMouseDown={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("[data-puzzle-editor-control]")
          ) {
            event.preventDefault();
          }
        }}
        onClick={(event) => {
          if (!(event.target instanceof Element)) return;
          const checkbox = event.target.closest<HTMLButtonElement>(
            '[data-puzzle-editor-control="checklist"]',
          );
          if (checkbox) {
            event.preventDefault();
            if (!checkbox.disabled) {
              toggleListItemAtIndex(
                Number(checkbox.dataset.puzzleBlockIndex),
              );
            }
            return;
          }
          if (event.target.closest("a")) {
            event.preventDefault();
          }
        }}
      />
      {iconMarkers.map((marker, index) =>
        createPortal(
          <Icon
            name={marker.dataset.puzzleIconName ?? ""}
            size={Number(marker.dataset.puzzleIconSize) || 18}
            color={marker.dataset.puzzleIconColor ?? "currentColor"}
          >
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </Icon>,
          marker,
          index,
        ),
      )}
      </>
    );
  },
);

Editor.displayName = "Editor";

export {
  Editor,
  type TextEditorHandle,
  type TextEditorCommands,
  type EditorProps,
};
