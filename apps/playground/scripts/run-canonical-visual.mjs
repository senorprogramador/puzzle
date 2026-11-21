import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_ENVIRONMENT_ID,
  CANONICAL_IMAGE_REF,
} from "../tests/visual-support.mjs";

const commands = {
  e2e: "test:e2e:container",
  behavior: "test:reference:behavior:container",
  a11y: "test:a11y:container",
  visual: "test:visual:container",
  update: "test:visual:update:container",
  diagnostics: "test:visual:diagnostics:container",
};
const action = process.argv[2];
const innerCommand = commands[action];

if (!innerCommand) {
  console.error(
    `Unknown canonical Playwright action "${action}". Choose one of: ${Object.keys(commands).join(", ")}.`,
  );
  process.exit(2);
}

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const containerCommand = [
  "npm install --global --allow-scripts=bun bun@1.4.4",
  'test "$(bun --version)" = "1.4.4"',
  "bun install --frozen-lockfile",
  "bun run build",
  "bun run --filter '@puzzle-ui/playground' build",
  `bun run --filter '@puzzle-ui/playground' ${innerCommand}`,
].join(" && ");

const result = spawnSync(
  "docker",
  [
    "run",
    "--rm",
    "--init",
    "--platform",
    "linux/arm64",
    "--shm-size=1gb",
    "--volume",
    `${repositoryRoot}:/workspace`,
    "--volume",
    "/workspace/node_modules",
    "--workdir",
    "/workspace",
    "--env",
    "CI=1",
    "--env",
    `PUZZLE_VISUAL_ENVIRONMENT=${CANONICAL_ENVIRONMENT_ID}`,
    "--env",
    `PUZZLE_PLAYWRIGHT_IMAGE=${CANONICAL_IMAGE_REF}`,
    CANONICAL_IMAGE_REF,
    "bash",
    "-ec",
    containerCommand,
  ],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(`Could not run Docker: ${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
