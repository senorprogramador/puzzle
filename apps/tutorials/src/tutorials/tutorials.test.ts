import { describe, expect, it } from "bun:test";
import { getTutorial, tutorials } from "./index";
import { tutorialDurationSeconds } from "../types";

describe("tutorial definitions", () => {
  it("uses unique stable IDs and documentation routes", () => {
    const ids = tutorials.map((tutorial) => tutorial.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(tutorials.every((tutorial) => tutorial.documentationUrl.startsWith("/docs/"))).toBe(
      true,
    );
  });

  it("includes focused scripts, captions, and a standard landscape duration", () => {
    for (const tutorial of tutorials) {
      expect(tutorial.scenes.length).toBeGreaterThanOrEqual(5);
      expect(tutorialDurationSeconds(tutorial)).toBeGreaterThanOrEqual(90);
      expect(tutorial.scenes.every((scene) => scene.narration.trim().length > 0)).toBe(true);
      expect(tutorial.scenes.some((scene) => scene.preview !== undefined)).toBe(true);
    }
  });

  it("resolves only known tutorial IDs", () => {
    expect(getTutorial("file-upload")?.componentName).toBe("FileUpload");
    expect(getTutorial("theme-setup")?.packageName).toBe("@puzzle-ui/theme");
    expect(getTutorial("missing")).toBeUndefined();
  });
});
