import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  TutorialDefinition,
  TutorialManifestEntry,
} from "../types";
import { tutorialDurationSeconds } from "../types";

export type TutorialAssetPaths = {
  directory: string;
  videoPath: string;
  thumbnailPath: string;
  captionsPath: string;
  videoUrl: string;
  thumbnailUrl: string;
  captionsUrl: string;
};

export const getTutorialAssetPaths = (
  tutorialId: string,
  videosDirectory: string,
): TutorialAssetPaths => {
  assert.match(tutorialId, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tutorial ID must be URL-safe.");
  const directory = join(videosDirectory, "components", tutorialId);
  const baseUrl = `/videos/components/${tutorialId}`;
  return {
    directory,
    videoPath: join(directory, "tutorial.mp4"),
    thumbnailPath: join(directory, "thumbnail.jpg"),
    captionsPath: join(directory, "captions.vtt"),
    videoUrl: `${baseUrl}/tutorial.mp4`,
    thumbnailUrl: `${baseUrl}/thumbnail.jpg`,
    captionsUrl: `${baseUrl}/captions.vtt`,
  };
};

export const createTutorialManifestEntry = (
  tutorial: TutorialDefinition,
  paths: TutorialAssetPaths,
  sourceHash: string,
  lastGeneratedAt: string,
): TutorialManifestEntry => {
  assert.match(sourceHash, /^[a-f0-9]{64}$/, "Source hash must be SHA-256.");
  assert.ok(
    Number.isFinite(Date.parse(lastGeneratedAt)) &&
      new Date(lastGeneratedAt).toISOString() === lastGeneratedAt,
    "lastGeneratedAt must be a valid ISO timestamp.",
  );
  return {
    id: tutorial.id,
    title: tutorial.title,
    description: tutorial.description,
    category: tutorial.category,
    durationSeconds: tutorialDurationSeconds(tutorial),
    language: tutorial.language,
    videoUrl: paths.videoUrl,
    thumbnailUrl: paths.thumbnailUrl,
    captionsUrl: paths.captionsUrl,
    documentationUrl: tutorial.documentationUrl,
    lastGeneratedAt,
    version: tutorial.version,
    sourceHash,
  };
};

export const shouldRenderTutorial = ({
  force,
  previousHash,
  currentHash,
  assetsPresent,
}: {
  force: boolean;
  previousHash: string | undefined;
  currentHash: string;
  assetsPresent: boolean;
}) => force || previousHash !== currentHash || !assetsPresent;

export const hashTutorialSources = async (
  tutorial: TutorialDefinition,
  repositoryRoot: string,
  renderingSources: readonly string[],
) => {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(tutorial));
  hash.update(
    ["remotion@4.0.545", "h264", "crf=25", "1920x1080", "30fps"].join("\0"),
  );
  for (const file of [...tutorial.sourceFiles, ...renderingSources]) {
    hash.update(`\0${file}\0`);
    hash.update(await readFile(join(repositoryRoot, file)));
  }
  return hash.digest("hex");
};
