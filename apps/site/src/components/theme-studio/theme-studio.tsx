import { useEffect, useReducer, useState } from "react";

import { assertSafeCssValue } from "@puzzle-ui/core";
import { Button, Card, ColorPicker, Select, TextInput } from "@puzzle-ui/ui";
import {
  THEME_TOKEN_REGISTRY,
  Theme,
  type ThemeColorSchemeTokens,
  type ThemeTokenRegistryEntry,
} from "@puzzle-ui/theme";
import { GoogleFontPicker } from "./google-font-picker";
import { ThemeStudioCodePanel } from "./code-panel";
import { WebsiteTemplatePreview } from "./templates/website-templates";
import { Header } from "@/components/layout/header";

import {
  COLOR_ROLES,
  FEATURED_COLOR_ROLES,
  INITIAL_THEME_STUDIO_STATE,
  PREVIEW_PAGES,
  SPACING_PRESETS,
  WEBSITE_TEMPLATES,
  createThemeImplementation,
  createPuzzleFontsJson,
  getBaseColorScheme,
  getColorThemeName,
  getColorThemePresets,
  getSelectedSpacingPreset,
  getThemeTokenGroups,
  getThemeTokenPath,
  getThemeTokenValue,
  hasThemeTokenOverrides,
  hasColorOverrides,
  isThemeCustomized,
  themeStudioReducer,
  type PreviewPage,
} from "./theme-studio-model";

import "./theme-studio.css";

const isPreviewPage = (value: string): value is PreviewPage =>
  (PREVIEW_PAGES as readonly string[]).includes(value);

const FEATURED_COLOR_ROLE_SET: ReadonlySet<string> = new Set(
  FEATURED_COLOR_ROLES,
);

const formatTokenName = (name: string): string =>
  name.replace(/([a-z])([A-Z])/g, "$1 $2");

const formatTokenGroup = (group: string): string =>
  group
    .split(".")
    .map(formatTokenName)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");

const ThemeTokenField = ({
  entry,
  value,
  onChange,
  onReset,
}: {
  entry: ThemeTokenRegistryEntry;
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}) => {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string>();
  const inputId = `theme-studio-token-${entry.cssVariable.replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  )}`;

  useEffect(() => setDraft(value), [value]);

  const handleChange = (nextValue: string) => {
    setDraft(nextValue);

    if (nextValue === "") {
      onChange("");
      setError(undefined);
      return;
    }

    try {
      assertSafeCssValue(nextValue, `Theme Studio ${entry.group}.${entry.name}`);
      onChange(nextValue);
      setError(undefined);
    } catch (validationError) {
      if (!(validationError instanceof TypeError)) throw validationError;
      setError(validationError.message);
    }
  };

  return (
    <div className="theme-studio__token-field">
      <div className="theme-studio__token-field-heading">
        <label className="theme-studio__token-label" htmlFor={inputId}>
          <strong>{formatTokenName(entry.name)}</strong>
          <code>{entry.cssVariable}</code>
        </label>
        <Button
          className="theme-studio__text-button"
          variant="link"
          size="sm"
          aria-label={`Reset ${formatTokenName(entry.name)} (${entry.cssVariable})`}
          disabled={value === entry.defaultValue}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <TextInput
        id={inputId}
        inputMode={entry.inputKind === "number" ? "decimal" : undefined}
        value={draft}
        aria-invalid={Boolean(error)}
        aria-label={`${formatTokenName(entry.name)} (${entry.cssVariable})`}
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
      {error && (
        <span className="theme-studio__token-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

const ThemeStudioColorField = ({
  role,
  mode,
  value,
  onChange,
}: {
  role: keyof ThemeColorSchemeTokens;
  mode: "light" | "dark";
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="theme-studio__color-field">
    <span>
      <code>{value}</code>
    </span>
    <ColorPicker
      rootClassName="theme-studio__color-picker"
      className="theme-studio__color-trigger"
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

const ThemeStudio = () => {
  const [state, dispatch] = useReducer(
    themeStudioReducer,
    INITIAL_THEME_STUDIO_STATE,
  );
  const customized = isThemeCustomized(state.tokens, state.fonts);
  const selectedSpacingPreset = getSelectedSpacingPreset(state.tokens);
  const selectedPresetName = state.colorTheme
    ? getColorThemeName(state.colorTheme)
    : null;
  const themeStatus = selectedPresetName
    ? customized
      ? `${selectedPresetName} - Customized`
      : `${selectedPresetName} - Built-in preset`
    : customized
      ? "Custom theme - No preset selected"
      : "Puzzle default";
  const implementation = createThemeImplementation(state);
  const fontsConfiguration = createPuzzleFontsJson(state);
  const colors = getBaseColorScheme(state.colorTheme, state.mode);
  const defaultColors = getBaseColorScheme(null, state.mode);

  return (
    <>
      <Header />
      <main className="theme-studio">
        <div className="theme-studio__container">
        <header className="theme-studio__header">
          <div>
            <p className="theme-studio__eyebrow">Puzzle design system</p>
            <h1>Theme Studio</h1>
            <p>
              Explore Puzzle color themes across five website styles, then
              fine-tune the colors and take the implementation with you.
            </p>
          </div>
          <span className="theme-studio__status" aria-live="polite">
            {themeStatus}
          </span>
        </header>

        <div className="theme-studio__workspace">
          <section
            className="theme-studio__preview-panel"
            aria-labelledby="theme-studio-preview-title"
          >
            <div className="theme-studio__panel-heading">
              <div>
                <h2 id="theme-studio-preview-title">Live website preview</h2>
                <Select
                  rootClassName="theme-studio__page-picker"
                  label="Preview page"
                  value={state.page}
                  options={PREVIEW_PAGES.map((page) => ({
                    value: page,
                    label: page.charAt(0).toUpperCase() + page.slice(1),
                  }))}
                  onChange={(page) => {
                    if (page && isPreviewPage(page)) {
                      dispatch({ type: "page", page });
                    }
                  }}
                />
              </div>
              <div className="theme-studio__mode-toggle" aria-label="Preview mode">
                {(["light", "dark"] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={state.mode === mode ? "toggle-active" : "toggle"}
                    size="sm"
                    aria-pressed={state.mode === mode}
                    onClick={() => dispatch({ type: "mode", mode })}
                  >
                    {mode === "light" ? "Light" : "Dark"}
                  </Button>
                ))}
              </div>
            </div>
            <div className="theme-studio__preview-frame">
              <Theme
                scope="local"
                globalStyles={false}
                theme={state.mode}
                colorTheme={state.colorTheme ?? undefined}
                fonts={state.fonts}
                fontSource="google"
                tokens={state.tokens}
              >
                <div
                  className="theme-studio__website"
                  data-template={state.template}
                  data-preview-page={state.page}
                >
                  <WebsiteTemplatePreview
                    template={state.template}
                    page={state.page}
                    onPageChange={(page) => dispatch({ type: "page", page })}
                  />
                </div>
              </Theme>
            </div>
          </section>

          <aside className="theme-studio__sidebar">
            <div className="theme-studio__sidebar-scrollarea">
              <section
                className="theme-studio__section"
                aria-labelledby="theme-studio-templates-title"
              >
                <div className="theme-studio__section-heading">
                  <div>
                    <h2 id="theme-studio-templates-title">Website templates</h2>
                    <p>
                      Choose a website style. Your color theme stays
                      independent.
                    </p>
                  </div>
                </div>
                <div className="theme-studio__template-list">
                  {WEBSITE_TEMPLATES.map((template) => (
                    <Card
                      key={template.id}
                      as="button"
                      type="button"
                      variant="outlined"
                      size="sm"
                      interactive
                      className="theme-studio__template-button"
                      aria-pressed={state.template === template.id}
                      onClick={() =>
                        dispatch({ type: "template", template: template.id })
                      }
                    >
                      <span
                        className="theme-studio__template-icon"
                        aria-hidden="true"
                      >
                        {template.label.charAt(0)}
                      </span>
                      <span>{template.label}</span>
                    </Card>
                  ))}
                </div>
              </section>

              <section
                className="theme-studio__section"
                aria-labelledby="theme-studio-presets-title"
              >
                <div className="theme-studio__section-heading">
                  <div>
                    <h2 id="theme-studio-presets-title">
                      Color theme presets
                    </h2>
                    <p>
                      Explore the built-in color themes included with Puzzle.
                      Select a theme to instantly apply it to your website
                      preview.
                    </p>
                  </div>
                  <Button
                    className="theme-studio__text-button"
                    variant="link"
                    size="sm"
                    disabled={!state.colorTheme && !customized}
                    onClick={() => dispatch({ type: "reset-default" })}
                  >
                    Reset to package default
                  </Button>
                </div>

                <div
                  className="theme-studio__preset-list"
                  role="group"
                  aria-label="Built-in color theme presets"
                >
                  <Card
                    as="button"
                    type="button"
                    variant="outlined"
                    size="sm"
                    interactive
                    className="theme-studio__preset-card"
                    aria-pressed={state.colorTheme === null && !customized}
                    onClick={() =>
                      dispatch({ type: "preset", colorTheme: null })
                    }
                  >
                    <span className="theme-studio__preset-name">
                      Puzzle default
                    </span>
                    <span className="theme-studio__preset-description">
                      Package colors
                    </span>
                    <span className="theme-studio__swatches" aria-hidden="true">
                      {[
                        defaultColors.primary,
                        defaultColors.secondary,
                        defaultColors.accent,
                      ].map((color, index) => (
                        <span
                          className="theme-studio__swatch"
                          key={`${index}-${color}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span
                      className="theme-studio__preset-surfaces"
                      aria-hidden="true"
                    >
                      <span
                        style={{ backgroundColor: defaultColors.background }}
                      />
                      <span style={{ backgroundColor: defaultColors.surface }} />
                    </span>
                    <span className="theme-studio__preset-caption">
                      Primary / secondary / accent
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
                      className="theme-studio__preset-card"
                      aria-pressed={state.colorTheme === preset.id}
                      onClick={() =>
                        dispatch({ type: "preset", colorTheme: preset.id })
                      }
                    >
                      <span className="theme-studio__preset-name">
                        {preset.name}
                      </span>
                      <span className="theme-studio__preset-description">
                        {customized && state.colorTheme === preset.id
                          ? "Customized"
                          : preset.id}
                      </span>
                      <span className="theme-studio__swatches" aria-hidden="true">
                        {[
                          preset.colors.primary,
                          preset.colors.secondary,
                          preset.colors.accent,
                        ].map((color, index) => (
                          <span
                            className="theme-studio__swatch"
                            key={`${index}-${color}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </span>
                      <span
                        className="theme-studio__preset-surfaces"
                        aria-hidden="true"
                      >
                        <span
                          style={{ backgroundColor: preset.colors.background }}
                        />
                        <span style={{ backgroundColor: preset.colors.surface }} />
                      </span>
                      <span className="theme-studio__preset-caption">
                        Primary / secondary / accent
                      </span>
                    </Card>
                  ))}
                </div>
              </section>

            <section
              className="theme-studio__panel"
              aria-labelledby="theme-studio-customize-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-customize-title">Customize colors</h2>
                  <p>{state.mode === "light" ? "Light" : "Dark"} scheme</p>
                </div>
                <Button
                  className="theme-studio__text-button"
                  variant="link"
                  size="sm"
                  disabled={!hasColorOverrides(state.tokens)}
                  onClick={() => dispatch({ type: "restore-preset" })}
                >
                  {state.colorTheme
                    ? "Restore preset colors"
                    : "Restore default colors"}
                </Button>
              </div>

              <div className="theme-studio__color-fields">
                {FEATURED_COLOR_ROLES.map((role) => (
                  <ThemeStudioColorField
                    key={role}
                    role={role}
                    mode={state.mode}
                    value={
                      state.tokens.colorSchemes?.[state.mode]?.[role] ??
                      colors[role]
                    }
                    onChange={(value) =>
                      dispatch({ type: "color", role, value })
                    }
                  />
                ))}
                <details className="theme-studio__advanced-colors">
                  <summary>All color roles</summary>
                  {COLOR_ROLES.filter(
                    (role) => !FEATURED_COLOR_ROLE_SET.has(role),
                  ).map((role) => (
                    <ThemeStudioColorField
                      key={role}
                      role={role}
                      mode={state.mode}
                      value={
                        state.tokens.colorSchemes?.[state.mode]?.[role] ??
                        colors[role]
                      }
                      onChange={(value) =>
                        dispatch({ type: "color", role, value })
                      }
                    />
                  ))}
                </details>
              </div>
            </section>

            <section
              className="theme-studio__panel"
              aria-labelledby="theme-studio-typography-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-typography-title">Typography</h2>
                  <p>
                    Choose independent Google Fonts for the preview. Unselected
                    roles keep Puzzle&apos;s built-in defaults.
                  </p>
                </div>
              </div>
              <div className="theme-studio__font-fields">
                <GoogleFontPicker
                  label="Body font"
                  description="Paragraphs, labels, and general interface text."
                  value={state.fonts.body?.family}
                  onChange={(family) =>
                    dispatch({ type: "font", role: "body", family })
                  }
                />
                <GoogleFontPicker
                  label="Heading font"
                  description="Headlines and prominent section titles."
                  value={state.fonts.heading?.family}
                  onChange={(family) =>
                    dispatch({ type: "font", role: "heading", family })
                  }
                />
                <GoogleFontPicker
                  label="Accent font"
                  description="Editorial highlights and accent copy."
                  value={state.fonts.accent?.family}
                  onChange={(family) =>
                    dispatch({ type: "font", role: "accent", family })
                  }
                />
              </div>
            </section>

            <section
              className="theme-studio__panel"
              aria-labelledby="theme-studio-spacing-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-spacing-title">Spacing options</h2>
                  <p>
                    Adjust spacing throughout the preview. Default restores the
                    Theme package spacing scale.
                  </p>
                </div>
                {selectedSpacingPreset === null && (
                  <span className="theme-studio__spacing-status">
                    Custom spacing
                  </span>
                )}
              </div>
              <div
                className="theme-studio__spacing-options"
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
                    className="theme-studio__spacing-card"
                    aria-pressed={selectedSpacingPreset === preset.id}
                    onClick={() =>
                      dispatch({
                        type: "spacing-preset",
                        spacingPreset: preset.id,
                      })
                    }
                  >
                    <span>{preset.label}</span>
                    <span>
                      {preset.id === "default"
                        ? "Package scale"
                        : `${Math.round(preset.scale * 100)}% scale`}
                    </span>
                  </Card>
                ))}
              </div>
            </section>

            <section
              className="theme-studio__panel"
              aria-labelledby="theme-studio-tokens-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-tokens-title">Design tokens</h2>
                  <p>
                    Edit supported non-color values. Unchanged tokens keep the
                    Theme package defaults.
                  </p>
                </div>
                <Button
                  className="theme-studio__text-button"
                  variant="link"
                  size="sm"
                  disabled={!hasThemeTokenOverrides(state.tokens)}
                  onClick={() => dispatch({ type: "reset-design-tokens" })}
                >
                  Reset token overrides
                </Button>
              </div>
              <div className="theme-studio__token-groups">
                {getThemeTokenGroups().map((group) => {
                  const entries = THEME_TOKEN_REGISTRY.filter(
                    (entry) => entry.group === group,
                  );
                  const groupPath = group.split(".");
                  const groupHasOverrides = hasThemeTokenOverrides(
                    state.tokens,
                    group,
                  );

                  return (
                    <details
                      className="theme-studio__token-group"
                      data-token-group={group}
                      key={group}
                    >
                      <summary>
                        <span>{formatTokenGroup(group)}</span>
                        <span>{entries.length} tokens</span>
                      </summary>
                      <div className="theme-studio__token-group-content">
                        <Button
                          className="theme-studio__text-button"
                          variant="link"
                          size="sm"
                          disabled={!groupHasOverrides}
                          onClick={() =>
                            dispatch({
                              type: "reset-token-group",
                              path: groupPath,
                            })
                          }
                        >
                          Reset group
                        </Button>
                        {entries.map((entry) => (
                          <ThemeTokenField
                            key={entry.cssVariable}
                            entry={entry}
                            value={getThemeTokenValue(state.tokens, entry)}
                            onChange={(value) => {
                              const path = getThemeTokenPath(entry);
                              dispatch(
                                value === "" || value === entry.defaultValue
                                  ? { type: "reset-token", path }
                                  : { type: "token", path, value },
                              );
                            }}
                            onReset={() =>
                              dispatch({
                                type: "reset-token",
                                path: getThemeTokenPath(entry),
                              })
                            }
                          />
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>

            <ThemeStudioCodePanel
              title="Theme implementation"
              description="Use this provider configuration in your application."
              code={implementation}
            />
            <ThemeStudioCodePanel
              title="puzzle-fonts.json"
              description="Download and self-host the Google Fonts used by your theme with the Puzzle Theme CLI."
              code={fontsConfiguration}
              emptyMessage="Select at least one Google Font to generate this configuration."
            />
            </div>
          </aside>
        </div>
        </div>
      </main>
    </>
  );
};

export { ThemeStudio };
