import { useState, useSyncExternalStore } from "react";

import {
  Button,
  Card,
  ColorPicker,
  Tabs,
  ToggleGroup,
} from "@puzzle-ui/ui";
import type { ThemeColorSchemeTokens } from "@puzzle-ui/theme";

import {
  COLOR_ROLES,
  FEATURED_COLOR_ROLES,
  SPACING_PRESETS,
  getBaseColorScheme,
  getColorThemePresets,
  getSelectedSpacingPreset,
  hasColorOverrides,
  hasThemeTokenOverrides,
  isThemeCustomized,
  type EditableColorRole,
  type ThemeStudioAction,
  type ThemeStudioState,
} from "./theme-studio-model";
import { GoogleFontPicker } from "./google-font-picker";
import { ThemeTokenEditor } from "./theme-token-editor";

const FEATURED_COLOR_ROLE_SET: ReadonlySet<string> = new Set(
  FEATURED_COLOR_ROLES,
);

type ColorSchemeMode = "light" | "dark";

const getSystemColorScheme = (): ColorSchemeMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const subscribeToSystemColorScheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const useSystemColorScheme = (): ColorSchemeMode =>
  useSyncExternalStore(subscribeToSystemColorScheme, getSystemColorScheme, () => "light");

type ThemeStudioSettingsProps = {
  state: ThemeStudioState;
  dispatch: (action: ThemeStudioAction) => void;
};

const ThemeStudioColorField = ({
  role,
  mode,
  value,
  onChange,
}: {
  role: EditableColorRole;
  mode: ColorSchemeMode;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="theme-studio-settings__color-field">
    <div>
      <strong>{role.charAt(0).toUpperCase() + role.slice(1)}</strong>
      <code>{value}</code>
    </div>
    <ColorPicker
      rootClassName="theme-studio-settings__color-picker"
      className="theme-studio-settings__color-trigger"
      label={`${role} ${mode} color`}
      value={value}
      format="hex"
      clearable={false}
      onChange={(nextColor) => {
        if (nextColor !== undefined) onChange(nextColor);
      }}
    />
  </div>
);

const ThemeStudioSettings = ({
  state,
  dispatch,
}: ThemeStudioSettingsProps) => {
  const [activeTab, setActiveTab] = useState("theme");
  const systemColorScheme = useSystemColorScheme();
  const colorScheme =
    state.mode === "system" ? systemColorScheme : state.mode;
  const colors = getBaseColorScheme(state.colorTheme, colorScheme);
  const defaultColors = getBaseColorScheme(null, colorScheme);
  const selectedSpacingPreset = getSelectedSpacingPreset(state.tokens);
  const customized = isThemeCustomized(state.tokens, state.fonts);
  const hasTokenOverrides = hasThemeTokenOverrides(state.tokens);

  const colorField = (role: keyof ThemeColorSchemeTokens) => (
    <ThemeStudioColorField
      key={role}
      role={role}
      mode={colorScheme}
      value={state.tokens.colorSchemes?.[colorScheme]?.[role] ?? colors[role]}
      onChange={(value) =>
        dispatch({ type: "color", scheme: colorScheme, role, value })
      }
    />
  );

  return (
    <aside className="theme-studio-settings" aria-label="Theme settings">
      <div className="theme-studio-settings__heading">
        <h2>Customize</h2>
        <Button
          variant="link"
          size="sm"
          disabled={
            state.colorTheme === null &&
            state.mode === "light" &&
            !customized &&
            !hasColorOverrides(state.tokens)
          }
          onClick={() => dispatch({ type: "reset-default" })}
        >
          Reset theme
        </Button>
      </div>
      <Tabs
        className="theme-studio-settings__tabs"
        activeId={activeTab}
        onActivate={setActiveTab}
        forceMountContent
        aria-label="Theme settings categories"
      >
        <Tabs.Tab id="theme" tab="Theme">
          <div className="theme-studio-settings__tab-content">
            <section
              className="theme-studio-settings__section"
              aria-labelledby="theme-studio-presets-title"
            >
              <div className="theme-studio-settings__section-heading">
                <h3 id="theme-studio-presets-title">Color themes</h3>
                <span>Presets</span>
              </div>
              <div
                className="theme-studio-settings__preset-list"
                role="group"
                aria-label="Built-in color theme presets"
              >
                <Card
                  as="button"
                  type="button"
                  variant="outlined"
                  size="sm"
                  interactive
                  className="theme-studio-settings__preset-card"
                  aria-pressed={state.colorTheme === null}
                  onClick={() => dispatch({ type: "preset", colorTheme: null })}
                >
                  <strong>Puzzle default</strong>
                  <span className="theme-studio-settings__swatches" aria-hidden="true">
                    {[defaultColors.primary, defaultColors.secondary, defaultColors.accent].map(
                      (color) => (
                        <span key={color} style={{ backgroundColor: color }} />
                      ),
                    )}
                  </span>
                </Card>
                {getColorThemePresets().map((preset) => (
                  <Card
                    key={preset.id}
                    as="button"
                    type="button"
                    variant="outlined"
                    size="sm"
                    interactive
                    className="theme-studio-settings__preset-card"
                    aria-pressed={state.colorTheme === preset.id}
                    onClick={() =>
                      dispatch({ type: "preset", colorTheme: preset.id })
                    }
                  >
                    <strong>{preset.name}</strong>
                    <span className="theme-studio-settings__swatches" aria-hidden="true">
                      {[
                        preset.colors.primary,
                        preset.colors.secondary,
                        preset.colors.accent,
                      ].map((color) => (
                        <span key={color} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </Card>
                ))}
              </div>
            </section>

            <section
              className="theme-studio-settings__section"
              aria-labelledby="theme-studio-colors-title"
            >
              <div className="theme-studio-settings__section-heading">
                <h3 id="theme-studio-colors-title">Color roles</h3>
                <Button
                  variant="link"
                  size="sm"
                  disabled={!hasColorOverrides(state.tokens)}
                  onClick={() => dispatch({ type: "restore-preset" })}
                >
                  Restore colors
                </Button>
              </div>
              <ToggleGroup
                className="theme-studio-settings__mode-toggle"
                type="single"
                size="sm"
                value={state.mode}
                required
                aria-label="Color mode"
                onValueChange={(mode) => {
                  if (mode === "light" || mode === "dark" || mode === "system") {
                    dispatch({ type: "mode", mode });
                  }
                }}
              >
                <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
                <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
                <ToggleGroup.Item value="system">System</ToggleGroup.Item>
              </ToggleGroup>
              <div className="theme-studio-settings__color-grid">
                {FEATURED_COLOR_ROLES.map(colorField)}
              </div>
              <details className="theme-studio-settings__all-colors">
                <summary>All color roles</summary>
                <div className="theme-studio-settings__color-grid">
                  {COLOR_ROLES.filter(
                    (role) => !FEATURED_COLOR_ROLE_SET.has(role),
                  ).map(colorField)}
                </div>
              </details>
            </section>
          </div>
        </Tabs.Tab>
        <Tabs.Tab id="typography" tab="Typography">
          <div className="theme-studio-settings__tab-content theme-studio-settings__font-fields">
            <GoogleFontPicker
              label="Body font"
              description="Paragraphs and interface text"
              value={state.fonts.body?.family}
              clearable={Boolean(state.fonts.body) && Object.keys(state.fonts).length > 1}
              onChange={(family) =>
                dispatch({ type: "font", role: "body", family })
              }
            />
            <GoogleFontPicker
              label="Heading font"
              description="Headlines and section titles"
              value={state.fonts.heading?.family}
              clearable={
                Boolean(state.fonts.heading) &&
                Object.keys(state.fonts).length > 1
              }
              onChange={(family) =>
                dispatch({ type: "font", role: "heading", family })
              }
            />
            <GoogleFontPicker
              label="Accent font"
              description="Editorial highlights"
              value={state.fonts.accent?.family}
              clearable={
                Boolean(state.fonts.accent) &&
                Object.keys(state.fonts).length > 1
              }
              onChange={(family) =>
                dispatch({ type: "font", role: "accent", family })
              }
            />
          </div>
        </Tabs.Tab>
        <Tabs.Tab id="layout" tab="Layout">
          <section className="theme-studio-settings__tab-content theme-studio-settings__section">
            <div className="theme-studio-settings__section-heading">
              <h3>Spacing scale</h3>
              {selectedSpacingPreset === null ? (
                <span>Custom spacing</span>
              ) : null}
            </div>
            <div
              className="theme-studio-settings__spacing-options"
              role="group"
              aria-label="Spacing presets"
            >
              {SPACING_PRESETS.map((preset) => (
                <Card
                  key={preset.id}
                  as="button"
                  type="button"
                  variant="outlined"
                  size="sm"
                  interactive
                  className="theme-studio-settings__spacing-card"
                  aria-pressed={selectedSpacingPreset === preset.id}
                  onClick={() =>
                    dispatch({
                      type: "spacing-preset",
                      spacingPreset: preset.id,
                    })
                  }
                >
                  {preset.label}
                </Card>
              ))}
            </div>
            <p className="theme-studio-settings__hint">
              Presets scale the spacing tokens from the Theme package.
            </p>
          </section>
        </Tabs.Tab>
        <Tabs.Tab id="variables" tab="CSS variables">
          <section className="theme-studio-settings__tab-content theme-studio-settings__section">
            <div className="theme-studio-settings__section-heading">
              <h3>Design tokens</h3>
              {hasTokenOverrides ? <span>Custom values</span> : null}
            </div>
            <ThemeTokenEditor
              tokens={state.tokens}
              onChange={(path, value) =>
                dispatch({ type: "token", path, value })
              }
              onReset={(path) => dispatch({ type: "reset-token", path })}
              onResetGroup={(path) =>
                dispatch({ type: "reset-token-group", path })
              }
              onResetAll={() => dispatch({ type: "reset-design-tokens" })}
            />
          </section>
        </Tabs.Tab>
      </Tabs>
    </aside>
  );
};

export { ThemeStudioSettings, type ThemeStudioSettingsProps };
