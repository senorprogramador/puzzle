import { useCallback, useState } from "react";

import {
  ImageUpload,
  VideoUpload,
  type VideoUploadHandler,
} from "@puzzle-ui/ui";

export const ImageUploadExample = () => {
  const [message, setMessage] = useState("No image uploaded yet.");

  return (
    <div className="puzzle-doc-example-stack">
      <ImageUpload
        enableCrop
        enableHotspots
        maxFileSize={10 * 1024 * 1024}
        profiles={[
          { name: "thumbnail", maxWidth: 480, maxHeight: 480 },
          { name: "hero", maxWidth: 1600, maxHeight: 900 },
        ]}
        retainOriginal={false}
        onUpload={async (result, { signal, onProgress }) => {
          for (const progress of [25, 50, 75, 100]) {
            await new Promise<void>((resolve) => setTimeout(resolve, 180));
            if (signal.aborted) throw new Error("Upload cancelled.");
            onProgress(progress);
          }
          setMessage(
            `Prepared ${result.file.name} (${result.processed.width} × ${result.processed.height}px) with ${Object.keys(result.variants).length} variants.`,
          );
        }}
      />
      <p role="status">{message}</p>
    </div>
  );
};

export const VideoUploadExample = () => {
  const [message, setMessage] = useState(
    "Select a video to preview metadata and start the local upload simulation.",
  );

  const onUpload = useCallback<VideoUploadHandler>((_file, context) => {
    let progress = 0;
    let paused = false;
    let settled = false;
    let timer: number | undefined;
    const statusTimers: number[] = [];
    let resolveUpload!: () => void;
    let rejectUpload!: (error: Error) => void;
    const done = new Promise<void>((resolve, reject) => {
      resolveUpload = resolve;
      rejectUpload = reject;
    });

    const tick = () => {
      if (paused || settled || context.signal.aborted) return;
      progress = Math.min(100, progress + 25);
      context.onProgress(progress);
      if (progress < 100) {
        timer = window.setTimeout(tick, 300);
        return;
      }

      settled = true;
      resolveUpload();
      statusTimers.push(
        window.setTimeout(() => context.onStatusChange("processing"), 250),
        window.setTimeout(() => {
          context.onStatusChange("ready");
          setMessage(
            `Ready: ${context.metadata.width} × ${context.metadata.height}px, ${Math.round(context.metadata.duration)} seconds.`,
          );
        }, 900),
      );
    };

    timer = window.setTimeout(tick, 300);
    return {
      done,
      pause: () => {
        paused = true;
        if (timer !== undefined) window.clearTimeout(timer);
      },
      resume: () => {
        if (!paused || settled) return;
        paused = false;
        timer = window.setTimeout(tick, 300);
      },
      cancel: () => {
        if (timer !== undefined) window.clearTimeout(timer);
        statusTimers.forEach((statusTimer) => window.clearTimeout(statusTimer));
        if (!settled) {
          settled = true;
          rejectUpload(new Error("Upload cancelled."));
        }
      },
    };
  }, []);

  return (
    <div className="puzzle-doc-example-stack">
      <VideoUpload
        maxFileSize={250 * 1024 * 1024}
        maxDurationSeconds={15 * 60}
        onStatusChange={(_file, status) => {
          setMessage(`Video status: ${status}`);
        }}
        onUpload={onUpload}
      />
      <p role="status">{message}</p>
    </div>
  );
};
