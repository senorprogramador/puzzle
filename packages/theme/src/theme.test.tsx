import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Theme } from "./theme";

const fonts = {
  heading: {
    family: "Sora" as const,
    weights: [600, 700],
  },
  body: {
    family: "Inter" as const,
    weights: [400, 700],
  },
  accent: {
    family: "JetBrains Mono" as const,
    weights: [400],
  },
};

describe("Theme", () => {
  it("keeps root scope as the default", () => {
    const markup = renderToStaticMarkup(
      <Theme theme="dark">
        <span>Root content</span>
      </Theme>,
    );

    expect(markup).toContain('data-puzzle-theme="true"');
    expect(markup).toContain(":root {");
    expect(markup).toContain("Root content");
    expect(markup).not.toContain("data-puzzle-theme-scope-style");
  });

  it("renders a local theme scope", () => {
    const markup = renderToStaticMarkup(
      <Theme scope="local" theme="dark">
        <span>Local content</span>
      </Theme>,
    );

    const scopeId = markup.match(/data-puzzle-theme-scope="([^"]+)"/)?.[1];

    expect(scopeId).toBeDefined();

    expect(markup).toContain(`data-puzzle-theme-scope-style="${scopeId}"`);

    expect(markup).toContain(`[data-puzzle-theme-scope="${scopeId}"] {`);

    expect(markup).toContain('data-theme="dark"');
    expect(markup).toContain("Local content");

    expect(markup).not.toContain('data-puzzle-theme="true"');
  });

  it("supports local system mode", () => {
    const markup = renderToStaticMarkup(
      <Theme scope="local" theme="system">
        <span>System content</span>
      </Theme>,
    );

    expect(markup).toContain('data-theme="system"');

    expect(markup).toContain("System content");
  });

  it("keeps local styles separate from the root theme marker", () => {
    const markup = renderToStaticMarkup(
      <>
        <Theme theme="light">
          <span>Root content</span>
        </Theme>

        <Theme scope="local" theme="dark">
          <span>Local content</span>
        </Theme>
      </>,
    );

    expect(markup).toContain('data-puzzle-theme="true"');

    expect(markup).toContain("data-puzzle-theme-scope-style");

    expect(markup).toContain("Root content");
    expect(markup).toContain("Local content");
  });

  describe("font preloading", () => {
    it("does not preload fonts by default when using Google Fonts", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts}>
          <span>Content</span>
        </Theme>,
      );

      expect(markup).not.toContain('rel="preload"');
    });

    it("preloads the body font by default for local fonts", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local">
          <span>Content</span>
        </Theme>,
      );

      expect(markup).toContain('rel="preload"');

      expect(markup).toContain('href="/fonts/puzzle-font-inter.woff2"');

      expect(markup).toContain('as="font"');

      expect(markup).toContain('type="font/woff2"');

      expect(markup).toContain('crossorigin="anonymous"');
    });

    it("preloads the heading font when requested", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local" fontPreload="heading">
          <span>Content</span>
        </Theme>,
      );

      expect(markup).toContain('href="/fonts/puzzle-font-sora.woff2"');
    });

    it("preloads the accent font when requested", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local" fontPreload="accent">
          <span>Content</span>
        </Theme>,
      );

      expect(markup).toContain(
        'href="/fonts/puzzle-font-jetbrains-mono.woff2"',
      );
    });

    it("does not preload when fontPreload is false", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local" fontPreload={false}>
          <span>Content</span>
        </Theme>,
      );

      expect(markup).not.toContain('rel="preload"');
    });

    it("does not preload when the selected role is not configured", () => {
      const markup = renderToStaticMarkup(
        <Theme
          fonts={{
            heading: fonts.heading,
          }}
          fontSource="local"
        >
          <span>Content</span>
        </Theme>,
      );

      expect(markup).not.toContain('rel="preload"');
    });

    it("uses a custom font base path", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local" fontBasePath="/assets/fonts">
          <span>Content</span>
        </Theme>,
      );

      expect(markup).toContain('href="/assets/fonts/puzzle-font-inter.woff2"');
    });

    it("supports font base paths with trailing slashes", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local" fontBasePath="/assets/fonts/">
          <span>Content</span>
        </Theme>,
      );

      expect(markup).toContain('href="/assets/fonts/puzzle-font-inter.woff2"');

      expect(markup).not.toContain('href="/assets/fonts//');
    });

    it("renders only one preload link", () => {
      const markup = renderToStaticMarkup(
        <Theme fonts={fonts} fontSource="local">
          <span>Content</span>
        </Theme>,
      );

      expect(markup.match(/rel="preload"/g)).toHaveLength(1);
    });
  });
});
