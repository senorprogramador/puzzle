import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CodeShowcaseSection } from "./code-showcase";
import { IntegrationsSection } from "./integrations";
import { PricingSection } from "./pricing";
import { ProductShowcaseSection } from "./product-showcase";
import { RoadmapSection } from "./roadmap";
import { SecuritySection } from "./security";
import { UseCasesSection } from "./use-cases";

describe("SaaS marketing sections during server rendering", () => {
  it("renders product showcases without browser globals", () => {
    expect(
      renderToString(createElement(ProductShowcaseSection, { items: [] })),
    ).toContain('data-marketing-family="product-showcase"');
  });

  it("renders integrations without browser globals", () => {
    expect(
      renderToString(createElement(IntegrationsSection, { items: [] })),
    ).toContain('data-marketing-family="integrations"');
  });

  it("renders use cases without browser globals", () => {
    expect(
      renderToString(createElement(UseCasesSection, { items: [] })),
    ).toContain('data-marketing-family="use-cases"');
  });

  it("renders security content without generated claims", () => {
    expect(
      renderToString(createElement(SecuritySection, { items: [] })),
    ).toContain('data-marketing-family="security"');
  });

  it("renders pricing without calculating values", () => {
    expect(
      renderToString(createElement(PricingSection, { plans: [] })),
    ).toContain('data-marketing-family="pricing"');
  });

  it("renders code showcases without accessing the clipboard", () => {
    expect(
      renderToString(createElement(CodeShowcaseSection, { items: [] })),
    ).toContain('data-marketing-family="code-showcase"');
  });

  it("renders roadmaps without accessing browser APIs", () => {
    expect(
      renderToString(createElement(RoadmapSection, { items: [] })),
    ).toContain('data-marketing-family="roadmap"');
  });
});
