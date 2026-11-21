import type { MediaProcessingQueueAdapter } from "../../src";

export type MediaProcessingQueueConformanceFixture = {
  readonly createAdapter: () => Promise<MediaProcessingQueueAdapter>;
};
