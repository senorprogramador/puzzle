import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type TutorialStudioConfig = {
  ollamaUrl: string;
  defaultModel: string;
  scriptModel?: string;
  lightweightModel: string;
  temperature: number;
  contextSize: number;
  maxOutputTokens: number;
  requestTimeoutMs: number;
  modelKeepAlive: string;
  maxModelMemoryGb: number;
  renderWaitTimeoutMs: number;
};

export const defaultTutorialStudioConfig: TutorialStudioConfig = {
  ollamaUrl: "http://127.0.0.1:11434",
  defaultModel: "qwen3:14b",
  lightweightModel: "qwen3:4b",
  temperature: 0.2,
  contextSize: 16_384,
  maxOutputTokens: 4_096,
  requestTimeoutMs: 120_000,
  modelKeepAlive: "0",
  maxModelMemoryGb: 18,
  renderWaitTimeoutMs: 30 * 60 * 1_000,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readBoundedNumber = (
  value: unknown,
  key: string,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  if (value === undefined) return fallback;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(
      `${key} must be a finite number between ${minimum} and ${maximum}.`,
    );
  }
  return value;
};

const readModel = (
  value: unknown,
  key: string,
  fallback: string | undefined,
) => {
  if (value === undefined) return fallback;
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9._:/-]+$/.test(value.trim())
  ) {
    throw new Error(`${key} must be a valid Ollama model name.`);
  }
  return value.trim();
};

const readModelKeepAlive = (value: unknown) => {
  if (value === undefined) return defaultTutorialStudioConfig.modelKeepAlive;
  if (
    typeof value !== "string" ||
    !/^(?:0|[1-9]\d*(?:ns|us|ms|s|m|h))$/.test(value)
  ) {
    throw new Error(
      'modelKeepAlive must be "0" or an Ollama duration such as "5m".',
    );
  }
  return value;
};

export const validateOllamaUrl = (value: string) => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("ollamaUrl must be a valid URL.");
  }
  const loopbackHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
  if (
    url.protocol !== "http:" ||
    !loopbackHosts.has(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Ollama must use a plain HTTP loopback URL such as http://127.0.0.1:11434. Source code is never sent to remote hosts.",
    );
  }
  return url.origin;
};

const configKeys = [
  "ollamaUrl",
  "defaultModel",
  "scriptModel",
  "lightweightModel",
  "temperature",
  "contextSize",
  "maxOutputTokens",
  "requestTimeoutMs",
  "modelKeepAlive",
  "maxModelMemoryGb",
  "renderWaitTimeoutMs",
] as const;
const configKeySet: ReadonlySet<string> = new Set(configKeys);

export const parseTutorialStudioConfig = (
  value: unknown,
): TutorialStudioConfig => {
  if (!isRecord(value)) {
    throw new Error("Tutorial Studio config must be a JSON object.");
  }
  const unsupportedKeys = Object.keys(value).filter((key) => !configKeySet.has(key));
  if (unsupportedKeys.length > 0) {
    throw new Error(
      `Unsupported config option(s): ${unsupportedKeys.join(", ")}.`,
    );
  }

  const defaults = defaultTutorialStudioConfig;
  const ollamaUrl =
    typeof value.ollamaUrl === "string"
      ? validateOllamaUrl(value.ollamaUrl)
      : defaults.ollamaUrl;
  const defaultModel = readModel(
    value.defaultModel,
    "defaultModel",
    defaults.defaultModel,
  );
  const lightweightModel = readModel(
    value.lightweightModel,
    "lightweightModel",
    defaults.lightweightModel,
  );
  if (!defaultModel || !lightweightModel) {
    throw new Error("defaultModel and lightweightModel are required.");
  }
  const contextSize = readBoundedNumber(
    value.contextSize,
    "contextSize",
    defaults.contextSize,
    2_048,
    131_072,
  );
  const maxOutputTokens = readBoundedNumber(
    value.maxOutputTokens,
    "maxOutputTokens",
    defaults.maxOutputTokens,
    128,
    32_768,
  );
  const requestTimeoutMs = readBoundedNumber(
    value.requestTimeoutMs,
    "requestTimeoutMs",
    defaults.requestTimeoutMs,
    1_000,
    30 * 60 * 1_000,
  );
  const renderWaitTimeoutMs = readBoundedNumber(
    value.renderWaitTimeoutMs,
    "renderWaitTimeoutMs",
    defaults.renderWaitTimeoutMs,
    0,
    24 * 60 * 60 * 1_000,
  );
  for (const [key, number] of [
    ["contextSize", contextSize],
    ["maxOutputTokens", maxOutputTokens],
    ["requestTimeoutMs", requestTimeoutMs],
    ["renderWaitTimeoutMs", renderWaitTimeoutMs],
  ] as const) {
    if (!Number.isInteger(number)) {
      throw new Error(`${key} must be an integer.`);
    }
  }

  return {
    ollamaUrl,
    defaultModel,
    scriptModel: readModel(value.scriptModel, "scriptModel", undefined),
    lightweightModel,
    temperature: readBoundedNumber(
      value.temperature,
      "temperature",
      defaults.temperature,
      0,
      2,
    ),
    contextSize,
    maxOutputTokens,
    requestTimeoutMs,
    modelKeepAlive: readModelKeepAlive(value.modelKeepAlive),
    maxModelMemoryGb: readBoundedNumber(
      value.maxModelMemoryGb,
      "maxModelMemoryGb",
      defaults.maxModelMemoryGb,
      1,
      512,
    ),
    renderWaitTimeoutMs,
  };
};

export const readTutorialStudioConfig = async (appDirectory: string) => {
  const configPath = join(appDirectory, "tutorial-studio.config.json");
  try {
    const contents = await readFile(configPath, "utf8");
    return {
      config: parseTutorialStudioConfig(JSON.parse(contents) as unknown),
      configPath,
      isDefault: false,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return {
        config: defaultTutorialStudioConfig,
        configPath,
        isDefault: true,
      };
    }
    throw error;
  }
};
