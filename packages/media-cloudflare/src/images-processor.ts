import type {
  MediaProcessor,
  MediaProcessingOutput,
  MediaProcessingOutputVariant,
  MediaProcessorInput,
} from "@puzzle-ui/media";
import { validateMediaImageProfiles } from "@puzzle-ui/media";
import { CloudflareMediaProviderError } from "./errors";
import type {
  CloudflareImagesOutputLike,
  CloudflareImagesProcessorOptions,
} from "./types";
import { sha256 } from "./utils";

const readOutput = async (
  output: CloudflareImagesOutputLike,
): Promise<{ readonly bytes: Uint8Array; readonly mimeType?: string }> => {
  const response = await output.response();
  if ("ok" in response && response.ok === false) {
    throw new CloudflareMediaProviderError(
      `Cloudflare Images returned HTTP ${response.status}.`,
    );
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  const contentType =
    response.headers?.get("content-type") ?? response.headers?.get("Content-Type") ?? undefined;
  return { bytes, ...(contentType ? { mimeType: contentType } : {}) };
};

const throwIfAborted = (signal?: AbortSignal): void => {
  if (!signal?.aborted) return;
  const error = new Error("Cloudflare Images processing was aborted.");
  error.name = "AbortError";
  throw error;
};

const profileKey = (profile: MediaProcessorInput["profiles"][number]): string =>
  JSON.stringify([
    profile.maxWidth ?? null,
    profile.maxHeight ?? null,
    profile.format ?? null,
    profile.quality ?? null,
  ]);

/**
 * MediaProcessor implementation for the Cloudflare Images binding. The
 * binding's exact runtime type differs between Workers releases, so it is
 * injected as a small structural interface. Source reads and variant writes
 * are also injected to keep credentials and object keys server-side.
 */
export class CloudflareImagesProcessor implements MediaProcessor {
  private readonly options: CloudflareImagesProcessorOptions;
  private nextId = 0;

  constructor(options: CloudflareImagesProcessorOptions) {
    this.options = options;
  }

  async processImage(input: MediaProcessorInput): Promise<MediaProcessingOutput> {
    const profiles = validateMediaImageProfiles(input.profiles);
    const variants: MediaProcessingOutputVariant[] = [];
    const transformedByProfile = new Map<string, MediaProcessingOutputVariant>();
    for (let index = 0; index < profiles.length; index += 1) {
      throwIfAborted(input.signal);
      const profile = profiles[index]!;
      const key = profileKey(profile);
      const existing = transformedByProfile.get(key);
      if (existing) {
        variants.push({ ...existing, name: profile.name });
        await input.onProgress((index + 1) / profiles.length);
        continue;
      }
      const source = await this.options.source(input.asset);
      throwIfAborted(input.signal);
      const transformed = this.options.images
        .input(source)
        .transform({
          ...(profile.maxWidth !== undefined ? { width: profile.maxWidth } : {}),
          ...(profile.maxHeight !== undefined ? { height: profile.maxHeight } : {}),
          fit: "scale-down",
        })
        .output({
          ...(profile.format
            ? { format: profile.format.replace(/^image\//, "") }
            : {}),
          ...(profile.quality !== undefined ? { quality: profile.quality } : {}),
        });
      const result = await readOutput(transformed);
      throwIfAborted(input.signal);
      const checksum = await sha256(result.bytes);
      const written = await this.options.writeVariant({
        asset: input.asset,
        profile,
        bytes: result.bytes,
        mimeType: result.mimeType ?? profile.format ?? input.asset.mimeType,
        checksum,
      });
      const mimeType = written.mimeType ?? result.mimeType ?? profile.format ?? input.asset.mimeType;
      const variant: MediaProcessingOutputVariant = {
        name: profile.name,
        kind: "image",
        object: written.object,
        mimeType,
        size: written.size ?? result.bytes.byteLength,
        checksum,
        ...(written.width !== undefined ? { width: written.width } : {}),
        ...(written.height !== undefined ? { height: written.height } : {}),
      };
      transformedByProfile.set(key, variant);
      variants.push(variant);
      await input.onProgress((index + 1) / profiles.length);
    }
    return { variants };
  }

  createVariantId(): string {
    this.nextId += 1;
    return this.options.idFactory?.() ?? `cloudflare-image-${this.nextId}`;
  }
}
