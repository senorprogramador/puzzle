import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const media = vi.hoisted(() => ({
  readVideoMetadata: vi.fn(),
  createVideoPoster: vi.fn(),
}));

vi.mock("@puzzle-ui/media/browser", () => media);

import { VideoUpload } from "./index";

const metadata = {
  duration: 12.5,
  width: 1920,
  height: 1080,
  aspectRatio: 16 / 9,
  mimeType: "video/webm",
  playbackSupport: "probably" as const,
};

const poster = {
  blob: new Blob(["poster"], { type: "image/jpeg" }),
  width: 640,
  height: 360,
  format: "image/jpeg",
  timeSeconds: 1,
};

const createVideo = (name = "clip.webm", type = "video/webm", size = 8) =>
  new File([new Uint8Array(size)], name, { type });

const selectFile = (file: File) => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("VideoUpload", () => {
  beforeEach(() => {
    media.readVideoMetadata.mockReset().mockResolvedValue(metadata);
    media.createVideoPoster.mockReset().mockResolvedValue(poster);
  });

  it("prepares metadata and poster without uploading when no handler is supplied", async () => {
    render(<VideoUpload />);

    selectFile(createVideo());

    expect(await screen.findByText("Ready to upload")).toBeInTheDocument();
    expect(screen.getByText(/0:12 · 1920 × 1080px/)).toBeInTheDocument();
    expect(media.readVideoMetadata).toHaveBeenCalledTimes(1);
    expect(media.createVideoPoster).toHaveBeenCalledTimes(1);
  });

  it("rejects wrong types and oversized files before reading metadata", () => {
    const onReject = vi.fn();
    render(<VideoUpload maxFileSize={4} onReject={onReject} />);

    selectFile(createVideo("large.webm", "video/webm", 8));
    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({ code: "file-too-large" }),
    ]);
    expect(media.readVideoMetadata).not.toHaveBeenCalled();

    selectFile(createVideo("image.png", "image/png", 2));
    expect(onReject).toHaveBeenLastCalledWith([
      expect.objectContaining({ code: "file-type" }),
    ]);
    expect(media.readVideoMetadata).not.toHaveBeenCalled();
  });

  it("supports progress, pause, resume, cancellation, and server status changes", async () => {
    const upload = deferred();
    const pause = vi.fn();
    const resume = vi.fn();
    const cancel = vi.fn();
    const onUpload = vi.fn((_file, context) => {
      queueMicrotask(() => context.onProgress(32));
      return { done: upload.promise, pause, resume, cancel };
    });
    render(<VideoUpload onUpload={onUpload} />);

    selectFile(createVideo());
    await screen.findByRole("button", { name: "Pause" });
    expect(screen.getByText("Uploading")).toBeInTheDocument();
    expect(screen.getByText("32%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    await waitFor(() => expect(pause).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Upload paused")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    await waitFor(() => expect(resume).toHaveBeenCalledTimes(1));

    const [, context] = onUpload.mock.calls[0] ?? [];
    act(() => context.onStatusChange("processing"));
    expect(screen.getByText("Server processing")).toBeInTheDocument();
    upload.resolve();
    await waitFor(() => expect(screen.getByText("Server processing")).toBeInTheDocument());
    act(() => context.onStatusChange("ready"));
    expect(screen.getByText("Video ready")).toBeInTheDocument();
  });

  it("cancels the injected resumable task and retries failures", async () => {
    const first = deferred();
    const second = deferred();
    const cancel = vi.fn();
    let uploadSignal: AbortSignal | undefined;
    const onUpload = vi
      .fn()
      .mockImplementationOnce((_file, context) => {
        uploadSignal = context.signal;
        return { done: first.promise, cancel };
      })
      .mockImplementationOnce(() => ({ done: second.promise }));
    render(<VideoUpload onUpload={onUpload} />);

    selectFile(createVideo());
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(1));
    await screen.findByRole("button", { name: "Cancel" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(uploadSignal?.aborted).toBe(true);
    expect(await screen.findByText("Upload cancelled")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    second.resolve();
    expect(await screen.findByText(/Uploaded · awaiting processing status/)).toBeInTheDocument();
  });

  it("retries a failed transfer and reaches uploaded status", async () => {
    const onUpload = vi
      .fn()
      .mockImplementationOnce(() => ({
        done: Promise.reject(new Error("Connection lost")),
      }))
      .mockImplementationOnce(() => ({ done: Promise.resolve() }));
    render(<VideoUpload onUpload={onUpload} />);

    selectFile(createVideo());
    expect(await screen.findByRole("alert")).toHaveTextContent("Connection lost");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    expect(
      await screen.findByText(/Uploaded · awaiting processing status/),
    ).toBeInTheDocument();
  });

  it("shows failed server-processing status distinctly", async () => {
    const onUpload = vi.fn((_file, context) => {
      context.onStatusChange("failed", "Transcoder unavailable");
      return { done: Promise.resolve() };
    });
    render(<VideoUpload onUpload={onUpload} />);
    selectFile(createVideo());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Transcoder unavailable",
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
