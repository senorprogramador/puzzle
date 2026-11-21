"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { useRovingFocus } from "@puzzle-ui/hooks";
import { Button } from "../../actions/button";
import { Stack } from "../../layout/stack";
import { Popover } from "../../overlays/popover";
import { Icon } from "@puzzle-ui/icons";
import { DEFAULT_COLOR_SCHEME } from "@puzzle-ui/theme";
import { useTextEditor } from ".";
import { cn } from "@puzzle-ui/core";
import {
  getBlockText,
  getOrderedSelection,
  getListSelectionState,
  TEXT_HEADING_VARIANTS,
  MAX_TEXT_LIST_INDENT,
  normalizeLinkHref,
} from "./text-document";
import { IconListPicker } from "./icon-list-picker";
import type { TextListIcon } from "./text-editor.types";

import "./text-editor-toolbar.css";

type TextEditorToolbarProps = {
  className?: string;
  ariaLabel?: string;
  dir?: "ltr" | "rtl";
};

const headingStyles = TEXT_HEADING_VARIANTS;
const headingLabel = (variant: string) =>
  variant.replace(/(\D)(\d)/, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());

const TextEditorToolbar = ({
  className,
  ariaLabel = "Text formatting",
  dir = "ltr",
}: TextEditorToolbarProps) => {
  const {
    toggleMark,
    isActive,
    setTextAlign,
    isTextAlignActive,
    setBlockType,
    setBlockStyle,
    insertHorizontalRule,
    clearInlineFormatting,
    applyListType,
    removeList,
    shiftListIndent,
    setBlockIndent,
    setListAttributes,
    beginListAttributePreview,
    previewListAttributes,
    finishListAttributePreview,
    setListChecked,
    setListInteractive,
    getActiveLink,
    getDocument,
    focus,
    selection,
    setLink,
    undo,
    redo,
    canUndo,
    canRedo,
    readOnly,
  } = useTextEditor();

  const iconSize = 20;
  const classes = cn("text-editor-toolbar", className);
  const linkErrorId = useId();
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [linkError, setLinkError] = useState("");
  const [canRemoveLink, setCanRemoveLink] = useState(false);
  const [listPopoverOpen, setListPopoverOpen] = useState(false);
  const [listPanel, setListPanel] = useState<
    "menu" | "checklist" | "icon"
  >("menu");
  const [blockPopoverOpen, setBlockPopoverOpen] = useState(false);

  const canUndoAction = canUndo?.() ?? false;
  const canRedoAction = canRedo?.() ?? false;
  const { start, end } = getOrderedSelection(selection);
  const canLink = getDocument?.().content.some((block, index) => {
    if (index < start.block || index > end.block) return false;
    const from = index === start.block ? start.offset : 0;
    const to = index === end.block ? end.offset : getBlockText(block).length;
    return to > from;
  }) ?? false;
  const listDocument = getDocument?.();
  const listState = listDocument
    ? getListSelectionState(listDocument, selection)
    : { status: "disabled" as const };
  const selectedListBlocks = (() => {
    if (!listDocument) return [];
    const collapsed =
      selection.anchor.block === selection.focus.block &&
      selection.anchor.offset === selection.focus.offset;
    const lastBlock =
      collapsed
        ? start.block
        : end.offset === 0 && end.block > start.block
          ? end.block - 1
          : end.block;
    return listDocument.content.slice(start.block, lastBlock + 1);
  })();
  const selectedBlock = selectedListBlocks[0];
  const precedingBlock = listDocument?.content[start.block - 1];
  const canIndent = Boolean(selectedBlock) &&
    (selectedBlock?.indent ?? 0) < MAX_TEXT_LIST_INDENT &&
    (!selectedBlock?.listType ||
      Boolean(precedingBlock?.listType &&
        (precedingBlock.indent ?? 0) >= (selectedBlock.indent ?? 0)));
  const canOutdent = selectedListBlocks.some((block) => (block.indent ?? 0) > 0);
  const blockStyleLabel = (() => {
    if (!selectedBlock) return "Paragraph";
    if (selectedListBlocks.some((block) =>
      block.type !== selectedBlock.type || block.variant !== selectedBlock.variant
    )) return "Mixed";
    if (selectedBlock.type === "heading") return headingLabel(selectedBlock.variant);
    if (selectedBlock.type === "blockquote") return "Blockquote";
    if (selectedBlock.type === "codeBlock") return "Code block";
    if (selectedBlock.listType) return "List";
    return "Paragraph";
  })();
  const selectedChecklistBlocks = selectedListBlocks.filter(
    (block) => block.listType === "checklist",
  );
  const canRemoveList = selectedListBlocks.some(
    (block) => block.listType !== undefined || block.type === "listItem",
  );
  const allChecklistInteractive =
    selectedChecklistBlocks.length > 0 &&
    selectedChecklistBlocks.every(
      (block) => block.listAttributes?.interactive === true,
    );
  const mixedChecklistInteractive =
    selectedChecklistBlocks.some(
      (block) => block.listAttributes?.interactive === true,
    ) && !allChecklistInteractive;
  const iconValue: TextListIcon =
    listState.listType === "icon" && listState.attributes?.icon
      ? listState.attributes.icon
      : { name: "mdi:circle", size: 18, color: DEFAULT_COLOR_SCHEME.light.primary };

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: [
      { id: "block-style", disabled: readOnly },
      { id: "bold", disabled: readOnly },
      { id: "italic", disabled: readOnly },
      { id: "underline", disabled: readOnly },
      { id: "strike", disabled: readOnly },
      { id: "code", disabled: readOnly },
      { id: "link", disabled: readOnly || !canLink },
      { id: "list", disabled: readOnly || listState.status === "disabled" },
      { id: "align-left", disabled: readOnly },
      { id: "align-center", disabled: readOnly },
      { id: "align-right", disabled: readOnly },
      { id: "align-justify", disabled: readOnly },
      { id: "undo", disabled: readOnly || !canUndoAction },
      { id: "redo", disabled: readOnly || !canRedoAction },
      { id: "blockquote", disabled: readOnly },
      { id: "code-block", disabled: readOnly },
      { id: "indent", disabled: readOnly || !canIndent },
      { id: "outdent", disabled: readOnly || !canOutdent },
      { id: "horizontal-rule", disabled: readOnly },
      { id: "clear-formatting", disabled: readOnly },
    ],
    orientation: "horizontal",
    dir,
  });
  const listMenuFocus = useRovingFocus<HTMLButtonElement>({
    items: [
      { id: "bullet", disabled: readOnly },
      { id: "ordered", disabled: readOnly },
      { id: "checklist", disabled: readOnly },
      { id: "icon", disabled: readOnly },
      { id: "remove-list", disabled: readOnly || !canRemoveList },
    ],
    orientation: "vertical",
    dir,
  });
  const blockMenuFocus = useRovingFocus<HTMLButtonElement>({
    items: [
      { id: "paragraph", disabled: readOnly },
      ...headingStyles.map((id) => ({ id, disabled: readOnly })),
    ],
    orientation: "vertical",
    dir,
  });

  const getToolbarItemProps = (id: string, disabled = false) => ({
    ref: rovingFocus.getItemRef(id),
    tabIndex: rovingFocus.getItemTabIndex(id, disabled),
    onFocus: () => rovingFocus.onItemFocus(id),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      rovingFocus.onItemKeyDown(event, id),
  });

  const getListMenuItemProps = (id: string, disabled = false) => ({
    ref: listMenuFocus.getItemRef(id),
    tabIndex: listMenuFocus.getItemTabIndex(id, disabled),
    onFocus: () => listMenuFocus.onItemFocus(id),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      listMenuFocus.onItemKeyDown(event, id),
  });
  const getBlockMenuItemProps = (id: string, disabled = false) => ({
    ref: blockMenuFocus.getItemRef(id),
    tabIndex: blockMenuFocus.getItemTabIndex(id, disabled),
    onFocus: () => blockMenuFocus.onItemFocus(id),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      blockMenuFocus.onItemKeyDown(event, id),
  });

  return (
    <Stack
      className={classes}
      direction="row"
      alignH="start"
      alignV="stretch"
      gap="md"
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      dir={dir}
    >
      <Popover
        aria-label="Block styles"
        open={blockPopoverOpen}
        onOpenChange={setBlockPopoverOpen}
        trigger={
          <Button
            {...getToolbarItemProps("block-style", readOnly)}
            aria-label="Block style"
            aria-description={blockStyleLabel}
            variant="outline"
            disabled={readOnly}
            onMouseDown={(event) => event.preventDefault()}
          >
            {blockStyleLabel}
          </Button>
        }
      >
        <div className="text-editor-toolbar__list-actions" role="group" aria-label="Block styles">
          <Button
            {...getBlockMenuItemProps("paragraph", readOnly)}
            type="button"
            variant={selectedBlock?.type === "paragraph" ? "toggle-active" : "outline"}
            aria-pressed={selectedBlock?.type === "paragraph"}
            onClick={() => {
              setBlockType?.("paragraph");
              setBlockPopoverOpen(false);
            }}
          >
            Paragraph
          </Button>
          {headingStyles.map((variant) => (
            <Button
              key={variant}
              {...getBlockMenuItemProps(variant, readOnly)}
              type="button"
              variant={selectedBlock?.type === "heading" && selectedBlock.variant === variant ? "toggle-active" : "outline"}
              aria-pressed={selectedBlock?.type === "heading" && selectedBlock.variant === variant}
              onClick={() => {
                setBlockStyle?.(variant);
                setBlockPopoverOpen(false);
              }}
            >
              {headingLabel(variant)}
            </Button>
          ))}
        </div>
      </Popover>
      <Stack
        direction="row"
        alignH="start"
        alignV="center"
        gap="xs"
        role="group"
        aria-label="Text style"
      >
        <Button
          {...getToolbarItemProps("bold", readOnly)}
          aria-label="Bold"
          aria-pressed={isActive?.("bold") ?? false}
          variant={isActive?.("bold") ? "toggle-active" : "toggle"}
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("bold")}
        >
          <Icon name="oui:editor-bold" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("italic", readOnly)}
          aria-label="Italic"
          aria-pressed={isActive?.("italic") ?? false}
          variant={isActive?.("italic") ? "toggle-active" : "toggle"}
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("italic")}
        >
          <Icon name="oui:editor-italic" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("underline", readOnly)}
          aria-label="Underline"
          aria-pressed={isActive?.("underline") ?? false}
          variant={isActive?.("underline") ? "toggle-active" : "toggle"}
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("underline")}
        >
          <Icon name="oui:editor-underline" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("strike", readOnly)}
          aria-label="Strikethrough"
          aria-pressed={isActive?.("strike") ?? false}
          variant={isActive?.("strike") ? "toggle-active" : "toggle"}
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("strike")}
        >
          <Icon name="oui:editor-strike" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("code", readOnly)}
          aria-label="Inline code"
          aria-pressed={isActive?.("code") ?? false}
          variant={isActive?.("code") ? "toggle-active" : "toggle"}
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("code")}
        >
          <Icon name="oui:editor-code-block" size={iconSize} />
        </Button>

        <Popover
          aria-label="Link settings"
          open={linkEditorOpen}
          onOpenChange={(open) => {
            if (open) {
              const activeLink = getActiveLink?.() ?? null;
              setLinkHref(activeLink ?? "");
              setCanRemoveLink(Boolean(activeLink));
            }
            setLinkError("");
            setLinkEditorOpen(open);
          }}
          trigger={
            <Button
              {...getToolbarItemProps("link", readOnly || !canLink)}
              aria-label="Link"
              aria-pressed={linkEditorOpen || Boolean(getActiveLink?.())}
              variant={linkEditorOpen || getActiveLink?.() ? "toggle-active" : "toggle"}
              disabled={readOnly || !canLink}
              onMouseDown={(event) => event.preventDefault()}
            >
              <Icon name="oui:editor-link" size={iconSize} />
            </Button>
          }
        >
          <form
            className="text-editor-toolbar__link-form"
            onSubmit={(event) => {
              event.preventDefault();
              const normalizedHref = normalizeLinkHref(linkHref);
              if (!normalizedHref) {
                setLinkError("Enter a valid link URL.");
                return;
              }
              if (!setLink?.(normalizedHref)) {
                setLinkError("Select text to apply a link.");
                return;
              }
              setLinkEditorOpen(false);
              setLinkError("");
            }}
          >
            <label className="text-editor-toolbar__link-label">
              Link URL
              <input
                autoFocus
                className="text-editor-toolbar__link-input"
                type="text"
                inputMode="url"
                value={linkHref}
                aria-invalid={Boolean(linkError)}
                aria-describedby={linkError ? linkErrorId : undefined}
                onChange={(event) => {
                  setLinkHref(event.currentTarget.value);
                  setLinkError("");
                }}
              />
            </label>
            <Button type="submit" variant="primary">
              Apply link
            </Button>
            {canRemoveLink && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (setLink?.(null)) {
                    setLinkEditorOpen(false);
                    setLinkError("");
                  } else {
                    setLinkError("Select text to remove a link.");
                  }
                }}
              >
                Remove link
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLinkEditorOpen(false);
                setLinkError("");
                focus?.();
              }}
            >
              Cancel
            </Button>
            {linkError && (
              <span
                id={linkErrorId}
                className="text-editor-toolbar__link-error"
                role="alert"
              >
                {linkError}
              </span>
            )}
          </form>
        </Popover>
      </Stack>

      <Stack
        direction="row"
        alignH="start"
        alignV="center"
        gap="xs"
        role="group"
        aria-label="Lists"
      >
        <Popover
          aria-label={
            listPanel === "icon"
              ? "Icon list settings"
              : listPanel === "checklist"
                ? "Checklist settings"
                : "List options"
          }
          open={listPopoverOpen}
          onOpenChange={(open) => {
            setListPopoverOpen(open);
            if (open) setListPanel(
              listState.listType === "icon" ? "icon" :
              listState.listType === "checklist" ? "checklist" : "menu",
            );
          }}
          trigger={
            <Button
              {...getToolbarItemProps("list", readOnly)}
              aria-label="List"
              aria-pressed={
                listState.status === "mixed"
                  ? "mixed"
                  : listState.status === "active"
              }
              data-list-state={listState.status}
              title={
                listState.status === "mixed"
                  ? "List: mixed"
                  : listState.status === "active"
                    ? `List: ${listState.listType}`
                    : "List"
              }
              variant={
                listState.status === "active" || listState.status === "mixed"
                  ? "toggle-active"
                  : "toggle"
              }
              disabled={readOnly || listState.status === "disabled"}
              onMouseDown={(event) => event.preventDefault()}
            >
              <Icon
                name={
                  listState.listType === "ordered"
                    ? "oui:editor-ordered-list"
                    : listState.listType === "checklist"
                      ? "mdi:format-list-checks"
                      : listState.listType === "icon"
                        ? iconValue.name
                        : "oui:editor-unordered-list"
                }
                size={iconSize}
                color={
                  listState.listType === "icon"
                    ? iconValue.color
                    : undefined
                }
              />
            </Button>
          }
        >
          {listPanel === "menu" ? (
            <div className="text-editor-toolbar__list-panel">
              <div
                className="text-editor-toolbar__list-actions"
                role="group"
                aria-label="List types"
              >
                <Button
                  {...getListMenuItemProps("bullet", readOnly)}
                  className="text-editor-toolbar__list-option"
                  type="button"
                  variant={
                    listState.status === "active" &&
                    listState.listType === "bullet"
                      ? "toggle-active"
                      : "outline"
                  }
                  aria-pressed={
                    listState.status === "active" &&
                    listState.listType === "bullet"
                  }
                  onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            if (listState.status === "active" && listState.listType === "bullet") removeList?.();
                            else applyListType?.("bullet");
                    setListPopoverOpen(false);
                    focus?.();
                  }}
                >
                  <Icon name="oui:editor-unordered-list" size={iconSize} />
                  Bullet
                </Button>
                <Button
                  {...getListMenuItemProps("ordered", readOnly)}
                  className="text-editor-toolbar__list-option"
                  type="button"
                  variant={
                    listState.status === "active" &&
                    listState.listType === "ordered"
                      ? "toggle-active"
                      : "outline"
                  }
                  aria-pressed={
                    listState.status === "active" &&
                    listState.listType === "ordered"
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (listState.status === "active" && listState.listType === "ordered") removeList?.();
                    else applyListType?.("ordered");
                    setListPopoverOpen(false);
                    focus?.();
                  }}
                >
                  <Icon name="oui:editor-ordered-list" size={iconSize} />
                  Ordered
                </Button>
                <Button
                  {...getListMenuItemProps("checklist", readOnly)}
                  className="text-editor-toolbar__list-option"
                  type="button"
                  variant={
                    listState.status === "active" &&
                    listState.listType === "checklist"
                      ? "toggle-active"
                      : "outline"
                  }
                  aria-pressed={
                    listState.status === "active" &&
                    listState.listType === "checklist"
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    applyListType?.("checklist");
                    setListPanel("checklist");
                  }}
                >
                  <Icon name="mdi:format-list-checks" size={iconSize} />
                  Checklist
                </Button>
                <Button
                  {...getListMenuItemProps("icon", readOnly)}
                  className="text-editor-toolbar__list-option"
                  type="button"
                  variant={
                    listState.status === "active" &&
                    listState.listType === "icon"
                      ? "toggle-active"
                      : "outline"
                  }
                  aria-pressed={
                    listState.status === "active" && listState.listType === "icon"
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    applyListType?.("icon");
                    setListPanel("icon");
                  }}
                >
                  <Icon
                    name={iconValue.name}
                    size={iconSize}
                    color={iconValue.color}
                  />
                  Icon
                </Button>
                <Button
                  {...getListMenuItemProps(
                    "remove-list",
                    readOnly || !canRemoveList,
                  )}
                  className="text-editor-toolbar__list-option"
                  type="button"
                  variant="outline"
                  disabled={readOnly || !canRemoveList}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    removeList?.();
                    setListPopoverOpen(false);
                  }}
                >
                  Remove list
                </Button>
              </div>
              {listState.status === "mixed" && (
                <p role="status">Selection contains mixed list formatting.</p>
              )}
            </div>
          ) : listPanel === "checklist" ? (
            <div className="text-editor-toolbar__list-panel">
              <label className="text-editor-toolbar__check-option">
                <input
                  type="checkbox"
                  ref={(element) => {
                    if (element) {
                      element.indeterminate = mixedChecklistInteractive;
                    }
                  }}
                  checked={allChecklistInteractive}
                  aria-checked={
                    mixedChecklistInteractive
                      ? "mixed"
                      : allChecklistInteractive
                  }
                  disabled={readOnly || selectedChecklistBlocks.length === 0}
                  onChange={(event) =>
                    setListInteractive?.(event.currentTarget.checked)
                  }
                />
                Allow checkbox interaction
              </label>
              <div className="text-editor-toolbar__list-actions">
                <Button
                  type="button"
                  variant="outline"
                  disabled={readOnly || selectedChecklistBlocks.length === 0}
                  onClick={() => setListChecked?.(true)}
                >
                  Mark selected checked
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={readOnly || selectedChecklistBlocks.length === 0}
                  onClick={() => setListChecked?.(false)}
                >
                  Mark selected unchecked
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setListPanel("menu")}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <IconListPicker
              value={iconValue}
              onChange={(icon) => setListAttributes?.({ icon }, { preserveFocus: true })}
              onPreviewStart={() => beginListAttributePreview?.()}
              onPreview={(icon) => previewListAttributes?.({ icon })}
              onPreviewFinish={(commit) => finishListAttributePreview?.(commit)}
              onCancel={() => setListPanel("menu")}
            />
          )}
        </Popover>
      </Stack>
      <Stack
        direction="row"
        alignH="start"
        alignV="center"
        gap="xs"
        role="group"
        aria-label="Alignment"
      >
        <Button {...getToolbarItemProps("align-left", readOnly)} aria-label="Align left"
          aria-pressed={isTextAlignActive?.("left") ?? false}
          variant={isTextAlignActive?.("left") ? "toggle-active" : "toggle"}
          disabled={readOnly} onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("left")}>
          <Icon name="oui:editor-align-left" size={iconSize} />
        </Button>
        <Button {...getToolbarItemProps("align-center", readOnly)} aria-label="Align center"
          aria-pressed={isTextAlignActive?.("center") ?? false}
          variant={isTextAlignActive?.("center") ? "toggle-active" : "toggle"}
          disabled={readOnly} onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("center")}>
          <Icon name="oui:editor-align-center" size={iconSize} />
        </Button>
        <Button {...getToolbarItemProps("align-right", readOnly)} aria-label="Align right"
          aria-pressed={isTextAlignActive?.("right") ?? false}
          variant={isTextAlignActive?.("right") ? "toggle-active" : "toggle"}
          disabled={readOnly} onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("right")}>
          <Icon name="oui:editor-align-right" size={iconSize} />
        </Button>
        <Button {...getToolbarItemProps("align-justify", readOnly)} aria-label="Justify text"
          aria-pressed={isTextAlignActive?.("justify") ?? false}
          variant={isTextAlignActive?.("justify") ? "toggle-active" : "toggle"}
          disabled={readOnly} onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("justify")}>
          <Icon name="energy-icons:align-justify-20" size={iconSize} />
        </Button>
      </Stack>
      <Stack direction="row" alignH="start" alignV="center" gap="xs" role="group" aria-label="History">
        <Button {...getToolbarItemProps("undo", readOnly || !canUndoAction)}
          aria-label="Undo" variant="outline" disabled={readOnly || !canUndoAction}
          onMouseDown={(event) => event.preventDefault()} onClick={() => undo?.()}>
          <Icon name="oui:editor-undo" size={iconSize} />
        </Button>
        <Button {...getToolbarItemProps("redo", readOnly || !canRedoAction)}
          aria-label="Redo" variant="outline" disabled={readOnly || !canRedoAction}
          onMouseDown={(event) => event.preventDefault()} onClick={() => redo?.()}>
          <Icon name="oui:editor-redo" size={iconSize} />
        </Button>
      </Stack>
      <Stack
        direction="row"
        alignH="start"
        alignV="center"
        gap="xs"
        role="group"
        aria-label="Block formatting"
      >
        {(["blockquote", "codeBlock"] as const).map((type) => {
          const label = type === "blockquote" ? "Blockquote" : "Code block";
          const active = selectedListBlocks.length > 0 && selectedListBlocks.every((block) => block.type === type);
          const mixed = !active && selectedListBlocks.some((block) => block.type === type);
          return (
            <Button
              key={type}
              {...getToolbarItemProps(type === "blockquote" ? "blockquote" : "code-block", readOnly)}
              aria-label={label}
              aria-pressed={mixed ? "mixed" : active}
              variant={active || mixed ? "toggle-active" : "toggle"}
              disabled={readOnly}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setBlockType?.(active ? "paragraph" : type)}
            >
              <Icon name={type === "blockquote" ? "mdi:format-quote-close" : "oui:editor-code-block"} size={iconSize} />
            </Button>
          );
        })}
      </Stack>
      <Stack direction="row" alignH="start" alignV="center" gap="xs" role="group" aria-label="Indentation">
        <Button
          {...getToolbarItemProps("indent", readOnly || !canIndent)}
          aria-label="Indent"
          variant="outline"
          disabled={readOnly || !canIndent}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const indent = Math.min(MAX_TEXT_LIST_INDENT, (selectedBlock?.indent ?? 0) + 1);
            if (selectedBlock?.listType) shiftListIndent?.(1);
            else setBlockIndent?.(indent);
          }}
        ><Icon name="mdi:format-indent-increase" size={iconSize} /></Button>
        <Button
          {...getToolbarItemProps("outdent", readOnly || !canOutdent)}
          aria-label="Outdent"
          variant="outline"
          disabled={readOnly || !canOutdent}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const indent = Math.max(0, (selectedBlock?.indent ?? 0) - 1);
            if (selectedBlock?.listType) shiftListIndent?.(-1);
            else setBlockIndent?.(indent);
          }}
        ><Icon name="mdi:format-indent-decrease" size={iconSize} /></Button>
      </Stack>
      <Stack direction="row" alignH="start" alignV="center" gap="xs" role="group" aria-label="Insert">
        <Button {...getToolbarItemProps("horizontal-rule", readOnly)} aria-label="Horizontal rule" variant="outline" disabled={readOnly} onMouseDown={(event) => event.preventDefault()} onClick={() => insertHorizontalRule?.()}>
          <Icon name="mdi:minus" size={iconSize} />
        </Button>
      </Stack>
      <Button {...getToolbarItemProps("clear-formatting", readOnly)} aria-label="Clear formatting" variant="outline" disabled={readOnly} onMouseDown={(event) => event.preventDefault()} onClick={() => clearInlineFormatting?.()}>
        <Icon name="mdi:format-clear" size={iconSize} />
      </Button>
    </Stack>
  );
};

export { TextEditorToolbar, type TextEditorToolbarProps };
