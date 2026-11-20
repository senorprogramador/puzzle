import { useReducer } from "react";

import { Theme } from "@puzzle-ui/theme";

import {
  COLOR_ROLES,
  INITIAL_THEME_STUDIO_STATE,
  PREVIEW_PAGES,
  WEBSITE_TEMPLATES,
  createThemeImplementation,
  getBaseColorScheme,
  getColorThemeName,
  getColorThemePresets,
  isThemeCustomized,
  themeStudioReducer,
  type PreviewPage,
  type WebsiteTemplate,
} from "./theme-studio-model";

import "./theme-studio.css";

const TEMPLATE_CONTENT: Record<
  WebsiteTemplate,
  {
    brand: string;
    tagline: string;
    headline: string;
    description: string;
    sectionTitle: string;
    cards: [string, string, string];
    action: string;
  }
> = {
  marketing: {
    brand: "Northstar",
    tagline: "Make good work matter",
    headline: "A clearer path to your next big idea.",
    description:
      "Bring your best work into focus with thoughtful tools built for teams that want to move forward.",
    sectionTitle: "Everything you need to move forward",
    cards: ["Find your focus", "Build momentum", "See what is next"],
    action: "Start a conversation",
  },
  bnb: {
    brand: "Hearth & Stay",
    tagline: "A little space to exhale",
    headline: "Come away. Feel at home.",
    description:
      "Slow mornings, thoughtful details, and a welcoming place to return to at the end of the day.",
    sectionTitle: "A stay made for slowing down",
    cards: ["Quiet rooms", "A generous breakfast", "The local way"],
    action: "Check availability",
  },
  restaurant: {
    brand: "Olive & Ember",
    tagline: "Seasonal food, shared well",
    headline: "Gather around something good.",
    description:
      "A neighborhood table for ingredient-led cooking, long lunches, and evenings worth lingering over.",
    sectionTitle: "From our kitchen to your table",
    cards: ["Made with the season", "A table for everyone", "A thoughtful pour"],
    action: "Book a table",
  },
  blog: {
    brand: "Fieldnotes",
    tagline: "Ideas worth keeping",
    headline: "Stories for a more curious world.",
    description:
      "Notes, perspectives, and practical ideas from people making thoughtful things happen.",
    sectionTitle: "The latest from Fieldnotes",
    cards: ["The art of starting small", "A slower kind of progress", "Making room for ideas"],
    action: "Read the journal",
  },
  corporate: {
    brand: "Meridian",
    tagline: "A better way forward",
    headline: "Make your next move with confidence.",
    description:
      "Practical expertise and a clear point of view for organizations ready to grow with purpose.",
    sectionTitle: "Expertise built around your goals",
    cards: ["Strategy", "Operations", "Partnerships"],
    action: "Talk to our team",
  },
};

const PAGE_LABELS: Record<PreviewPage, string> = {
  home: "Home",
  about: "About",
  contact: "Contact",
};

const getPageContent = (
  page: PreviewPage,
  template: (typeof TEMPLATE_CONTENT)[WebsiteTemplate],
) => {
  if (page === "about") {
    return {
      headline: `A little more about ${template.brand}.`,
      description: template.description,
      sectionTitle: "The things we believe",
    };
  }

  if (page === "contact") {
    return {
      headline: "We would love to hear from you.",
      description: `Get in touch with ${template.brand} and tell us what you have in mind.`,
      sectionTitle: "Start with a hello",
    };
  }

  return {
    headline: template.headline,
    description: template.description,
    sectionTitle: template.sectionTitle,
  };
};

const ThemeStudioWebsite = ({
  templateId,
  page,
  onPageChange,
}: {
  templateId: WebsiteTemplate;
  page: PreviewPage;
  onPageChange: (page: PreviewPage) => void;
}) => {
  const template = TEMPLATE_CONTENT[templateId];
  const pageContent = getPageContent(page, template);

  return (
    <div
      id="preview-home"
      className="theme-studio__website"
      data-template={templateId}
      data-preview-page={page}
    >
      <header className="theme-studio__website-header">
        <a className="theme-studio__brand" href="#preview-home">
          <span className="theme-studio__brand-mark" aria-hidden="true">
            {template.brand.charAt(0)}
          </span>
          <span>
            <strong>{template.brand}</strong>
            <small>{template.tagline}</small>
          </span>
        </a>

        <nav className="theme-studio__website-nav" aria-label="Preview pages">
          {PREVIEW_PAGES.map((previewPage) => (
            <button
              key={previewPage}
              type="button"
              aria-current={page === previewPage ? "page" : undefined}
              onClick={() => onPageChange(previewPage)}
            >
              {PAGE_LABELS[previewPage]}
            </button>
          ))}
          <button
            type="button"
            className="theme-studio__button theme-studio__button--primary theme-studio__nav-action"
            onClick={() => onPageChange("contact")}
          >
            {template.action}
          </button>
        </nav>
      </header>

      <div>
        <section className="theme-studio__hero">
          <div className="theme-studio__hero-copy">
            <p className="theme-studio__eyebrow">{template.tagline}</p>
            <h2>{pageContent.headline}</h2>
            <p className="theme-studio__hero-description">
              {pageContent.description}
            </p>
            <button
              type="button"
              className="theme-studio__button theme-studio__button--primary"
              onClick={() => onPageChange("contact")}
            >
              {template.action}
            </button>
          </div>
          <div className="theme-studio__hero-art" aria-hidden="true">
            <span className="theme-studio__art-orbit" />
            <span className="theme-studio__art-card">
              <span className="theme-studio__art-line" />
              <span className="theme-studio__art-line" />
              <span className="theme-studio__art-chip" />
            </span>
          </div>
        </section>

        <section className="theme-studio__feature-section">
          <div className="theme-studio__feature-heading">
            <p className="theme-studio__eyebrow">{template.brand}</p>
            <h3>{pageContent.sectionTitle}</h3>
          </div>
          <div className="theme-studio__feature-grid">
            {template.cards.map((card, index) => (
              <article className="theme-studio__feature-card" key={card}>
                <span className="theme-studio__feature-number">
                  0{index + 1}
                </span>
                <h4>{card}</h4>
                <p>
                  Thoughtful details, a clear point of view, and the care to
                  make every part feel considered.
                </p>
                <a href="#preview-details">Explore the details</a>
              </article>
            ))}
          </div>
        </section>

        <section className="theme-studio__contact-card" id="preview-details">
          <div>
            <p className="theme-studio__eyebrow">Stay in the loop</p>
            <h3>Good things start with a conversation.</h3>
          </div>
          <form
            className="theme-studio__contact-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="theme-studio-preview-email">Your email</label>
            <div className="theme-studio__form-row">
              <input
                id="theme-studio-preview-email"
                type="email"
                placeholder="you@example.com"
              />
              <button
                type="submit"
                className="theme-studio__button theme-studio__button--primary"
              >
                Get in touch
              </button>
            </div>
          </form>
        </section>
      </div>

      <footer className="theme-studio__website-footer">
        <span>{template.brand}</span>
        <span>Thoughtfully made with Puzzle</span>
        <a href="#preview-home">Back to top</a>
      </footer>
    </div>
  );
};

const ThemeStudio = () => {
  const [state, dispatch] = useReducer(
    themeStudioReducer,
    INITIAL_THEME_STUDIO_STATE,
  );
  const customized = isThemeCustomized(state.tokens);
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
  const colors = getBaseColorScheme(state.colorTheme, state.mode);
  const defaultColors = getBaseColorScheme(null, state.mode);

  return (
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

        <section
          className="theme-studio__section"
          aria-labelledby="theme-studio-templates-title"
        >
          <div className="theme-studio__section-heading">
            <div>
              <h2 id="theme-studio-templates-title">Website templates</h2>
              <p>Choose a website style. Your color theme stays independent.</p>
            </div>
          </div>
          <div className="theme-studio__template-list">
            {WEBSITE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className="theme-studio__template-button"
                aria-pressed={state.template === template.id}
                onClick={() =>
                  dispatch({ type: "template", template: template.id })
                }
              >
                <span className="theme-studio__template-icon" aria-hidden="true">
                  {template.label.charAt(0)}
                </span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section
          className="theme-studio__section"
          aria-labelledby="theme-studio-presets-title"
        >
          <div className="theme-studio__section-heading">
            <div>
              <h2 id="theme-studio-presets-title">Color theme presets</h2>
              <p>
                Explore the built-in color themes included with Puzzle. Select
                a theme to instantly apply it to your website preview.
              </p>
            </div>
            <button
              className="theme-studio__text-button"
              type="button"
              disabled={!state.colorTheme && !customized}
              onClick={() => dispatch({ type: "reset-default" })}
            >
              Reset to package default
            </button>
          </div>

          <div
            className="theme-studio__preset-list"
            role="group"
            aria-label="Built-in color theme presets"
          >
            <button
              type="button"
              className="theme-studio__preset-card"
              aria-pressed={state.colorTheme === null && !customized}
              onClick={() => dispatch({ type: "preset", colorTheme: null })}
            >
              <span className="theme-studio__preset-name">Puzzle default</span>
              <span className="theme-studio__preset-description">
                Package colors
              </span>
              <span className="theme-studio__swatches" aria-hidden="true">
                {[
                  defaultColors.primary,
                  defaultColors.secondary,
                  defaultColors.accent,
                ].map(
                  (color, index) => (
                    <span
                      className="theme-studio__swatch"
                      key={`${index}-${color}`}
                      style={{ backgroundColor: color }}
                    />
                  ),
                )}
              </span>
              <span className="theme-studio__preset-surfaces" aria-hidden="true">
                <span style={{ backgroundColor: defaultColors.background }} />
                <span style={{ backgroundColor: defaultColors.surface }} />
              </span>
              <span className="theme-studio__preset-caption">
                Primary / secondary / accent
              </span>
            </button>

            {getColorThemePresets().map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="theme-studio__preset-card"
                aria-pressed={
                  state.colorTheme === preset.id
                }
                onClick={() =>
                  dispatch({ type: "preset", colorTheme: preset.id })
                }
              >
                <span className="theme-studio__preset-name">{preset.name}</span>
                <span className="theme-studio__preset-description">
                  {customized && state.colorTheme === preset.id
                    ? "Customized"
                    : preset.id}
                </span>
                <span className="theme-studio__swatches" aria-hidden="true">
                  {[preset.colors.primary, preset.colors.secondary, preset.colors.accent].map(
                    (color, index) => (
                      <span
                        className="theme-studio__swatch"
                        key={`${index}-${color}`}
                        style={{ backgroundColor: color }}
                      />
                    ),
                  )}
                </span>
                <span className="theme-studio__preset-surfaces" aria-hidden="true">
                  <span style={{ backgroundColor: preset.colors.background }} />
                  <span style={{ backgroundColor: preset.colors.surface }} />
                </span>
                <span className="theme-studio__preset-caption">
                  Primary / secondary / accent
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="theme-studio__workspace">
          <section
            className="theme-studio__preview-panel"
            aria-labelledby="theme-studio-preview-title"
          >
            <div className="theme-studio__panel-heading">
              <div>
                <h2 id="theme-studio-preview-title">Live website preview</h2>
                <p>Page: {PAGE_LABELS[state.page]}</p>
              </div>
              <div className="theme-studio__mode-toggle" aria-label="Preview mode">
                {(["light", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={state.mode === mode}
                    onClick={() => dispatch({ type: "mode", mode })}
                  >
                    {mode === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </div>
            <div className="theme-studio__preview-frame">
              <Theme
                scope="local"
                globalStyles={false}
                theme={state.mode}
                colorTheme={state.colorTheme ?? undefined}
                tokens={state.tokens}
              >
                <ThemeStudioWebsite
                  templateId={state.template}
                  page={state.page}
                  onPageChange={(page) => dispatch({ type: "page", page })}
                />
              </Theme>
            </div>
          </section>

          <aside className="theme-studio__customization">
            <section
              className="theme-studio__panel"
              aria-labelledby="theme-studio-customize-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-customize-title">Customize colors</h2>
                  <p>{state.mode === "light" ? "Light" : "Dark"} scheme</p>
                </div>
                <button
                  className="theme-studio__text-button"
                  type="button"
                  disabled={!customized}
                  onClick={() => dispatch({ type: "restore-preset" })}
                >
                  {state.colorTheme ? "Restore preset" : "Restore default"}
                </button>
              </div>

              <div className="theme-studio__color-fields">
                {COLOR_ROLES.map((role) => (
                  <label className="theme-studio__color-field" key={role}>
                    <span>
                      <strong>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </strong>
                      <code>
                        {state.tokens.colorSchemes?.[state.mode]?.[role] ??
                          colors[role]}
                      </code>
                    </span>
                    <input
                      type="color"
                      aria-label={`${role} ${state.mode} color`}
                      value={
                        state.tokens.colorSchemes?.[state.mode]?.[role] ??
                        colors[role]
                      }
                      onChange={(event) =>
                        dispatch({
                          type: "color",
                          role,
                          value: event.currentTarget.value,
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </section>

            <section
              className="theme-studio__panel theme-studio__code-panel"
              aria-labelledby="theme-studio-code-title"
            >
              <div className="theme-studio__panel-heading">
                <div>
                  <h2 id="theme-studio-code-title">Implementation code</h2>
                  <p>Uses the public Theme provider API.</p>
                </div>
              </div>
              <pre>
                <code>{implementation}</code>
              </pre>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export { ThemeStudio };
