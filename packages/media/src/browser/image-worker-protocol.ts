import type { MediaCrop } from "../types/media.types";
import type { BrowserMediaProgress } from "./browser-utils";
import type { ImageProcessingResult, ResizeImageOptions } from "./image-processing";

export type ImageWorkerRequest = {
  readonly image: Blob;
  readonly options: Omit<ResizeImageOptions, "signal" | "onProgress">;
  readonly crop?: MediaCrop;
};

export type ImageWorkerResponse =
  | { readonly type: "ready" }
  | { readonly type: "fallback" }
  | { readonly type: "progress"; readonly progress: BrowserMediaProgress }
  | { readonly type: "result"; readonly result: ImageProcessingResult }
  | {
      readonly type: "error";
      readonly code: string;
      readonly message: string;
      readonly retryable?: boolean;
    };
