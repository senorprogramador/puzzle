import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const media = vi.hoisted(() => ({
  resizeImage: vi.fn(),
  createImageVariants: vi.fn(),
}));

vi.mock("@puzzle-ui/media/browser", () => media);

import { ImageUpload } from "./index";

const outputResult = () => ({
  blob: new Blob(["processed"], { type: "image/png" }),
  fileName: "photo.png",
  width: 64,
  height: 32,
  originalWidth: 128,
  originalHeight: 64,
  format: "image/png",
  size: 9,
  resized: true,
  usedFallbackFormat: false,
});

const createImage = (name = "photo.png", size = 8, type = "image/png") =>
  new File([new Uint8Array(size)], name, { type });

const selectFile = (file: File) => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

describe("ImageUpload", () => {
  beforeEach(() => {
    media.resizeImage.mockReset().mockImplementation(async () => outputResult());
    media.createImageVariants.mockReset().mockImplementation(async () => ({
      original: null,
      variants: {
        card: { ...outputResult(), fileName: "photo-card.png" },
      },
    }));
  });

  it("prepares selected files without calling an upload action when none is provided", async () => {
    render(<ImageUpload />);

    selectFile(createImage());

    expect(await screen.findByText("Image ready")).toBeInTheDocument();
    expect(media.resizeImage).toHaveBeenCalledTimes(1);
  });

  it("passes the original only when retention is explicitly enabled and includes named variants", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    const source = createImage();
    render(
      <ImageUpload
        onUpload={onUpload}
        profiles={[{ name: "card", maxWidth: 320 }]}
        retainOriginal
      />,
    );

    selectFile(source);

    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1));
    const [result] = onUpload.mock.calls[0] ?? [];
    expect(result.original).toBe(source);
    expect(result.file).toBeInstanceOf(File);
    expect(result.variants).toHaveProperty("card");
  });

  it("does not retain the original by default", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(<ImageUpload onUpload={onUpload} />);

    selectFile(createImage());

    await waitFor(() =>
      expect(onUpload.mock.calls[0]?.[0].original).toBeNull(),
    );
  });

  it("processes multiple selected files independently", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    const onChange = vi.fn();
    render(<ImageUpload multiple maxFiles={2} onChange={onChange} onUpload={onUpload} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [createImage("one.png"), createImage("two.png")] },
    });

    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    expect(onChange.mock.lastCall?.[0]).toHaveLength(2);
  });

  it("rejects unsupported types and oversized files before processing", () => {
    const onReject = vi.fn();
    render(<ImageUpload maxFileSize={4} onReject={onReject} />);

    selectFile(createImage("large.png", 8));
    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({ code: "file-too-large" }),
    ]);
    expect(media.resizeImage).not.toHaveBeenCalled();

    selectFile(createImage("document.pdf", 2, "application/pdf"));
    expect(onReject).toHaveBeenLastCalledWith([
      expect.objectContaining({ code: "file-type" }),
    ]);
    expect(media.resizeImage).not.toHaveBeenCalled();
  });

  it("cancels processing and ignores a late result", async () => {
    const result = deferred<ReturnType<typeof outputResult>>();
    let processingSignal: AbortSignal | undefined;
    media.resizeImage.mockImplementationOnce((_file, options) => {
      processingSignal = options.signal;
      return result.promise;
    });
    const onUpload = vi.fn();
    render(<ImageUpload onUpload={onUpload} />);

    selectFile(createImage());
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    expect(processingSignal?.aborted).toBe(true);
    expect(screen.getByText("Image processing or upload was cancelled.")).toBeInTheDocument();

    result.resolve(outputResult());
    await waitFor(() => expect(onUpload).not.toHaveBeenCalled());
    expect(screen.getByText("Image processing or upload was cancelled.")).toBeInTheDocument();
  });

  it("retries a failed upload", async () => {
    const onUpload = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce(undefined);
    render(<ImageUpload onUpload={onUpload} />);

    selectFile(createImage());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Network unavailable",
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Upload complete")).toBeInTheDocument();
  });

  it("reports local processing and consumer upload progress", async () => {
    const onProgress = vi.fn();
    const onUpload = vi.fn(async (_result, { onProgress: report }) => {
      report(42);
    });
    const file = createImage();
    media.resizeImage.mockImplementationOnce(async (_source, options) => {
      options.onProgress({ stage: "resize", progress: 0.5 });
      return outputResult();
    });
    render(<ImageUpload onProgress={onProgress} onUpload={onUpload} />);

    selectFile(file);

    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1));
    expect(onProgress).toHaveBeenCalledWith(file, 50);
    expect(onProgress).toHaveBeenCalledWith(file, 42);
  });

  it("reports crop and hotspot values in the upload result", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(
      <ImageUpload
        enableCrop
        enableHotspots
        onUpload={onUpload}
      />,
    );
    selectFile(createImage());

    fireEvent.click(await screen.findByRole("button", { name: "Upload image" }));
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("Upload complete")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Upload image" }),
    ).not.toBeInTheDocument();
    const [result] = onUpload.mock.calls[0] ?? [];
    expect(result.crop).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(result.hotspots).toEqual({ focalPoint: null, hotspots: [] });
  });
});
