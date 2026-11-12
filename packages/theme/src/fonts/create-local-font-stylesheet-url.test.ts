import { describe, expect, it } from "vitest";

import { createLocalFontStylesheetUrl } from "./create-local-font-stylesheet-url";

describe("createLocalFontStylesheetUrl", () => {
  it("uses /fonts as the default directory", () => {
    expect(createLocalFontStylesheetUrl()).toBe("/fonts/puzzle-fonts.css");
  });

  it("supports custom directories", () => {
    expect(createLocalFontStylesheetUrl("/assets/fonts")).toBe(
      "/assets/fonts/puzzle-fonts.css",
    );
  });

  it("normalizes trailing slashes", () => {
    expect(createLocalFontStylesheetUrl("/fonts/")).toBe(
      "/fonts/puzzle-fonts.css",
    );
  });

  it("supports the root directory", () => {
    expect(createLocalFontStylesheetUrl("/")).toBe("/puzzle-fonts.css");
  });

  it("rejects relative paths", () => {
    expect(() => createLocalFontStylesheetUrl("fonts")).toThrow(TypeError);
  });

  it("rejects protocol-relative paths", () => {
    expect(() => createLocalFontStylesheetUrl("//example.com/fonts")).toThrow(
      TypeError,
    );
  });

  it("rejects path traversal", () => {
    expect(() => createLocalFontStylesheetUrl("/assets/../fonts")).toThrow(
      TypeError,
    );
  });

  it("rejects query strings and fragments", () => {
    expect(() => createLocalFontStylesheetUrl("/fonts?version=1")).toThrow(
      TypeError,
    );

    expect(() => createLocalFontStylesheetUrl("/fonts#fonts")).toThrow(
      TypeError,
    );
  });
});
