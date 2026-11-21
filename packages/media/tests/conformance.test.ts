import { InMemoryMediaObjectStorageAdapter, InMemoryMediaProcessingQueueAdapter, runMediaObjectStorageConformance, runMediaProcessingQueueConformance } from "../src/testing";
import type {
  MediaMultipartPartTarget,
  MediaObjectStorageAdapter,
  MediaUploadSession,
} from "../src";

runMediaObjectStorageConformance({
  createAdapter: async () => new InMemoryMediaObjectStorageAdapter(),
  uploadSingle: async (
    adapter: MediaObjectStorageAdapter,
    session: MediaUploadSession,
    bytes: Uint8Array,
    contentType: string,
  ) => {
    if (!(adapter instanceof InMemoryMediaObjectStorageAdapter)) {
      throw new Error("The in-memory fixture requires its matching adapter.");
    }
    await adapter.writeForTesting(session.id, bytes, contentType);
  },
  uploadMultipart: async (
    adapter: MediaObjectStorageAdapter,
    session: MediaUploadSession,
    targets: readonly MediaMultipartPartTarget[],
    bytes: Uint8Array,
  ) => {
    if (!(adapter instanceof InMemoryMediaObjectStorageAdapter)) {
      throw new Error("The in-memory fixture requires its matching adapter.");
    }
    const partSize = session.partSizeBytes;
    if (!partSize) throw new Error("The multipart session did not include a part size.");
    const parts = [];
    for (const target of targets) {
      const start = (target.partNumber - 1) * partSize;
      parts.push(
        await adapter.writePartForTesting(
          session.id,
          target.partNumber,
          bytes.slice(start, start + partSize),
        ),
      );
    }
    return parts;
  },
});

runMediaProcessingQueueConformance({
  createAdapter: async () => new InMemoryMediaProcessingQueueAdapter(),
});
