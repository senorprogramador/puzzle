import type { TreeViewItem } from "@puzzle-ui/ui";
import type {
  MediaLibraryAsset,
  MediaLibraryFolder,
  MediaLibraryQuery,
} from "./media.types";

export const DEFAULT_MEDIA_LIBRARY_QUERY: MediaLibraryQuery = {
  folderId: null,
  search: "",
  kind: "all",
  status: "all",
  tag: null,
  sortBy: "name",
  sortDirection: "asc",
  page: 1,
  pageSize: 24,
  view: "grid",
};

export const buildMediaFolderTree = (
  folders: readonly MediaLibraryFolder[],
): TreeViewItem<MediaLibraryFolder>[] => {
  const seenFolderIds = new Set<string>();
  const uniqueFolders = folders.filter((folder) => {
    if (seenFolderIds.has(folder.id)) return false;
    seenFolderIds.add(folder.id);
    return true;
  });
  const byId = new Map(uniqueFolders.map((folder) => [folder.id, folder]));
  const childrenByParent = new Map<string, MediaLibraryFolder[]>();
  const roots: MediaLibraryFolder[] = [];

  for (const folder of uniqueFolders) {
    if (folder.parentId && byId.has(folder.parentId)) {
      const children = childrenByParent.get(folder.parentId) ?? [];
      children.push(folder);
      childrenByParent.set(folder.parentId, children);
    } else {
      roots.push(folder);
    }
  }

  const visited = new Set<string>();
  const createItem = (
    folder: MediaLibraryFolder,
    ancestors: ReadonlySet<string>,
  ): TreeViewItem<MediaLibraryFolder> => {
    if (ancestors.has(folder.id)) {
      return {
        id: folder.id,
        label: folder.name,
        textValue: folder.name,
        data: folder,
      };
    }

    visited.add(folder.id);
    const nextAncestors = new Set(ancestors).add(folder.id);
    const children = (childrenByParent.get(folder.id) ?? []).map((child) =>
      createItem(child, nextAncestors),
    );

    return {
      id: folder.id,
      label: folder.name,
      textValue: folder.name,
      ...(children.length > 0 ? { children } : {}),
      data: folder,
    };
  };

  const tree = roots.map((folder) => createItem(folder, new Set<string>()));

  for (const folder of uniqueFolders) {
    if (!visited.has(folder.id)) tree.push(createItem(folder, new Set<string>()));
  }

  return tree;
};

export const getMediaFolderPath = (
  folders: readonly MediaLibraryFolder[],
  folderId: string | null,
): MediaLibraryFolder[] => {
  if (!folderId) return [];
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const path: MediaLibraryFolder[] = [];
  const visited = new Set<string>();
  let current = byId.get(folderId);

  while (current && !visited.has(current.id)) {
    path.push(current);
    visited.add(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return path.reverse();
};

export const filterAndSortMediaAssets = (
  assets: readonly MediaLibraryAsset[],
  query: MediaLibraryQuery,
): MediaLibraryAsset[] => {
  const normalizedSearch = query.search.trim().toLocaleLowerCase();
  const filtered = assets.filter((asset) => {
    if (query.folderId !== null && asset.folderId !== query.folderId) {
      return false;
    }
    if (query.kind !== "all" && asset.kind !== query.kind) return false;
    if (query.status !== "all" && asset.status !== query.status) return false;
    if (query.tag && !asset.tags.includes(query.tag)) return false;
    if (!normalizedSearch) return true;

    return [
      asset.displayName,
      asset.originalName,
      asset.mimeType,
      asset.altText,
      asset.caption,
      asset.title,
      asset.description,
      ...asset.tags,
    ]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
  });

  const direction = query.sortDirection === "asc" ? 1 : -1;
  return filtered.sort((left, right) => {
    const leftValue =
      query.sortBy === "name"
        ? left.displayName
        : query.sortBy === "updatedAt"
          ? toTimestamp(left.updatedAt)
          : left[query.sortBy];
    const rightValue =
      query.sortBy === "name"
        ? right.displayName
        : query.sortBy === "updatedAt"
          ? toTimestamp(right.updatedAt)
          : right[query.sortBy];

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * direction;
    }

    return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    }) * direction;
  });
};

export const formatMediaFileSize = (size: number): string => {
  if (!Number.isFinite(size) || size < 0) return "Unknown size";
  if (size < 1024) return `${size} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

export const formatMediaDuration = (duration: number): string => {
  if (!Number.isFinite(duration) || duration < 0) return "Unknown duration";
  const totalSeconds = Math.floor(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const formatMediaDate = (date: string | Date | undefined): string => {
  if (!date) return "—";
  const parsed = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed);
};

const toTimestamp = (date: string | Date | undefined): number => {
  if (!date) return 0;
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isFinite(parsed.getTime()) ? parsed.getTime() : 0;
};
