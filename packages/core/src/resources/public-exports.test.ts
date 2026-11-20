import { describe, expect, it } from "vitest";
import * as resources from "./index";

describe("@puzzle-ui/core/resources public exports", () => {
  it("exposes the scheduler and shared resource priority utilities", () => {
    expect(resources.createResourceScheduler).toEqual(expect.any(Function));
    expect(resources.ResourceScheduler).toEqual(expect.any(Function));
    expect(resources.RESOURCE_PRIORITY_ORDER).toEqual([
      "critical",
      "high",
      "normal",
      "low",
    ]);
  });
});
