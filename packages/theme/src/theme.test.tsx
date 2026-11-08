import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Theme } from "./theme";

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
});
