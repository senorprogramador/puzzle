"use client";

import { useEffect, useMemo, useState } from "react";
import { ContentEditor, MediaField, MediaLibrary } from "@puzzle-ui/pieces";
import { ImageUpload, VideoUpload } from "@puzzle-ui/ui";
import { createMediaClient, createMediaUploadQueue } from "@puzzle-ui/fullstack/media/client";
import { createCmsClient } from "@puzzle-ui/fullstack/cms/client";

const contentType = {
  kind: "collection",
  name: "Story",
  fields: {
    title: { type: "text", label: "Title", required: true },
    media: { type: "media", label: "Media" },
  },
};

const responseOrThrow = async (response) => {
  if (!response.ok) throw new Error(`Test request failed (${response.status}): ${await response.text()}`);
  return response;
};

export function Workflow() {
  const [hydrated, setHydrated] = useState(false);
  const [assets, setAssets] = useState([]);
  const [fields, setFields] = useState({ title: "", media: null });
  const [entry, setEntry] = useState(null);
  const [draftPreview, setDraftPreview] = useState(null);
  const [published, setPublished] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);
  const media = useMemo(() => createMediaClient({
    uploadTransport: async ({ target, file, signal, onProgress }) => {
      const location = new URL(target.url);
      if (location.protocol !== "memory:") throw new Error("Unexpected test upload target.");
      if (location.hostname === "multipart") await new Promise((resolve) => setTimeout(resolve, 30));
      const response = await responseOrThrow(await fetch(
        `/api/e2e/upload/${location.hostname}${location.pathname}`,
        {
          method: "PUT",
          headers: { "content-type": target.headers["content-type"] ?? file.type },
          body: file,
          signal,
        },
      ));
      onProgress(file.size, file.size);
      return location.hostname === "multipart" ? (await response.json()).etag : undefined;
    },
  }), []);
  const queue = useMemo(() => createMediaUploadQueue(media, { maxRetries: 0 }), [media]);
  const cms = useMemo(() => createCmsClient(), []);
  const story = useMemo(() => cms.collection("story"), [cms]);
  useEffect(() => setHydrated(true), []);
  const project = (asset) => ({
    ...asset,
    hotspots: asset.hotspots.map((hotspot) => ({
      ...hotspot,
      width: hotspot.width ?? 0,
      height: hotspot.height ?? 0,
    })),
    variants: asset.variants.map((variant) => ({
      ...variant,
      ...(asset.kind === "image" ? { previewUrl: `/api/e2e/object/${asset.id}?variant=${variant.id}` } : {}),
    })),
    ...(asset.kind === "image" ? { previewUrl: `/api/e2e/object/${asset.id}` } : {}),
  });
  const refresh = async () => {
    const page = await media.listAssets();
    setAssets(page.items.map(project));
  };
  const process = async (asset) => {
    await media.requestProcessing(asset.id);
    const response = await responseOrThrow(await fetch("/api/e2e/run-worker", { method: "POST" }));
    const { status } = await response.json();
    if (status !== "succeeded") throw new Error(`Test processor returned ${status}.`);
    await refresh();
  };
  const onImage = async (result, context) => {
    setError(null);
    try {
      const asset = await queue.upload({
        file: result.file,
        kind: "image",
        metadata: { width: result.processed.width, height: result.processed.height },
      }, {
        signal: context.signal,
        onProgress: (progress) => context.onProgress(progress.percent),
      });
      await process(asset);
    } catch (caught) {
      setError(caught.message);
      throw caught;
    }
  };
  const onVideo = (file, context) => {
    setError(null);
    setVideoInfo({
      width: context.metadata.width,
      height: context.metadata.height,
      duration: context.metadata.duration,
      posterBytes: context.poster.blob.size,
    });
    const task = queue.createTask({
      file,
      kind: "video",
      metadata: {
        width: context.metadata.width,
        height: context.metadata.height,
        duration: context.metadata.duration,
      },
    }, {
      signal: context.signal,
      onProgress: (progress) => context.onProgress(progress.percent),
    });
    return {
      pause: () => task.pause(),
      resume: () => task.resume(file),
      cancel: () => task.cancel(),
      done: task.promise.then(async (asset) => {
        context.onStatusChange("processing");
        await process(asset);
        context.onStatusChange("ready");
      }).catch((caught) => {
        setError(caught.message);
        throw caught;
      }),
    };
  };
  const saveAsset = async (assetId, patch) => {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) throw new Error("The selected asset is missing.");
    await media.updateAsset(assetId, { ...patch, expectedRevision: asset.revision });
    await refresh();
  };
  const saveDraft = async () => {
    const saved = entry
      ? await story.update(entry.id, fields, {
        expectedRevision: entry.revision,
      })
      : await story.create(fields, {
        locale: "en-US",
        slug: `story-${fields.media}`,
      });
    setEntry(saved);
    setPublished(null);
  };
  const publish = async () => {
    if (!entry) throw new Error("Save a draft first.");
    const saved = await story.publish(entry.id, {
      expectedRevision: entry.revision,
    });
    setEntry(saved);
    setPublished(await story.public.findById(entry.id));
  };
  const previewDraft = async () => {
    if (!entry) {
      setError("Save a draft first.");
      return;
    }
    try {
      setDraftPreview(await story.findById(entry.id));
    } catch (caught) {
      setError(caught.message);
    }
  };
  const checkPublicEntry = async () => {
    if (!entry) {
      setError("Save a draft first.");
      return;
    }
    try {
      setPublished(await story.public.findById(entry.id));
    } catch (caught) {
      if (caught.status === 404) {
        setPublished(null);
        return;
      }
      setError(caught.message);
    }
  };

  return (
    <main>
      <h1>CMS and media test workflow</h1>
      <output data-testid="hydrated">{String(hydrated)}</output>
      {error ? <p role="alert">{error}</p> : null}
      <section aria-label="Image upload">
        <ImageUpload format="image/png" maxWidth={32} maxHeight={32} onUpload={onImage} />
      </section>
      <section aria-label="Video upload">
        <VideoUpload onUpload={onVideo} />
        {videoInfo ? <output data-testid="video-info">{JSON.stringify(videoInfo)}</output> : null}
      </section>
      <MediaLibrary assets={assets} selectionMode="none" />
      <output data-testid="assets">{JSON.stringify(assets)}</output>
      <ContentEditor
        contentType={contentType}
        value={fields}
        onChange={setFields}
        onSaveDraft={saveDraft}
        onPublish={publish}
        renderField={({ field, value, onChange }) => field.type === "media" ? (
          <MediaField
            label={field.label}
            value={typeof value === "string" ? value : null}
            onChange={onChange}
            onSaveAsset={saveAsset}
            libraryProps={{ assets }}
          />
        ) : null}
      />
      <button type="button" onClick={previewDraft}>Preview draft</button>
      <button type="button" onClick={checkPublicEntry}>Check public visibility</button>
      <output data-testid="entry">{JSON.stringify(entry)}</output>
      <output data-testid="draft-preview">{JSON.stringify(draftPreview)}</output>
      <output data-testid="public-entry">{JSON.stringify(published)}</output>
    </main>
  );
}
