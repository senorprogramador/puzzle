import { describe, expect, it } from "bun:test";
import {
  defaultTutorialStudioConfig,
  parseTutorialStudioConfig,
} from "./config";
import {
  generateStructuredOutput,
  listInstalledOllamaModels,
} from "./ollama";

describe("local Ollama provider", () => {
  it("uses only the configured loopback server and validates its responses", async () => {
    let chatRequest: Record<string, unknown> | undefined;
    const server = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      async fetch(request) {
        if (new URL(request.url).pathname === "/api/tags") {
          return Response.json({
            models: [{ name: "qwen3:4b", size: 2_500_000_000 }],
          });
        }
        if (new URL(request.url).pathname === "/api/chat") {
          chatRequest = (await request.json()) as Record<string, unknown>;
          return Response.json({
            message: { content: '{"ok":true}' },
          });
        }
        return new Response("Not found", { status: 404 });
      },
    });

    try {
      const config = parseTutorialStudioConfig({
        ...defaultTutorialStudioConfig,
        ollamaUrl: server.url.origin,
      });
      const models = await listInstalledOllamaModels(config);
      expect(models).toEqual([
        { name: "qwen3:4b", sizeBytes: 2_500_000_000, modifiedAt: undefined },
      ]);
      const response = await generateStructuredOutput({
        config,
        model: "qwen3:4b",
        systemPrompt: "Return JSON.",
        userPrompt: "Return an object with ok=true.",
        responseSchema: { type: "object" },
      });
      expect(response).toBe('{"ok":true}');
      expect(chatRequest?.keep_alive).toBe("0");
      expect(chatRequest?.model).toBe("qwen3:4b");
    } finally {
      server.stop(true);
    }
  });
});
