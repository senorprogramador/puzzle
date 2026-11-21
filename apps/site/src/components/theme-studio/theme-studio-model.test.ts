import { describe, expect, it } from "bun:test";

import {
  COLOR_THEMES,
  DEFAULT_COLOR_SCHEME,
  THEME_TOKEN_REGISTRY,
  type ColorThemes,
  type ThemeFonts,
} from "@puzzle-ui/theme";

import projectFonts from "../../puzzle-fonts.json";
import {
  COLOR_ROLES,
  FEATURED_COLOR_ROLES,
  INITIAL_THEME_STUDIO_STATE,
  SPACING_PRESETS,
  WEBSITE_TEMPLATES,
  createPuzzleFontsJson,
  createThemeImplementation,
  formatDimensionValue,
  formatDurationValue,
  getBaseColorScheme,
  getColorThemePresets,
  getSelectedFontConfiguration,
  getSelectedSpacingPreset,
  getThemeTokenGroups,
  getThemeTokenPath,
  getThemeTokenValue,
  hasThemeTokenOverrides,
  isThemeCustomized,
  parseDimensionValue,
  parseDurationValue,
  themeStudioReducer,
} from "./theme-studio-model";

const configuredProjectFonts = projectFonts as unknown as ThemeFonts;

const getFirstPresetId = (): ColorThemes => {
  const preset = getColorThemePresets()[0];

  if (!preset) throw new Error("The Theme package has no color presets.");

  return preset.id;
};

describe("Theme Studio model", () => {
  it("discovers all color presets and roles from the public Theme package", () => {
    expect(getColorThemePresets().map(({ id }) => id)).toEqual(
      Object.keys(COLOR_THEMES) as ColorThemes[],
    );
    expect(COLOR_ROLES).toEqual(
      Object.keys(DEFAULT_COLOR_SCHEME.light) as (keyof typeof DEFAULT_COLOR_SCHEME.light)[],
    );
    expect(FEATURED_COLOR_ROLES).toEqual([
      "primary",
      "secondary",
      "accent",
      "background",
      "surface",
    ]);
  });

  it("starts from the website template, package palette, and project fonts", () => {
    expect(INITIAL_THEME_STUDIO_STATE.template).toBe("marketing");
    expect(INITIAL_THEME_STUDIO_STATE.colorTheme).toBeNull();
    expect(INITIAL_THEME_STUDIO_STATE.tokens).toEqual({});
    expect(INITIAL_THEME_STUDIO_STATE.fonts).toEqual(configuredProjectFonts);
    expect(
      isThemeCustomized(
        INITIAL_THEME_STUDIO_STATE.tokens,
        INITIAL_THEME_STUDIO_STATE.fonts,
      ),
    ).toBe(false);
    expect(WEBSITE_TEMPLATES.map(({ id }) => id)).toEqual([
      "marketing",
      "bnb",
      "restaurant",
      "blog",
      "corporate",
    ]);
  });

  it("creates a safe, valid CLI font configuration without mutating defaults", () => {
    const before = JSON.stringify(INITIAL_THEME_STUDIO_STATE.fonts);
    const json = createPuzzleFontsJson(INITIAL_THEME_STUDIO_STATE);
    const parsed = JSON.parse(json) as typeof projectFonts;

    expect(json).toEndWith("\n");
    expect(parsed).toEqual(projectFonts);
    expect(parsed.heading.weightRange).toEqual([300, 700]);
    expect(parsed.heading.styles).toEqual(["normal", "italic"]);
    expect(parsed.heading.display).toBe("optional");
    expect(parsed.heading.fallback).toEqual(["system-ui", "sans-serif"]);
    expect(createPuzzleFontsJson({ fonts: {} })).toBe(json);
    expect(JSON.stringify(INITIAL_THEME_STUDIO_STATE.fonts)).toBe(before);
  });

  it("copies font configuration safely and updates only one role", () => {
    const changed = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "font",
      role: "body",
      family: "Inter",
    });

    expect(changed.fonts.body).toEqual({
      ...configuredProjectFonts.body,
      family: "Inter",
    });
    expect(changed.fonts.heading).toEqual(configuredProjectFonts.heading);
    expect(changed.fonts.accent).toEqual(configuredProjectFonts.accent);
    expect(getSelectedFontConfiguration(changed)).toEqual(changed.fonts);
    expect(isThemeCustomized(changed.tokens, changed.fonts)).toBe(true);

    const cleared = themeStudioReducer(changed, {
      type: "font",
      role: "body",
      family: undefined,
    });
    expect(cleared.fonts.body).toBeUndefined();
    expect(cleared.fonts.heading).toEqual(configuredProjectFonts.heading);
    expect(cleared.fonts.accent).toEqual(configuredProjectFonts.accent);
    expect(JSON.parse(createPuzzleFontsJson(cleared)).body).toBeUndefined();
  });

  it("preserves at least one configured font role in the reducer", () => {
    const singleFont = {
      ...INITIAL_THEME_STUDIO_STATE,
      fonts: { heading: { ...configuredProjectFonts.heading! } },
    };
    const result = themeStudioReducer(singleFont, {
      type: "font",
      role: "heading",
      family: undefined,
    });

    expect(result).toBe(singleFont);
    expect(JSON.parse(createPuzzleFontsJson(result))).toEqual(singleFont.fonts);
  });

  it("resets the theme to package colors and project fonts without changing the preview page", () => {
    const customized = {
      ...INITIAL_THEME_STUDIO_STATE,
      template: "restaurant" as const,
      page: "contact" as const,
      mode: "dark" as const,
      colorTheme: getFirstPresetId(),
      fonts: { body: { family: "Inter" as const } },
      tokens: { spacing: { 4: "1.25rem" } },
    };
    const reset = themeStudioReducer(customized, { type: "reset-default" });

    expect(reset.colorTheme).toBeNull();
    expect(reset.mode).toBe("light");
    expect(reset.fonts).toEqual(configuredProjectFonts);
    expect(reset.tokens).toEqual({});
    expect(reset.template).toBe("restaurant");
    expect(reset.page).toBe("contact");
  });

  it("preserves template, typography, and non-color overrides when selecting a preset", () => {
    const state = {
      ...INITIAL_THEME_STUDIO_STATE,
      template: "blog" as const,
      page: "about" as const,
      fonts: { ...INITIAL_THEME_STUDIO_STATE.fonts, body: { family: "Inter" as const } },
      tokens: {
        colorSchemes: { light: { primary: "#123456" }, dark: { accent: "#345678" } },
        spacing: { 4: "1.25rem" },
      },
    };
    const selected = themeStudioReducer(state, {
      type: "preset",
      colorTheme: getFirstPresetId(),
    });

    expect(selected.template).toBe("blog");
    expect(selected.page).toBe("about");
    expect(selected.fonts).toEqual(state.fonts);
    expect(selected.tokens).toEqual({ spacing: { 4: "1.25rem" } });
  });

  it("keeps light and dark color overrides isolated and restores only colors", () => {
    const light = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "color",
      scheme: "light",
      role: "primary",
      value: "#123456",
    });
    const darkMode = themeStudioReducer(light, {
      type: "mode",
      mode: "dark",
    });
    const dark = themeStudioReducer(darkMode, {
      type: "color",
      scheme: "dark",
      role: "primary",
      value: "#654321",
    });

    expect(dark.tokens.colorSchemes?.light?.primary).toBe("#123456");
    expect(dark.tokens.colorSchemes?.dark?.primary).toBe("#654321");
    expect(getBaseColorScheme(null, "light")).toEqual(DEFAULT_COLOR_SCHEME.light);

    const system = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "mode",
      mode: "system",
    });
    const systemDarkColor = themeStudioReducer(system, {
      type: "color",
      scheme: "dark",
      role: "primary",
      value: "#abcdef",
    });
    expect(systemDarkColor.mode).toBe("system");
    expect(systemDarkColor.tokens.colorSchemes?.dark?.primary).toBe("#abcdef");
    expect(createThemeImplementation(systemDarkColor)).toContain(
      'theme="system"',
    );

    const restored = themeStudioReducer(dark, { type: "restore-preset" });
    expect(restored.tokens.colorSchemes).toBeUndefined();
    expect(restored.tokens.colorSchemes).toBeUndefined();
  });

  it("discovers editable token groups and applies nested token overrides", () => {
    const spacing = THEME_TOKEN_REGISTRY.find(
      (entry) => entry.group === "spacing" && entry.name === "4",
    );
    if (!spacing) throw new Error("The Theme package has no spacing token 4.");

    expect(getThemeTokenGroups()).toEqual([
      ...new Set(THEME_TOKEN_REGISTRY.map((entry) => entry.group)),
    ]);

    const updated = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "token",
      path: getThemeTokenPath(spacing),
      value: "1.25rem",
    });
    expect(getThemeTokenValue(updated.tokens, spacing)).toBe("1.25rem");
    expect(createThemeImplementation(updated)).toContain('"4": "1.25rem"');
  });

  it("removes redundant default token overrides and rejects unsafe values", () => {
    const token = THEME_TOKEN_REGISTRY.find(
      (entry) => entry.group === "spacing" && entry.name === "4",
    );
    if (!token) throw new Error("The Theme package has no spacing token 4.");

    const customized = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "token",
      path: getThemeTokenPath(token),
      value: "2rem",
    });
    expect(hasThemeTokenOverrides(customized.tokens, "spacing")).toBe(true);

    const resetByValue = themeStudioReducer(customized, {
      type: "token",
      path: getThemeTokenPath(token),
      value: token.defaultValue,
    });
    expect(resetByValue.tokens.spacing).toBeUndefined();

    expect(() =>
      themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
        type: "token",
        path: getThemeTokenPath(token),
        value: "url({x})",
      }),
    ).toThrow(TypeError);
  });

  it("resets token groups and all design tokens without clearing colors", () => {
    const customized = {
      ...INITIAL_THEME_STUDIO_STATE,
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        spacing: { 4: "1.25rem" },
        radius: { md: "1rem" },
      },
    };
    const resetGroup = themeStudioReducer(customized, {
      type: "reset-token-group",
      path: ["spacing"],
    });
    expect(resetGroup.tokens.spacing).toBeUndefined();
    expect(resetGroup.tokens.radius?.md).toBe("1rem");
    expect(resetGroup.tokens.colorSchemes?.light?.primary).toBe("#123456");

    const resetAll = themeStudioReducer(customized, {
      type: "reset-design-tokens",
    });
    expect(resetAll.tokens).toEqual({
      colorSchemes: { light: { primary: "#123456" } },
    });
  });

  it("applies every spacing preset while preserving unrelated settings", () => {
    const spacingEntries = THEME_TOKEN_REGISTRY.filter(
      (entry) => entry.group === "spacing",
    );
    const initial = {
      ...INITIAL_THEME_STUDIO_STATE,
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        radius: { md: "1rem" },
      },
    };

    for (const preset of SPACING_PRESETS) {
      const applied = themeStudioReducer(initial, {
        type: "spacing-preset",
        spacingPreset: preset.id,
      });
      expect(getSelectedSpacingPreset(applied.tokens)).toBe(preset.id);
      expect(applied.tokens.colorSchemes?.light?.primary).toBe("#123456");
      expect(applied.tokens.radius?.md).toBe("1rem");
      if (preset.id === "default") {
        expect(applied.tokens.spacing).toBeUndefined();
      } else {
        const scale = SPACING_PRESETS.find(
          ({ id }) => id === preset.id,
        )?.scale;
        if (scale === undefined) throw new Error("Missing spacing scale.");
        for (const entry of spacingEntries) {
          const match = /^(-?(?:\d+|\d*\.\d+))([a-z%]*)$/i.exec(
            entry.defaultValue,
          );
          const expected = match
            ? `${Number((Number(match[1]) * scale).toFixed(6))}${match[2]}`
            : entry.defaultValue;
          expect(getThemeTokenValue(applied.tokens, entry)).toBe(expected);
        }
      }
    }
  });

  it("parses and formats dimensions and durations without unit conversion", () => {
    expect(parseDimensionValue("1rem")).toEqual({ value: 1, unit: "rem" });
    expect(parseDimensionValue("65ch")).toEqual({ value: 65, unit: "ch" });
    expect(parseDimensionValue("0")).toEqual({ value: 0, unit: "" });
    expect(parseDimensionValue("0.125rem")).toEqual({
      value: 0.125,
      unit: "rem",
    });
    expect(formatDimensionValue(0.125, "rem")).toBe("0.125rem");
    expect(parseDimensionValue("calc(100% - 1rem)")).toBeNull();
    expect(parseDimensionValue("5vh")).toEqual({ value: 5, unit: "vh" });
    expect(parseDurationValue("120ms")).toEqual({ value: 120, unit: "ms" });
    expect(parseDurationValue("0.32s")).toEqual({ value: 0.32, unit: "s" });
    expect(formatDurationValue(0.32, "s")).toBe("0.32s");
    expect(formatDurationValue(Number.NaN, "ms")).toBeNull();
  });

  it("generates valid TSX that reflects mode, preset, fonts, and tokens", () => {
    const state = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "preset",
      colorTheme: getFirstPresetId(),
    });
    const customized = themeStudioReducer(state, {
      type: "token",
      path: ["spacing", "4"],
      value: "1.25rem",
    });
    const code = createThemeImplementation({
      ...customized,
      mode: "dark",
    });

    expect(code).toContain('theme="dark"');
    expect(code).toContain(`colorTheme="${getFirstPresetId()}"`);
    expect(code).toContain('"family": "Geist"');
    expect(code).toContain('fontSource="local"');
    expect(code).toContain('"4": "1.25rem"');
    expect(() => new Bun.Transpiler({ loader: "tsx" }).transformSync(code)).not.toThrow();
    expect(JSON.parse(createPuzzleFontsJson(customized))).toEqual(
      customized.fonts,
    );
  });

  it("keeps the built-in color pairing behavior", () => {
    for (const { id } of getColorThemePresets()) {
      expect(getBaseColorScheme(id, "light")).toEqual(COLOR_THEMES[id].light);
      expect(getBaseColorScheme(id, "dark")).toEqual({
        ...COLOR_THEMES[id].light,
        ...COLOR_THEMES[id].dark,
      });
    }
  });
});
