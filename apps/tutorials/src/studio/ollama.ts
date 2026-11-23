import type { TutorialStudioConfig } from "./config";

export type InstalledOllamaModel = {
  name: string;
  sizeBytes: number;
  modifiedAt?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseJsonResponse = async (response: Response, endpoint: string) => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Ollama ${endpoint} returned HTTP ${response.status}: ${text.slice(0, 500)}`,
    );
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Ollama ${endpoint} returned invalid JSON.`);
  }
};

export const listInstalledOllamaModels = async (
  config: TutorialStudioConfig,
): Promise<InstalledOllamaModel[]> => {
  let response: Response;
  try {
    response = await fetch(`${config.ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(config.requestTimeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(
        `Ollama did not respond within ${config.requestTimeoutMs}ms at ${config.ollamaUrl}. Start the local Ollama service and retry.`,
      );
    }
    throw new Error(
      `Could not connect to local Ollama at ${config.ollamaUrl}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const payload = await parseJsonResponse(response, "/api/tags");
  if (!isRecord(payload) || !Array.isArray(payload.models)) {
    throw new Error("Ollama /api/tags returned an unexpected model list.");
  }
  return payload.models.map((model, index) => {
    if (
      !isRecord(model) ||
      typeof model.name !== "string" ||
      typeof model.size !== "number" ||
      !Number.isFinite(model.size) ||
      model.size < 0
    ) {
      throw new Error(`Ollama returned an invalid model at models[${index}].`);
    }
    return {
      name: model.name,
      sizeBytes: model.size,
      modifiedAt:
        typeof model.modified_at === "string" ? model.modified_at : undefined,
    };
  });
};

export const generateStructuredOutput = async ({
  config,
  model,
  systemPrompt,
  userPrompt,
  responseSchema,
}: {
  config: TutorialStudioConfig;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  responseSchema: Record<string, unknown>;
}) => {
  let response: Response;
  try {
    response = await fetch(`${config.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(config.requestTimeoutMs),
      body: JSON.stringify({
        model,
        stream: false,
        keep_alive: config.modelKeepAlive,
        format: responseSchema,
        options: {
          temperature: config.temperature,
          num_ctx: config.contextSize,
          num_predict: config.maxOutputTokens,
        },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(
        `Ollama model "${model}" exceeded the ${config.requestTimeoutMs}ms request timeout.`,
      );
    }
    throw new Error(
      `Could not request a response from local Ollama model "${model}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const payload = await parseJsonResponse(response, "/api/chat");
  if (
    !isRecord(payload) ||
    !isRecord(payload.message) ||
    typeof payload.message.content !== "string"
  ) {
    throw new Error("Ollama /api/chat returned no structured message content.");
  }
  return payload.message.content;
};
