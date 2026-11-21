import { describe, expect, it } from "vitest";
import type { MediaLibraryAsset, MediaLibraryFolder } from "./media.types";
import {
  buildMediaFolderTree,
  filterAndSortMediaAssets,
  formatMediaDuration,
  formatMediaFileSize,
  getMediaFolderPath,
  DEFAULT_MEDIA_LIBRARY_QUERY,
} from "./media.utils";

const makeAsset = (
  id: string,
  overrides: Partial<MediaLibraryAsset> = {},
): MediaLibraryAsset => ({
  id,
  folderId: null,
  originalName: `${id}.png`,
  displayName: id,
  kind: "image",
  mimeType: "image/png",
  size: 1024,
  status: "ready",
  tags: [],
  hotspots: [],
  focalPoint: null,
  variants: [],
  ...overrides,
});

describe("media library utilities", () => {
  it("builds a nested folder tree and ignores repeated IDs", () => {
    const folders: MediaLibraryFolder[] = [
      { id: "root", name: "Root", parentId: null },
      { id: "child", name: "Child", parentId: "root" },
      { id: "child", name: "Duplicate", parentId: "root" },
    ];

    const tree = buildMediaFolderTree(folders);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.label).toBe("Root");
    expect(tree[0]?.children?.[0]?.label).toBe("Child");
  });

  it("returns folder breadcrumbs without looping on malformed parent links", () => {
    const folders: MediaLibraryFolder[] = [
      { id: "root", name: "Root", parentId: null },
      { id: "child", name: "Child", parentId: "root" },
    ];

    expect(getMediaFolderPath(folders, "child").map((folder) => folder.name)).toEqual([
      "Root",
      "Child",
    ]);
    expect(
      getMediaFolderPath(
        [
          { id: "a", name: "A", parentId: "b" },
          { id: "b", name: "B", parentId: "a" },
        ],
        "a",
      ),
    ).toHaveLength(2);
  });

  it("filters and sorts all supplied assets or one selected folder", () => {
    const assets = [
      makeAsset("beta", { tags: ["campaign"], size: 100 }),
      makeAsset("alpha", { tags: ["campaign"], size: 200 }),
      makeAsset("other-folder", { folderId: "archive", tags: ["campaign"] }),
    ];
    const query = {
      ...DEFAULT_MEDIA_LIBRARY_QUERY,
      search: "campaign",
      tag: "campaign",
      sortBy: "name" as const,
      sortDirection: "asc" as const,
    };

    expect(filterAndSortMediaAssets(assets, query).map((asset) => asset.id)).toEqual([
      "alpha",
      "beta",
      "other-folder",
    ]);
    expect(
      filterAndSortMediaAssets(assets, { ...query, folderId: "archive" }).map(
        (asset) => asset.id,
      ),
    ).toEqual(["other-folder"]);
  });

  it("formats sizes and durations without non-finite output", () => {
    expect(formatMediaFileSize(0)).toBe("0 B");
    expect(formatMediaFileSize(1_048_576)).toBe("1.0 MB");
    expect(formatMediaDuration(3661)).toBe("1:01:01");
    expect(formatMediaDuration(Number.NaN)).toBe("Unknown duration");
  });
});

const safeClientAsset = makeAsset("safe");
// @ts-expect-error Storage object keys are not part of the client projection.
safeClientAsset.object;
// @ts-expect-error Tenant internals are not part of the client projection.
safeClientAsset.tenantId;
// @ts-expect-error Processing errors are not part of the client projection.
safeClientAsset.processingError;
