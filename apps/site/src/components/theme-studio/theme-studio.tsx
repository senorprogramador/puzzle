import { useReducer } from "react";

import { Card, Select } from "@puzzle-ui/ui";
import { Theme } from "@puzzle-ui/theme";

import { Header } from "@/components/layout/header";
import { sectionPreviewImages } from "@/components/doc-examples/shared/section-preview-media";

import {
  INITIAL_THEME_STUDIO_STATE,
  PREVIEW_PAGES,
  WEBSITE_TEMPLATES,
  getColorThemeName,
  getColorThemePresets,
  isThemeCustomized,
  themeStudioReducer,
  type PreviewPage,
} from "./theme-studio-model";
import { ThemeStudioOutputDock } from "./theme-studio-output-dock";
import { ThemeStudioSettings } from "./theme-studio-settings";
import { WebsiteTemplatePreview } from "./templates/website-templates";

import "./theme-studio.css";

const templateThumbnails = {
  marketing: sectionPreviewImages.team,
  bnb: sectionPreviewImages.landscape,
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
  blog: sectionPreviewImages.dashboard,
  corporate: sectionPreviewImages.workspace,
} as const;

const isPreviewPage = (value: string): value is PreviewPage =>
  (PREVIEW_PAGES as readonly string[]).includes(value);

const ThemeStudio = () => {
  const [state, dispatch] = useReducer(
    themeStudioReducer,
    INITIAL_THEME_STUDIO_STATE,
  );
  const selectedPresetName = state.colorTheme
    ? getColorThemeName(state.colorTheme)
    : null;
  const customized = isThemeCustomized(state.tokens, state.fonts);
  const themeStatus = selectedPresetName
    ? customized
      ? `${selectedPresetName} · Customized`
      : `${selectedPresetName} · Built-in`
    : customized
      ? "Custom theme"
      : "Puzzle default";

  return (
    <>
      <Header />
      <main className="theme-studio">
        <div className="theme-studio__content">
          <header className="theme-studio__page-heading">
            <div>
              <p className="theme-studio__eyebrow">Puzzle design system</p>
              <h1>Theme Studio</h1>
              <p>Shape a theme, preview your site, and copy your setup.</p>
            </div>
            <span className="theme-studio__status" aria-live="polite">
              <span aria-hidden="true" />
              {themeStatus}
            </span>
          </header>

          <ThemeStudioOutputDock state={state} />

          <section
            className="theme-studio-templates"
            aria-labelledby="theme-studio-templates-title"
          >
            <h2 id="theme-studio-templates-title" className="visually-hidden">
              Website templates
            </h2>
            <div className="theme-studio-templates__list" role="group" aria-label="Website templates">
              {WEBSITE_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  as="button"
                  type="button"
                  variant="outlined"
                  size="sm"
                  interactive
                  className="theme-studio-templates__option"
                  aria-pressed={state.template === template.id}
                  onClick={() =>
                    dispatch({ type: "template", template: template.id })
                  }
                >
                  <img
                    className="theme-studio-templates__thumbnail"
                    src={templateThumbnails[template.id]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{template.label}</span>
                </Card>
              ))}
            </div>
          </section>

          <div className="theme-studio__workspace">
            <section
              className="theme-studio__preview"
              aria-labelledby="theme-studio-preview-title"
            >
              <div className="theme-studio__preview-heading">
                <h2 id="theme-studio-preview-title">Live preview</h2>
                <Select
                  rootClassName="theme-studio__page-picker"
                  label="Preview page"
                  size="sm"
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
              <div className="theme-studio__preview-content">
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

            <ThemeStudioSettings
              state={state}
              dispatch={(action) => dispatch(action)}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export { ThemeStudio };
