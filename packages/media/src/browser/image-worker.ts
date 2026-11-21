/// <reference lib="webworker" />

import {
  MediaCapabilityError,
  MediaError,
  MediaProcessingError,
} from "../errors/media.errors";
import { processImageOnCurrentThread } from "./image-processing";
import type { ImageWorkerRequest, ImageWorkerResponse } from "./image-worker-protocol";

const scope = globalThis as typeof globalThis & DedicatedWorkerGlobalScope;
const respond = (message: ImageWorkerResponse): void => scope.postMessage(message);

scope.addEventListener("message", (event: MessageEvent<ImageWorkerRequest>) => {
  const { image, options, crop } = event.data;
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap !== "function") {
    respond({ type: "fallback" });
    return;
  }
  void processImageOnCurrentThread(image, {
    ...options,
    onProgress: (progress) => respond({ type: "progress", progress }),
  }, crop).then(
    (result) => respond({ type: "result", result }),
    (error: unknown) => {
      if (error instanceof MediaCapabilityError ||
          (error instanceof MediaError && error.code === "INVALID_FILE")) {
        respond({ type: "fallback" });
        return;
      }
      respond({
        type: "error",
        code: error instanceof MediaError ? error.code : "PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Image processing failed.",
        ...(error instanceof MediaProcessingError ? { retryable: error.retryable } : {}),
      });
    },
  );
});

respond({ type: "ready" });
