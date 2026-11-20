import { describe, expect, it } from "vitest";
import * as hooks from "./index";

describe("@puzzle-ui/hooks public exports", () => {
  it("exposes the rendering hooks without requiring browser globals or framework adapters", () => {
    expect(hooks.FoldProvider).toEqual(expect.any(Function));
    expect(hooks.useFoldOptimization).toEqual(expect.any(Function));
    expect(hooks.useFold).toEqual(expect.any(Function));
    expect(hooks.useVisibility).toEqual(expect.any(Function));
    expect(hooks.useIsVisible).toEqual(expect.any(Function));
    expect(hooks.useIsNearby).toEqual(expect.any(Function));
    expect(hooks.useFoldState).toEqual(expect.any(Function));
    expect(hooks.useResourcePrefetch).toEqual(expect.any(Function));
    expect(hooks.DEFAULT_PROXIMITY_ROOT_MARGINS.normal).toBe("400px 0px");
  });

  it("exposes the color scheme hook from the package root", () => {
    expect(hooks.useColorScheme).toEqual(expect.any(Function));
  });
});
