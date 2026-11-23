import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type TutorialCandidate = {
  name: string;
  packageName: string;
  kind: "component" | "hook" | "provider" | "utility";
  description: string;
  sourceFiles: string[];
  propNames: string[];
  relevanceScore: number;
  factors: {
    apiComplexity: number;
    composition: number;
    interactivity: number;
    accessibility: number;
    documentation: number;
  };
};

const workerPath = fileURLToPath(
  new URL("../../scripts/discovery-worker.mjs", import.meta.url),
);

export const discoverTutorialCandidates = async (
  repositoryRoot: string,
  selectedPackage?: string,
): Promise<TutorialCandidate[]> => {
  const worker = Bun.spawn(
    ["node", workerPath, repositoryRoot, selectedPackage ?? ""],
    {
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const [exitCode, output, errorOutput] = await Promise.all([
    worker.exited,
    new Response(worker.stdout).text(),
    new Response(worker.stderr).text(),
  ]);
  if (exitCode !== 0) {
    throw new Error(
      `TypeScript public-export discovery failed: ${errorOutput.trim() || `worker exited with code ${exitCode}`}`,
    );
  }
  try {
    const candidates = JSON.parse(output) as unknown;
    if (!Array.isArray(candidates)) {
      throw new Error("Discovery worker returned a non-array result.");
    }
    return candidates as TutorialCandidate[];
  } catch (error) {
    throw new Error(
      `TypeScript public-export discovery returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const readCandidateEvidence = async (
  candidate: TutorialCandidate,
  repositoryRoot: string,
  maximumCharacters = 30_000,
) => {
  let remainingCharacters = maximumCharacters;
  const sources: Array<{
    file: string;
    lineCount: number;
    excerpt: string;
  }> = [];
  for (const file of candidate.sourceFiles) {
    if (remainingCharacters <= 0) break;
    const path = resolve(repositoryRoot, file);
    const relativePath = relative(repositoryRoot, path);
    if (relativePath.startsWith("..")) {
      throw new Error(`Source evidence path escapes the repository: ${file}`);
    }
    const contents = await readFile(path, "utf8");
    const lines = contents.split(/\r?\n/);
    const excerptLines = lines.slice(
      0,
      Math.max(1, Math.min(lines.length, Math.ceil(remainingCharacters / 100))),
    );
    const excerpt = excerptLines
      .map((line, index) => `${index + 1}: ${line}`)
      .join("\n");
    sources.push({
      file,
      lineCount: excerptLines.length,
      excerpt,
    });
    remainingCharacters -= excerpt.length;
  }
  if (sources.length === 0) {
    throw new Error(`No source evidence is available for ${candidate.name}.`);
  }
  return sources;
};
