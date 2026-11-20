export const AI_AGENTS = ["copilot", "claude", "cursor", "agents"] as const;

export type AiAgent = (typeof AI_AGENTS)[number];
export type AiCommand = "init" | "update" | "check";

export type InstructionManifest = {
  schemaVersion: 1;
  packageName: string;
  instructionVersion: number;
  contentFile: string;
  instructionDependencies: string[];
  documentationUrl: string;
};

export type LoadedInstructionPackage = {
  name: string;
  version: string;
  instructionVersion: number;
  content: string;
  contentHash: string;
  dependencies: string[];
  documentationUrl: string;
  packageDirectory: string;
};

export type InstalledPackage = {
  name: string;
  version: string;
  private: boolean;
  packageDirectory: string;
  packageJsonPath: string;
};

export type GeneratedFileRecord = {
  fileHash: string;
  managedHash: string;
};

export type AiProjectManifest = {
  schemaVersion: 1;
  generatorVersion: string;
  packages: Array<{
    name: string;
    version: string;
    instructionVersion: number;
    contentHash: string;
  }>;
  agents: AiAgent[];
  generatedFiles: Record<string, GeneratedFileRecord>;
};

export type AiCliOptions = {
  cwd?: string;
  write?: (message: string) => void;
  interactive?: boolean;
};
