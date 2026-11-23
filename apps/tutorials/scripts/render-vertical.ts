import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { withTutorialRenderLock } from "../src/studio/render-lock";

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(appDirectory, "../..");
const rawArguments = Bun.argv.slice(2);
const renderArguments =
  rawArguments[0] === "--" ? rawArguments.slice(1) : rawArguments;

await withTutorialRenderLock(repositoryRoot, async () => {
  const child = Bun.spawn(
    ["remotion", "render", "src/index.ts", ...renderArguments],
    {
      cwd: appDirectory,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  const exitCode = await child.exited;
  assert.equal(
    exitCode,
    0,
    `Remotion vertical render failed with exit code ${exitCode}.`,
  );
});
