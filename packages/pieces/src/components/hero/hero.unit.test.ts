import { describe, expect, it } from "vitest";

import { mergeHeroPresetProps } from "./hero.utils";

import type { HeroProps } from ".";

describe("mergeHeroPresetProps", () => {
  it("applies preset defaults", () => {
    const defaults: Partial<HeroProps> = {
      layout: "split",
      theme: "dark",
      height: "large",
    };

    const result = mergeHeroPresetProps(defaults, {
      title: "Welcome",
    });

    expect(result.layout).toBe("split");
    expect(result.theme).toBe("dark");
    expect(result.height).toBe("large");
    expect(result.title).toBe("Welcome");
  });

  it("allows consumers to override preset defaults", () => {
    const defaults: Partial<HeroProps> = {
      layout: "split",
      alignment: "start",
      theme: "light",
    };

    const result = mergeHeroPresetProps(defaults, {
      layout: "centered",
      alignment: "center",
      theme: "dark",
      title: "Custom hero",
    });

    expect(result.layout).toBe("centered");
    expect(result.alignment).toBe("center");
    expect(result.theme).toBe("dark");
  });

  it("preserves custom props", () => {
    const defaults: Partial<HeroProps> = {
      layout: "split",
    };

    const actions = "Actions";
    const media = "Media";

    const result = mergeHeroPresetProps(defaults, {
      title: "Test",
      actions,
      media,
    });

    expect(result.title).toBe("Test");
    expect(result.actions).toBe(actions);
    expect(result.media).toBe(media);
  });

  it("does not mutate preset defaults", () => {
    const defaults: Partial<HeroProps> = {
      layout: "split",
      theme: "light",
    };

    mergeHeroPresetProps(defaults, {
      theme: "dark",
    });

    expect(defaults.theme).toBe("light");
    expect(defaults.layout).toBe("split");
  });

  it("does not mutate consumer props", () => {
    const props: HeroProps = {
      title: "Original",
      layout: "centered",
    };

    mergeHeroPresetProps({ theme: "dark" }, props);

    expect(props.title).toBe("Original");
    expect(props.theme).toBeUndefined();
  });
});
