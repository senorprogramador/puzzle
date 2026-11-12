import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { resolveFontStylesheets } from "./resolve-font-stylesheets";
import type { ThemeFonts } from "./types";

const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const GOOGLE_FONTS_CSS_HEADERS = {
  accept: "text/css,*/*;q=0.1",
  "user-agent": GOOGLE_FONTS_USER_AGENT,
};

const FONT_FACE_REGEX = /(?:\/\*\s*([^*]+?)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/gi;

const FONT_URL_REGEX = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)"'\s]+))\s*\)/i;

const FONT_FORMAT_REGEX = /format\(\s*["']?([^"')]+)["']?\s*\)/i;

const GENERATED_CSS_FILENAME = "puzzle-fonts.css";

const createHashValue = (value: string): string => {
  return createHash("sha256").update(value).digest("hex");
};

type ParsedFontFace = {
  body: string;
  url: string;
  originalUrl: string;
  subset?: string;
};

type DownloadGoogleFontsOptions = {
  fonts: ThemeFonts;
  outputDir: string;
  force?: boolean;
  subsets?: readonly string[];
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>;
};

export type DownloadGoogleFontsResult = {
  cssPath: string;
  fontFiles: number;
  skipped: boolean;
};

const parseFontFaces = (css: string, family: string): ParsedFontFace[] => {
  const matches = [...css.matchAll(FONT_FACE_REGEX)];

  if (matches.length === 0) {
    throw new Error(
      `Google Fonts returned no @font-face declarations for "${family}".`,
    );
  }

  return matches.map((match) => {
    const body = match[2];

    if (body === undefined) {
      throw new Error(
        `Could not parse a font-face declaration for "${family}".`,
      );
    }

    const urlMatch = body.match(FONT_URL_REGEX);

    const fontUrl = urlMatch?.[1] ?? urlMatch?.[2] ?? urlMatch?.[3];

    if (!fontUrl || !urlMatch) {
      throw new Error(
        `No font URL found in a font-face declaration for "${family}".`,
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(fontUrl);
    } catch {
      throw new Error(
        `Google Fonts returned an invalid font URL for "${family}".`,
      );
    }

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "fonts.gstatic.com" ||
      !parsedUrl.pathname.toLowerCase().endsWith(".woff2")
    ) {
      throw new Error(
        `Google Fonts returned an unsupported font URL: ${fontUrl}`,
      );
    }

    const format = body.match(FONT_FORMAT_REGEX)?.[1];

    if (format && format.toLowerCase() !== "woff2") {
      throw new Error(
        `Expected a WOFF2 font for "${family}", received "${format}".`,
      );
    }

    return {
      body,
      url: fontUrl,
      originalUrl: urlMatch[0],
      subset: match[1]?.trim(),
    };
  });
};

const hasCurrentGeneratedFonts = async (
  cssPath: string,
  outputDir: string,
  configHash: string,
): Promise<boolean> => {
  try {
    const css = await readFile(cssPath, "utf8");

    if (!css.includes(`puzzle-ui-fonts-sha256:${configHash}`)) {
      return false;
    }

    const referencedFiles = [
      ...css.matchAll(/url\(\s*["']?\.\/([^)"']+)["']?\s*\)/g),
    ]
      .map((match) => match[1])
      .filter((name): name is string => name !== undefined);

    if (referencedFiles.length === 0) {
      return false;
    }

    await Promise.all(
      referencedFiles.map((filename) => access(join(outputDir, filename))),
    );

    return true;
  } catch {
    return false;
  }
};

export const downloadGoogleFonts = async ({
  fonts,
  outputDir,
  force = false,
  subsets,
  fetcher = fetch,
}: DownloadGoogleFontsOptions): Promise<DownloadGoogleFontsResult> => {
  if (subsets !== undefined && (subsets.length === 0 || subsets.some((subset) => !/^[a-z]+(?:-[a-z]+)*$/.test(subset)))) {
    throw new TypeError("subsets must be a non-empty list of Google Fonts subset names.");
  }
  const stylesheets = resolveFontStylesheets(fonts);

  if (stylesheets.length === 0) {
    throw new Error(
      "No fonts configured. Add at least one font to puzzle-fonts.json.",
    );
  }

  await mkdir(outputDir, { recursive: true });

  const cssPath = join(outputDir, GENERATED_CSS_FILENAME);

  const configHash = createHashValue(
    JSON.stringify([
      subsets ? [...new Set(subsets)].sort() : null,
      stylesheets.map((stylesheet) => stylesheet.href).sort(),
    ]),
  );

  if (
    !force &&
    (await hasCurrentGeneratedFonts(cssPath, outputDir, configHash))
  ) {
    return {
      cssPath,
      fontFiles: 0,
      skipped: true,
    };
  }

  const fontFiles = new Map<string, string>();
  const generatedFaces: string[] = [];

  for (const stylesheet of stylesheets) {
    const response = await fetcher(stylesheet.href, {
      headers: GOOGLE_FONTS_CSS_HEADERS,
    });

    if (!response.ok) {
      const details = (await response.text()).slice(0, 500);

      throw new Error(
        [
          `Google Fonts request failed for "${stylesheet.family}".`,
          `HTTP ${response.status}.`,
          details,
        ]
          .filter(Boolean)
          .join(" "),
      );
    }

    const css = await response.text();

    const faces = parseFontFaces(css, stylesheet.family);
    if (subsets) {
      for (const subset of subsets) {
        if (!faces.some((face) => face.subset === subset)) {
          throw new Error(`Google Fonts returned no "${subset}" subset for "${stylesheet.family}".`);
        }
      }
    }

    for (const face of faces) {
      if (subsets && (!face.subset || !subsets.includes(face.subset))) continue;
      let filename = fontFiles.get(face.url);

      if (!filename) {
        filename = `font-${createHashValue(face.url).slice(0, 16)}.woff2`;

        const fontResponse = await fetcher(face.url);

        if (!fontResponse.ok) {
          throw new Error(
            `Could not download font "${stylesheet.family}": HTTP ${fontResponse.status}.`,
          );
        }

        const buffer = new Uint8Array(await fontResponse.arrayBuffer());

        if (buffer.byteLength === 0) {
          throw new Error(
            `Google Fonts returned an empty font file for "${stylesheet.family}".`,
          );
        }

        await writeFile(join(outputDir, filename), buffer);

        fontFiles.set(face.url, filename);
      }

      const rewrittenBody = face.body.replace(
        face.originalUrl,
        `url("./${filename}")`,
      );

      generatedFaces.push(`@font-face {\n${rewrittenBody.trim()}\n}`);
    }
  }

  const generatedCss = [
    "/* Generated by @puzzle-ui/theme. Do not edit. */",
    `/* puzzle-ui-fonts-sha256:${configHash} */`,
    "",
    generatedFaces.join("\n\n"),
    "",
  ].join("\n");

  await writeFile(cssPath, generatedCss, "utf8");

  return {
    cssPath,
    fontFiles: fontFiles.size,
    skipped: false,
  };
};
