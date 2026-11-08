import { describe, expect, it } from "vitest";
import { getContainerPresetClass } from "./container.utils";

describe("getContainerPresetClass", () => {
  it.each([
    ["container", "puzzle-container--container"],
    ["content", "puzzle-container--content"],
    ["prose", "puzzle-container--prose"],
    ["full", "puzzle-container--full"],
  ] as const)("maps %s to its class", (preset, expected) => {
    expect(getContainerPresetClass(preset)).toBe(expected);
  });
});
