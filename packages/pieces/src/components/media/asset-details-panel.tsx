"use client";

import { useEffect, useId, useState } from "react";
import {
  Autocomplete,
  Image,
  ImageBox,
  ImageCropper,
  ImageHotspotEditor,
  MediaFrame,
} from "@puzzle-ui/ui";
import type {
  ImageHotspotEditorValue,
  ImageHotspot,
} from "@puzzle-ui/ui";
import type {
  AssetDetailsPanelProps,
  MediaLibraryAsset,
  MediaLibraryMetadataPatch,
} from "./media.types";
import {
  formatMediaDate,
  formatMediaDuration,
  formatMediaFileSize,
} from "./media.utils";

import "./media.css";

type DetailsTab = "details" | "crop" | "hotspots";

const createDraft = (asset: MediaLibraryAsset): MediaLibraryMetadataPatch => ({
  displayName: asset.displayName,
  folderId: asset.folderId,
  altText: asset.altText ?? "",
  caption: asset.caption ?? "",
  title: asset.title ?? "",
  description: asset.description ?? "",
  tags: [...asset.tags],
  crop: asset.crop ?? null,
  hotspots: [...asset.hotspots],
  focalPoint: asset.focalPoint,
});

const getErrorMessage = (error: unknown): string =>
  error instanceof Error && error.message
    ? error.message
    : typeof error === "string" && error
      ? error
      : "Asset details could not be saved.";

const AssetDetailsPanel = ({
  asset,
  folders = [],
  readOnly = false,
  onSave,
  onClose,
  className,
}: AssetDetailsPanelProps) => {
  const panelId = useId();
  const [activeTab, setActiveTab] = useState<DetailsTab>("details");
  const [draft, setDraft] = useState<MediaLibraryMetadataPatch>(() =>
    createDraft(asset),
  );
  const [savedDraft, setSavedDraft] = useState<MediaLibraryMetadataPatch>(() =>
    createDraft(asset),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const nextDraft = createDraft(asset);
    setDraft(nextDraft);
    setSavedDraft(nextDraft);
    setSaveError(null);
    setActiveTab("details");
  }, [asset.id, asset.updatedAt]);

  const updateDraft = (patch: MediaLibraryMetadataPatch) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSaveError(null);
  };
  const isDirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
  const canEdit = !readOnly && Boolean(onSave);
  const imagePreviewUrl = asset.previewUrl;
  const previewRatio = asset.width && asset.width > 0 && asset.height && asset.height > 0
    ? asset.width / asset.height
    : 0;
  const previewAspectRatio = Number.isFinite(previewRatio * 32) && previewRatio > 0
    ? previewRatio
    : 4 / 3;
  const variantImages = [
    ...(asset.previewUrl
      ? [{
          src: asset.previewUrl,
          alt: asset.altText ?? asset.displayName,
          title: "Current preview",
        }]
      : []),
    ...asset.variants
      .filter((variant) => variant.previewUrl)
      .map((variant) => ({
        src: variant.previewUrl!,
        alt: variant.name,
        title: variant.name,
      })),
  ];
  const hotspotValue: ImageHotspotEditorValue = {
    focalPoint: draft.focalPoint ?? null,
    hotspots: (draft.hotspots ?? []).map(
      (hotspot): ImageHotspot => ({
        ...hotspot,
        width: hotspot.width ?? 0.1,
        height: hotspot.height ?? 0.1,
      }),
    ),
  };

  const save = async () => {
    if (!onSave || !canEdit || isSaving || !isDirty) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(asset.id, draft);
      setSavedDraft(draft);
    } catch (error) {
      setSaveError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    setDraft(savedDraft);
    setSaveError(null);
  };

  const renderDetails = () => (
    <div className="puzzle-asset-details__content">
      {imagePreviewUrl ? (
        <MediaFrame
          title={asset.displayName}
          caption={`${asset.kind} · ${formatMediaFileSize(asset.size)}`}
          className="puzzle-asset-details__preview"
        >
          <Image
            src={imagePreviewUrl}
            alt={asset.altText ?? asset.displayName}
            fill
            aspectRatio={previewAspectRatio}
            fit="contain"
            unoptimized
            className="puzzle-asset-details__image"
            containerStyle={{ maxWidth: `${previewAspectRatio * 32}rem` }}
            fallback={<span>Preview unavailable</span>}
          />
        </MediaFrame>
      ) : (
        <p className="puzzle-media-library__muted">Preview unavailable.</p>
      )}
      {variantImages.length > 1 ? (
        <ImageBox
          images={variantImages}
          aspectRatio={4 / 3}
          unoptimized
          className="puzzle-asset-details__variants-preview"
        />
      ) : null}
      <dl className="puzzle-asset-details__metadata">
        <div>
          <dt>File name</dt>
          <dd>{asset.originalName}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{asset.mimeType}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{formatMediaFileSize(asset.size)}</dd>
        </div>
        {asset.width && asset.height ? (
          <div>
            <dt>Dimensions</dt>
            <dd>{asset.width} × {asset.height}</dd>
          </div>
        ) : null}
        {asset.duration !== undefined ? (
          <div>
            <dt>Duration</dt>
            <dd>{formatMediaDuration(asset.duration)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Status</dt>
          <dd>{asset.status}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatMediaDate(asset.updatedAt)}</dd>
        </div>
        <div>
          <dt>Usage</dt>
          <dd>{asset.usages?.length ?? 0} references</dd>
        </div>
      </dl>
      {asset.variants.length > 0 ? (
        <section className="puzzle-asset-details__variants" aria-labelledby={`${panelId}-variants`}>
          <h3 id={`${panelId}-variants`}>Variants</h3>
          <ul>
            {asset.variants.map((variant) => (
              <li key={variant.id}>
                <span>{variant.name}</span>
                <span>{variant.status}</span>
                {variant.width && variant.height ? (
                  <span>{variant.width} × {variant.height}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {asset.usages?.length ? (
        <section className="puzzle-asset-details__usages" aria-labelledby={`${panelId}-usages`}>
          <h3 id={`${panelId}-usages`}>Used by</h3>
          <ul>
            {asset.usages.map((usage, index) => (
              <li key={`${usage.resourceType}:${usage.resourceId}:${usage.fieldKey}:${index}`}>
                <span>{usage.resourceType}</span>
                <span>{usage.resourceId}</span>
                <span>{usage.fieldKey}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );

  const renderEditor = () => {
    if (!imagePreviewUrl || asset.kind !== "image") {
      return (
        <p className="puzzle-media-library__muted">
          Image editing requires an image preview URL supplied by the caller.
        </p>
      );
    }

    return activeTab === "crop" ? (
      <ImageCropper
        src={imagePreviewUrl}
        alt={asset.altText ?? asset.displayName}
        label="Image crop"
        value={draft.crop ?? undefined}
        disabled={!canEdit}
        onChange={(crop) => updateDraft({ crop })}
      />
    ) : (
      <ImageHotspotEditor
        src={imagePreviewUrl}
        alt={asset.altText ?? asset.displayName}
        label="Image focal point and hotspots"
        value={hotspotValue}
        disabled={!canEdit}
        onChange={(value) =>
          updateDraft({
            focalPoint: value.focalPoint ?? null,
            hotspots: value.hotspots,
          })
        }
      />
    );
  };

  return (
    <aside
      className={`puzzle-asset-details ${className ?? ""}`}
      aria-labelledby={`${panelId}-title`}
    >
      <header className="puzzle-asset-details__header">
        <div>
          <h2 id={`${panelId}-title`}>Asset details</h2>
          <p>{asset.displayName}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            className="puzzle-media-library__text-button"
            aria-label="Close asset details"
            onClick={onClose}
          >
            Close
          </button>
        ) : null}
      </header>

      <div className="puzzle-asset-details__tabs" role="tablist" aria-label="Asset details sections">
        {(["details", "crop", "hotspots"] as const).map((tab) => (
          <button
            key={tab}
            id={`${panelId}-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${panelId}-panel`}
            disabled={tab !== "details" && asset.kind !== "image"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" ? "Details" : tab === "crop" ? "Crop" : "Hotspots"}
          </button>
        ))}
      </div>

      <div
        id={`${panelId}-panel`}
        className="puzzle-asset-details__panel"
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
      >
        {activeTab === "details" ? (
          <>
            {renderDetails()}
            <div className="puzzle-asset-details__form">
              <label>
                <span>Display name</span>
                <input
                  value={draft.displayName ?? asset.displayName}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ displayName: event.currentTarget.value })
                  }
                />
              </label>
              <label>
                <span>Folder</span>
                <select
                  value={draft.folderId ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraft({ folderId: event.currentTarget.value || null })
                  }
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Alt text</span>
                <input
                  value={draft.altText ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ altText: event.currentTarget.value })
                  }
                />
              </label>
              <label>
                <span>Title</span>
                <input
                  value={draft.title ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ title: event.currentTarget.value })
                  }
                />
              </label>
              <label>
                <span>Caption</span>
                <textarea
                  value={draft.caption ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ caption: event.currentTarget.value })
                  }
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  value={draft.description ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ description: event.currentTarget.value })
                  }
                />
              </label>
              <Autocomplete
                label="Tags"
                multiple
                freeSolo
                disabled={!canEdit}
                options={[...new Set([...asset.tags, ...(draft.tags ?? [])])].map(
                  (tag) => ({ label: tag, value: tag }),
                )}
                value={draft.tags ?? []}
                onChange={(tags) => updateDraft({ tags })}
                placeholder="Add tags"
              />
            </div>
          </>
        ) : (
          renderEditor()
        )}
      </div>

      {saveError ? (
        <p className="puzzle-asset-details__error" role="alert">
          {saveError}
        </p>
      ) : null}
      {canEdit ? (
        <div className="puzzle-asset-details__actions">
          <button
            type="button"
            className="puzzle-media-library__text-button"
            disabled={!isDirty || isSaving}
            onClick={cancel}
          >
            Cancel changes
          </button>
          <button
            type="button"
            className="puzzle-media-library__action-button"
            disabled={!isDirty || isSaving}
            onClick={save}
          >
            {isSaving ? "Saving…" : "Save details"}
          </button>
        </div>
      ) : null}
    </aside>
  );
};

export { AssetDetailsPanel };
