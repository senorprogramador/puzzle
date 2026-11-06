import { describe, expect, it } from "vitest";

import {
  createRejection,
  formatFileSize,
  matchesMimeType,
  validateFile,
  validateFiles,
} from "./file-upload.utils";

const createFile = (name: string, type = "image/png", size = 100): File =>
  new File([new Uint8Array(size)], name, { type });

describe("formatFileSize", () => {
  it.each([
    [0, "0 B"],
    [1, "1 B"],
    [1024, "1.0 KB"],
    [10240, "10 KB"],
    [1048576, "1.0 MB"],
    [1073741824, "1.0 GB"],
  ])("formats %i bytes as %s", (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });

  it("handles invalid values", () => {
    expect(formatFileSize(-1)).toBe("0 B");
    expect(formatFileSize(Number.NaN)).toBe("0 B");
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe("0 B");
  });
});

describe("matchesMimeType", () => {
  it("matches exact MIME types", () => {
    expect(matchesMimeType("image/png", ["image/png"])).toBe(true);
  });

  it("matches MIME wildcards", () => {
    expect(matchesMimeType("image/jpeg", ["image/*"])).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(matchesMimeType("IMAGE/PNG", ["image/png"])).toBe(true);
  });

  it("supports multiple accepted MIME types", () => {
    expect(
      matchesMimeType("application/pdf", ["image/*", "application/pdf"]),
    ).toBe(true);
  });

  it("does not match unrelated types", () => {
    expect(matchesMimeType("application/pdf", ["image/*"])).toBe(false);
  });

  it("rejects an empty MIME type", () => {
    expect(matchesMimeType("", ["image/*"])).toBe(false);
  });

  it("handles MIME parameters", () => {
    expect(matchesMimeType("image/png; charset=binary", ["image/png"])).toBe(
      true,
    );
  });
});

describe("validateFile", () => {
  it("accepts a valid file", () => {
    expect(
      validateFile(createFile("photo.png"), {
        accept: ["image/png"],
        maxFileSize: 200,
      }),
    ).toBeUndefined();
  });

  it("rejects unsupported MIME types", () => {
    const result = validateFile(createFile("document.pdf", "application/pdf"), {
      accept: ["image/png"],
    });

    expect(result?.code).toBe("file-type");
  });

  it("rejects files exceeding the maximum size", () => {
    const result = validateFile(createFile("large.png", "image/png", 201), {
      maxFileSize: 200,
    });

    expect(result?.code).toBe("file-too-large");
  });

  it("accepts files exactly at the maximum size", () => {
    expect(
      validateFile(createFile("photo.png", "image/png", 200), {
        maxFileSize: 200,
      }),
    ).toBeUndefined();
  });

  it("allows all types when accept is empty", () => {
    expect(
      validateFile(createFile("document.pdf", "application/pdf"), {
        accept: [],
      }),
    ).toBeUndefined();
  });
});

describe("validateFiles", () => {
  it("accepts multiple valid files", () => {
    const result = validateFiles(
      [createFile("one.png"), createFile("two.png")],
      [],
      { multiple: true },
    );

    expect(result.accepted).toHaveLength(2);
    expect(result.rejected).toHaveLength(0);
  });

  it("allows only one file in single mode", () => {
    const result = validateFiles(
      [createFile("one.png"), createFile("two.png")],
      [],
      { multiple: false },
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].code).toBe("too-many-files");
  });

  it("enforces maxFiles across existing and incoming files", () => {
    const result = validateFiles(
      [createFile("two.png"), createFile("three.png")],
      [createFile("one.png")],
      {
        multiple: true,
        maxFiles: 2,
      },
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].code).toBe("too-many-files");
  });

  it("enforces maxTotalSize across existing and incoming files", () => {
    const result = validateFiles(
      [createFile("two.png", "image/png", 100)],
      [createFile("one.png", "image/png", 100)],
      {
        multiple: true,
        maxTotalSize: 150,
      },
    );

    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0].code).toBe("total-too-large");
  });

  it("allows a total size exactly at the limit", () => {
    const result = validateFiles(
      [createFile("two.png", "image/png", 100)],
      [createFile("one.png", "image/png", 100)],
      {
        multiple: true,
        maxTotalSize: 200,
      },
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(0);
  });

  it("does not count rejected files toward maxFiles", () => {
    const result = validateFiles(
      [createFile("invalid.pdf", "application/pdf"), createFile("valid.png")],
      [],
      {
        multiple: true,
        maxFiles: 1,
        accept: ["image/png"],
      },
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].name).toBe("valid.png");
  });

  it("does not count rejected files toward maxTotalSize", () => {
    const result = validateFiles(
      [
        createFile("invalid.pdf", "application/pdf", 500),
        createFile("valid.png", "image/png", 100),
      ],
      [],
      {
        multiple: true,
        maxTotalSize: 150,
        accept: ["image/png"],
      },
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].name).toBe("valid.png");
  });
});

describe("createRejection", () => {
  it("creates a rejection with its file, code and message", () => {
    const file = createFile("invalid.png");

    expect(createRejection(file, "file-type", "Unsupported type.")).toEqual({
      file,
      code: "file-type",
      message: "Unsupported type.",
    });
  });
});
