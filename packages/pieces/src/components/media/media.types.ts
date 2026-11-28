import type {
  FileUploadUploadContext,
  ImageUploadContext,
  ImageUploadResult,
  VideoUploadContext,
  VideoUploadSession,
} from "@puzzle-ui/ui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type MediaLibraryAssetKind =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "other";

export type MediaLibraryAssetStatus =
  | "pending-upload"
  | "uploaded"
  | "processing"
  | "ready"
  | "failed"
  | "deleted";

export type MediaLibraryCrop = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type MediaLibraryFocalPoint = {
  readonly x: number;
  readonly y: number;
};

export type MediaLibraryHotspot = MediaLibraryCrop & {
  readonly id: string;
  readonly label?: string;
  readonly data?: Readonly<Record<string, string | number | boolean | null>>;
};

export type MediaLibraryVariant = {
  readonly id: string;
  readonly assetId: string;
  readonly name: string;
  readonly kind: "image" | "video" | "poster" | "manifest" | "thumbnail";
  readonly status: "pending" | "ready" | "failed";
  readonly mimeType?: string;
  readonly size?: number;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly bitrate?: number;
  readonly createdAt?: string | Date;
  readonly updatedAt?: string | Date;
  /** A caller-supplied, temporary URL for a preview image or poster. */
  readonly previewUrl?: string | null;
};

export type MediaLibraryUsage = {
  readonly resourceType: string;
  readonly resourceId: string;
  readonly fieldKey: string;
  readonly updatedAt?: string | Date;
};

/**
 * Safe browser-facing asset data. It intentionally excludes storage object
 * references, tenant/audit internals, and processing error details.
 */
export type MediaLibraryAsset = {
  readonly id: string;
  readonly folderId: string | null;
  readonly originalName: string;
  readonly displayName: string;
  readonly kind: MediaLibraryAssetKind;
  readonly mimeType: string;
  readonly size: number;
  readonly status: MediaLibraryAssetStatus;
  /** Caller-provided ephemeral authorized image/poster URL; never derived here. */
  readonly previewUrl?: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly orientation?: number;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags: readonly string[];
  readonly crop?: MediaLibraryCrop | null;
  readonly hotspots: readonly MediaLibraryHotspot[];
  readonly focalPoint: MediaLibraryFocalPoint | null;
  readonly variants: readonly MediaLibraryVariant[];
  readonly usages?: readonly MediaLibraryUsage[];
  readonly createdAt?: string | Date;
  readonly updatedAt?: string | Date;
};

/** Folder fields safe to send to a browser-facing media manager. */
export type MediaLibraryFolder = {
  readonly id: string;
  readonly parentId: string | null;
  readonly name: string;
};

export type MediaLibrarySortField =
  | "name"
  | "kind"
  | "status"
  | "size"
  | "updatedAt";

export type MediaLibraryQuery = {
  /** `null` browses all supplied assets; a folder ID limits results to that folder. */
  folderId: string | null;
  search: string;
  kind: MediaLibraryAssetKind | "all";
  status: MediaLibraryAssetStatus | "all";
  tag: string | null;
  sortBy: MediaLibrarySortField;
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
  view: "grid" | "list";
};

export type MediaLibraryMetadataPatch = Partial<
  Pick<
    MediaLibraryAsset,
    | "displayName"
    | "folderId"
    | "altText"
    | "caption"
    | "title"
    | "description"
    | "tags"
    | "crop"
    | "hotspots"
    | "focalPoint"
  >
>;

export type MediaLibraryBulkAction =
  | { type: "move"; folderId: string | null }
  | { type: "delete" }
  | { type: "restore" };

export type MediaLibraryBulkActionResult = {
  succeededIds: readonly string[];
  failures: readonly {
    assetId: string;
    message?: string;
  }[];
};

export type MediaLibraryVideoUploadSession = VideoUploadSession & {
  /** Optional created asset ID reported after the supplied upload completes. */
  assetId?: string;
};

export type MediaLibraryUploadActions = {
  image?: (
    result: ImageUploadResult,
    context: ImageUploadContext,
  ) => Promise<string | void>;
  video?: (
    file: File,
    context: VideoUploadContext,
  ) =>
    | MediaLibraryVideoUploadSession
    | Promise<MediaLibraryVideoUploadSession>;
  file?: (
    file: File,
    context: FileUploadUploadContext,
  ) => Promise<string | void>;
  onAssetUploaded?: (assetId: string) => void;
};

export type MediaLibraryProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onError"
> & {
  assets: readonly MediaLibraryAsset[];
  folders?: readonly MediaLibraryFolder[];
  selectionMode?: "none" | "single" | "multiple";
  selectedAssetIds?: readonly string[];
  defaultSelectedAssetIds?: readonly string[];
  onSelectionChange?: (assetIds: string[]) => void;
  query?: MediaLibraryQuery;
  defaultQuery?: Partial<MediaLibraryQuery>;
  onQueryChange?: (query: MediaLibraryQuery) => void;
  loading?: boolean;
  loadingNextPage?: boolean;
  error?: ReactNode;
  permissionDenied?: boolean;
  canUpload?: boolean;
  upload?: MediaLibraryUploadActions;
  onCreateFolder?: (
    name: string,
    parentId: string | null,
  ) => void | Promise<void>;
  onRenameFolder?: (
    folderId: string,
    name: string,
  ) => void | Promise<void>;
  onMoveFolder?: (
    folderId: string,
    parentId: string | null,
  ) => void | Promise<void>;
  onCopyReference?: (assetId: string) => void | Promise<void>;
  onBulkAction?: (
    assetIds: string[],
    action: MediaLibraryBulkAction,
  ) => MediaLibraryBulkActionResult | void | Promise<MediaLibraryBulkActionResult | void>;
  onSaveAsset?: (
    assetId: string,
    patch: MediaLibraryMetadataPatch,
  ) => void | Promise<void>;
  showDetailsPanel?: boolean;
  /** Additional controls rendered beside the selected-asset actions. */
  selectionActions?: ReactNode;
};

export type MediaLibraryPropsForPicker = Omit<
  MediaLibraryProps,
  | "selectionMode"
  | "selectedAssetIds"
  | "defaultSelectedAssetIds"
  | "onSelectionChange"
>;

export type AssetDetailsPanelProps = {
  asset: MediaLibraryAsset;
  folders?: readonly MediaLibraryFolder[];
  readOnly?: boolean;
  onSave?: (
    assetId: string,
    patch: MediaLibraryMetadataPatch,
  ) => void | Promise<void>;
  onClose?: () => void;
  className?: string;
};

export type AssetPickerDialogCommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libraryProps: MediaLibraryPropsForPicker;
  allowedKinds?: readonly MediaLibraryAssetKind[];
  initialFolderId?: string | null;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export type AssetPickerDialogProps =
  | (AssetPickerDialogCommonProps & {
      multiple?: false;
      value?: string | null;
      onConfirm: (assetId: string) => void;
    })
  | (AssetPickerDialogCommonProps & {
      multiple: true;
      value?: readonly string[];
      onConfirm: (assetIds: string[]) => void;
    });

export type MediaFieldProps = {
  id?: string;
  name?: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  requiredMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string | null;
  asset?: MediaLibraryAsset | null;
  onChange: (assetId: string | null) => void;
  onSaveAsset?: (
    assetId: string,
    patch: MediaLibraryMetadataPatch,
  ) => void | Promise<void>;
  libraryProps: MediaLibraryPropsForPicker;
  allowedKinds?: readonly MediaLibraryAssetKind[];
  className?: string;
};
