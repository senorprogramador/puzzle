import { describe, expect, it } from "vitest";

import {
  createCropAtZoom,
  getBaseCrop,
  moveCrop,
  resizeFixedCrop,
} from "./image-cropper.utils";

describe("ImageCropper utilities", () => {
  it("fits each aspect ratio within the normalized image bounds", () => {
    expect(getBaseCrop({ width: 1600, height: 900 }, 1)).toEqual({
      x: 0.21875,
      y: 0,
      width: 0.5625,
      height: 1,
    });
    expect(getBaseCrop({ width: 900, height: 1600 }, 16 / 9)).toEqual({
      x: 0,
      y: 0.341797,
      width: 1,
      height: 0.316406,
    });
  });

  it("zooms around the crop center and keeps the selected ratio", () => {
    const crop = getBaseCrop({ width: 1600, height: 900 }, 16 / 9);
    const zoomed = createCropAtZoom(crop, { width: 1600, height: 900 }, 16 / 9, 2);

    expect(zoomed).toEqual({
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
    });
  });

  it("clamps pan and resize operations to the image edges", () => {
    const crop = { x: 0.2, y: 0.2, width: 0.4, height: 0.4 };

    expect(moveCrop(crop, 0.9, -0.5)).toEqual({
      x: 0.6,
      y: 0,
      width: 0.4,
      height: 0.4,
    });
    expect(
      resizeFixedCrop(
        crop,
        500,
        { width: 1000, height: 1000 },
        1,
      ),
    ).toEqual({
      x: 0.2,
      y: 0.2,
      width: 0.8,
      height: 0.8,
    });
  });
});
