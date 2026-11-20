import { describe, expect, it } from "bun:test";

import {
  COLOR_THEMES,
  DEFAULT_COLOR_SCHEME,
  THEME_TOKEN_REGISTRY,
  type ColorThemes,
} from "@puzzle-ui/theme";

import {
  COLOR_ROLES,
  FEATURED_COLOR_ROLES,
  INITIAL_THEME_STUDIO_STATE,
  SPACING_PRESETS,
  WEBSITE_TEMPLATES,
  createPuzzleFontsJson,
  createThemeImplementation,
  getBaseColorScheme,
  getColorThemePresets,
  getSelectedSpacingPreset,
  getThemeTokenGroups,
  getThemeTokenPath,
  getThemeTokenValue,
  hasThemeTokenOverrides,
  getSelectedFontConfiguration,
  isThemeCustomized,
  themeStudioReducer,
} from "./theme-studio-model";

const getFirstPresetId = (): ColorThemes => {
  const preset = getColorThemePresets()[0];

  if (!preset) throw new Error("The Theme package has no color presets.");

  return preset.id;
};

describe("Theme Studio model", () => {
  it("discovers every built-in theme once from the Theme package registry", () => {
    const presets = getColorThemePresets();
    const identifiers = Object.keys(COLOR_THEMES) as ColorThemes[];

    expect(presets.map(({ id }) => id)).toEqual(identifiers);
    expect(new Set(presets.map(({ id }) => id)).size).toBe(identifiers.length);
  });

  it("uses the registered light and dark colors for each preset", () => {
    for (const { id, colors } of getColorThemePresets()) {
      expect(colors).toEqual(COLOR_THEMES[id].light);
      expect(getBaseColorScheme(id, "light")).toEqual(COLOR_THEMES[id].light);
      expect(getBaseColorScheme(id, "dark")).toEqual({
        ...COLOR_THEMES[id].light,
        ...COLOR_THEMES[id].dark,
      });
    }
  });

  it("starts with the Marketing template and the package default palette", () => {
    expect(INITIAL_THEME_STUDIO_STATE.template).toBe("marketing");
    expect(INITIAL_THEME_STUDIO_STATE.colorTheme).toBeNull();
    expect(INITIAL_THEME_STUDIO_STATE.tokens).toEqual({});
    expect(WEBSITE_TEMPLATES.map(({ id }) => id)).toEqual([
      "marketing",
      "bnb",
      "restaurant",
      "blog",
      "corporate",
    ]);
  });

  it("exposes all package color roles while highlighting the primary five", () => {
    expect(COLOR_ROLES.map(String)).toEqual(
      Object.keys(DEFAULT_COLOR_SCHEME.light),
    );
    expect(FEATURED_COLOR_ROLES).toEqual([
      "primary",
      "secondary",
      "accent",
      "background",
      "surface",
    ]);
  });

  it("keeps the selected template and page when applying another preset", () => {
    const state = {
      ...INITIAL_THEME_STUDIO_STATE,
      template: "restaurant" as const,
      page: "about" as const,
    };

    const updated = themeStudioReducer(state, {
      type: "preset",
      colorTheme: getFirstPresetId(),
    });
    expect(updated.template).toBe("restaurant");
    expect(updated.page).toBe("about");
    expect(updated.colorTheme).toBe(getFirstPresetId());
  });

  it("keeps font roles independent and preserves them across studio settings", () => {
    const bodyFont = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "font",
      role: "body",
      family: "Inter",
    });
    const headingFont = themeStudioReducer(bodyFont, {
      type: "font",
      role: "heading",
      family: "Roboto",
    });
    const afterSettingsChanges = [
      { type: "template" as const, template: "restaurant" as const },
      { type: "page" as const, page: "about" as const },
      { type: "mode" as const, mode: "dark" as const },
      { type: "color" as const, role: "primary" as const, value: "#123456" },
    ].reduce(themeStudioReducer, headingFont);

    expect(afterSettingsChanges.fonts.body?.family).toBe("Inter");
    expect(afterSettingsChanges.fonts.heading?.family).toBe("Roboto");
    expect(afterSettingsChanges.fonts.accent).toBeUndefined();
    expect(
      isThemeCustomized(afterSettingsChanges.tokens, afterSettingsChanges.fonts),
    ).toBe(true);

    const withoutBody = themeStudioReducer(afterSettingsChanges, {
      type: "font",
      role: "body",
      family: undefined,
    });
    expect(withoutBody.fonts.body).toBeUndefined();
    expect(withoutBody.fonts.heading?.family).toBe("Roboto");
  });

  it("applies and removes only custom token overrides", () => {
    const colorTheme = getFirstPresetId();
    const initial = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "preset",
      colorTheme,
    });
    const customized = themeStudioReducer(initial, {
      type: "color",
      role: "primary",
      value: "#123456",
    });

    expect(isThemeCustomized(customized.tokens)).toBe(true);
    expect(customized.tokens.colorSchemes?.light?.primary).toBe("#123456");

    const restored = themeStudioReducer(customized, {
      type: "color",
      role: "primary",
      value: COLOR_THEMES[colorTheme].light.primary,
    });

    expect(isThemeCustomized(restored.tokens)).toBe(false);
    expect(restored.tokens).toEqual({});
  });

  it("discovers every editable token group from the public Theme registry", () => {
    const groups = getThemeTokenGroups();

    expect(new Set(groups).size).toBe(groups.length);
    expect(groups).toEqual([
      ...new Set(THEME_TOKEN_REGISTRY.map((entry) => entry.group)),
    ]);
  });

  it("applies nested design-token edits and generates matching overrides", () => {
    const spacing = THEME_TOKEN_REGISTRY.find(
      (entry) => entry.group === "spacing" && entry.name === "4",
    );
    if (!spacing) throw new Error("The Theme package has no spacing token 4.");

    const tokens = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "token",
      path: getThemeTokenPath(spacing),
      value: "1.25rem",
    });

    expect(getThemeTokenValue(tokens.tokens, spacing)).toBe("1.25rem");
    expect(hasThemeTokenOverrides(tokens.tokens, "spacing")).toBe(true);
    expect(createThemeImplementation(tokens)).toContain('"4": "1.25rem"');
  });

  it("resets a token group without clearing colors or other token groups", () => {
    const withOverrides = {
      ...INITIAL_THEME_STUDIO_STATE,
      colorTheme: getFirstPresetId(),
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        spacing: { 4: "1.25rem" },
        radius: { md: "1rem" },
      },
    };

    const reset = themeStudioReducer(withOverrides, {
      type: "reset-token-group",
      path: ["spacing"],
    });

    expect(reset.tokens.spacing).toBeUndefined();
    expect(reset.tokens.radius?.md).toBe("1rem");
    expect(reset.tokens.colorSchemes?.light?.primary).toBe("#123456");
    expect(hasThemeTokenOverrides(reset.tokens, "spacing")).toBe(false);
  });

  it("resets all design tokens while preserving custom colors", () => {
    const withOverrides = {
      ...INITIAL_THEME_STUDIO_STATE,
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        spacing: { 4: "1.25rem" },
      },
    };

    const reset = themeStudioReducer(withOverrides, {
      type: "reset-design-tokens",
    });

    expect(reset.tokens).toEqual({
      colorSchemes: { light: { primary: "#123456" } },
    });
  });

  it("applies spacing presets from Theme defaults and preserves other tokens", () => {
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
        continue;
      }

      for (const entry of spacingEntries) {
        const match = /^(-?(?:\d+|\d*\.\d+))([a-z%]*)$/i.exec(
          entry.defaultValue,
        );
        const expected = match
          ? `${Number((Number(match[1]) * preset.scale).toFixed(6))}${match[2]}`
          : entry.defaultValue;

        expect(getThemeTokenValue(applied.tokens, entry)).toBe(expected);
        expect(createThemeImplementation(applied)).toContain(
          `"${entry.name}": "${expected}"`,
        );
      }
    }
  });

  it("marks manually edited spacing as custom until it matches a preset", () => {
    const compact = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "spacing-preset",
      spacingPreset: "compact",
    });
    const customized = themeStudioReducer(compact, {
      type: "token",
      path: ["spacing", "4"],
      value: "1.1rem",
    });

    expect(getSelectedSpacingPreset(customized.tokens)).toBeNull();
    expect(isThemeCustomized(customized.tokens)).toBe(true);

    const restored = themeStudioReducer(customized, {
      type: "spacing-preset",
      spacingPreset: "default",
    });
    expect(getSelectedSpacingPreset(restored.tokens)).toBe("default");
    expect(restored.tokens.spacing).toBeUndefined();
  });

  it("generates a preset reference and only the active custom overrides", () => {
    const colorTheme = getFirstPresetId();
    const customized = themeStudioReducer(
      {
        ...INITIAL_THEME_STUDIO_STATE,
        colorTheme,
      },
      {
        type: "color",
        role: "accent",
        value: "#123456",
      },
    );
    const code = createThemeImplementation(customized);

    expect(code).toContain(`colorTheme="${colorTheme}"`);
    expect(code).toContain('"accent": "#123456"');
    expect(code).not.toContain('"primary":');
    expect(() =>
      new Bun.Transpiler({ loader: "tsx" }).transformSync(code),
    ).not.toThrow();
  });

  it("generates matching Theme and CLI font configuration", () => {
    const selected = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "font",
      role: "body",
      family: "Inter",
    });
    const fonts = getSelectedFontConfiguration(selected);
    const json = createPuzzleFontsJson(selected);
    const code = createThemeImplementation(selected);

    expect(fonts).toEqual({ body: { family: "Inter" } });
    expect(JSON.parse(json ?? "null")).toEqual(fonts);
    expect(code).toContain('"body": {\n          "family": "Inter"');
    expect(code).toContain('fontSource="local"');
    expect(code).not.toContain('"heading":');
    expect(new Bun.Transpiler({ loader: "tsx" }).transformSync(code)).toBeTruthy();
  });

  it("restores a customized built-in theme without changing the website view", () => {
    const customized = {
      ...INITIAL_THEME_STUDIO_STATE,
      template: "blog" as const,
      page: "contact" as const,
      colorTheme: getFirstPresetId(),
      tokens: {
        colorSchemes: {
          light: {
            primary: "#123456",
          },
        },
      },
    };
    const restored = themeStudioReducer(customized, {
      type: "restore-preset",
    });

    expect(restored.colorTheme).toBe(customized.colorTheme);
    expect(restored.template).toBe("blog");
    expect(restored.page).toBe("contact");
    expect(restored.tokens).toEqual({});
  });

  it("restores preset colors without discarding fonts or design tokens", () => {
    const customized = {
      ...INITIAL_THEME_STUDIO_STATE,
      colorTheme: getFirstPresetId(),
      fonts: { body: { family: "Inter" as const } },
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        spacing: { 4: "1.25rem" },
      },
    };

    const restored = themeStudioReducer(customized, {
      type: "restore-preset",
    });

    expect(restored.tokens.colorSchemes).toBeUndefined();
    expect(restored.tokens.spacing?.[4]).toBe("1.25rem");
    expect(restored.fonts.body?.family).toBe("Inter");
  });

  it("restores the package default and supports every template/theme pairing", () => {
    const customized = {
      ...INITIAL_THEME_STUDIO_STATE,
      colorTheme: getFirstPresetId(),
      fonts: { body: { family: "Inter" as const } },
      tokens: {
        colorSchemes: { light: { primary: "#123456" } },
        spacing: { 4: "1.25rem" },
      },
    };
    const reset = themeStudioReducer(customized, { type: "reset-default" });
    const pairs = WEBSITE_TEMPLATES.flatMap((template) =>
      getColorThemePresets().map((preset) => [template.id, preset.id]),
    );

    expect(reset.colorTheme).toBeNull();
    expect(reset.tokens).toEqual({});
    expect(reset.fonts).toEqual({});
    expect(pairs).toHaveLength(WEBSITE_TEMPLATES.length * Object.keys(COLOR_THEMES).length);
    expect(COLOR_ROLES).toContain("background");
  });

  it("omits preset and override props for the package default", () => {
    const code = createThemeImplementation(INITIAL_THEME_STUDIO_STATE);

    expect(code).toContain('theme="light"');
    expect(code).not.toContain("colorTheme=");
    expect(code).not.toContain("tokens=");
  });
});
