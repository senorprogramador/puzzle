import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ServiceOptionsSection } from "./service-options-section";

afterEach(cleanup);

describe("ServiceOptionsSection responsive layout", () => {
  it("wraps long prices without causing horizontal overflow", async () => {
    const { container } = render(
      <ServiceOptionsSection
        title="Stay extras"
        services={[
          {
            id: "long-price",
            title: "Optional service",
            inclusion: "optional",
            price: "€".repeat(160),
          },
        ]}
      />,
    );
    const section = container.querySelector<HTMLElement>(
      ".puzzle-service-options-section",
    )!;
    const price = container.querySelector<HTMLElement>(
      ".puzzle-service-options-section__price",
    )!;

    for (const width of [320, 375, 768, 1440]) {
      await page.viewport(width, 800);

      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      expect(price.scrollWidth).toBeLessThanOrEqual(price.clientWidth);
    }
  });
});
