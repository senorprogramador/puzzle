import { describe, expect, it } from "vitest";

import { cropImage, formatImageUploadSize } from "./image-upload.utils";

describe("ImageUpload utilities", () => {
  it("formats source and processed image sizes", () => {
    expect(formatImageUploadSize(512)).toBe("512 B");
    expect(formatImageUploadSize(10 * 1024)).toBe("10 KB");
    expect(formatImageUploadSize(1536 * 1024)).toBe("1.5 MB");
  });

  it("honors an already-aborted crop request without touching browser APIs", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      cropImage(
        new File(["image"], "photo.png", { type: "image/png" }),
        { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("preserves the original file for a full-image crop", async () => {
    const file = new File(["image"], "photo.png", { type: "image/png" });
    const result = await cropImage(
      file,
      { x: 0, y: 0, width: 1, height: 1 },
      new AbortController().signal,
    );
    expect(result.blob).toBe(file);
  });
});
