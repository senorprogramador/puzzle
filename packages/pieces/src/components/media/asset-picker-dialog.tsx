"use client";

import { useEffect, useId, useState } from "react";
import { BREAKPOINTS } from "@puzzle-ui/theme";
import { Dialog, Drawer } from "@puzzle-ui/ui";
import { MediaLibrary } from "./media-library";
import type {
  AssetPickerDialogProps,
  MediaLibraryAsset,
  MediaLibraryQuery,
} from "./media.types";

import "./media.css";

const getInitialSelection = (props: AssetPickerDialogProps): string[] => {
  if (props.multiple) return [...(props.value ?? [])];
  return props.value ? [props.value] : [];
};

const useCompactPresentation = () => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia(
      `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
    );
    const update = () => setCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return compact;
};

const AssetPickerDialog = (props: AssetPickerDialogProps) => {
  const titleId = useId();
  const compact = useCompactPresentation();
  const [selection, setSelection] = useState(() => getInitialSelection(props));
  const valueKey = props.multiple
    ? (props.value ?? []).join("\u0000")
    : props.value ?? "";

  useEffect(() => {
    if (props.open) setSelection(getInitialSelection(props));
  }, [props.open, props.multiple, valueKey]);

  const allowedAssets: readonly MediaLibraryAsset[] = props.allowedKinds
    ? props.libraryProps.assets.filter((asset) =>
        props.allowedKinds?.includes(asset.kind),
      )
    : props.libraryProps.assets;
  const allowedIds = new Set(allowedAssets.map((asset) => asset.id));
  const eligibleSelection = selection.filter((assetId) =>
    allowedIds.has(assetId),
  );
  const defaultQuery: Partial<MediaLibraryQuery> = {
    ...props.libraryProps.defaultQuery,
    ...(props.initialFolderId !== undefined &&
    props.libraryProps.defaultQuery?.folderId === undefined
      ? { folderId: props.initialFolderId }
      : {}),
  };
  const cancelLabel = props.cancelLabel ?? "Cancel";
  const confirmLabel = props.confirmLabel ?? "Choose asset";
  const onCancel = () => props.onOpenChange(false);
  const onConfirm = () => {
    if (eligibleSelection.length === 0) return;
    if (props.multiple) {
      props.onConfirm(eligibleSelection);
    } else {
      props.onConfirm(eligibleSelection[0]!);
    }
    props.onOpenChange(false);
  };

  const pickerContent = (
    <MediaLibrary
      {...props.libraryProps}
      assets={allowedAssets}
      defaultQuery={defaultQuery}
      selectionMode={props.multiple ? "multiple" : "single"}
      selectedAssetIds={selection}
      onSelectionChange={setSelection}
    />
  );
  const footer = (
    <div className="puzzle-asset-picker__footer">
      <span aria-live="polite">
        {eligibleSelection.length} selected
      </span>
      <button
        type="button"
        className="puzzle-media-library__text-button"
        onClick={onCancel}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className="puzzle-media-library__action-button"
        disabled={eligibleSelection.length === 0}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  );

  if (compact) {
    return (
      <Drawer
        open={props.open}
        onOpenChange={props.onOpenChange}
        position="bottom"
        aria-labelledby={titleId}
        className="puzzle-asset-picker__drawer"
      >
        <header className="puzzle-asset-picker__drawer-header">
          <h2 id={titleId}>{props.title ?? "Choose media"}</h2>
          {props.description ? <p>{props.description}</p> : null}
        </header>
        <div className="puzzle-asset-picker__content">{pickerContent}</div>
        {footer}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      title={props.title ?? "Choose media"}
      description={props.description}
      size="xl"
      className="puzzle-asset-picker__dialog"
      footer={footer}
    >
      {pickerContent}
    </Dialog>
  );
};

export { AssetPickerDialog };
