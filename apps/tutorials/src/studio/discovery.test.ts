import { describe, expect, it } from "bun:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  discoverTutorialCandidates,
  readCandidateEvidence,
} from "./discovery";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../",
);

describe("public component discovery", () => {
  it("finds public exports and scores them from API and source evidence", async () => {
    const candidates = await discoverTutorialCandidates(
      repositoryRoot,
      "@puzzle-ui/ui",
    );
    const fileUpload = candidates.find(
      (candidate) => candidate.name === "FileUpload",
    );
    expect(fileUpload).toBeDefined();
    expect(fileUpload?.packageName).toBe("@puzzle-ui/ui");
    expect(fileUpload?.kind).toBe("component");
    expect(fileUpload?.sourceFiles.length).toBeGreaterThan(0);
    expect(fileUpload?.relevanceScore).toBeGreaterThan(0);
    expect(fileUpload?.relevanceScore).toBeLessThanOrEqual(100);
  });

  it("provides line-numbered evidence excerpts for a discovered export", async () => {
    const candidates = await discoverTutorialCandidates(
      repositoryRoot,
      "@puzzle-ui/ui",
    );
    const fileUpload = candidates.find(
      (candidate) => candidate.name === "FileUpload",
    );
    if (!fileUpload) throw new Error("FileUpload was not discovered.");
    const sources = await readCandidateEvidence(fileUpload, repositoryRoot);
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0]?.excerpt).toMatch(/^1: /);
    expect(sources[0]?.lineCount).toBeGreaterThan(0);
  });
});
