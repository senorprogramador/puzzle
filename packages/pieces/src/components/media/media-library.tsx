"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Autocomplete,
  Button,
  DataTable,
  FileUpload,
  FormField,
  Image,
  ImageUpload,
  MediaFrame,
  Select,
  Stack,
  TextInput,
  ToggleGroup,
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
  selectionActions,
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
  const pageSize =
    Number.isInteger(query.pageSize) && query.pageSize > 0
      ? query.pageSize
      : DEFAULT_MEDIA_LIBRARY_QUERY.pageSize;
  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const requestedPage =
    Number.isInteger(query.page) && query.page > 0 ? query.page : 1;
  const currentPage = Math.min(requestedPage, pageCount);
  const pageAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedAssets = assets.filter((asset) => selection.includes(asset.id));
  const selectedFolder = folders.find((folder) => folder.id === query.folderId);
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
    : (uploadKinds[0] ?? "file");
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
      } else if (
        folderForm === "rename" &&
        query.folderId &&
        folderName.trim()
      ) {
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
      const failedIds = new Set(
        result.failures.map((failure) => failure.assetId),
      );
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
        <span
          className="puzzle-media-library__preview-placeholder"
          aria-hidden="true"
        >
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
            <Stack
              as="article"
              className="puzzle-media-library__asset-card"
              direction="col"
              gap="sm"
              data-selected={isSelected || undefined}
            >
              {renderAssetPreview(asset)}
              <Stack
                className="puzzle-media-library__asset-summary"
                direction="col"
                gap="xs"
              >
                <h3 className="puzzle-media-library__asset-name">
                  {asset.displayName}
                </h3>
                <span className="puzzle-media-library__asset-meta">
                  {asset.kind} · {formatMediaFileSize(asset.size)}
                </span>
              </Stack>
              {selectionMode !== "none" ? (
                <Button
                  type="button"
                  size="sm"
                  variant={isSelected ? "secondary" : "outline"}
                  className="puzzle-media-library__select-toggle"
                  aria-label={`${isSelected ? "Deselect" : "Select"} ${asset.displayName}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleSelection(asset.id)}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              ) : null}
            </Stack>
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
        <Button
          key="name"
          type="button"
          size="sm"
          variant="link"
          className="puzzle-media-library__asset-select"
          aria-pressed={selection.includes(asset.id)}
          disabled={selectionMode === "none"}
          onClick={() => toggleSelection(asset.id)}
        >
          {asset.displayName}
        </Button>,
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
        data-has-folders={
          folders.length > 0 || onCreateFolder ? "true" : undefined
        }
      >
        {folders.length > 0 || onCreateFolder ? (
          <Stack
            as="aside"
            className="puzzle-media-library__folders"
            direction="col"
            gap="md"
            aria-label="Folders"
          >
            <Stack
              className="puzzle-media-library__folder-heading"
              direction="row"
              alignH="between"
              alignV="center"
              gap="md"
            >
              <h2>Folders</h2>
              {onCreateFolder ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFolderName("");
                    setFolderForm("create");
                  }}
                >
                  New folder
                </Button>
              ) : null}
            </Stack>
            <Button
              type="button"
              className="puzzle-media-library__root-folder"
              variant={query.folderId === null ? "secondary" : "outline"}
              fullWidth
              aria-current={query.folderId === null ? "page" : undefined}
              onClick={() => updateQuery({ folderId: null, page: 1 })}
            >
              All media
            </Button>
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
              <Stack
                className="puzzle-media-library__folder-actions"
                direction="row"
                alignV="end"
                gap="sm"
              >
                {onRenameFolder ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFolderName(selectedFolder.name);
                      setFolderForm("rename");
                    }}
                  >
                    Rename folder
                  </Button>
                ) : null}
                {onMoveFolder ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFolderForm("move")}
                  >
                    Move folder
                  </Button>
                ) : null}
              </Stack>
            ) : null}
            {folderForm ? (
              <Stack
                as="form"
                className="puzzle-media-library__folder-form"
                direction="col"
                gap="sm"
                onSubmit={handleFolderFormSubmit}
              >
                {folderForm === "move" ? (
                  <FormField
                    className="puzzle-media-library__control"
                    label="Move folder to"
                  >
                    <Select<string>
                      options={[
                        { label: "Top level", value: "" },
                        ...folders
                          .filter(
                            (folder) => !excludedFolderTargets.has(folder.id),
                          )
                          .map((folder) => ({
                            label: folder.name,
                            value: folder.id,
                          })),
                      ]}
                      value={folderTarget}
                      onChange={(value) => setFolderTarget(value ?? "")}
                    />
                  </FormField>
                ) : (
                  <FormField
                    className="puzzle-media-library__control"
                    label={
                      folderForm === "create"
                        ? "Folder name"
                        : "New folder name"
                    }
                    required
                  >
                    <TextInput
                      autoFocus
                      value={folderName}
                      onChange={(event) =>
                        setFolderName(event.currentTarget.value)
                      }
                    />
                  </FormField>
                )}
                <Stack
                  className="puzzle-media-library__inline-actions"
                  direction="row"
                  alignV="end"
                  gap="sm"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isFolderPending}
                  >
                    {isFolderPending ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFolderForm(null)}
                    disabled={isFolderPending}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        ) : null}

        <Stack className="puzzle-media-library__main" direction="col" gap="md">
          <Stack
            as="header"
            className="puzzle-media-library__header"
            direction="row"
            alignH="between"
            alignV={{ mobile: "start", tablet: "center" }}
            gap="md"
          >
            <div>
              <Stack
                as="nav"
                className="puzzle-media-library__breadcrumbs"
                direction="row"
                alignV="center"
                gap="sm"
                aria-label="Folder breadcrumbs"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  className="puzzle-media-library__breadcrumb-link"
                  aria-current={query.folderId === null ? "page" : undefined}
                  onClick={() => updateQuery({ folderId: null, page: 1 })}
                >
                  All media
                </Button>
                {folderPath.map((folder, index) => (
                  <Stack
                    as="span"
                    key={folder.id}
                    className="puzzle-media-library__breadcrumb"
                    direction="row"
                    alignV="center"
                    gap="sm"
                  >
                    <span aria-hidden="true">/</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      className="puzzle-media-library__breadcrumb-link"
                      aria-current={
                        index === folderPath.length - 1 ? "page" : undefined
                      }
                      onClick={() =>
                        updateQuery({ folderId: folder.id, page: 1 })
                      }
                    >
                      {folder.name}
                    </Button>
                  </Stack>
                ))}
              </Stack>
              <h2>{currentFolder?.name ?? "Media library"}</h2>
              <p className="puzzle-media-library__muted">
                {filteredAssets.length} asset
                {filteredAssets.length === 1 ? "" : "s"}
              </p>
            </div>
            {showUpload ? (
              <details className="puzzle-media-library__upload">
                <summary className="puzzle-media-library__upload-trigger">
                  Upload media
                </summary>
                <div className="puzzle-media-library__upload-content">
                  {uploadKinds.length > 1 ? (
                    <FormField
                      className="puzzle-media-library__control"
                      label="Upload type"
                    >
                      <Select<UploadKind>
                        options={uploadKinds.map((kind) => ({
                          value: kind,
                          label: kind === "file" ? "Other files" : `${kind}s`,
                        }))}
                        value={activeUploadKind}
                        onChange={(kind) => {
                          if (kind !== undefined) setUploadKind(kind);
                        }}
                      />
                    </FormField>
                  ) : null}
                  {activeUploadKind === "image" && upload?.image ? (
                    <ImageUpload
                      multiple
                      onUpload={handleImageUpload}
                      onReject={(rejections) =>
                        setActionFeedback({
                          role: "alert",
                          message: rejections
                            .map((item) => item.message)
                            .join(" "),
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
                          message: rejections
                            .map((item) => item.message)
                            .join(" "),
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
                          message: rejections
                            .map((item) => item.message)
                            .join(" "),
                        })
                      }
                    />
                  ) : null}
                </div>
              </details>
            ) : null}
          </Stack>

          <div className="puzzle-media-library__toolbar">
            <FormField
              className="puzzle-media-library__control puzzle-media-library__search"
              label="Search media"
            >
              <TextInput
                type="search"
                value={query.search}
                placeholder="Search name, description, or tag"
                onChange={(event) =>
                  updateQuery({ search: event.currentTarget.value, page: 1 })
                }
              />
            </FormField>
            <FormField className="puzzle-media-library__control" label="Type">
              <Select<MediaLibraryQuery["kind"]>
                options={[
                  { label: "All types", value: "all" },
                  { label: "Images", value: "image" },
                  { label: "Videos", value: "video" },
                  { label: "Audio", value: "audio" },
                  { label: "Documents", value: "document" },
                  { label: "Other", value: "other" },
                ]}
                value={query.kind}
                onChange={(kind) => {
                  if (kind !== undefined) updateQuery({ kind, page: 1 });
                }}
              />
            </FormField>
            <FormField className="puzzle-media-library__control" label="Status">
              <Select<MediaLibraryQuery["status"]>
                options={[
                  { label: "All statuses", value: "all" },
                  { label: "Pending upload", value: "pending-upload" },
                  { label: "Uploaded", value: "uploaded" },
                  { label: "Processing", value: "processing" },
                  { label: "Ready", value: "ready" },
                  { label: "Failed", value: "failed" },
                  { label: "Deleted", value: "deleted" },
                ]}
                value={query.status}
                onChange={(status) => {
                  if (status !== undefined) updateQuery({ status, page: 1 });
                }}
              />
            </FormField>
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
            <FormField
              className="puzzle-media-library__control"
              label="Sort by"
            >
              <Select<MediaLibraryQuery["sortBy"]>
                options={[
                  { label: "Name", value: "name" },
                  { label: "Type", value: "kind" },
                  { label: "Status", value: "status" },
                  { label: "File size", value: "size" },
                  { label: "Last updated", value: "updatedAt" },
                ]}
                value={query.sortBy}
                onChange={(sortBy) => {
                  if (sortBy !== undefined) updateQuery({ sortBy, page: 1 });
                }}
              />
            </FormField>
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label={`Sort ${query.sortDirection === "asc" ? "descending" : "ascending"}`}
              onClick={() =>
                updateQuery({
                  sortDirection: query.sortDirection === "asc" ? "desc" : "asc",
                  page: 1,
                })
              }
            >
              {query.sortDirection === "asc" ? "Ascending" : "Descending"}
            </Button>
            <ToggleGroup
              className="puzzle-media-library__view-toggle"
              type="single"
              value={query.view}
              required
              spacing={4}
              aria-label="View mode"
              onValueChange={(view) => {
                if (view === "grid" || view === "list") {
                  updateQuery({ view });
                }
              }}
            >
              <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
              <ToggleGroup.Item value="list">List</ToggleGroup.Item>
            </ToggleGroup>
          </div>

          {selection.length > 0 ? (
            <Stack
              className="puzzle-media-library__selection"
              direction={{ mobile: "col", tablet: "col", desktop: "row" }}
              alignV="center"
              gap="md"
              role="group"
              aria-label="Selected assets"
            >
              <span>{selection.length} selected</span>
              {onCopyReference && selection.length === 1 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
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
                </Button>
              ) : null}
              {onSaveAsset && selection.length === 1 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setDetailsOpen((open) => !open)}
                >
                  {detailsOpen ? "Hide details" : "Details"}
                </Button>
              ) : null}
              {onBulkAction ? (
                <Stack
                  className="puzzle-media-library__bulk-actions"
                  direction={{ mobile: "col", desktop: "row" }}
                  alignV="center"
                  gap="md"
                >
                  <FormField
                    className="puzzle-media-library__control"
                    label="Bulk action"
                  >
                    <Select<MediaLibraryBulkAction["type"]>
                      options={[
                        { label: "Move", value: "move" },
                        { label: "Soft delete", value: "delete" },
                        { label: "Restore", value: "restore" },
                      ]}
                      value={bulkAction.type}
                      onChange={(type) => {
                        if (type === undefined) return;
                        setBulkAction(
                          type === "move"
                            ? { type, folderId: query.folderId }
                            : { type },
                        );
                      }}
                    />
                  </FormField>
                  {bulkAction.type === "move" ? (
                    <FormField
                      className="puzzle-media-library__control"
                      label="Destination"
                    >
                      <Select<string>
                        options={[
                          { label: "Top level", value: "" },
                          ...folders.map((folder) => ({
                            label: folder.name,
                            value: folder.id,
                          })),
                        ]}
                        value={bulkAction.folderId ?? ""}
                        onChange={(folderId) =>
                          setBulkAction({
                            type: "move",
                            folderId: folderId || null,
                          })
                        }
                      />
                    </FormField>
                  ) : null}
                  <Button
                    type="button"
                    variant="primary"
                    disabled={isActionPending}
                    onClick={runBulkAction}
                  >
                    {isActionPending ? "Working…" : "Apply"}
                  </Button>
                </Stack>
              ) : null}
              {selectionActions}
            </Stack>
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
            <p
              className="puzzle-media-library__state"
              role="status"
              aria-live="polite"
            >
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
                <Button type="button" variant="primary" onClick={resetFilters}>
                  Clear filters
                </Button>
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
              <Stack
                as="nav"
                className="puzzle-media-library__pagination"
                direction="row"
                alignH="center"
                alignV="center"
                gap="md"
                aria-label="Media library pages"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={currentPage <= 1 || loadingNextPage}
                  onClick={() => updateQuery({ page: currentPage - 1 })}
                >
                  Previous
                </Button>
                <span aria-live="polite">
                  Page {currentPage} of {pageCount}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= pageCount || loadingNextPage}
                  onClick={() => updateQuery({ page: currentPage + 1 })}
                >
                  Next
                </Button>
              </Stack>
            </div>
          )}
        </Stack>
      </div>
      {detailsOpen && selectedAssets[0] && onSaveAsset ? (
        <AssetDetailsPanel
          asset={selectedAssets[0]}
          folders={folders}
          onSave={(assetId: string, patch: MediaLibraryMetadataPatch) =>
            onSaveAsset(assetId, patch)
          }
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </section>
  );
};

export { MediaLibrary };
