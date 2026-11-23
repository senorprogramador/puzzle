import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { FeaturesSection } from "./features";

afterEach(() => {
  cleanup();
});

describe("FeaturesSection browser layout", () => {
  it("keeps sticky feature content full-width when no media is supplied", async () => {
    await page.viewport(1200, 800);
    try {
      const { container, unmount } = render(
        <FeaturesSection
          variant="sticky"
          items={[{ id: "speed", title: "Speed", description: "Ship sooner." }]}
        />,
      );

      const textOnlyLayout = container.querySelector(
        ".puzzle-features__sticky-layout",
      )!;
      expect(
        getComputedStyle(textOnlyLayout)
          .gridTemplateColumns.trim()
          .split(/\s+/),
      ).toHaveLength(1);
      unmount();

      const withMedia = render(
        <FeaturesSection
          variant="sticky"
          items={[
            {
              id: "speed",
              title: "Speed",
              description: "Ship sooner.",
              media: <img src="/speed.png" alt="Speed settings" />,
            },
          ]}
        />,
      );
      const mediaLayout = withMedia.container.querySelector(
        ".puzzle-features__sticky-layout",
      )!;
      expect(
        getComputedStyle(mediaLayout)
          .gridTemplateColumns.trim()
          .split(/\s+/),
      ).toHaveLength(2);
    } finally {
      await page.viewport(1280, 720);
    }
  });
});
