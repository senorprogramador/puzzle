/// <reference types="node" />

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BREAKPOINTS } from "./breakpoints";

const componentStylesheets = [
  "../../ui/src/components/overlays/notification/notification.css",
  "../../ui/src/components/utilities/preview/preview.css",
];

describe("breakpoints", () => {
  it("uses unique positive pixel values", () => {
    const values = Object.values(BREAKPOINTS);

    expect(values.every((value) => Number.isFinite(value) && value > 0)).toBe(
      true,
    );
    expect(new Set(values).size).toBe(values.length);
  });

  it("keeps component CSS media queries aligned with central breakpoints", () => {
    const allowedValues = new Set(
      Object.values(BREAKPOINTS).map((value) => `${value}px`),
    );

    for (const stylesheet of componentStylesheets) {
      const css = readFileSync(new URL(stylesheet, import.meta.url), "utf8");

      const mediaQueries = [
        ...css.matchAll(
          /@media\s*\([^)]*(?:min|max)-width:\s*(\d+(?:\.\d+)?px)/g,
        ),
      ];

      for (const match of mediaQueries) {
        expect(
          allowedValues.has(match[1]),
          `${stylesheet} uses ${match[1]}, which is not defined in BREAKPOINTS`,
        ).toBe(true);
      }
    }
  });
});
