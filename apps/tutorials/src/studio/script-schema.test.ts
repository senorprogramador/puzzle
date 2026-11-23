import { describe, expect, it } from "bun:test";
import { validateTutorialDraft } from "./script-schema";

const sources = [
  { file: "packages/ui/src/components/example.tsx", lineCount: 20 },
];

const createDraft = () => ({
  schemaVersion: 1,
  componentName: "Example",
  title: "Using the Example component",
  description: "A practical guide to the verified public Example component API.",
  scenes: Array.from({ length: 4 }, (_, index) => ({
    id: `scene-${index + 1}`,
    title: `Explain behavior ${index + 1}`,
    narration:
      "Explain only the behavior supported by the implementation and cite its source.",
    visualDescription: "Show the relevant public component implementation.",
    evidence: [
      {
        file: sources[0]?.file,
        startLine: index + 1,
        endLine: index + 2,
      },
    ],
  })),
});

describe("tutorial script schema", () => {
  it("accepts a source-cited draft with valid line ranges", () => {
    const result = validateTutorialDraft(createDraft(), "Example", sources);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scenes).toHaveLength(4);
    }
  });

  it("rejects unsupported evidence files, out-of-range lines, and executable fields", () => {
    const draft = createDraft();
    const firstScene = draft.scenes[0];
    if (!firstScene) throw new Error("Test draft is missing its first scene.");
    firstScene.evidence[0] = {
      file: "packages/../../etc/passwd",
      startLine: 1,
      endLine: 200,
    };
    const unsafe = validateTutorialDraft(draft, "Example", sources);
    expect(unsafe.success).toBe(false);
    if (!unsafe.success) {
      expect(unsafe.errors.join(" ")).toContain("safe repository path");
    }

    const withCommand = { ...createDraft(), shellCommand: "rm -rf ." };
    const extraProperty = validateTutorialDraft(
      withCommand,
      "Example",
      sources,
    );
    expect(extraProperty.success).toBe(false);
    if (!extraProperty.success) {
      expect(extraProperty.errors.join(" ")).toContain(
        "unsupported top-level properties",
      );
    }
  });
});
