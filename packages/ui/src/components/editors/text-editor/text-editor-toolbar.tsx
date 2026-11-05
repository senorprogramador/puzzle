"use client";

import type { KeyboardEvent } from "react";

import { useRovingFocus } from "@puzzle/hooks";
import { Button } from "../../actions/button";
import { Stack } from "../../layout/stack";
import { Icon } from "@puzzle/icons";
import { useTextEditor } from ".";
import { cn } from "@puzzle/core";

import "./text-editor-toolbar.css";

type TextEditorToolbarProps = {
  className?: string;
  ariaLabel?: string;
  dir?: "ltr" | "rtl";
};

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
    setListType,
    isListTypeActive,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTextEditor();

  const iconSize = 20;
  const classes = cn("text-editor-toolbar", className);

  const canUndoAction = canUndo?.() ?? false;
  const canRedoAction = canRedo?.() ?? false;

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: [
      { id: "bold" },
      { id: "italic" },
      { id: "underline" },
      { id: "strike" },
      { id: "align-left" },
      { id: "align-center" },
      { id: "align-right" },
      { id: "align-justify" },
      { id: "undo", disabled: !canUndoAction },
      { id: "redo", disabled: !canRedoAction },
      { id: "list-bullet" },
      { id: "list-ordered" },
    ],
    orientation: "horizontal",
    dir,
  });

  const getToolbarItemProps = (id: string, disabled = false) => ({
    ref: rovingFocus.getItemRef(id),
    tabIndex: rovingFocus.getItemTabIndex(id, disabled),
    onFocus: () => rovingFocus.onItemFocus(id),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      rovingFocus.onItemKeyDown(event, id),
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
      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          {...getToolbarItemProps("bold")}
          aria-label="Bold"
          variant={isActive?.("bold") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("bold")}
        >
          <Icon name="oui:editor-bold" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("italic")}
          aria-label="Italic"
          variant={isActive?.("italic") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("italic")}
        >
          <Icon name="oui:editor-italic" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("underline")}
          aria-label="Underline"
          variant={isActive?.("underline") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("underline")}
        >
          <Icon name="oui:editor-underline" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("strike")}
          aria-label="Strikethrough"
          variant={isActive?.("strike") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("strike")}
        >
          <Icon name="oui:editor-strike" size={iconSize} />
        </Button>
      </Stack>

      <div
        role="separator"
        aria-orientation="vertical"
        style={{ width: "1px", backgroundColor: "#ccc", minHeight: "24px" }}
      />

      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          {...getToolbarItemProps("align-left")}
          aria-label="Align left"
          variant={isTextAlignActive?.("left") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("left")}
        >
          <Icon name="oui:editor-align-left" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("align-center")}
          aria-label="Align center"
          variant={isTextAlignActive?.("center") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("center")}
        >
          <Icon name="oui:editor-align-center" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("align-right")}
          aria-label="Align right"
          variant={isTextAlignActive?.("right") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("right")}
        >
          <Icon name="oui:editor-align-right" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("align-justify")}
          aria-label="Justify text"
          variant={isTextAlignActive?.("justify") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("justify")}
        >
          <Icon name="energy-icons:align-justify-20" size={iconSize} />
        </Button>
      </Stack>

      <div
        role="separator"
        aria-orientation="vertical"
        style={{ width: "1px", backgroundColor: "#ccc", minHeight: "24px" }}
      />

      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          {...getToolbarItemProps("undo", !canUndoAction)}
          aria-label="Undo"
          variant="outline"
          disabled={!canUndoAction}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => undo?.()}
        >
          <Icon name="oui:editor-undo" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("redo", !canRedoAction)}
          aria-label="Redo"
          variant="outline"
          disabled={!canRedoAction}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => redo?.()}
        >
          <Icon name="oui:editor-redo" size={iconSize} />
        </Button>
      </Stack>

      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          {...getToolbarItemProps("list-bullet")}
          aria-label="Bulleted list"
          variant={isListTypeActive?.("bullet") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setListType?.("bullet")}
        >
          <Icon name="oui:editor-ordered-list" size={iconSize} />
        </Button>

        <Button
          {...getToolbarItemProps("list-ordered")}
          aria-label="Numbered list"
          variant={isListTypeActive?.("ordered") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setListType?.("ordered")}
        >
          <Icon name="oui:editor-unordered-list" size={iconSize} />
        </Button>
      </Stack>
    </Stack>
  );
};

export { TextEditorToolbar, type TextEditorToolbarProps };
