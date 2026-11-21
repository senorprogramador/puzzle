import { useState } from "react";
import {
  AssetDetailsPanel,
  AssetPickerDialog,
  MediaField,
  MediaLibrary,
} from "@puzzle-ui/pieces";
import type {
  MediaLibraryAsset,
  MediaLibraryFolder,
  MediaLibraryPropsForPicker,
} from "@puzzle-ui/pieces";

const previewUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23c8d9ef'/%3E%3C/svg%3E";

const initialAssets: MediaLibraryAsset[] = [
  {
    id: "north-coast",
    folderId: "photography",
    originalName: "north-coast-original.webp",
    displayName: "North coast",
    kind: "image",
    mimeType: "image/webp",
    size: 482_000,
    status: "ready",
    previewUrl,
    width: 2400,
    height: 1800,
    altText: "Cliffs along the north coast",
    caption: "Coastal light at the end of the day.",
    title: "North coast",
    description: "Editorial photography for the travel campaign.",
    tags: ["campaign", "travel"],
    crop: null,
    hotspots: [],
    focalPoint: null,
    variants: [
      {
        id: "north-coast-thumb",
        assetId: "north-coast",
        name: "Thumbnail",
        kind: "thumbnail",
        status: "ready",
        width: 480,
        height: 360,
        previewUrl,
      },
    ],
    usages: [
      {
        resourceType: "Page",
        resourceId: "coast-guide",
        fieldKey: "heroImage",
      },
    ],
    updatedAt: "2026-10-28T12:00:00.000Z",
  },
  {
    id: "launch-trailer",
    folderId: "video",
    originalName: "launch-trailer.mp4",
    displayName: "Launch trailer",
    kind: "video",
    mimeType: "video/mp4",
    size: 18_400_000,
    status: "processing",
    tags: ["campaign", "launch"],
    hotspots: [],
    focalPoint: null,
    variants: [],
    duration: 43,
  },
];

const initialFolders: MediaLibraryFolder[] = [
  { id: "photography", name: "Photography", parentId: null },
  { id: "video", name: "Video", parentId: null },
];

const getPickerLibraryProps = (
  assets: readonly MediaLibraryAsset[],
  folders: readonly MediaLibraryFolder[],
): MediaLibraryPropsForPicker => ({ assets, folders });

export const MediaLibraryExample = () => {
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  return (
    <MediaLibrary
      assets={initialAssets}
      folders={initialFolders}
      selectedAssetIds={selectedAssetIds}
      onSelectionChange={setSelectedAssetIds}
      selectionMode="multiple"
      defaultQuery={{ pageSize: 8 }}
    />
  );
};

export const AssetPickerDialogExample = () => {
  const [open, setOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  return (
    <div className="puzzle-media-example">
      <button type="button" onClick={() => setOpen(true)}>
        {selectedAssetId ? "Change selected asset" : "Choose an asset"}
      </button>
      <AssetPickerDialog
        open={open}
        onOpenChange={setOpen}
        libraryProps={getPickerLibraryProps(initialAssets, initialFolders)}
        allowedKinds={["image", "video"]}
        value={selectedAssetId}
        onConfirm={setSelectedAssetId}
      />
      {selectedAssetId ? <p>Selected asset ID: {selectedAssetId}</p> : null}
    </div>
  );
};

export const AssetDetailsPanelExample = () => {
  const [asset, setAsset] = useState(initialAssets[0]!);
  return (
    <AssetDetailsPanel
      asset={asset}
      folders={initialFolders}
      onSave={async (_assetId, patch) =>
        setAsset((current) => ({ ...current, ...patch }))
      }
    />
  );
};

export const MediaFieldExample = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [value, setValue] = useState<string | null>("north-coast");
  const selectedAsset = assets.find((asset) => asset.id === value);
  return (
    <MediaField
      label="Feature image"
      description="Choose one image for this page."
      required
      value={value}
      asset={selectedAsset}
      onChange={setValue}
      onSaveAsset={(assetId, patch) =>
        setAssets((current) =>
          current.map((item) =>
            item.id === assetId ? { ...item, ...patch } : item,
          ),
        )
      }
      libraryProps={getPickerLibraryProps(assets, initialFolders)}
      allowedKinds={["image"]}
    />
  );
};
