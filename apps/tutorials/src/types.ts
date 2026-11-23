export type TutorialPreview = "file-upload" | "data-table" | "theme-setup";
export type TutorialLanguage = "en" | "nl" | "es" | "de";

export type TutorialScene = {
  id: string;
  title: string;
  body: string;
  narration: string;
  durationSeconds: number;
  code?: string;
  codeFilename?: string;
  codeLanguage?: string;
  highlightedLines?: number[];
  preview?: TutorialPreview;
  steps?: string[];
};

export type TutorialDefinition = {
  id: string;
  title: string;
  description: string;
  category: "components";
  componentName: string;
  packageName: "@puzzle-ui/ui" | "@puzzle-ui/theme";
  audience: string;
  objectives: string[];
  language: TutorialLanguage;
  documentationUrl: string;
  version: string;
  sourceFiles: string[];
  scenes: TutorialScene[];
};

export type TutorialManifestEntry = {
  id: string;
  title: string;
  description: string;
  category: TutorialDefinition["category"];
  durationSeconds: number;
  language: TutorialLanguage;
  videoUrl: string;
  thumbnailUrl: string;
  captionsUrl: string;
  documentationUrl: string;
  lastGeneratedAt: string;
  version: string;
  sourceHash: string;
};

export const tutorialDurationSeconds = (tutorial: TutorialDefinition) =>
  tutorial.scenes.reduce((total, scene) => total + scene.durationSeconds, 0);
