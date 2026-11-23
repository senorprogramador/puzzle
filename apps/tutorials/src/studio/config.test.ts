import { describe, expect, it } from "bun:test";
import {
  defaultTutorialStudioConfig,
  parseTutorialStudioConfig,
} from "./config";

describe("Tutorial Studio configuration", () => {
  it("uses the verified local Qwen defaults and supports a smaller model", () => {
    expect(defaultTutorialStudioConfig.defaultModel).toBe("qwen3:14b");
    const config = parseTutorialStudioConfig({
      lightweightModel: "qwen3:4b",
      scriptModel: "qwen3:8b",
    });
    expect(config.scriptModel).toBe("qwen3:8b");
    expect(config.lightweightModel).toBe("qwen3:4b");
    expect(config.ollamaUrl).toBe("http://127.0.0.1:11434");
    expect(config.modelKeepAlive).toBe("0");
    expect(
      parseTutorialStudioConfig({ modelKeepAlive: "5m" }).modelKeepAlive,
    ).toBe("5m");
  });

  it("rejects remote Ollama endpoints and invalid resource limits", () => {
    expect(() =>
      parseTutorialStudioConfig({ ollamaUrl: "https://example.com" }),
    ).toThrow("loopback URL");
    expect(() =>
      parseTutorialStudioConfig({ maxModelMemoryGb: -1 }),
    ).toThrow("maxModelMemoryGb");
    expect(() =>
      parseTutorialStudioConfig({ modelKeepAlive: "not-a-duration" }),
    ).toThrow("modelKeepAlive");
  });

  it("rejects unknown configuration keys", () => {
    expect(() => parseTutorialStudioConfig({ arbitraryCommand: "run" })).toThrow(
      "Unsupported config option",
    );
  });
});
