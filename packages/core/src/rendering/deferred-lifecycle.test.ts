import { describe, expect, it } from "vitest";
import { transitionDeferredLifecycle } from "./deferred-lifecycle";
import type { DeferredLifecycleEvent } from "./types";

const transition = (
  state: Parameters<typeof transitionDeferredLifecycle>[0],
  type: DeferredLifecycleEvent["type"],
) => transitionDeferredLifecycle(state, { type });

describe("deferred rendering lifecycle", () => {
  it("separates scheduling, loading, resolution, and mounting", () => {
    expect(transition("idle", "schedule")).toBe("scheduled");
    expect(transition("scheduled", "start")).toBe("loading");
    expect(transition("loading", "resolve")).toBe("ready");
    expect(transition("ready", "mount")).toBe("mounted");
  });

  it("supports cancellation and retry after loading failures", () => {
    expect(transition("loading", "cancel")).toBe("cancelled");
    expect(transition("failed", "retry")).toBe("scheduled");
    expect(transition("cancelled", "retry")).toBe("scheduled");
  });

  it("ignores events that are invalid for the current state", () => {
    expect(transition("idle", "mount")).toBe("idle");
    expect(transition("cancelled", "resolve")).toBe("cancelled");
    expect(transition("mounted", "retry")).toBe("mounted");
  });
});
