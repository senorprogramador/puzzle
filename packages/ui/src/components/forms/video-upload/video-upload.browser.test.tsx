import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { VideoUpload } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("VideoUpload (browser)", () => {
  it("reads real video metadata and generates a local poster before injected upload", async () => {
    const response = await fetch(
      new URL("./fixtures/finite-duration.webm", import.meta.url),
    );
    expect(response.ok).toBe(true);
    const file = new File([await response.blob()], "sample.webm", {
      type: "video/webm",
    });
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const onUpload = vi.fn((_file, context) => {
      expect(context.metadata.width).toBeGreaterThan(0);
      expect(context.metadata.height).toBeGreaterThan(0);
      expect(context.poster.blob.size).toBeGreaterThan(0);
      return { done: Promise.resolve() };
    });
    const { container, unmount } = render(<VideoUpload onUpload={onUpload} />);

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(/Uploaded · awaiting processing status/),
    ).toBeInTheDocument();
    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(container.querySelector("video")?.getAttribute("poster")).toMatch(
      /^blob:/,
    );

    unmount();
    await waitFor(() => expect(revoke).toHaveBeenCalled());
  });
});
