import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  applyInstructionPlan,
  checkInstructionPlan,
  createInstructionPlan,
  readProjectManifest,
} from "./file-manager";
import type { LoadedInstructionPackage } from "./types";

const instructionPackage: LoadedInstructionPackage = {
  name: "@puzzle-ui/ui",
  version: "1.0.0",
  instructionVersion: 1,
  content: "# UI guidance\n",
  contentHash: "content-hash",
  dependencies: [],
  documentationUrl: "https://puzzle-ui.com/docs/ui",
  packageDirectory: "/unused",
};

describe("Puzzle AI instruction file management", () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await mkdtemp(path.join(os.tmpdir(), "puzzle-ai-files-"));
    await writeFile(
      path.join(projectRoot, "package.json"),
      JSON.stringify({ name: "consumer-app" }),
    );
  });

  afterEach(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  const plan = async (
    agents: Array<"copilot" | "claude" | "cursor" | "agents">,
    previousManifest?: Awaited<ReturnType<typeof readProjectManifest>>,
  ) =>
    createInstructionPlan({
      projectRoot,
      packages: [instructionPackage],
      agents,
      sharedInstructions: "# Shared guidance",
      ...(previousManifest ? { previousManifest } : {}),
    });

  it("writes deterministic files and passes check after init", async () => {
    const initialPlan = await plan(["copilot"]);
    await applyInstructionPlan(projectRoot, initialPlan);

    const previousManifest = await readProjectManifest(projectRoot);
    const updatePlan = await plan(["copilot"], previousManifest);

    expect(updatePlan.changes).toEqual([]);
    await expect(
      checkInstructionPlan(projectRoot, updatePlan, previousManifest),
    ).resolves.toEqual([]);
  });

  it("preserves user content around the managed AGENTS section", async () => {
    await writeFile(
      path.join(projectRoot, "AGENTS.md"),
      "# Existing project instructions\n\nKeep this text.\n",
    );
    const initialPlan = await plan(["agents"]);
    await applyInstructionPlan(projectRoot, initialPlan);

    const previousManifest = await readProjectManifest(projectRoot);
    const updatePlan = await plan(["agents"], previousManifest);
    await applyInstructionPlan(projectRoot, updatePlan);

    const content = await readFile(path.join(projectRoot, "AGENTS.md"), "utf8");
    expect(content).toContain("# Existing project instructions");
    expect(content).toContain("Keep this text.");
    expect(content.match(/PUZZLE AI INSTRUCTIONS START/g)).toHaveLength(1);
  });

  it("refuses to overwrite a conflicting dedicated agent file", async () => {
    const targetDirectory = path.join(projectRoot, ".github", "instructions");
    await mkdir(targetDirectory, { recursive: true });
    const target = path.join(targetDirectory, "puzzle-ai.instructions.md");
    await writeFile(target, "# Hand-written file\n");

    const instructionPlan = await plan(["copilot"]);

    expect(
      instructionPlan.conflicts.some((conflict) =>
        conflict.includes("already exists and is not Puzzle-managed"),
      ),
    ).toBe(true);
    await expect(readFile(target, "utf8")).resolves.toBe("# Hand-written file\n");
    await expect(
      applyInstructionPlan(projectRoot, instructionPlan),
    ).rejects.toThrow("already exists and is not Puzzle-managed");
  });

  it("removes only the managed section when an agent is deselected", async () => {
    const initialPlan = await plan(["copilot", "agents"]);
    await applyInstructionPlan(projectRoot, initialPlan);

    const agentsPath = path.join(projectRoot, "AGENTS.md");
    const existing = await readFile(agentsPath, "utf8");
    await writeFile(agentsPath, `${existing}\nHand-written after setup.\n`);
    const previousManifest = await readProjectManifest(projectRoot);
    const updatePlan = await plan(["copilot"], previousManifest);
    await applyInstructionPlan(projectRoot, updatePlan);

    await expect(readFile(agentsPath, "utf8")).resolves.toContain(
      "Hand-written after setup.",
    );
    await expect(readFile(agentsPath, "utf8")).resolves.not.toContain(
      "PUZZLE AI INSTRUCTIONS START",
    );
  });

  it("refuses to write through a symlinked output directory", async () => {
    const outside = await mkdtemp(path.join(os.tmpdir(), "puzzle-ai-outside-"));
    try {
      await import("node:fs/promises").then(({ symlink }) =>
        symlink(outside, path.join(projectRoot, ".github")),
      );
      const instructionPlan = await plan(["copilot"]);
      expect(instructionPlan.conflicts.join("\n")).toContain("unsafe directory");
    } finally {
      await rm(outside, { recursive: true, force: true });
    }
  });
});
