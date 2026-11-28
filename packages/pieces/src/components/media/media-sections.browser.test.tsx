import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { page } from "vitest/browser";
import { expect, it, vi } from "vitest";
import { AssetPickerDialog } from "./asset-picker-dialog";
import { AssetDetailsPanel } from "./asset-details-panel";
import { MediaLibrary } from "./media-library";
import { MediaField } from "./media-field";
import type {
  MediaLibraryAsset,
  MediaLibraryPropsForPicker,
} from "./media.types";

const assets: MediaLibraryAsset[] = [
  {
    id: "cover",
    folderId: null,
    originalName: "cover.png",
    displayName: "Cover image",
    kind: "image",
    mimeType: "image/png",
    size: 12_000,
    status: "ready",
    tags: [],
    hotspots: [],
    focalPoint: null,
    variants: [],
  },
];

const libraryProps: MediaLibraryPropsForPicker = {
  assets,
  folders: [
    { id: "media", name: "Media", parentId: null },
    { id: "images", name: "Images", parentId: "media" },
  ],
};

it("keeps the library responsive and supports keyboard selection", async () => {
  const user = userEvent.setup();
  const onSelectionChange = vi.fn();
  const { container } = render(
    <MediaLibrary
      {...libraryProps}
      selectionMode="single"
      onSelectionChange={onSelectionChange}
    />,
  );
  const layout = container.querySelector(".puzzle-media-library__layout")!;

  await page.viewport(375, 800);
  expect(getComputedStyle(layout).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(768, 1024);
  expect(getComputedStyle(layout).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  const selectButton = screen.getByRole("button", {
    name: "Select Cover image",
  });
  selectButton.focus();
  await user.keyboard("{Enter}");
  expect(onSelectionChange).toHaveBeenLastCalledWith(["cover"]);

  const selection = container.querySelector<HTMLElement>(
    ".puzzle-media-library__selection",
  );
  expect(selection).not.toBeNull();

  for (const [width, direction] of [
    [375, "column"],
    [768, "column"],
    [1280, "row"],
  ] as const) {
    await page.viewport(width, 800);
    expect(getComputedStyle(selection!).flexDirection).toBe(direction);
  }

  expect(getComputedStyle(layout).gridTemplateColumns.trim().split(/\s+/).length)
    .toBeGreaterThan(1);
});

it("opens and selects media filters with the Puzzle Select control", async () => {
  await page.viewport(1280, 800);
  const user = userEvent.setup();
  render(<MediaLibrary {...libraryProps} />);

  const statusFilter = screen.getByRole("combobox", { name: "Status" });
  await user.click(statusFilter);
  await screen.findByRole("listbox");
  await user.click(await screen.findByRole("option", { name: "Processing" }));

  expect(statusFilter).toHaveTextContent("Processing");
  expect(screen.getByRole("heading", { name: "No matching assets" })).toBeVisible();
});

it("clips grid preview images to their media frame", async () => {
  const asset: MediaLibraryAsset = {
    ...assets[0]!,
    previewUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%23005799'/%3E%3C/svg%3E",
  };
  const { container } = render(<MediaLibrary assets={[asset]} />);
  const frame = container.querySelector<HTMLElement>(
    ".puzzle-media-library__asset-card .puzzle-media-frame__viewport",
  );
  const image = frame?.querySelector("img");

  expect(frame).not.toBeNull();
  expect(image).not.toBeNull();
  await waitFor(() => expect(image).toHaveProperty("naturalWidth", 120));

  for (const width of [375, 768, 1280]) {
    await page.viewport(width, 900);
    expect(getComputedStyle(frame!).overflow).toBe("hidden");

    const card = frame!.closest(".puzzle-media-library__asset-card")!;
    const cardBounds = card.getBoundingClientRect();
    const frameBounds = frame!.getBoundingClientRect();
    expect(frameBounds.left).toBeGreaterThanOrEqual(cardBounds.left);
    expect(frameBounds.right).toBeLessThanOrEqual(cardBounds.right + 1);
  }
});

it("uses the Drawer on narrow viewports and closes on Escape", async () => {
  await page.viewport(375, 800);
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  const { container } = render(
    <AssetPickerDialog
      open
      onOpenChange={onOpenChange}
      libraryProps={libraryProps}
      value={null}
      onConfirm={vi.fn()}
    />,
  );

  await waitFor(() => {
    expect(container.querySelector(".puzzle-drawer")).toBeInTheDocument();
  });
  await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
  await user.keyboard("{Escape}");
  await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
});

it("returns focus to the MediaField trigger after the mobile picker closes", async () => {
  await page.viewport(375, 800);
  const user = userEvent.setup();
  const { container } = render(
    <MediaField
      label="Cover image"
      value={null}
      onChange={vi.fn()}
      libraryProps={libraryProps}
    />,
  );
  const trigger = screen.getByRole("button", {
    name: "Choose media for Cover image",
  });

  await user.click(trigger);
  await waitFor(() => {
    expect(container.querySelector(".puzzle-drawer")).toBeInTheDocument();
  });
  await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
  await user.keyboard("{Escape}");
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("keeps image previews visible and within their containers across viewports", async () => {
  const asset: MediaLibraryAsset = {
    ...assets[0]!,
    previewUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%23005799'/%3E%3C/svg%3E",
    altText: "Sample cover",
    width: 80,
    height: 120,
  };
  const { container } = render(
    <div>
      <MediaField label="Cover" value={asset.id} asset={asset} onChange={vi.fn()} libraryProps={{ assets: [asset] }} />
      <AssetDetailsPanel asset={asset} />
    </div>,
  );
  const images = screen.getAllByRole("img", { name: "Sample cover" });
  await waitFor(() => images.forEach((image) =>
    expect((image as HTMLImageElement).naturalWidth).toBe(120),
  ));

  for (const width of [375, 768, 1280]) {
    await page.viewport(width, 900);
    for (const image of images) {
      const bounds = image.getBoundingClientRect();
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.right).toBeLessThanOrEqual(width);
    }
    const detailsPreview = container.querySelector(".puzzle-asset-details__preview .puzzle-image")!;
    expect(detailsPreview.getBoundingClientRect().height).toBeLessThanOrEqual(512.5);
    expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  }
});
