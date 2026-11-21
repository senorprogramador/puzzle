"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useRovingFocus } from "@puzzle-ui/hooks";
import { Icon } from "@puzzle-ui/icons";
import { Button } from "../../actions/button";
import { ColorPicker } from "../../forms/color-picker";
import type { TextListIcon } from "./text-editor.types";
import {
  searchIconifyIcons,
  type IconifySearchResult,
} from "./iconify-search";
import "./text-editor-toolbar.css";

type SearchState =
  | { status: "idle"; results: IconifySearchResult[] }
  | { status: "loading"; results: IconifySearchResult[] }
  | { status: "success"; results: IconifySearchResult[] }
  | { status: "error"; results: IconifySearchResult[]; message: string };

type IconListPickerProps = {
  value: TextListIcon;
  onChange: (value: TextListIcon) => void;
  onPreviewStart: () => void;
  onPreview: (value: TextListIcon) => void;
  onPreviewFinish: (commit: boolean) => void;
  onCancel: () => void;
};

const IconListPicker = ({ value, onChange, onPreviewStart, onPreview, onPreviewFinish, onCancel }: IconListPickerProps) => {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
    results: [],
  });
  const [size, setSize] = useState(String(value.size));
  const sizeErrorId = useId();
  const parsedSize = Number(size);
  const invalidSize = !size || !Number.isInteger(parsedSize) || parsedSize < 8 || parsedSize > 64;
  const [colorOpen, setColorOpen] = useState(false);
  const [draftColor, setDraftColor] = useState(value.color);
  const appliedColorRef = useRef(value.color);
  const colorTriggerRef = useRef<HTMLButtonElement>(null);
  const previewActiveRef = useRef(false);
  const finishRef = useRef(onPreviewFinish);
  finishRef.current = onPreviewFinish;

  useEffect(() => {
    if (!colorOpen) setDraftColor(value.color);
  }, [colorOpen, value.color]);

  useEffect(() => () => {
    if (previewActiveRef.current) finishRef.current(false);
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setSearchState({ status: "idle", results: [] });
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
    setSearchState({ status: "loading", results: [] });
      void searchIconifyIcons(normalizedQuery, controller.signal).then(
        (results) => {
          if (!controller.signal.aborted) {
            setSearchState({ status: "success", results });
          }
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          setSearchState({
            status: "error",
            results: [],
            message:
              error instanceof Error ? error.message : "Icon search failed.",
          });
        },
      );
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: searchState.results.map((result) => ({ id: result.id })),
    orientation: "both",
    initialActiveId: value.name,
  });

  const getResultProps = (id: string) => ({
    ref: rovingFocus.getItemRef(id),
    tabIndex: rovingFocus.getItemTabIndex(id),
    onFocus: () => rovingFocus.onItemFocus(id),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      rovingFocus.onItemKeyDown(event, id),
  });

  return (
    <div className="text-editor-toolbar__icon-picker">
      <label className="text-editor-toolbar__field">
        Search icons
        <input
          type="search"
          autoFocus
          value={query}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </label>

      <div
        className="text-editor-toolbar__icon-results"
        role="group"
        aria-label="Icon search results"
      >
        {searchState.status === "idle" && (
          <p role="status">Search Iconify by name or keyword.</p>
        )}
        {searchState.status === "loading" && (
          <p role="status">Searching icons…</p>
        )}
        {searchState.status === "error" && (
          <p role="alert">{searchState.message}</p>
        )}
        {searchState.status === "success" &&
          (searchState.results.length > 0 ? (
            searchState.results.map((result) => (
              <button
                {...getResultProps(result.id)}
                key={result.id}
                type="button"
                className="text-editor-toolbar__icon-result"
                aria-pressed={value.name === result.id}
                aria-label={result.id}
                onClick={() => onChange({ ...value, name: result.id })}
              >
                <Icon name={result.id} size={20} aria-hidden="true" />
                <code>{result.prefix}</code>
                <span>{result.name}</span>
              </button>
            ))
          ) : (
            <p role="status">No icons found.</p>
          ))}
      </div>

      <div className="text-editor-toolbar__icon-preview">
        <span>Preview</span>
        <Icon name={value.name} size={value.size} color={value.color}>
          <circle cx="50" cy="50" r="8" fill="currentColor" />
        </Icon>
        <code>{value.name}</code>
      </div>

      <label className="text-editor-toolbar__field">
        Icon size
        <input
          type="number"
          min={8}
          max={64}
          step={1}
          value={size}
          aria-invalid={invalidSize || undefined}
          aria-describedby={invalidSize ? sizeErrorId : undefined}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setSize(next);
            const parsed = Number(next);
            if (next && Number.isInteger(parsed) && parsed >= 8 && parsed <= 64) {
              onChange({ ...value, size: parsed });
            }
          }}
          onBlur={() => setSize(String(value.size))}
        />
        {invalidSize && (
          <span id={sizeErrorId} role="alert">Enter a whole number from 8 to 64.</span>
        )}
      </label>

      <ColorPicker
        ref={colorTriggerRef}
        label="Icon color"
        value={draftColor === "currentColor" ? undefined : draftColor}
        open={colorOpen}
        clearable
        clearLabel="Use current text color"
        onOpenChange={(open) => {
          if (open) {
            appliedColorRef.current = value.color;
            setDraftColor(value.color);
            onPreviewStart();
            previewActiveRef.current = true;
          } else if (previewActiveRef.current) {
            previewActiveRef.current = false;
            onPreviewFinish(false);
            setDraftColor(appliedColorRef.current);
          }
          setColorOpen(open);
        }}
        onChange={(nextColor) => {
          const color = nextColor ?? "currentColor";
          setDraftColor(color);
          onPreview({ ...value, color });
        }}
        footer={
          <div className="text-editor-toolbar__icon-actions">
            <Button type="button" variant="primary" onClick={() => {
              previewActiveRef.current = false;
              onPreview({ ...value, color: draftColor });
              onPreviewFinish(true);
              setColorOpen(false);
              colorTriggerRef.current?.focus();
            }}>Apply color</Button>
            <Button type="button" variant="outline" onClick={() => {
              previewActiveRef.current = false;
              onPreviewFinish(false);
              setDraftColor(appliedColorRef.current);
              setColorOpen(false);
              colorTriggerRef.current?.focus();
            }}>Cancel color</Button>
          </div>
        }
      />

      <div className="text-editor-toolbar__icon-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Back
        </Button>
      </div>
    </div>
  );
};

export { IconListPicker, type IconListPickerProps };
