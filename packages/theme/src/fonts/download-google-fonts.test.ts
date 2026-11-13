import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mkdtemp, readFile, rm } from "node:fs/promises";

import { tmpdir } from "node:os";
import { join } from "node:path";

import { downloadGoogleFonts } from "./download-google-fonts";
import { createFontPreloadFilename } from "./create-font-preload-filename";

const GOOGLE_CSS = `
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v18/example.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}
`;

const FONT_BYTES = new Uint8Array([0, 1, 2, 3, 4, 5]);

const createFetchMock = (css = GOOGLE_CSS) => {
  return vi.fn(async (url: string) => {
    if (url.startsWith("https://fonts.googleapis.com/")) {
      return new Response(css, {
        status: 200,
        headers: {
          "content-type": "text/css",
        },
      });
    }

    return new Response(FONT_BYTES, {
      status: 200,
      headers: {
        "content-type": "font/woff2",
      },
    });
  });
};

describe("createFontPreloadFilename", () => {
  it("creates a stable normalized filename", () => {
    expect(createFontPreloadFilename("Inter")).toBe("puzzle-font-inter.woff2");
  });

  it("normalizes spaces and special characters", () => {
    expect(createFontPreloadFilename("JetBrains Mono")).toBe(
      "puzzle-font-jetbrains-mono.woff2",
    );
  });

  it("normalizes accented characters", () => {
    expect(createFontPreloadFilename("Áccent Font")).toBe(
      "puzzle-font-accent-font.woff2",
    );
  });

  it("rejects an empty normalized family name", () => {
    expect(() => createFontPreloadFilename("!!!")).toThrow("valid font family");
  });
});

describe("downloadGoogleFonts", () => {
  let outputDir: string;

  beforeEach(async () => {
    outputDir = await mkdtemp(join(tmpdir(), "puzzle-theme-fonts-"));
  });

  afterEach(async () => {
    await rm(outputDir, {
      recursive: true,
      force: true,
    });
  });

  it("filters subsets before downloading and invalidates the cache when subsets change", async () => {
    const css =
      GOOGLE_CSS +
      GOOGLE_CSS.replace("/* latin */", "/* latin-ext */").replace(
        "example.woff2",
        "extended.woff2",
      ) +
      GOOGLE_CSS.replace("/* latin */", "/* cyrillic */").replace(
        "example.woff2",
        "cyrillic.woff2",
      );

    const fetcher = vi.fn(
      async (url: string) =>
        new Response(
          url.startsWith("https://fonts.googleapis.com/") ? css : FONT_BYTES,
        ),
    );

    const options = {
      fonts: {
        body: {
          family: "Inter" as const,
          weightRange: [300, 700] as const,
        },
      },
      outputDir,
      fetcher,
      subsets: ["latin", "latin-ext"],
    };

    const result = await downloadGoogleFonts(options);

    expect(result.fontFiles).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(3);

    expect(
      fetcher.mock.calls.some(([url]) => url.includes("cyrillic.woff2")),
    ).toBe(false);

    const generatedCss = await readFile(result.cssPath, "utf8");

    expect(generatedCss.match(/@font-face/g)).toHaveLength(2);

    expect(generatedCss).toContain("puzzle-font-inter.woff2");

    expect((await downloadGoogleFonts(options)).skipped).toBe(true);

    expect(
      (
        await downloadGoogleFonts({
          ...options,
          subsets: ["latin"],
        })
      ).skipped,
    ).toBe(false);

    expect(
      (
        await downloadGoogleFonts({
          ...options,
          subsets: undefined,
        })
      ).fontFiles,
    ).toBe(3);
  });

  it("rejects unavailable subsets instead of silently omitting fonts", async () => {
    await expect(
      downloadGoogleFonts({
        fonts: {
          body: {
            family: "Inter",
          },
        },
        outputDir,
        fetcher: createFetchMock(),
        subsets: ["latin-ext"],
      }),
    ).rejects.toThrow('no "latin-ext" subset');
  });

  it("rejects empty subset lists", async () => {
    await expect(
      downloadGoogleFonts({
        fonts: {
          body: {
            family: "Inter",
          },
        },
        outputDir,
        subsets: [],
      }),
    ).rejects.toThrow("subsets must be");
  });

  it("downloads fonts and generates a local stylesheet", async () => {
    const fetcher = createFetchMock();

    const result = await downloadGoogleFonts({
      fonts: {
        body: {
          family: "Inter",
          weights: [400],
        },
      },
      outputDir,
      fetcher,
    });

    expect(result.skipped).toBe(false);
    expect(result.fontFiles).toBe(1);

    expect(result.cssPath).toBe(join(outputDir, "puzzle-fonts.css"));

    const css = await readFile(result.cssPath, "utf8");

    expect(css).toContain("@font-face");
    expect(css).toContain("font-family: 'Inter'");
    expect(css).toContain("font-weight: 400");
    expect(css).toContain("unicode-range:");

    expect(css).toContain('url("./puzzle-font-inter.woff2")');

    expect(css).not.toContain("fonts.gstatic.com");

    expect(fetcher).toHaveBeenCalledTimes(2);

    const preloadFont = await readFile(
      join(outputDir, "puzzle-font-inter.woff2"),
    );

    expect(preloadFont).toEqual(Buffer.from(FONT_BYTES));
  });

  it("uses the normal Latin variant instead of italic or Latin Extended", async () => {
    const css = `
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/v18/extended.woff2) format('woff2');
  unicode-range: U+0100-02FF;
}

/* latin */
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/v18/italic.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}

/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/v18/normal.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}
`;

    const result = await downloadGoogleFonts({
      fonts: {
        body: {
          family: "Inter",
        },
      },
      outputDir,
      fetcher: createFetchMock(css),
    });

    const generatedCss = await readFile(result.cssPath, "utf8");

    expect(generatedCss).toContain('url("./puzzle-font-inter.woff2")');

    expect(generatedCss).toContain('url("./font-');

    const preloadFont = await readFile(
      join(outputDir, "puzzle-font-inter.woff2"),
    );

    expect(preloadFont).toEqual(Buffer.from(FONT_BYTES));
  });

  it("does not generate a preload file when Latin is excluded", async () => {
    const latinExtCss = GOOGLE_CSS.replace(
      "/* latin */",
      "/* latin-ext */",
    ).replace("example.woff2", "extended.woff2");

    const result = await downloadGoogleFonts({
      fonts: {
        body: {
          family: "Inter",
        },
      },
      outputDir,
      fetcher: createFetchMock(latinExtCss),
      subsets: ["latin-ext"],
    });

    expect(result.fontFiles).toBe(1);

    const files = await readFile(join(outputDir, "puzzle-fonts.css"), "utf8");

    expect(files).not.toContain("puzzle-font-inter.woff2");
  });

  it("does not download unchanged fonts again", async () => {
    const fetcher = createFetchMock();

    const options = {
      fonts: {
        body: {
          family: "Inter" as const,
          weights: [400],
        },
      },
      outputDir,
      fetcher,
    };

    const first = await downloadGoogleFonts(options);

    expect(first.skipped).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(2);

    const second = await downloadGoogleFonts(options);

    expect(second.skipped).toBe(true);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("downloads fonts again when force is enabled", async () => {
    const fetcher = createFetchMock();

    const options = {
      fonts: {
        body: {
          family: "Inter" as const,
          weights: [400],
        },
      },
      outputDir,
      fetcher,
    };

    await downloadGoogleFonts(options);

    const result = await downloadGoogleFonts({
      ...options,
      force: true,
    });

    expect(result.skipped).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it("rejects invalid font responses", async () => {
    const fetcher = vi.fn(async () => {
      return new Response("Not found", {
        status: 404,
      });
    });

    await expect(
      downloadGoogleFonts({
        fonts: {
          body: {
            family: "Inter",
          },
        },
        outputDir,
        fetcher,
      }),
    ).rejects.toThrow("HTTP 404");
  });

  it("rejects responses without font-face declarations", async () => {
    const fetcher = vi.fn(async () => {
      return new Response("Invalid CSS", {
        status: 200,
      });
    });

    await expect(
      downloadGoogleFonts({
        fonts: {
          body: {
            family: "Inter",
          },
        },
        outputDir,
        fetcher,
      }),
    ).rejects.toThrow("@font-face");
  });

  it("rejects font files from unsupported hosts", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.startsWith("https://fonts.googleapis.com/")) {
        const css = GOOGLE_CSS.replace(
          "https://fonts.gstatic.com",
          "https://example.com",
        );

        return new Response(css, {
          status: 200,
        });
      }

      return new Response(FONT_BYTES, {
        status: 200,
      });
    });

    await expect(
      downloadGoogleFonts({
        fonts: {
          body: {
            family: "Inter",
          },
        },
        outputDir,
        fetcher,
      }),
    ).rejects.toThrow("unsupported font URL");
  });
});
