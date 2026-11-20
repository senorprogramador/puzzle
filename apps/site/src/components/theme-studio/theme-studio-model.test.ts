import { describe, expect, it } from "bun:test";

import { COLOR_THEMES, type ColorThemes } from "@puzzle-ui/theme";

import {
  COLOR_ROLES,
  INITIAL_THEME_STUDIO_STATE,
  WEBSITE_TEMPLATES,
  createThemeImplementation,
  getBaseColorScheme,
  getColorThemePresets,
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

  it("restores the package default and supports every template/theme pairing", () => {
    const customized = themeStudioReducer(INITIAL_THEME_STUDIO_STATE, {
      type: "color",
      role: "primary",
      value: "#123456",
    });
    const reset = themeStudioReducer(customized, { type: "reset-default" });
    const pairs = WEBSITE_TEMPLATES.flatMap((template) =>
      getColorThemePresets().map((preset) => [template.id, preset.id]),
    );

    expect(reset.colorTheme).toBeNull();
    expect(reset.tokens).toEqual({});
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
