import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "bun:test";
import { tutorials } from "../tutorials";
import {
  createTutorialManifestEntry,
  getTutorialAssetPaths,
  hashTutorialSources,
  shouldRenderTutorial,
} from "./metadata";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, {
    force: true,
    recursive: true,
  })));
});

describe("tutorial publishing metadata", () => {
  it("creates stable public output paths and rejects unsafe IDs", () => {
    expect(getTutorialAssetPaths("data-table", "/site/public/videos")).toEqual({
      directory: "/site/public/videos/components/data-table",
      videoPath: "/site/public/videos/components/data-table/tutorial.mp4",
      thumbnailPath: "/site/public/videos/components/data-table/thumbnail.jpg",
      captionsPath: "/site/public/videos/components/data-table/captions.vtt",
      videoUrl: "/videos/components/data-table/tutorial.mp4",
      thumbnailUrl: "/videos/components/data-table/thumbnail.jpg",
      captionsUrl: "/videos/components/data-table/captions.vtt",
    });
    expect(() => getTutorialAssetPaths("../other", "/site/public/videos")).toThrow();
  });

  it("generates complete metadata from a tutorial definition", () => {
    const tutorial = tutorials.find((entry) => entry.id === "file-upload")!;
    const paths = getTutorialAssetPaths(tutorial.id, "/site/public/videos");
    const entry = createTutorialManifestEntry(
      tutorial,
      paths,
      "a".repeat(64),
      "2026-11-22T23:00:00.000Z",
    );

    expect(entry).toMatchObject({
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      category: "components",
      durationSeconds: 94,
      language: "en",
      videoUrl: "/videos/components/file-upload/tutorial.mp4",
      thumbnailUrl: "/videos/components/file-upload/thumbnail.jpg",
      captionsUrl: "/videos/components/file-upload/captions.vtt",
      documentationUrl: tutorial.documentationUrl,
      version: "1",
      sourceHash: "a".repeat(64),
    });
  });

  it("invalidates rendering when definitions, sources, assets, or force change", () => {
    expect(
      shouldRenderTutorial({
        force: false,
        previousHash: "same",
        currentHash: "same",
        assetsPresent: true,
      }),
    ).toBe(false);
    expect(
      shouldRenderTutorial({
        force: false,
        previousHash: "old",
        currentHash: "new",
        assetsPresent: true,
      }),
    ).toBe(true);
    expect(
      shouldRenderTutorial({
        force: false,
        previousHash: "same",
        currentHash: "same",
        assetsPresent: false,
      }),
    ).toBe(true);
    expect(
      shouldRenderTutorial({
        force: true,
        previousHash: "same",
        currentHash: "same",
        assetsPresent: true,
      }),
    ).toBe(true);
  });

  it("hashes tutorial text and referenced source contents deterministically", async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-tutorial-hash-"));
    temporaryDirectories.push(directory);
    const sourcePath = join(directory, "component.tsx");
    await writeFile(sourcePath, "export const Component = () => null;\n");
    const tutorial = {
      ...tutorials[0]!,
      sourceFiles: ["component.tsx"],
    };
    const initialHash = await hashTutorialSources(tutorial, directory, []);
    expect(await hashTutorialSources(tutorial, directory, [])).toBe(initialHash);
    await writeFile(sourcePath, "export const Component = () => <div />;\n");
    expect(await hashTutorialSources(tutorial, directory, [])).not.toBe(initialHash);
  });
});
