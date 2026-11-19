import { describe, expect, it } from "vitest";
import {
  canTransitionVisibility,
  createFoldStateSnapshot,
  transitionVisibility,
} from "./state-machine";

describe("visibility state machine", () => {
  it("allows only the declared physical visibility transitions", () => {
    expect(canTransitionVisibility("unknown", "outside")).toBe(true);
    expect(canTransitionVisibility("outside", "visible")).toBe(true);
    expect(canTransitionVisibility("nearby", "outside")).toBe(true);
    expect(canTransitionVisibility("visible", "nearby")).toBe(true);
    expect(canTransitionVisibility("visible", "unknown")).toBe(false);
    expect(transitionVisibility("visible", "unknown")).toBe("visible");
  });

  it("keeps activation distinct from physical visibility", () => {
    expect(createFoldStateSnapshot("outside", true)).toEqual({
      state: "activated",
      visibility: "outside",
      isVisible: false,
      isNearby: false,
      isActivated: true,
    });
  });
});
