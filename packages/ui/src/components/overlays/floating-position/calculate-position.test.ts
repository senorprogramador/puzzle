import { describe, expect, it } from "vitest";

import { calculatePosition } from "./calculate-position";

const createRect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect => {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
};

const defaultOptions = {
  position: "bottom" as const,
  align: "start" as const,
  offset: 8,
  collisionPadding: 8,
  viewportWidth: 800,
  viewportHeight: 600,
};

describe("calculatePosition", () => {
  it("positions content below the anchor", () => {
    const result = calculatePosition(
      createRect(100, 100, 120, 40),
      createRect(0, 0, 160, 80),
      defaultOptions,
    );

    expect(result).toEqual({
      position: "bottom",
      coordinates: {
        top: 148,
        left: 100,
      },
    });
  });

  it("aligns content to the center of the anchor", () => {
    const result = calculatePosition(
      createRect(100, 100, 120, 40),
      createRect(0, 0, 80, 60),
      {
        ...defaultOptions,
        align: "center",
      },
    );

    expect(result.coordinates.left).toBe(120);
  });

  it("aligns content to the end of the anchor", () => {
    const result = calculatePosition(
      createRect(100, 100, 120, 40),
      createRect(0, 0, 80, 60),
      {
        ...defaultOptions,
        align: "end",
      },
    );

    expect(result.coordinates.left).toBe(140);
  });

  it("uses the opposite placement when the preferred side does not fit", () => {
    const result = calculatePosition(
      createRect(100, 540, 120, 40),
      createRect(0, 0, 160, 80),
      defaultOptions,
    );

    expect(result.position).toBe("top");
    expect(result.coordinates.top).toBe(452);
  });

  it("tries the remaining placements when neither preferred side fits", () => {
    const result = calculatePosition(
      createRect(4, 200, 40, 40),
      createRect(0, 0, 120, 100),
      {
        ...defaultOptions,
        position: "left",
      },
    );

    expect(result.position).toBe("right");
  });

  it("clamps content to the viewport when no placement fully fits", () => {
    const result = calculatePosition(
      createRect(2, 2, 20, 20),
      createRect(0, 0, 900, 700),
      {
        ...defaultOptions,
        position: "top",
      },
    );

    expect(result.position).toBe("top");
    expect(result.coordinates).toEqual({
      top: 8,
      left: 8,
    });
  });

  it("respects collision padding", () => {
    const result = calculatePosition(
      createRect(0, 100, 40, 40),
      createRect(0, 0, 80, 60),
      {
        ...defaultOptions,
        collisionPadding: 16,
      },
    );

    expect(result.coordinates.left).toBeGreaterThanOrEqual(16);
  });
});
