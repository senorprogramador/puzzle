export type TutorialEvidenceSource = {
  file: string;
  lineCount: number;
};

export type TutorialEvidenceReference = {
  file: string;
  startLine: number;
  endLine: number;
};

export type TutorialDraftScene = {
  id: string;
  title: string;
  narration: string;
  visualDescription: string;
  evidence: TutorialEvidenceReference[];
};

export type TutorialDraft = {
  schemaVersion: 1;
  componentName: string;
  title: string;
  description: string;
  scenes: TutorialDraftScene[];
};

export type TutorialDraftValidation =
  | { success: true; data: TutorialDraft }
  | { success: false; errors: string[] };

export const tutorialDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "componentName", "title", "description", "scenes"],
  properties: {
    schemaVersion: { type: "integer", const: 1 },
    componentName: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    scenes: {
      type: "array",
      minItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "title",
          "narration",
          "visualDescription",
          "evidence",
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          narration: { type: "string" },
          visualDescription: { type: "string" },
          evidence: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["file", "startLine", "endLine"],
              properties: {
                file: { type: "string" },
                startLine: { type: "integer", minimum: 1 },
                endLine: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
    },
  },
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).every((key) => keys.includes(key));

const isSafeRepositoryPath = (file: string) =>
  file.startsWith("packages/") || file.startsWith("apps/");

export const validateTutorialDraft = (
  value: unknown,
  expectedComponentName: string,
  sourceFiles: readonly TutorialEvidenceSource[],
): TutorialDraftValidation => {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return { success: false, errors: ["Draft must be a JSON object."] };
  }
  const topLevelKeys = [
    "schemaVersion",
    "componentName",
    "title",
    "description",
    "scenes",
  ];
  if (!hasOnlyKeys(value, topLevelKeys)) {
    errors.push("Draft contains unsupported top-level properties.");
  }
  if (value.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1.");
  }
  if (value.componentName !== expectedComponentName) {
    errors.push(`componentName must be ${expectedComponentName}.`);
  }
  const title =
    typeof value.title === "string" ? value.title.trim() : "";
  const description =
    typeof value.description === "string" ? value.description.trim() : "";
  if (title.length < 8 || title.length > 120) {
    errors.push("title must be between 8 and 120 characters.");
  }
  if (description.length < 20 || description.length > 300) {
    errors.push("description must be between 20 and 300 characters.");
  }

  const scenes: TutorialDraftScene[] = [];
  const sceneIds = new Set<string>();
  const inputScenes = Array.isArray(value.scenes) ? value.scenes : [];
  if (inputScenes.length < 4 || inputScenes.length > 12) {
    errors.push("scenes must contain between 4 and 12 entries.");
  }

  const sourceLineCounts = new Map(
    sourceFiles.map((source) => [source.file, source.lineCount]),
  );
  inputScenes.forEach((inputScene, index) => {
    const prefix = `scenes[${index}]`;
    if (!isRecord(inputScene)) {
      errors.push(`${prefix} must be an object.`);
      return;
    }
    if (
      !hasOnlyKeys(inputScene, [
        "id",
        "title",
        "narration",
        "visualDescription",
        "evidence",
      ])
    ) {
      errors.push(`${prefix} contains unsupported properties.`);
    }

    const id = typeof inputScene.id === "string" ? inputScene.id.trim() : "";
    const sceneTitle =
      typeof inputScene.title === "string" ? inputScene.title.trim() : "";
    const narration =
      typeof inputScene.narration === "string"
        ? inputScene.narration.trim()
        : "";
    const visualDescription =
      typeof inputScene.visualDescription === "string"
        ? inputScene.visualDescription.trim()
        : "";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      errors.push(`${prefix}.id must be a URL-safe slug.`);
    }
    if (sceneIds.has(id)) errors.push(`${prefix}.id duplicates "${id}".`);
    sceneIds.add(id);
    if (sceneTitle.length < 5 || sceneTitle.length > 100) {
      errors.push(`${prefix}.title must be between 5 and 100 characters.`);
    }
    if (narration.length < 40 || narration.length > 1200) {
      errors.push(`${prefix}.narration must be between 40 and 1200 characters.`);
    }
    if (visualDescription.length < 10 || visualDescription.length > 500) {
      errors.push(
        `${prefix}.visualDescription must be between 10 and 500 characters.`,
      );
    }

    const evidence: TutorialEvidenceReference[] = [];
    const inputEvidence = Array.isArray(inputScene.evidence)
      ? inputScene.evidence
      : [];
    if (inputEvidence.length === 0 || inputEvidence.length > 8) {
      errors.push(`${prefix}.evidence must contain between 1 and 8 references.`);
    }
    inputEvidence.forEach((inputReference, referenceIndex) => {
      const evidencePrefix = `${prefix}.evidence[${referenceIndex}]`;
      if (!isRecord(inputReference)) {
        errors.push(`${evidencePrefix} must be an object.`);
        return;
      }
      if (
        !hasOnlyKeys(inputReference, ["file", "startLine", "endLine"])
      ) {
        errors.push(`${evidencePrefix} contains unsupported properties.`);
      }
      const file =
        typeof inputReference.file === "string"
          ? inputReference.file.trim()
          : "";
      const startLine = inputReference.startLine;
      const endLine = inputReference.endLine;
      if (!isSafeRepositoryPath(file) || file.split("/").includes("..")) {
        errors.push(`${evidencePrefix}.file is not a safe repository path.`);
        return;
      }
      const lineCount = sourceLineCounts.get(file);
      if (!lineCount) {
        errors.push(`${evidencePrefix}.file is not part of the supplied evidence.`);
        return;
      }
      if (
        !Number.isInteger(startLine) ||
        !Number.isInteger(endLine) ||
        typeof startLine !== "number" ||
        typeof endLine !== "number" ||
        startLine < 1 ||
        endLine < startLine ||
        endLine > lineCount
      ) {
        errors.push(
          `${evidencePrefix} must reference existing lines in ${file}.`,
        );
        return;
      }
      evidence.push({ file, startLine, endLine });
    });

    if (
      id &&
      sceneTitle &&
      narration &&
      visualDescription &&
      evidence.length > 0
    ) {
      scenes.push({
        id,
        title: sceneTitle,
        narration,
        visualDescription,
        evidence,
      });
    }
  });

  if (errors.length > 0) return { success: false, errors };
  return {
    success: true,
    data: {
      schemaVersion: 1,
      componentName: expectedComponentName,
      title,
      description,
      scenes,
    },
  };
};
