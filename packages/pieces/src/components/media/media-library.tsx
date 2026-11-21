"use client";

import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Autocomplete,
  DataTable,
  FileUpload,
  Image,
  ImageUpload,
  MediaFrame,
  TreeView,
  VideoUpload,
} from "@puzzle-ui/ui";
import type {
  FileUploadUploadContext,
  ImageUploadContext,
  ImageUploadResult,
  MediaFrameProps,
  TreeViewItem,
  VideoUploadContext,
} from "@puzzle-ui/ui";

import { AssetDetailsPanel } from "./asset-details-panel";
import {
  buildMediaFolderTree,
  DEFAULT_MEDIA_LIBRARY_QUERY,
  filterAndSortMediaAssets,
  formatMediaDate,
  formatMediaDuration,
  formatMediaFileSize,
  getMediaFolderPath,
} from "./media.utils";
import type {
  MediaLibraryAsset,
  MediaLibraryBulkAction,
  MediaLibraryBulkActionResult,
  MediaLibraryFolder,
  MediaLibraryMetadataPatch,
  MediaLibraryProps,
  MediaLibraryQuery,
  MediaLibraryVideoUploadSession,
} from "./media.types";

import "./media.css";

type FolderFormMode = "create" | "rename" | "move";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error && error.message
    ? error.message
    : typeof error === "string" && error
      ? error
      : "The action could not be completed.";

const getBulkResult = (
  result: MediaLibraryBulkActionResult | void,
  assetIds: string[],
): MediaLibraryBulkActionResult => {
  if (!result) return { succeededIds: assetIds, failures: [] };
  const selectedIds = new Set(assetIds);
  const failuresById = new Map(
    result.failures
      .filter((failure) => selectedIds.has(failure.assetId))
      .map((failure) => [failure.assetId, failure]),
  );
  const failures = [...failuresById.values()];
  const succeededIds = [...new Set(result.succeededIds)].filter(
    (id) => selectedIds.has(id) && !failuresById.has(id),
  );
  const reportedIds = new Set([
    ...succeededIds,
    ...failures.map((failure) => failure.assetId),
  ]);
  return {
    succeededIds,
    failures: [
      ...failures,
      ...assetIds
        .filter((assetId) => !reportedIds.has(assetId))
        .map((assetId) => ({
          assetId,
          message: "No result was returned for this asset.",
        })),
    ],
  };
};

const createFolderItems = (
  folders: readonly MediaLibraryFolder[],
  counts: ReadonlyMap<string, number>,
): TreeViewItem<MediaLibraryFolder>[] => {
  const addCounts = (
    items: TreeViewItem<MediaLibraryFolder>[],
  ): TreeViewItem<MediaLibraryFolder>[] =>
    items.map((item) => ({
      ...item,
      endAdornment: counts.get(item.id) ?? undefined,
      children: item.children ? addCounts(item.children) : undefined,
    }));

  return addCounts(buildMediaFolderTree(folders));
};

type UploadKind = "image" | "video" | "file";

const MediaLibrary = ({
  assets,
  folders = [],
  selectionMode = "multiple",
  selectedAssetIds,
  defaultSelectedAssetIds = [],
  onSelectionChange,
  query: controlledQuery,
  defaultQuery,
  onQueryChange,
  loading = false,
  loadingNextPage = false,
  error,
  permissionDenied = false,
  canUpload,
  upload,
  onCreateFolder,
  onRenameFolder,
  onMoveFolder,
  onCopyReference,
  onBulkAction,
  onSaveAsset,
  showDetailsPanel = false,
  className,
  ...sectionProps
}: MediaLibraryProps) => {
  const [internalQuery, setInternalQuery] = useState<MediaLibraryQuery>(() => ({
    ...DEFAULT_MEDIA_LIBRARY_QUERY,
    ...defaultQuery,
  }));
  const query = controlledQuery ?? internalQuery;
  const [internalSelection, setInternalSelection] = useState<string[]>([
    ...defaultSelectedAssetIds,
  ]);
  const selection = selectedAssetIds ?? internalSelection;
  const [bulkAction, setBulkAction] = useState<MediaLibraryBulkAction>({
    type: "delete",
  });
  const [actionFeedback, setActionFeedback] = useState<{
    role: "status" | "alert";
    message: string;
    details?: string[];
  } | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const [folderForm, setFolderForm] = useState<FolderFormMode | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderTarget, setFolderTarget] = useState("");
  const [isFolderPending, setIsFolderPending] = useState(false);
  const [uploadKind, setUploadKind] = useState<UploadKind>(
    upload?.image ? "image" : upload?.video ? "video" : "file",
  );
  const [detailsOpen, setDetailsOpen] = useState(showDetailsPanel);

  const updateQuery = (patch: Partial<MediaLibraryQuery>) => {
    const nextQuery = { ...query, ...patch };
    if (!controlledQuery) setInternalQuery(nextQuery);
    onQueryChange?.(nextQuery);
  };

  const updateSelection = (nextSelection: string[]) => {
    const uniqueIds = [...new Set(nextSelection)];
    if (selectedAssetIds === undefined) setInternalSelection(uniqueIds);
    onSelectionChange?.(uniqueIds);
  };

  const toggleSelection = (assetId: string) => {
    if (selectionMode === "none") return;
    const isSelected = selection.includes(assetId);
    if (selectionMode === "single") {
      updateSelection(isSelected ? [] : [assetId]);
      return;
    }

    updateSelection(
      isSelected
        ? selection.filter((selectedId) => selectedId !== assetId)
        : [...selection, assetId],
    );
  };

  const folderCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const asset of assets) {
      if (asset.folderId) {
        counts.set(asset.folderId, (counts.get(asset.folderId) ?? 0) + 1);
      }
    }
    return counts;
  }, [assets]);

  const folderItems = useMemo(
    () => createFolderItems(folders, folderCounts),
    [folders, folderCounts],
  );
  const folderPath = getMediaFolderPath(folders, query.folderId);
  const defaultExpandedIds = [
    ...new Set([
      ...folderItems
        .filter((folder) => folder.children?.length)
        .map((folder) => folder.id),
      ...folderPath.slice(0, -1).map((folder) => folder.id),
    ]),
  ];
  const filteredAssets = useMemo(
    () => filterAndSortMediaAssets(assets, query),
    [assets, query],
  );
  const pageSize = Number.isInteger(query.pageSize) && query.pageSize > 0
    ? query.pageSize
    : DEFAULT_MEDIA_LIBRARY_QUERY.pageSize;
  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const requestedPage = Number.isInteger(query.page) && query.page > 0
    ? query.page
    : 1;
  const currentPage = Math.min(requestedPage, pageCount);
  const pageAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedAssets = assets.filter((asset) =>
    selection.includes(asset.id),
  );
  const selectedFolder = folders.find(
    (folder) => folder.id === query.folderId,
  );
  const excludedFolderTargets = useMemo(() => {
    const excluded = new Set<string>();
    if (query.folderId) excluded.add(query.folderId);
    let addedDescendant = true;
    while (addedDescendant) {
      addedDescendant = false;
      for (const folder of folders) {
        if (
          folder.parentId &&
          excluded.has(folder.parentId) &&
          !excluded.has(folder.id)
        ) {
          excluded.add(folder.id);
          addedDescendant = true;
        }
      }
    }
    return excluded;
  }, [folders, query.folderId]);
  const hasFilters =
    Boolean(query.search.trim()) ||
    query.kind !== "all" ||
    query.status !== "all" ||
    Boolean(query.tag);
  const uploadKinds = (["image", "video", "file"] as const).filter((kind) =>
    kind === "image"
      ? Boolean(upload?.image)
      : kind === "video"
        ? Boolean(upload?.video)
        : Boolean(upload?.file),
  );
  const activeUploadKind = uploadKinds.includes(uploadKind)
    ? uploadKind
    : uploadKinds[0] ?? "file";
  const isUploadAllowed = canUpload ?? uploadKinds.length > 0;
  const showUpload = isUploadAllowed && uploadKinds.length > 0;
  const tagOptions = useMemo(
    () =>
      [...new Set(assets.flatMap((asset) => asset.tags))]
        .sort((left, right) => left.localeCompare(right))
        .map((tag) => ({ label: tag, value: tag })),
    [assets],
  );

  const resetFilters = () =>
    updateQuery({
      search: "",
      kind: "all",
      status: "all",
      tag: null,
      page: 1,
    });

  const handleFolderFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFolderPending) return;
    setIsFolderPending(true);
    setActionFeedback(null);

    try {
      if (folderForm === "create" && folderName.trim()) {
        await onCreateFolder?.(folderName.trim(), query.folderId);
        setActionFeedback({ role: "status", message: "Folder created." });
      } else if (folderForm === "rename" && query.folderId && folderName.trim()) {
        await onRenameFolder?.(query.folderId, folderName.trim());
        setActionFeedback({ role: "status", message: "Folder renamed." });
      } else if (folderForm === "move" && query.folderId) {
        await onMoveFolder?.(query.folderId, folderTarget || null);
        setActionFeedback({ role: "status", message: "Folder moved." });
      }
      setFolderForm(null);
      setFolderName("");
      setFolderTarget("");
    } catch (caught) {
      setActionFeedback({ role: "alert", message: getErrorMessage(caught) });
    } finally {
      setIsFolderPending(false);
    }
  };

  const runBulkAction = async () => {
    if (!onBulkAction || selection.length === 0 || isActionPending) return;
    setIsActionPending(true);
    setActionFeedback(null);

    try {
      const result = getBulkResult(
        await onBulkAction([...selection], bulkAction),
        [...selection],
      );
      const failedIds = new Set(result.failures.map((failure) => failure.assetId));
      updateSelection(selection.filter((assetId) => failedIds.has(assetId)));
      const successCount = result.succeededIds.length;
      const failureCount = result.failures.length;
      const message =
        failureCount > 0
          ? `${successCount} action${successCount === 1 ? "" : "s"} completed; ${failureCount} failed.`
          : `${successCount} asset${successCount === 1 ? "" : "s"} updated.`;
      setActionFeedback({
        role: failureCount > 0 ? "alert" : "status",
        message,
        ...(failureCount > 0
          ? {
              details: result.failures.map(
                (failure) =>
                  `${failure.assetId}: ${failure.message ?? "Action failed."}`,
              ),
            }
          : {}),
      });
    } catch (caught) {
      setActionFeedback({ role: "alert", message: getErrorMessage(caught) });
    } finally {
      setIsActionPending(false);
    }
  };

  const reportUploadedAsset = (assetId: string | void) => {
    if (assetId) upload?.onAssetUploaded?.(assetId);
  };

  const handleImageUpload = async (
    result: ImageUploadResult,
    context: ImageUploadContext,
  ) => {
    reportUploadedAsset(await upload?.image?.(result, context));
  };

  const handleVideoUpload = async (
    file: File,
    context: VideoUploadContext,
  ): Promise<MediaLibraryVideoUploadSession> => {
    const session = await upload?.video?.(file, context);
    if (!session) {
      return { done: Promise.resolve() };
    }
    if (!session.assetId) return session;

    return {
      ...session,
      done: session.done.then(() => {
        reportUploadedAsset(session.assetId);
      }),
    };
  };

  const handleFileUpload = async (
    file: File,
    context: FileUploadUploadContext,
  ) => {
    reportUploadedAsset(await upload?.file?.(file, context));
  };

  const renderAssetPreview = (
    asset: MediaLibraryAsset,
    frame: MediaFrameProps["frame"] = "none",
  ): ReactNode => (
    <MediaFrame frame={frame} className="puzzle-media-library__frame">
      {asset.previewUrl ? (
        <Image
          src={asset.previewUrl}
          alt=""
          fill
          fit="cover"
          unoptimized
          loading="lazy"
          containerClassName="puzzle-media-library__image"
          fallback={<span aria-hidden="true">Preview unavailable</span>}
        />
      ) : (
        <span className="puzzle-media-library__preview-placeholder" aria-hidden="true">
          {asset.kind}
        </span>
      )}
    </MediaFrame>
  );

  const renderGrid = () => (
    <ul className="puzzle-media-library__grid" aria-label="Media assets">
      {pageAssets.map((asset) => {
        const isSelected = selection.includes(asset.id);
        return (
          <li key={asset.id}>
            <article
              className="puzzle-media-library__asset-card"
              data-selected={isSelected || undefined}
            >
              {renderAssetPreview(asset)}
              <div className="puzzle-media-library__asset-summary">
                <h3 className="puzzle-media-library__asset-name">
                  {asset.displayName}
                </h3>
                <span className="puzzle-media-library__asset-meta">
                  {asset.kind} · {formatMediaFileSize(asset.size)}
                </span>
              </div>
              {selectionMode !== "none" ? (
                <button
                  type="button"
                  className="puzzle-media-library__select-toggle"
                  aria-label={`${isSelected ? "Deselect" : "Select"} ${asset.displayName}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleSelection(asset.id)}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              ) : null}
            </article>
          </li>
        );
      })}
    </ul>
  );

  const renderList = () => (
    <DataTable<MediaLibraryAsset>
      key={pageAssets
        .map((asset) =>
          [
            asset.id,
            asset.displayName,
            asset.kind,
            asset.status,
            asset.size,
            asset.updatedAt instanceof Date
              ? asset.updatedAt.toISOString()
              : asset.updatedAt,
          ].join(":"),
        )
        .join("|")}
      className="puzzle-media-library__table"
      header={["Name", "Type", "Status", "Size", "Updated"]}
      numberOfItems={pageAssets.length}
      initialItems={pageAssets}
      itemsPerPage={undefined}
      requestItems={async (start, end) => pageAssets.slice(start, end)}
      noContent="No assets found."
      renderCell={(asset) => [
        <button
          key="name"
          type="button"
          className="puzzle-media-library__asset-select"
          aria-pressed={selection.includes(asset.id)}
          disabled={selectionMode === "none"}
          onClick={() => toggleSelection(asset.id)}
        >
          {asset.displayName}
        </button>,
        asset.kind,
        asset.status,
        formatMediaFileSize(asset.size),
        formatMediaDate(asset.updatedAt),
      ]}
      aria-label="Media assets"
    />
  );

  const currentFolder = folders.find((folder) => folder.id === query.folderId);
  const noAssetsInCurrentFolder = assets.every(
    (asset) => query.folderId !== null && asset.folderId !== query.folderId,
  );
  const emptyTitle = hasFilters
    ? "No matching assets"
    : query.folderId
      ? "This folder is empty"
      : "Your media library is empty";
  const emptyDescription = hasFilters
    ? "Try a different search or clear the selected filters."
    : query.folderId
      ? "Upload media or choose another folder."
      : "Upload a file to start building your library.";

  if (permissionDenied) {
    return (
      <section
        {...sectionProps}
        className={`puzzle-media-library ${className ?? ""}`}
        role="alert"
      >
        <h2 className="puzzle-media-library__state-title">Access denied</h2>
        <p>You do not have permission to view this media library.</p>
      </section>
    );
  }

  return (
    <section
      {...sectionProps}
      className={`puzzle-media-library ${className ?? ""}`}
    >
      <div
        className="puzzle-media-library__layout"
        data-has-folders={folders.length > 0 || onCreateFolder ? "true" : undefined}
      >
        {folders.length > 0 || onCreateFolder ? (
          <aside className="puzzle-media-library__folders" aria-label="Folders">
            <div className="puzzle-media-library__folder-heading">
              <h2>Folders</h2>
              {onCreateFolder ? (
                <button
                  type="button"
                  className="puzzle-media-library__text-button"
                  onClick={() => {
                    setFolderName("");
                    setFolderForm("create");
                  }}
                >
                  New folder
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="puzzle-media-library__root-folder"
              aria-current={query.folderId === null ? "page" : undefined}
              onClick={() => updateQuery({ folderId: null, page: 1 })}
            >
              All media
            </button>
            {folderItems.length > 0 ? (
              <TreeView
                aria-label="Media folders"
                items={folderItems}
                selectionMode="single"
                defaultExpandedIds={defaultExpandedIds}
                selectedIds={query.folderId ? [query.folderId] : []}
                onSelectionChange={(ids) =>
                  updateQuery({ folderId: ids[0] ?? null, page: 1 })
                }
                expandOnItemClick={false}
                size="sm"
              />
            ) : (
              <p className="puzzle-media-library__muted">No folders yet.</p>
            )}
            {selectedFolder && (onRenameFolder || onMoveFolder) ? (
              <div className="puzzle-media-library__folder-actions">
                {onRenameFolder ? (
                  <button
                    type="button"
                    className="puzzle-media-library__text-button"
                    onClick={() => {
                      setFolderName(selectedFolder.name);
                      setFolderForm("rename");
                    }}
                  >
                    Rename folder
                  </button>
                ) : null}
                {onMoveFolder ? (
                  <button
                    type="button"
                    className="puzzle-media-library__text-button"
                    onClick={() => setFolderForm("move")}
                  >
                    Move folder
                  </button>
                ) : null}
              </div>
            ) : null}
            {folderForm ? (
              <form
                className="puzzle-media-library__folder-form"
                onSubmit={handleFolderFormSubmit}
              >
                {folderForm === "move" ? (
                  <label>
                    <span>Move folder to</span>
                    <select
                      value={folderTarget}
                      onChange={(event) => setFolderTarget(event.currentTarget.value)}
                    >
                      <option value="">Top level</option>
                      {folders
                        .filter((folder) => !excludedFolderTargets.has(folder.id))
                        .map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                    </select>
                  </label>
                ) : (
                  <label>
                    <span>
                      {folderForm === "create" ? "Folder name" : "New folder name"}
                    </span>
                    <input
                      autoFocus
                      required
                      value={folderName}
                      onChange={(event) => setFolderName(event.currentTarget.value)}
                    />
                  </label>
                )}
                <div className="puzzle-media-library__inline-actions">
                  <button
                    type="submit"
                    className="puzzle-media-library__action-button"
                    disabled={isFolderPending}
                  >
                    {isFolderPending ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="puzzle-media-library__text-button"
                    onClick={() => setFolderForm(null)}
                    disabled={isFolderPending}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </aside>
        ) : null}

        <div className="puzzle-media-library__main">
          <header className="puzzle-media-library__header">
            <div>
              <nav
                className="puzzle-media-library__breadcrumbs"
                aria-label="Folder breadcrumbs"
              >
                <button
                  type="button"
                  aria-current={query.folderId === null ? "page" : undefined}
                  onClick={() => updateQuery({ folderId: null, page: 1 })}
                >
                  All media
                </button>
                {folderPath.map((folder, index) => (
                  <span key={folder.id} className="puzzle-media-library__breadcrumb">
                    <span aria-hidden="true">/</span>
                    <button
                      type="button"
                      aria-current={
                        index === folderPath.length - 1 ? "page" : undefined
                      }
                      onClick={() =>
                        updateQuery({ folderId: folder.id, page: 1 })
                      }
                    >
                      {folder.name}
                    </button>
                  </span>
                ))}
              </nav>
              <h2>{currentFolder?.name ?? "Media library"}</h2>
              <p className="puzzle-media-library__muted">
                {filteredAssets.length} asset{filteredAssets.length === 1 ? "" : "s"}
              </p>
            </div>
            {showUpload ? (
              <details className="puzzle-media-library__upload">
                <summary className="puzzle-media-library__action-button">
                  Upload media
                </summary>
                <div className="puzzle-media-library__upload-content">
                  {uploadKinds.length > 1 ? (
                    <label className="puzzle-media-library__control">
                      <span>Upload type</span>
                      <select
                        value={activeUploadKind}
                        onChange={(event) =>
                          setUploadKind(event.currentTarget.value as UploadKind)
                        }
                      >
                        {uploadKinds.map((kind) => (
                          <option key={kind} value={kind}>
                            {kind === "file" ? "Other files" : `${kind}s`}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  {activeUploadKind === "image" && upload?.image ? (
                    <ImageUpload
                      multiple
                      onUpload={handleImageUpload}
                      onReject={(rejections) =>
                        setActionFeedback({
                          role: "alert",
                          message: rejections.map((item) => item.message).join(" "),
                        })
                      }
                    />
                  ) : activeUploadKind === "video" && upload?.video ? (
                    <VideoUpload
                      multiple
                      onUpload={handleVideoUpload}
                      onReject={(rejections) =>
                        setActionFeedback({
                          role: "alert",
                          message: rejections.map((item) => item.message).join(" "),
                        })
                      }
                    />
                  ) : activeUploadKind === "file" && upload?.file ? (
                    <FileUpload
                      multiple
                      onUpload={handleFileUpload}
                      onReject={(rejections) =>
                        setActionFeedback({
                          role: "alert",
                          message: rejections.map((item) => item.message).join(" "),
                        })
                      }
                    />
                  ) : null}
                </div>
              </details>
            ) : null}
          </header>

          <div className="puzzle-media-library__toolbar">
            <label className="puzzle-media-library__control puzzle-media-library__search">
              <span>Search media</span>
              <input
                type="search"
                value={query.search}
                placeholder="Search name, description, or tag"
                onChange={(event) =>
                  updateQuery({ search: event.currentTarget.value, page: 1 })
                }
              />
            </label>
            <label className="puzzle-media-library__control">
              <span>Type</span>
              <select
                value={query.kind}
                onChange={(event) =>
                  updateQuery({
                    kind: event.currentTarget.value as MediaLibraryQuery["kind"],
                    page: 1,
                  })
                }
              >
                <option value="all">All types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="puzzle-media-library__control">
              <span>Status</span>
              <select
                value={query.status}
                onChange={(event) =>
                  updateQuery({
                    status: event.currentTarget.value as MediaLibraryQuery["status"],
                    page: 1,
                  })
                }
              >
                <option value="all">All statuses</option>
                <option value="pending-upload">Pending upload</option>
                <option value="uploaded">Uploaded</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="failed">Failed</option>
                <option value="deleted">Deleted</option>
              </select>
            </label>
            <div className="puzzle-media-library__tag-filter">
              <Autocomplete
                label="Tag"
                options={tagOptions}
                value={query.tag ?? undefined}
                clearable
                clearLabel="Clear tag"
                noOptionsText="No tags found."
                placeholder="Filter by tag"
                onChange={(tag) => updateQuery({ tag: tag ?? null, page: 1 })}
              />
            </div>
            <label className="puzzle-media-library__control">
              <span>Sort by</span>
              <select
                value={query.sortBy}
                onChange={(event) =>
                  updateQuery({
                    sortBy: event.currentTarget.value as MediaLibraryQuery["sortBy"],
                    page: 1,
                  })
                }
              >
                <option value="name">Name</option>
                <option value="kind">Type</option>
                <option value="status">Status</option>
                <option value="size">File size</option>
                <option value="updatedAt">Last updated</option>
              </select>
            </label>
            <button
              type="button"
              className="puzzle-media-library__text-button"
              aria-label={`Sort ${query.sortDirection === "asc" ? "descending" : "ascending"}`}
              onClick={() =>
                updateQuery({
                  sortDirection: query.sortDirection === "asc" ? "desc" : "asc",
                  page: 1,
                })
              }
            >
              {query.sortDirection === "asc" ? "Ascending" : "Descending"}
            </button>
            <div className="puzzle-media-library__view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                aria-pressed={query.view === "grid"}
                onClick={() => updateQuery({ view: "grid" })}
              >
                Grid
              </button>
              <button
                type="button"
                aria-pressed={query.view === "list"}
                onClick={() => updateQuery({ view: "list" })}
              >
                List
              </button>
            </div>
          </div>

          {selection.length > 0 ? (
            <div className="puzzle-media-library__selection" aria-label="Selected assets">
              <span>
                {selection.length} selected
              </span>
              {onCopyReference && selection.length === 1 ? (
                <button
                  type="button"
                  className="puzzle-media-library__text-button"
                  onClick={async () => {
                    try {
                      await onCopyReference(selection[0]!);
                      setActionFeedback({
                        role: "status",
                        message: "Reference action completed.",
                      });
                    } catch (caught) {
                      setActionFeedback({
                        role: "alert",
                        message: getErrorMessage(caught),
                      });
                    }
                  }}
                >
                  Copy reference
                </button>
              ) : null}
              {onSaveAsset && selection.length === 1 ? (
                <button
                  type="button"
                  className="puzzle-media-library__text-button"
                  onClick={() => setDetailsOpen((open) => !open)}
                >
                  {detailsOpen ? "Hide details" : "Details"}
                </button>
              ) : null}
              {onBulkAction ? (
                <div className="puzzle-media-library__bulk-actions">
                  <label className="puzzle-media-library__control">
                    <span>Bulk action</span>
                    <select
                      value={bulkAction.type}
                      onChange={(event) => {
                        const type = event.currentTarget.value as MediaLibraryBulkAction["type"];
                        setBulkAction(
                          type === "move"
                            ? { type, folderId: query.folderId }
                            : { type },
                        );
                      }}
                    >
                      <option value="move">Move</option>
                      <option value="delete">Soft delete</option>
                      <option value="restore">Restore</option>
                    </select>
                  </label>
                  {bulkAction.type === "move" ? (
                    <label className="puzzle-media-library__control">
                      <span>Destination</span>
                      <select
                        value={bulkAction.folderId ?? ""}
                        onChange={(event) =>
                          setBulkAction({
                            type: "move",
                            folderId: event.currentTarget.value || null,
                          })
                        }
                      >
                        <option value="">Top level</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  <button
                    type="button"
                    className="puzzle-media-library__action-button"
                    disabled={isActionPending}
                    onClick={runBulkAction}
                  >
                    {isActionPending ? "Working…" : "Apply"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {actionFeedback ? (
            <div
              className="puzzle-media-library__feedback"
              role={actionFeedback.role}
            >
              <p>{actionFeedback.message}</p>
              {actionFeedback.details?.length ? (
                <ul>
                  {actionFeedback.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {loading ? (
            <p className="puzzle-media-library__state" role="status" aria-live="polite">
              Loading media…
            </p>
          ) : error ? (
            <div className="puzzle-media-library__state" role="alert">
              <h3>Unable to load media</h3>
              <div>{error}</div>
            </div>
          ) : loadingNextPage && filteredAssets.length === 0 ? (
            <p className="puzzle-media-library__state" role="status">
              Loading more assets…
            </p>
          ) : filteredAssets.length === 0 ? (
            <div className="puzzle-media-library__state" role="status">
              <h3>{emptyTitle}</h3>
              <p>
                {noAssetsInCurrentFolder && !hasFilters
                  ? emptyDescription
                  : hasFilters
                    ? "Try a different search or clear the selected filters."
                    : emptyDescription}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  className="puzzle-media-library__action-button"
                  onClick={resetFilters}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <div
              className="puzzle-media-library__results"
              aria-busy={loadingNextPage}
            >
              {query.view === "grid" ? renderGrid() : renderList()}
              {loadingNextPage ? (
                <p className="puzzle-media-library__loading-next" role="status">
                  Loading more assets…
                </p>
              ) : null}
              <nav
                className="puzzle-media-library__pagination"
                aria-label="Media library pages"
              >
                <button
                  type="button"
                  className="puzzle-media-library__text-button"
                  disabled={currentPage <= 1 || loadingNextPage}
                  onClick={() => updateQuery({ page: currentPage - 1 })}
                >
                  Previous
                </button>
                <span aria-live="polite">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  type="button"
                  className="puzzle-media-library__text-button"
                  disabled={currentPage >= pageCount || loadingNextPage}
                  onClick={() => updateQuery({ page: currentPage + 1 })}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      {detailsOpen && selectedAssets[0] && onSaveAsset ? (
        <AssetDetailsPanel
          asset={selectedAssets[0]}
          folders={folders}
          onSave={(
            assetId: string,
            patch: MediaLibraryMetadataPatch,
          ) => onSaveAsset(assetId, patch)}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </section>
  );
};

export { MediaLibrary };
