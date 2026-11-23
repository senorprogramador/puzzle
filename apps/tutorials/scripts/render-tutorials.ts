import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tutorials } from "../src/tutorials";
import {
  createTutorialManifestEntry,
  getTutorialAssetPaths,
  hashTutorialSources,
  shouldRenderTutorial,
} from "../src/rendering/metadata";
import { withTutorialRenderLock } from "../src/studio/render-lock";
import { validateTutorials } from "../src/tutorials/validate";
import type { TutorialDefinition, TutorialManifestEntry } from "../src/types";
import { tutorialDurationSeconds } from "../src/types";

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(appDirectory, "../..");
const publicVideosDirectory = join(repositoryRoot, "apps/site/public/videos");
const publicManifestPath = join(publicVideosDirectory, "manifest.json");
const siteManifestPath = join(
  repositoryRoot,
  "apps/site/src/generated/tutorial-manifest.json",
);
const renderingSources = [
  "apps/tutorials/src/Root.tsx",
  "apps/tutorials/src/components/CodeEditor.tsx",
  "apps/tutorials/src/components/PuzzlePreview.tsx",
  "apps/tutorials/src/compositions/ComponentTutorial.tsx",
  "packages/theme/src/theme.tsx",
  "packages/theme/src/theme.css",
  "packages/theme/src/constants.ts",
];
const fps = 30;
const rawArguments = Bun.argv.slice(2);
const argumentsList = rawArguments[0] === "--" ? rawArguments.slice(1) : rawArguments;
const force = argumentsList.includes("--force");
const thumbnailsOnly = argumentsList.includes("--thumbnails-only");
const manifestOnly = argumentsList.includes("--manifest-only");
const renderAll = argumentsList.includes("--all");
const selectedIds = argumentsList.filter((argument) => !argument.startsWith("--"));

type VideoProbe = {
  streams?: Array<{
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
  }>;
  format?: { duration?: string };
};

const readManifest = async (): Promise<TutorialManifestEntry[]> => {
  try {
    return JSON.parse(await readFile(publicManifestPath, "utf8")) as TutorialManifestEntry[];
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
};

const writeManifest = async (entries: TutorialManifestEntry[]) => {
  const sorted = tutorials
    .map((tutorial) => entries.find((candidate) => candidate.id === tutorial.id))
    .filter((entry): entry is TutorialManifestEntry => entry !== undefined);
  const contents = `${JSON.stringify(sorted, null, 2)}\n`;
  await mkdir(dirname(siteManifestPath), { recursive: true });
  await mkdir(publicVideosDirectory, { recursive: true });
  await writeFile(publicManifestPath, contents);
  await writeFile(siteManifestPath, contents);
};

const runRemotion = async (argumentsForRemotion: string[]) => {
  await withTutorialRenderLock(repositoryRoot, async () => {
    const process = Bun.spawn(["remotion", ...argumentsForRemotion], {
      cwd: appDirectory,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    const exitCode = await process.exited;
    assert.equal(
      exitCode,
      0,
      `Remotion command failed: ${argumentsForRemotion.join(" ")}`,
    );
  });
};

const ensureNonEmpty = async (path: string) => {
  const file = await stat(path);
  assert.ok(file.isFile() && file.size > 0, `Expected a non-empty file at ${path}.`);
};

const validateVideo = async (
  path: string,
  durationSeconds: number,
) => {
  await ensureNonEmpty(path);
  const probeProcess = Bun.spawnSync(
    [
      "ffprobe",
      "-v",
      "error",
      "-show_entries",
      "stream=codec_type,codec_name,width,height",
      "-show_entries",
      "format=duration",
      "-of",
      "json",
      path,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  assert.equal(
    probeProcess.exitCode,
    0,
    `ffprobe failed: ${new TextDecoder().decode(probeProcess.stderr)}`,
  );
  const probe = JSON.parse(new TextDecoder().decode(probeProcess.stdout)) as VideoProbe;
  const video = probe.streams?.find((stream) => stream.codec_type === "video");
  assert.equal(video?.codec_name, "h264", `${path} must use H.264.`);
  assert.equal(video?.width, 1920, `${path} must be 1920 pixels wide.`);
  assert.equal(video?.height, 1080, `${path} must be 1080 pixels tall.`);
  const hasAudio = probe.streams?.some((stream) => stream.codec_type === "audio") ?? false;
  assert.equal(hasAudio, false, `${path} must not contain an audio track.`);
  const actualDuration = Number(probe.format?.duration);
  assert.ok(Number.isFinite(actualDuration), `${path} needs valid duration metadata.`);
  assert.ok(
    Math.abs(actualDuration - durationSeconds) <= 1 / fps + 0.1,
    `${path} duration ${actualDuration}s does not match ${durationSeconds}s.`,
  );
  const decoder = Bun.spawnSync(["ffmpeg", "-v", "error", "-i", path, "-f", "null", "-"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  assert.equal(
    decoder.exitCode,
    0,
    `ffmpeg could not decode ${path}: ${new TextDecoder().decode(decoder.stderr)}`,
  );
};

const formatTimestamp = (seconds: number) => {
  const milliseconds = Math.round((seconds % 1) * 1000);
  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
};

const writeCaptions = async (
  tutorial: TutorialDefinition,
  captionsPath: string,
) => {
  let timestamp = 0;
  const cues = tutorial.scenes.map((scene, index) => {
    const start = timestamp;
    timestamp += scene.durationSeconds;
    return `${index + 1}\n${formatTimestamp(start)} --> ${formatTimestamp(timestamp)}\n${scene.narration}`;
  });
  await writeFile(captionsPath, `WEBVTT\n\n${cues.join("\n\n")}\n`);
};

const existingEntries = await readManifest();
const existingById = new Map(existingEntries.map((entry) => [entry.id, entry]));

if (manifestOnly) {
  await validateTutorials();
  for (const tutorial of tutorials) {
    assert.ok(existingById.has(tutorial.id), `Render ${tutorial.id} before updating the manifest.`);
    const paths = getTutorialAssetPaths(tutorial.id, publicVideosDirectory);
    await ensureNonEmpty(paths.videoPath);
    await ensureNonEmpty(paths.thumbnailPath);
    await ensureNonEmpty(paths.captionsPath);
  }
  await writeManifest(existingEntries);
  console.log(`Updated tutorial manifests: ${publicManifestPath}`);
} else if (thumbnailsOnly) {
  await validateTutorials();
  for (const tutorial of tutorials) {
    const paths = getTutorialAssetPaths(tutorial.id, publicVideosDirectory);
    const existing = existingById.get(tutorial.id);
    const hash = await hashTutorialSources(tutorial, repositoryRoot, renderingSources);
    assert.ok(existing, `Render ${tutorial.id} before generating its thumbnail.`);
    assert.equal(existing.sourceHash, hash, `Render ${tutorial.id}; its source has changed.`);
    await ensureNonEmpty(paths.videoPath);
    await mkdir(paths.directory, { recursive: true });
    await runRemotion([
      "still",
      "src/index.ts",
      tutorial.id,
      paths.thumbnailPath,
      "--frame=45",
      "--image-format=jpeg",
    ]);
    await ensureNonEmpty(paths.thumbnailPath);
  }
  await writeManifest(existingEntries);
} else {
  await validateTutorials();
  const selected = renderAll || selectedIds.length === 0
    ? tutorials
    : tutorials.filter((tutorial) => selectedIds.includes(tutorial.id));
  assert.equal(
    selected.length,
    renderAll || selectedIds.length === 0
      ? tutorials.length
      : selectedIds.length,
    "Unknown tutorial ID. Check the tutorial manifest and use a stable ID.",
  );

  const nextEntries = [...existingEntries];
  for (const tutorial of selected) {
    const paths = getTutorialAssetPaths(tutorial.id, publicVideosDirectory);
    await mkdir(paths.directory, { recursive: true });
    const hash = await hashTutorialSources(tutorial, repositoryRoot, renderingSources);
    const previous = existingById.get(tutorial.id);
    const assetStatuses = await Promise.all(
      [paths.videoPath, paths.thumbnailPath, paths.captionsPath].map(async (path) => {
        try {
          const file = await stat(path);
          return file.isFile() && file.size > 0;
        } catch (error) {
          if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return false;
          }
          throw error;
        }
      }),
    );
    const upToDate = !shouldRenderTutorial({
      force,
      previousHash: previous?.sourceHash,
      currentHash: hash,
      assetsPresent: assetStatuses.every(Boolean),
    });

    if (upToDate) {
      await validateVideo(
        paths.videoPath,
        tutorialDurationSeconds(tutorial),
      );
      await ensureNonEmpty(paths.thumbnailPath);
      const captions = await readFile(paths.captionsPath, "utf8");
      assert.ok(captions.startsWith("WEBVTT\n"), `${tutorial.id} captions must be WebVTT.`);
      console.log(`Skipping ${tutorial.id}: source hash is unchanged.`);
      continue;
    }

    console.log(`Rendering ${tutorial.id} (${hash.slice(0, 12)}).`);
    await runRemotion([
      "render",
      "src/index.ts",
      tutorial.id,
      paths.videoPath,
      "--codec=h264",
      "--crf=25",
      "--concurrency=2",
    ]);
    await runRemotion([
      "still",
      "src/index.ts",
      tutorial.id,
      paths.thumbnailPath,
      "--frame=45",
      "--image-format=jpeg",
    ]);
    await writeCaptions(tutorial, paths.captionsPath);
    await validateVideo(
      paths.videoPath,
      tutorialDurationSeconds(tutorial),
    );
    await ensureNonEmpty(paths.thumbnailPath);
    const captions = await readFile(paths.captionsPath, "utf8");
    assert.ok(captions.startsWith("WEBVTT\n"), `${tutorial.id} captions must be WebVTT.`);

    const entry = createTutorialManifestEntry(
      tutorial,
      paths,
      hash,
      new Date().toISOString(),
    );
    const previousIndex = nextEntries.findIndex((candidate) => candidate.id === tutorial.id);
    if (previousIndex === -1) nextEntries.push(entry);
    else nextEntries[previousIndex] = entry;
  }
  await writeManifest(nextEntries);
  console.log(`Tutorial videos are available in ${publicVideosDirectory}.`);
}
