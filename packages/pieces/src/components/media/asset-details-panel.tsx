"use client";

import { useEffect, useId, useState } from "react";
import {
  Autocomplete,
  Button,
  FormField,
  Image,
  ImageBox,
  ImageCropper,
  ImageHotspotEditor,
  MediaFrame,
  Select,
  Stack,
  TextAreaInput,
  TextInput,
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
              <Stack
                as="li"
                key={variant.id}
                direction="row"
                gap="sm"
              >
                <span>{variant.name}</span>
                <span>{variant.status}</span>
                {variant.width && variant.height ? (
                  <span>{variant.width} × {variant.height}</span>
                ) : null}
              </Stack>
            ))}
          </ul>
        </section>
      ) : null}
      {asset.usages?.length ? (
        <section className="puzzle-asset-details__usages" aria-labelledby={`${panelId}-usages`}>
          <h3 id={`${panelId}-usages`}>Used by</h3>
          <ul>
            {asset.usages.map((usage, index) => (
              <Stack
                as="li"
                key={`${usage.resourceType}:${usage.resourceId}:${usage.fieldKey}:${index}`}
                direction="row"
                gap="sm"
              >
                <span>{usage.resourceType}</span>
                <span>{usage.resourceId}</span>
                <span>{usage.fieldKey}</span>
              </Stack>
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
      <Stack
        as="header"
        className="puzzle-asset-details__header"
        direction="row"
        alignH="between"
        alignV="start"
        gap="md"
      >
        <div>
          <h2 id={`${panelId}-title`}>Asset details</h2>
          <p>{asset.displayName}</p>
        </div>
        {onClose ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label="Close asset details"
            onClick={onClose}
          >
            Close
          </Button>
        ) : null}
      </Stack>

      <Stack
        className="puzzle-asset-details__tabs"
        direction="row"
        gap="sm"
        wrap="nowrap"
        role="tablist"
        aria-label="Asset details sections"
      >
        {(["details", "crop", "hotspots"] as const).map((tab) => (
          <Button
            key={tab}
            id={`${panelId}-tab-${tab}`}
            type="button"
            size="sm"
            variant="ghost"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${panelId}-panel`}
            disabled={tab !== "details" && asset.kind !== "image"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" ? "Details" : tab === "crop" ? "Crop" : "Hotspots"}
          </Button>
        ))}
      </Stack>

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
              <FormField label="Display name">
                <TextInput
                  value={draft.displayName ?? asset.displayName}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ displayName: event.currentTarget.value })
                  }
                />
              </FormField>
              <FormField label="Folder" disabled={!canEdit}>
                <Select<string>
                  options={[
                    { label: "No folder", value: "" },
                    ...folders.map((folder) => ({
                      label: folder.name,
                      value: folder.id,
                    })),
                  ]}
                  value={draft.folderId ?? ""}
                  onChange={(folderId) =>
                    updateDraft({ folderId: folderId || null })
                  }
                />
              </FormField>
              <FormField label="Alt text">
                <TextInput
                  value={draft.altText ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ altText: event.currentTarget.value })
                  }
                />
              </FormField>
              <FormField label="Title">
                <TextInput
                  value={draft.title ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ title: event.currentTarget.value })
                  }
                />
              </FormField>
              <FormField label="Caption">
                <TextAreaInput
                  value={draft.caption ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ caption: event.currentTarget.value })
                  }
                />
              </FormField>
              <FormField label="Description">
                <TextAreaInput
                  value={draft.description ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraft({ description: event.currentTarget.value })
                  }
                />
              </FormField>
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
        <Stack
          className="puzzle-asset-details__actions"
          direction="row"
          alignH="end"
          alignV="center"
          gap="md"
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!isDirty || isSaving}
            onClick={cancel}
          >
            Cancel changes
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!isDirty || isSaving}
            onClick={save}
          >
            {isSaving ? "Saving…" : "Save details"}
          </Button>
        </Stack>
      ) : null}
    </aside>
  );
};

export { AssetDetailsPanel };
