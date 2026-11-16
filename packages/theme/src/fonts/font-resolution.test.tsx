import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createThemeCss } from "../create-theme-css";
import { DEFAULT_TYPOGRAPHY_ROLES, createFluidFontSize, typographyDefaults } from "./typography";
import { resolveFontConfig } from "./resolve-font-config";
import { resolveFontStylesheets } from "./resolve-font-stylesheets";
import { GoogleFont } from "./google-font";

describe("resolveFontConfig", () => {
  it("trims family names and deduplicates and sorts weights and styles", () => {
    expect(
      resolveFontConfig({
        family: "  Inter  " as never,
        weights: [700, 400, 700, 500],
        styles: ["italic", "normal", "italic"],
      }),
    ).toMatchObject({
      family: "Inter",
      weights: [400, 500, 700],
      styles: ["normal", "italic"],
      display: "swap",
      fallback: ["system-ui", "sans-serif"],
      role: "body",
    });
  });

  it("prefers variable weight ranges and derives role-specific defaults", () => {
    expect(
      resolveFontConfig({
        family: "Sora" as never,
        role: "heading",
        weights: [300, 700],
        weightRange: [200, 800],
      }),
    ).toMatchObject({
      family: "Sora",
      weightRange: [200, 800],
      weights: [200, 800],
      fallback: ["system-ui", "sans-serif"],
      role: "heading",
    });
  });

  it.each(["", "  ", "Bad;Family", "Bad<Family", "Bad\nFamily", "Bad\u007fFamily"])(
    "rejects unsafe font family %j",
    (family) => {
      expect(() => resolveFontConfig({ family: family as never })).toThrow(
        TypeError,
      );
    },
  );

  it.each([
    [[]],
    [[0, 700]],
    [[300, 1001]],
    [[700, 300]],
    [[300, 500, 700]],
  ])("rejects invalid variable weight range %j", (weightRange) => {
    expect(() =>
      resolveFontConfig({
        family: "Inter" as never,
        weightRange: weightRange as never,
      }),
    ).toThrow(RangeError);
  });

  it("validates weights, non-empty styles, and fallback names", () => {
    expect(() =>
      resolveFontConfig({ family: "Inter" as never, weights: [] }),
    ).toThrow(RangeError);
    expect(() =>
      resolveFontConfig({
        family: "Inter" as never,
        weights: [400, 1001],
      }),
    ).toThrow(RangeError);
    expect(() =>
      resolveFontConfig({ family: "Inter" as never, styles: [] }),
    ).toThrow(TypeError);
    expect(() =>
      resolveFontConfig({ family: "Inter" as never, fallback: [] }),
    ).toThrow(TypeError);
    expect(() =>
      resolveFontConfig({
        family: "Inter" as never,
        fallback: ["Bad;Fallback"],
      }),
    ).toThrow(TypeError);
  });
});

describe("resolveFontStylesheets", () => {
  it("returns no stylesheets for absent or empty font configurations", () => {
    expect(resolveFontStylesheets()).toEqual([]);
    expect(resolveFontStylesheets({})).toEqual([]);
  });

  it("preserves role order while merging duplicate family requests", () => {
    const sheets = resolveFontStylesheets({
      heading: {
        family: "Inter" as never,
        weights: [700, 400],
      },
      body: {
        family: "inter" as never,
        weights: [500, 400],
        styles: ["italic"],
      },
      accent: {
        family: "JetBrains Mono" as never,
        weights: [400],
      },
    });

    expect(sheets).toHaveLength(2);
    expect(sheets[0]?.family).toBe("Inter");
    expect(new URL(sheets[0]!.href).searchParams.get("family")).toBe(
      "Inter:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700",
    );
    expect(sheets[1]?.family).toBe("JetBrains Mono");
  });

  it("keeps otherwise-identical requests separate when display modes differ", () => {
    const sheets = resolveFontStylesheets({
      heading: { family: "Inter" as never, display: "swap" },
      body: { family: "Inter" as never, display: "optional" },
    });

    expect(sheets.map(({ display }) => display)).toEqual(["swap", "optional"]);
  });
});

describe("typography generation", () => {
  it("clamps fluid font sizes to the configured endpoint values", () => {
    const fluid = createFluidFontSize({
      min: 16,
      max: 32,
      minViewport: 360,
      maxViewport: 1360,
    });

    expect(fluid).toBe("clamp(1rem, 0.6400rem + 1.6000vw, 2rem)");
    expect(typographyDefaults.display1.responsive).toEqual({
      min: 40,
      max: 80,
      minViewport: 360,
      maxViewport: 1440,
    });
  });

  it("keeps finite reversed ranges deterministic without changing the endpoints", () => {
    expect(
      createFluidFontSize({
        min: 32,
        max: 16,
        minViewport: 360,
        maxViewport: 1440,
      }),
    ).toBe("clamp(2rem, 2.3333rem + -1.4815vw, 1rem)");
  });

  it("generates every typography role with its configured font and token references", () => {
    expect(Object.keys(DEFAULT_TYPOGRAPHY_ROLES)).toEqual(
      Object.keys(typographyDefaults),
    );
    expect(DEFAULT_TYPOGRAPHY_ROLES.display1).toMatchObject({
      font: "heading",
      fontSize: "clamp(2.5rem, 1.6667rem + 3.7037vw, 5rem)",
      fontWeight: "300",
    });
    expect(DEFAULT_TYPOGRAPHY_ROLES.body1).toMatchObject({
      font: "body",
      fontSize: "var(--puzzle-font-size-base)",
      fontWeight: "var(--puzzle-font-weight-normal)",
      lineHeight: "var(--puzzle-font-line-height-normal)",
    });
    expect(DEFAULT_TYPOGRAPHY_ROLES.button.letterSpacing).toBe(
      `${0.5 / 14}em`,
    );
  });
});

describe("createThemeCss", () => {
  it("emits declarations in insertion order without a rule wrapper", () => {
    expect(
      createThemeCss({
        "--puzzle-color-primary": "var(--custom, #123456)",
        "--puzzle-font-size-body": "1.125rem",
      }),
    ).toBe(
      "  --puzzle-color-primary: var(--custom, #123456);\n  --puzzle-font-size-body: 1.125rem;\n",
    );
  });

  it("returns a trailing newline when there are no declarations", () => {
    expect(createThemeCss({})).toBe("\n");
  });
});

describe("GoogleFont rendering", () => {
  it("renders Google preconnect and stylesheet links with nonce style output", () => {
    const markup = renderToStaticMarkup(
      <GoogleFont family={"Inter" as never} nonce="font-nonce" />,
    );

    expect(markup).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(markup).toContain('href="https://fonts.gstatic.com"');
    expect(markup).toContain('crossorigin="anonymous"');
    expect(markup).toContain('rel="stylesheet"');
    expect(markup).toContain("family=Inter");
    expect(markup).toContain('<style nonce="font-nonce">');
    expect(markup).toContain("--puzzle-font-body:");
    expect(markup).not.toContain('rel="preload"');
  });

  it("uses only the local stylesheet for local font source", () => {
    const markup = renderToStaticMarkup(
      <GoogleFont
        family={"Inter" as never}
        fontSource="local"
        fontBasePath="/assets/fonts/"
      />,
    );

    expect(markup).toContain('href="/assets/fonts/puzzle-fonts.css"');
    expect(markup).not.toContain("fonts.googleapis.com");
    expect(markup).not.toContain("fonts.gstatic.com");
  });

  it("rejects invalid font configurations during server rendering", () => {
    expect(() =>
      renderToStaticMarkup(<GoogleFont family={"Bad;Family" as never} />),
    ).toThrow(TypeError);
    expect(() =>
      renderToStaticMarkup(
        <GoogleFont family={"Inter" as never} weights={[]} />,
      ),
    ).toThrow(RangeError);
  });
});
