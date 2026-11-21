"use client";

import { useId, useMemo, useState } from "react";
import { Image, MediaFrame } from "@puzzle-ui/ui";
import { AssetDetailsPanel } from "./asset-details-panel";
import { AssetPickerDialog } from "./asset-picker-dialog";
import type {
  MediaFieldProps,
  MediaLibraryAsset,
  MediaLibraryPropsForPicker,
} from "./media.types";

import "./media.css";

const MediaField = ({
  id,
  name,
  label,
  description,
  error,
  required = false,
  requiredMessage = "Choose an asset.",
  disabled = false,
  readOnly = false,
  value = null,
  asset,
  onChange,
  onSaveAsset,
  libraryProps,
  allowedKinds,
  className,
}: MediaFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedAsset: MediaLibraryAsset | undefined =
    asset ?? libraryProps.assets.find((item) => item.id === value);
  const requiredError = required && !value ? requiredMessage : null;
  const visibleError = error || requiredError;
  const pickerAction = selectedAsset ? "Change media" : "Choose media";
  const describedBy = [
    description ? descriptionId : undefined,
    visibleError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;
  const isLocked = disabled || readOnly;
  const pickerLibraryProps: MediaLibraryPropsForPicker = useMemo(() => {
    if (!libraryProps.upload) return libraryProps;
    const uploadActions = libraryProps.upload;
    return {
      ...libraryProps,
      upload: {
        ...uploadActions,
        onAssetUploaded: (assetId) => {
          if (!isLocked) onChange(assetId);
          uploadActions.onAssetUploaded?.(assetId);
        },
      },
    };
  }, [isLocked, libraryProps, onChange]);

  return (
    <div
      className={`puzzle-media-field ${className ?? ""}`}
      role="group"
      aria-labelledby={`${fieldId}-label`}
      aria-describedby={describedBy}
      aria-invalid={Boolean(visibleError)}
      aria-required={required || undefined}
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
    >
      <span className="puzzle-media-field__label" id={`${fieldId}-label`}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      {description ? (
        <p className="puzzle-media-field__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <input
        type="hidden"
        id={fieldId}
        name={name}
        value={value ?? ""}
        disabled={disabled}
      />
      {selectedAsset ? (
        <div className="puzzle-media-field__selected">
          {selectedAsset.previewUrl ? (
            <MediaFrame
              className="puzzle-media-field__preview"
              caption={selectedAsset.displayName}
            >
              <Image
                src={selectedAsset.previewUrl}
                alt={selectedAsset.altText ?? selectedAsset.displayName}
                fill
                aspectRatio={4 / 3}
                fit="cover"
                unoptimized
                fallback={<span>Preview unavailable</span>}
              />
            </MediaFrame>
          ) : null}
          <div className="puzzle-media-field__asset-copy">
            <span>{selectedAsset.displayName}</span>
            <span className="puzzle-media-library__muted">
              {selectedAsset.kind} · {selectedAsset.status}
            </span>
          </div>
        </div>
      ) : (
        <p className="puzzle-media-field__empty">No media selected.</p>
      )}
      {selectedAsset?.kind === "image" && onSaveAsset && !isLocked ? (
        <button
          type="button"
          className="puzzle-media-library__text-button"
          aria-expanded={detailsOpen}
          aria-controls={`${fieldId}-asset-details`}
          onClick={() => setDetailsOpen((open) => !open)}
        >
          {detailsOpen ? "Hide image details" : "Edit image details"}
        </button>
      ) : null}
      {detailsOpen && selectedAsset && onSaveAsset && !isLocked ? (
        <div id={`${fieldId}-asset-details`} className="puzzle-media-field__details">
          <AssetDetailsPanel
            asset={selectedAsset}
            folders={libraryProps.folders}
            onSave={onSaveAsset}
            onClose={() => setDetailsOpen(false)}
          />
        </div>
      ) : null}
      <div className="puzzle-media-field__actions">
        <button
          type="button"
          className="puzzle-media-library__action-button"
          aria-label={`${pickerAction} for ${typeof label === "string" ? label : "field"}`}
          aria-describedby={describedBy}
          aria-invalid={Boolean(visibleError)}
          aria-required={required || undefined}
          disabled={isLocked}
          onClick={() => setPickerOpen(true)}
        >
          {pickerAction}
        </button>
        {value && !isLocked ? (
          <button
            type="button"
            className="puzzle-media-library__text-button"
            aria-label={`Remove ${selectedAsset?.displayName ?? "selected media"}`}
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        ) : null}
        {readOnly ? (
          <span className="puzzle-media-field__readonly">Read only</span>
        ) : null}
      </div>
      {visibleError ? (
        <p className="puzzle-media-field__error" id={errorId} role="alert">
          {visibleError}
        </p>
      ) : null}

      <AssetPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        libraryProps={pickerLibraryProps}
        allowedKinds={allowedKinds}
        value={value}
        onConfirm={(assetId) => onChange(assetId)}
      />
    </div>
  );
};

export { MediaField };
