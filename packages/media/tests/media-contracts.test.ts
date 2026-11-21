import { describe, expect, it } from "bun:test";
import {
  MediaValidationError,
  normalizeMediaCrop,
  normalizeMediaChecksum,
  normalizeMediaFocalPoint,
  normalizeMediaHotspots,
  normalizeMediaTags,
  validateMediaFileMetadata,
  validateMediaImageProfiles,
  validateMediaVideoProfiles,
} from "../src";

describe("media contracts", () => {
  it("normalizes checksums, tags, and serializable coordinates", () => {
    expect(
      normalizeMediaChecksum({
        algorithm: "sha256",
        value: "A".repeat(64),
      }).value,
    ).toBe("a".repeat(64));
    expect(normalizeMediaTags([" hero ", "hero", "", "mobile"])).toEqual([
      "hero",
      "mobile",
    ]);
    expect(normalizeMediaCrop({ x: 0.1, y: 0.2, width: 0.5, height: 0.4 })).toEqual({
      x: 0.1,
      y: 0.2,
      width: 0.5,
      height: 0.4,
    });
    expect(
      normalizeMediaHotspots([
        { id: "cta", x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
      ]),
    ).toHaveLength(1);
    expect(normalizeMediaHotspots([
      { id: "point", x: 1, y: 1, width: 0, height: 0 },
      { id: "implicit-point", x: 0.5, y: 0.5 },
    ])).toEqual([
      { id: "point", x: 1, y: 1, width: 0, height: 0 },
      { id: "implicit-point", x: 0.5, y: 0.5 },
    ]);
    const point = normalizeMediaFocalPoint({ x: 0, y: 1 });
    const uiNormalizedImagePoint: { readonly x: number; readonly y: number } = point;
    expect(uiNormalizedImagePoint).toEqual({ x: 0, y: 1 });
    expect(
      JSON.parse(
        JSON.stringify(normalizeMediaFocalPoint({ x: 0.25, y: 0.75 })),
      ),
    ).toEqual({ x: 0.25, y: 0.75 });
  });

  it("rejects invalid coordinates, metadata, and processing profiles", () => {
    expect(() =>
      normalizeMediaCrop({ x: 0.9, y: 0, width: 0.2, height: 0.5 }),
    ).toThrow(MediaValidationError);
    expect(() =>
      normalizeMediaHotspots([
        { id: "one", x: 0.5, y: 0.5 },
        { id: "one", x: 0.25, y: 0.25 },
      ]),
    ).toThrow(MediaValidationError);
    for (const hotspot of [
      { id: "mixed", x: 0.5, y: 0.5, width: 0, height: 0.1 },
      { id: "missing", x: 0.5, y: 0.5, width: 0 },
      { id: "outside", x: 0.9, y: 0.5, width: 0.2, height: 0.1 },
    ]) {
      expect(() => normalizeMediaHotspots([hotspot])).toThrow(MediaValidationError);
    }
    expect(() => normalizeMediaFocalPoint({ x: -0.01, y: 0.5 })).toThrow(
      MediaValidationError,
    );
    expect(() => normalizeMediaFocalPoint({ x: 0.5, y: Number.NaN })).toThrow(
      MediaValidationError,
    );
    expect(() =>
      validateMediaFileMetadata({
        kind: "image",
        mimeType: "video/mp4",
        size: 12,
      }),
    ).toThrow(MediaValidationError);
    expect(() =>
      validateMediaImageProfiles([{ name: "invalid" }]),
    ).toThrow(MediaValidationError);
    expect(() =>
      validateMediaVideoProfiles([
        { name: "mobile", maxWidth: 360, videoBitrate: -1 },
      ]),
    ).toThrow(MediaValidationError);
  });

  it("requires complete image dimensions and validates dates through JSON-safe values", () => {
    const metadata = validateMediaFileMetadata({
      kind: "image",
      mimeType: "image/png",
      size: 10,
      width: 10,
      height: 8,
    });
    expect(metadata.width).toBe(10);
    expect(() =>
      validateMediaFileMetadata({
        kind: "image",
        mimeType: "image/png",
        size: 10,
        width: 10,
      }),
    ).toThrow(MediaValidationError);
    const serialized = JSON.stringify({
      createdAt: new Date("2026-01-02T03:04:05.000Z"),
      crop: normalizeMediaCrop({ x: 0, y: 0, width: 1, height: 1 }),
    });
    expect(serialized).toContain("2026-01-02T03:04:05.000Z");
  });
});
