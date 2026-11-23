import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tutorials } from "./index";
import { tutorialDurationSeconds } from "../types";

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repositoryRoot = resolve(appDirectory, "../..");

export const validateTutorials = async () => {
  const ids = new Set<string>();
  const documentationUrls = new Set<string>();

  for (const tutorial of tutorials) {
    assert.match(tutorial.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tutorial IDs must be URL-safe.");
    assert.ok(!ids.has(tutorial.id), `Duplicate tutorial ID: ${tutorial.id}`);
    ids.add(tutorial.id);
    assert.ok(tutorial.title.trim(), `${tutorial.id} needs a title.`);
    assert.ok(tutorial.description.trim(), `${tutorial.id} needs a description.`);
    assert.ok(tutorial.audience.trim(), `${tutorial.id} needs a target audience.`);
    assert.ok(tutorial.objectives.length > 0, `${tutorial.id} needs learning objectives.`);
    assert.ok(!documentationUrls.has(tutorial.documentationUrl), `${tutorial.id} duplicates a documentation URL.`);
    documentationUrls.add(tutorial.documentationUrl);
    assert.ok(
      tutorial.documentationUrl.startsWith("/docs/"),
      `${tutorial.id} must link to a documentation route.`,
    );
    assert.ok(
      tutorialDurationSeconds(tutorial) >= 90,
      `${tutorial.id} should provide a focused tutorial of at least 90 seconds.`,
    );
    assert.ok(tutorial.scenes.length >= 5, `${tutorial.id} needs multiple instructional scenes.`);

    const docsRoute = tutorial.documentationUrl.slice("/docs/".length);
    const docsPaths = [
      join(repositoryRoot, "apps/site/content/docs", `${docsRoute}.mdx`),
      join(repositoryRoot, "apps/site/content/docs", docsRoute, "index.mdx"),
    ];
    let docs: string | undefined;
    for (const docsPath of docsPaths) {
      try {
        docs = await readFile(docsPath, "utf8");
        break;
      } catch (error) {
        if (
          !(error instanceof Error && "code" in error && error.code === "ENOENT")
        ) {
          throw error;
        }
      }
    }
    assert.ok(docs, `${tutorial.documentationUrl} must resolve to an MDX page.`);
    assert.match(
      docs,
      new RegExp(`<TutorialVideo\\s+id=["']${tutorial.id}["']\\s*\\/>`),
      `${tutorial.documentationUrl} must embed tutorial ${tutorial.id}.`,
    );

    for (const sourceFile of tutorial.sourceFiles) {
      const sourcePath = resolve(repositoryRoot, sourceFile);
      assert.equal(
        relative(repositoryRoot, sourcePath).startsWith(".."),
        false,
        `${tutorial.id} source path escapes the repository: ${sourceFile}`,
      );
      await access(sourcePath);
    }
    for (const scene of tutorial.scenes) {
      assert.ok(scene.title.trim(), `${tutorial.id}/${scene.id} needs a scene title.`);
      assert.ok(scene.body.trim(), `${tutorial.id}/${scene.id} needs explanatory text.`);
      assert.ok(scene.narration.trim(), `${tutorial.id}/${scene.id} needs narration/captions.`);
      assert.ok(
        Number.isInteger(scene.durationSeconds) && scene.durationSeconds > 0,
        `${tutorial.id}/${scene.id} has an invalid duration.`,
      );
      if (scene.code) {
        assert.ok(
          !scene.code.includes("from \"@puzzle-ui/") ||
            /from "@puzzle-ui\/(ui|pieces|theme)"/.test(scene.code),
          `${tutorial.id}/${scene.id} must use a public Puzzle package entry point.`,
        );
      }
    }
  }

  const reportPath = join(appDirectory, "tutorial-suitability.md");
  await access(reportPath);
  const report = await readFile(reportPath, "utf8");
  for (const tutorial of tutorials) {
    assert.ok(report.includes(tutorial.componentName), `${tutorial.id} is missing from the suitability report.`);
  }

  return tutorials;
};
