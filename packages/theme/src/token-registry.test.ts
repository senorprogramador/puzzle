import { describe, expect, it } from "vitest";
import { stringWithCasing } from "@puzzle-ui/core";
import { DEFAULT_TOKENS } from "./constants";
import { createThemeVariables } from "./create-theme-variables";
import { DEFAULT_TYPOGRAPHY_ROLES } from "./fonts/typography";
import {
  THEME_TOKEN_REGISTRY,
  type ThemeTokenGroup,
  type ThemeTokenRegistryEntry,
} from "./token-registry";

const flattenDefaults = (
  value: unknown,
  group = "",
): Array<{ group: string; name: string; defaultValue: string }> => {
  if (typeof value !== "object" || value === null) return [];

  return Object.entries(value).flatMap(([name, child]) => {
    const childGroup = group ? `${group}.${name}` : name;

    if (typeof child === "object" && child !== null) {
      return flattenDefaults(child, childGroup);
    }

    return [{ group, name, defaultValue: child as string }];
  });
};

const expectedCssVariable = (
  group: ThemeTokenGroup,
  name: string,
): string => {
  const kebabName = stringWithCasing(name, "kebabcase");

  if (group.startsWith("typography.roles.")) {
    const role = group.slice("typography.roles.".length);
    const prefixes: Record<string, string> = {
      fontSize: "font-size",
      fontWeight: "font-weight",
      lineHeight: "font-line-height",
      letterSpacing: "font-letter-spacing",
    };

    return `--puzzle-${prefixes[name]}-${role}`;
  }

  if (group.startsWith("typography.")) {
    const subgroup = group.slice("typography.".length);
    const prefixes: Record<string, string> = {
      fontSize: "font-size",
      fontWeight: "font-weight",
      lineHeight: "font-line-height",
      letterSpacing: "font-letter-spacing",
      fontGap: "font-gap",
    };

    return `--puzzle-${prefixes[subgroup]}-${kebabName}`;
  }

  const directVariables: Record<string, string> = {
    "borders.width": "--puzzle-border-width",
    "borders.widthStrong": "--puzzle-border-width-strong",
    "borders.style": "--puzzle-border-style",
    "layout.container": "--puzzle-container-width",
    "layout.content": "--puzzle-content-width",
    "layout.prose": "--puzzle-prose-width",
    "motion.fast": "--puzzle-duration-fast",
    "motion.normal": "--puzzle-duration-normal",
    "motion.slow": "--puzzle-duration-slow",
    "motion.easingStandard": "--puzzle-easing-standard",
    "motion.easingIn": "--puzzle-easing-in",
    "motion.easingOut": "--puzzle-easing-out",
  };
  const directVariable = directVariables[`${group}.${name}`];

  if (directVariable) return directVariable;

  const prefixes: Record<string, string> = {
    spacing: "space",
    radius: "radius",
    shadows: "shadow",
    elevation: "elevation",
    breakpoints: "breakpoint",
    overlays: "overlay",
    zIndex: "z-index",
  };

  return `--puzzle-${prefixes[group]}-${kebabName}`;
};

describe("THEME_TOKEN_REGISTRY", () => {
  it("represents each non-color default token once with its generated CSS variable", () => {
    const defaultTokens = flattenDefaults(
      Object.fromEntries(
        Object.entries(DEFAULT_TOKENS).filter(([group]) => group !== "colorSchemes"),
      ),
    ).filter(({ group, name }) => !(group === "overlays" && name === "backdrop"));
    const roleTokens = Object.entries(DEFAULT_TYPOGRAPHY_ROLES).flatMap(
      ([role, values]) =>
        (
          [
            "fontSize",
            "fontWeight",
            "lineHeight",
            "letterSpacing",
          ] as const
        ).map((name) => ({
          group: `typography.roles.${role}`,
          name,
          defaultValue: values[name],
        })),
    );
    const expectedTokens = [...defaultTokens, ...roleTokens];

    const identities = THEME_TOKEN_REGISTRY.map(
      ({ group, name }) => `${group}.${name}`,
    );
    const cssVariables = THEME_TOKEN_REGISTRY.map(
      ({ cssVariable }) => cssVariable,
    );

    expect(new Set(identities).size).toBe(identities.length);
    expect(new Set(cssVariables).size).toBe(cssVariables.length);
    expect(identities).toHaveLength(expectedTokens.length);

    const generatedVariables = createThemeVariables();
    const generatedTokenVariables = Object.keys(generatedVariables).filter(
      (name) =>
        !name.startsWith("--puzzle-color-") &&
        !name.startsWith("--puzzle-font-family-") &&
        ![
          "--puzzle-font-body",
          "--puzzle-font-heading",
          "--puzzle-font-accent",
          "--puzzle-overlay-backdrop",
        ].includes(name),
    );

    for (const token of expectedTokens) {
      const entry = THEME_TOKEN_REGISTRY.find(
        (candidate) =>
          candidate.group === token.group &&
          candidate.name === token.name,
      );

      expect(entry).toBeDefined();
      expect(entry?.defaultValue).toBe(token.defaultValue);
      expect(entry?.cssVariable).toBe(
        expectedCssVariable(
          token.group as ThemeTokenGroup,
          token.name,
        ),
      );
      expect(generatedVariables[entry!.cssVariable]).toBe(token.defaultValue);
    }

    expect([...cssVariables].sort()).toEqual(generatedTokenVariables.sort());
  });

  it("marks only values with a safely inferred input kind", () => {
    const findEntry = (
      group: ThemeTokenGroup,
      name: string,
    ): ThemeTokenRegistryEntry | undefined =>
      THEME_TOKEN_REGISTRY.find(
        (entry) => entry.group === group && entry.name === name,
      );

    expect(findEntry("spacing", "4")?.inputKind).toBe("dimension");
    expect(
      findEntry("typography.roles.display1", "fontSize")?.inputKind,
    ).toBe("dimension");
    expect(
      findEntry("typography.roles.display1", "fontWeight")?.inputKind,
    ).toBe("number");
    expect(findEntry("typography.fontWeight", "normal")?.inputKind).toBe(
      "number",
    );
    expect(findEntry("motion", "fast")?.inputKind).toBe("duration");
    expect(findEntry("shadows", "md")?.inputKind).toBeUndefined();
    expect(findEntry("motion", "easingIn")?.inputKind).toBeUndefined();
    expect(findEntry("overlays", "backdrop")).toBeUndefined();
  });
});
