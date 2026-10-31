import { Button } from "../button/button";
import { Stack } from "../stack/stack";
import { Icon } from "@puzzle/icons";
import { useTextEditor } from "./text-editor";
import { cn } from "@puzzle/core";
import "./text-editor-toolbar.css";

type TextEditorToolbarProps = {
  className?: string;
};

const TextEditorToolbar = ({ className }: TextEditorToolbarProps) => {
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
  return (
    <Stack
      className={classes}
      direction="row"
      alignH="start"
      alignV="stretch"
      gap="md"
    >
      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          variant={isActive?.("bold") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            toggleMark?.("bold");
          }}
        >
          <Icon name="oui:editor-bold" size={iconSize} />
        </Button>
        <Button
          variant={isActive?.("italic") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("italic")}
        >
          <Icon name="oui:editor-italic" size={iconSize} />
        </Button>
        <Button
          variant={isActive?.("underline") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("underline")}
        >
          <Icon name="oui:editor-underline" size={iconSize} />
        </Button>
        <Button
          variant={isActive?.("strike") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => toggleMark?.("strike")}
        >
          <Icon name="oui:editor-strike" size={iconSize} />
        </Button>
      </Stack>
      <div
        style={{ width: "1px", backgroundColor: "#ccc", minHeight: "24px" }}
      />
      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          variant={isTextAlignActive?.("left") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("left")}
        >
          <Icon name="oui:editor-align-left" size={iconSize} />
        </Button>

        <Button
          variant={isTextAlignActive?.("center") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("center")}
        >
          <Icon name="oui:editor-align-center" size={iconSize} />
        </Button>

        <Button
          variant={isTextAlignActive?.("right") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("right")}
        >
          <Icon name="oui:editor-align-right" size={iconSize} />
        </Button>

        <Button
          variant={isTextAlignActive?.("justify") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setTextAlign?.("justify")}
        >
          <Icon name="energy-icons:align-justify-20" size={iconSize} />
        </Button>
      </Stack>
      <div
        style={{ width: "1px", backgroundColor: "#ccc", minHeight: "24px" }}
      />
      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          variant="outline"
          disabled={!canUndo?.()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            undo?.();
          }}
        >
          <Icon name="oui:editor-undo" size={iconSize} />
        </Button>
        <Button
          variant="outline"
          disabled={!canRedo?.()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            redo?.();
          }}
        >
          <Icon name="oui:editor-redo" size={iconSize} />
        </Button>
      </Stack>
      <Stack direction="row" alignH="start" alignV="center" gap="xs">
        <Button
          variant={isListTypeActive?.("bullet") ? "toggle-active" : "toggle"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setListType?.("bullet")}
        >
          <Icon name="oui:editor-ordered-list" size={iconSize} />
        </Button>
        <Button
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
