import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeComponentsProvider } from "@puzzle-ui/theme/components-context";
import { AssetDetailsPanel } from "./asset-details-panel";
import { AssetPickerDialog } from "./asset-picker-dialog";
import { MediaField } from "./media-field";
import { MediaLibrary } from "./media-library";
import type {
  MediaLibraryAsset,
  MediaLibraryFolder,
  MediaLibraryPropsForPicker,
} from "./media.types";

const assets: MediaLibraryAsset[] = [
  {
    id: "cover",
    folderId: null,
    originalName: "cover-original.png",
    displayName: "Cover image",
    kind: "image",
    mimeType: "image/png",
    size: 12_000,
    status: "ready",
    previewUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
    width: 1200,
    height: 800,
    altText: "A mountain at sunrise",
    caption: "Early light",
    title: "Sunrise",
    description: "A mountain landscape.",
    tags: ["campaign"],
    crop: null,
    hotspots: [],
    focalPoint: null,
    variants: [],
    updatedAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "detail",
    folderId: null,
    originalName: "detail.png",
    displayName: "Detail image",
    kind: "image",
    mimeType: "image/png",
    size: 8_000,
    status: "ready",
    tags: ["editorial"],
    hotspots: [],
    focalPoint: null,
    variants: [],
  },
  {
    id: "clip",
    folderId: "folder-video",
    originalName: "launch.mp4",
    displayName: "Launch clip",
    kind: "video",
    mimeType: "video/mp4",
    size: 1_000_000,
    status: "processing",
    tags: ["launch"],
    hotspots: [],
    focalPoint: null,
    variants: [],
  },
];

const folders: MediaLibraryFolder[] = [
  { id: "folder-media", name: "Media", parentId: null },
  { id: "folder-video", name: "Video", parentId: "folder-media" },
];

const pickerLibraryProps: MediaLibraryPropsForPicker = {
  assets,
  folders,
};

it("renders temporary previews with dimension-free framework image overrides", () => {
  const options: Array<{ fill?: boolean; unoptimized?: boolean }> = [];
  const FrameworkImage = ({ src, alt, fill, unoptimized }: {
    src: string;
    alt: string;
    fill?: boolean;
    unoptimized?: boolean;
  }) => {
    if (!fill) throw new Error("Framework images need dimensions or fill.");
    options.push({ fill, unoptimized });
    return <img src={src} alt={alt} />;
  };
  const asset: MediaLibraryAsset = {
    ...assets[0]!,
    width: undefined,
    height: undefined,
    variants: [{
      id: "variant",
      assetId: "cover",
      name: "thumbnail",
      kind: "thumbnail",
      status: "ready",
      previewUrl: "/temporary-thumbnail",
    }],
  };

  render(
    <ThemeComponentsProvider components={{ image: FrameworkImage }}>
      <MediaLibrary assets={[asset]} />
      <MediaField label="Media" value={asset.id} asset={asset} onChange={vi.fn()} libraryProps={{ assets: [asset] }} />
      <AssetDetailsPanel asset={asset} />
    </ThemeComponentsProvider>,
  );

  expect(options.length).toBeGreaterThanOrEqual(5);
  expect(options.every(({ fill, unoptimized }) => fill && unoptimized)).toBe(true);
});

describe("MediaLibrary", () => {
  it("searches supplied assets and returns selected asset IDs", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <MediaLibrary
        assets={assets}
        folders={folders}
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.type(screen.getByRole("searchbox", { name: "Search media" }), "cover");
    expect(screen.getByRole("button", { name: "Select Cover image" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Select Launch clip" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Select Cover image" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["cover"]);
  });

  it("supports folders, status filters, and grid/list views", async () => {
    const user = userEvent.setup();
    render(<MediaLibrary assets={assets} folders={folders} />);

    await user.click(screen.getByText("Video"));
    expect(screen.getByRole("heading", { name: "Video" })).toBeVisible();

    await user.selectOptions(screen.getByLabelText("Status"), "processing");
    expect(screen.getByRole("button", { name: "Select Launch clip" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("table")).toBeVisible();
  });

  it("paginates the caller-provided asset list", async () => {
    const user = userEvent.setup();
    render(
      <MediaLibrary
        assets={assets}
        defaultQuery={{ pageSize: 1 }}
      />,
    );

    expect(screen.getByRole("button", { name: "Select Cover image" })).toBeVisible();
    expect(screen.getByText("Page 1 of 3")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Select Detail image" })).toBeVisible();
    expect(screen.getByText("Page 2 of 3")).toBeVisible();
  });

  it("reports partial bulk-action failures and retains failed IDs", async () => {
    const user = userEvent.setup();
    const onBulkAction = vi.fn(async () => ({
      succeededIds: ["cover"],
      failures: [{ assetId: "clip", message: "Asset is in use." }],
    }));
    render(
      <MediaLibrary
        assets={assets}
        defaultSelectedAssetIds={["cover", "clip"]}
        onBulkAction={onBulkAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onBulkAction).toHaveBeenCalledWith(
      ["cover", "clip"],
      { type: "delete" },
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "1 action completed; 1 failed.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "clip: Asset is in use.",
    );
    expect(screen.getByText("1 selected")).toBeVisible();
  });

  it("shows loading, error, empty, and permission-denied states", () => {
    const { rerender } = render(<MediaLibrary assets={[]} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading media");

    rerender(<MediaLibrary assets={[]} error="Offline" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Offline");

    rerender(<MediaLibrary assets={[]} />);
    expect(screen.getByRole("heading", { name: "Your media library is empty" })).toBeVisible();

    rerender(<MediaLibrary assets={assets} permissionDenied />);
    expect(screen.getByRole("alert")).toHaveTextContent("Access denied");
  });
});

describe("AssetDetailsPanel", () => {
  it("edits and saves caller-owned metadata", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn(async () => undefined);
    render(<AssetDetailsPanel asset={assets[0]!} onSave={onSave} />);

    const displayName = screen.getByRole("textbox", { name: "Display name" });
    await user.clear(displayName);
    await user.type(displayName, "Updated cover");
    const tagsInput = screen.getByRole("combobox", { name: "Tags" });
    await user.type(tagsInput, "editorial");
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: "Save details" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        "cover",
        expect.objectContaining({
          displayName: "Updated cover",
          tags: ["campaign", "editorial"],
        }),
      );
    });
    expect(screen.getByText("12 KB")).toBeVisible();
  });

  it("exposes crop and hotspot editors for caller-authorized image previews", async () => {
    const user = userEvent.setup();
    render(<AssetDetailsPanel asset={assets[0]!} onSave={vi.fn()} />);

    await user.click(screen.getByRole("tab", { name: "Crop" }));
    expect(screen.getByRole("group", { name: "Image crop" })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Hotspots" }));
    expect(
      screen.getByRole("group", { name: "Image focal point and hotspots" }),
    ).toBeVisible();
  });
});

describe("AssetPickerDialog", () => {
  it("confirms a single selected asset ID", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AssetPickerDialog
        open
        onOpenChange={vi.fn()}
        libraryProps={pickerLibraryProps}
        value={null}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Select Cover image" }));
    await user.click(screen.getByRole("button", { name: "Choose asset" }));

    expect(onConfirm).toHaveBeenCalledWith("cover");
  });

  it("confirms multiple asset IDs and applies allowed-kind constraints", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AssetPickerDialog
        open
        multiple
        onOpenChange={vi.fn()}
        libraryProps={pickerLibraryProps}
        allowedKinds={["image"]}
        value={[]}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.queryByRole("button", { name: "Select Launch clip" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Select Cover image" }));
    await user.click(screen.getByRole("button", { name: "Select Detail image" }));
    await user.click(screen.getByRole("button", { name: "Choose asset" }));

    expect(onConfirm).toHaveBeenCalledWith(["cover", "detail"]);
  });
});

describe("MediaField", () => {
  it("links errors accessibly and returns the selected asset ID", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaField
        label="Cover image"
        required
        error="Select a cover image."
        value={null}
        onChange={onChange}
        libraryProps={pickerLibraryProps}
      />,
    );

    const openButton = screen.getByRole("button", {
      name: "Choose media for Cover image",
    });
    expect(openButton).toHaveAttribute("aria-invalid", "true");
    expect(openButton).toHaveAttribute("aria-describedby");

    await user.click(openButton);
    await user.click(screen.getByRole("button", { name: "Select Cover image" }));
    await user.click(screen.getByRole("button", { name: "Choose asset" }));

    expect(onChange).toHaveBeenCalledWith("cover");
  });

  it("keeps a read-only field from opening its picker or clearing a value", () => {
    render(
      <MediaField
        label="Cover image"
        value="cover"
        asset={assets[0]}
        readOnly
        onChange={vi.fn()}
        libraryProps={pickerLibraryProps}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Change media for Cover image" }),
    ).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove Cover image" })).not.toBeInTheDocument();
    expect(screen.getByText("Read only")).toBeVisible();
  });

  it("disables picker and form submission for a disabled field", () => {
    render(
      <MediaField
        label="Cover image"
        name="coverAssetId"
        value="cover"
        disabled
        onChange={vi.fn()}
        libraryProps={pickerLibraryProps}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Change media for Cover image" }),
    ).toBeDisabled();
    expect(document.querySelector('input[name="coverAssetId"]')).toBeDisabled();
  });

  it("composes the image detail editor when a save action is supplied", async () => {
    const user = userEvent.setup();
    render(
      <MediaField
        label="Cover image"
        value="cover"
        asset={assets[0]}
        onChange={vi.fn()}
        onSaveAsset={vi.fn()}
        libraryProps={pickerLibraryProps}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit image details" }));
    expect(screen.getByRole("tab", { name: "Crop" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Hotspots" })).toBeVisible();
  });

  it("shows the existing UI uploader and folder management actions", async () => {
    const user = userEvent.setup();
    const onCreateFolder = vi.fn();
    render(
      <MediaLibrary
        assets={assets}
        folders={folders}
        onCreateFolder={onCreateFolder}
        upload={{
          image: async () => undefined,
          video: async () => ({ done: Promise.resolve() }),
          file: async () => undefined,
        }}
      />,
    );

    await user.click(screen.getByText("Upload media"));
    expect(screen.getByText("Drop images here")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "New folder" }));
    await user.type(screen.getByLabelText("Folder name"), "Campaign");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onCreateFolder).toHaveBeenCalledWith("Campaign", null);
    expect(screen.getByRole("status")).toHaveTextContent("Folder created");
  });

  it("renames and moves folders only through supplied callbacks", async () => {
    const user = userEvent.setup();
    const onRenameFolder = vi.fn();
    const onMoveFolder = vi.fn();
    render(
      <MediaLibrary
        assets={assets}
        folders={folders}
        defaultQuery={{ folderId: "folder-media" }}
        onRenameFolder={onRenameFolder}
        onMoveFolder={onMoveFolder}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Rename folder" }));
    const nameInput = screen.getByLabelText("New folder name");
    await user.clear(nameInput);
    await user.type(nameInput, "Library");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onRenameFolder).toHaveBeenCalledWith("folder-media", "Library");

    await user.click(screen.getByRole("button", { name: "Move folder" }));
    await user.selectOptions(screen.getByLabelText("Move folder to"), "");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onMoveFolder).toHaveBeenCalledWith("folder-media", null);
  });
});
