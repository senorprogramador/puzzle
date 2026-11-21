import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageUpload } from "./index";
import { cropImage } from "./image-upload.utils";

afterEach(() => {
  vi.restoreAllMocks();
});

const createOrientedJpeg = async (): Promise<File> => {
  const canvas = document.createElement("canvas");
  canvas.width = 3;
  canvas.height = 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("A browser canvas is required for this test.");
  context.fillStyle = "#ff0000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const jpeg = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not encode the JPEG fixture."));
    }, "image/jpeg");
  });
  const bytes = new Uint8Array(await jpeg.arrayBuffer());
  const exif = new Uint8Array([
    0x45, 0x78, 0x69, 0x66, 0, 0,
    0x49, 0x49, 0x2a, 0, 8, 0, 0, 0,
    1, 0, 0x12, 0x01, 3, 0, 1, 0, 0, 0,
    6, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const segmentLength = exif.length + 2;
  const segment = new Uint8Array([
    0xff,
    0xe1,
    (segmentLength >> 8) & 0xff,
    segmentLength & 0xff,
    ...exif,
  ]);
  return new File(
    [bytes.slice(0, 2), segment, bytes.slice(2)],
    "oriented.jpg",
    { type: "image/jpeg" },
  );
};

describe("ImageUpload (browser)", () => {
  it("uses EXIF orientation when showing source and resized dimensions", async () => {
    const file = await createOrientedJpeg();
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(<ImageUpload onUpload={onUpload} maxWidth={20} maxHeight={20} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1), {
      timeout: 5_000,
    });
    expect(screen.getByText(/Source: 2 × 3px/)).toBeInTheDocument();
    expect(screen.getByText(/Processed: 2 × 3px/)).toBeInTheDocument();
    expect(onUpload.mock.calls[0]?.[0].processed.format).toBe("image/jpeg");
  });

  it("crops a normalized source rectangle and respects abort before decode", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 2;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("A browser canvas is required for this test.");
    context.fillStyle = "#00ff00";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const source = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not encode the crop fixture."));
      }, "image/png");
    });
    const file = new File([source], "crop.png", { type: "image/png" });
    const controller = new AbortController();

    const cropped = await cropImage(
      file,
      { x: 0.5, y: 0, width: 0.5, height: 1 },
      controller.signal,
    );
    const bitmap = await createImageBitmap(cropped.blob);
    expect(bitmap.width).toBe(2);
    expect(bitmap.height).toBe(2);
    expect(cropped.sourceWidth).toBe(4);
    expect(cropped.sourceHeight).toBe(2);
    bitmap.close();

    controller.abort();
    await expect(
      cropImage(file, { x: 0.5, y: 0, width: 0.5, height: 1 }, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("crops using the oriented source dimensions", async () => {
    const cropped = await cropImage(
      await createOrientedJpeg(),
      { x: 0.5, y: 0, width: 0.5, height: 1 },
      new AbortController().signal,
    );
    expect(cropped.sourceWidth).toBe(2);
    expect(cropped.sourceHeight).toBe(3);
    expect(cropped.width).toBe(1);
    expect(cropped.height).toBe(3);
  });

  it("composes crop and hotspot editors against the selected image", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 3;
    const source = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not encode the editor fixture."));
      }, "image/png");
    });
    const file = new File([source], "editable.png", { type: "image/png" });
    const onUpload = vi.fn();
    render(<ImageUpload enableCrop enableHotspots onUpload={onUpload} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByRole("group", { name: "Crop editable.png" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", {
        name: "Focal point and hotspots for editable.png",
      }),
    ).toBeInTheDocument();
    expect(onUpload).not.toHaveBeenCalled();
    expect(
      await screen.findByRole("button", { name: "Upload image" }),
    ).toBeInTheDocument();
  });
});
