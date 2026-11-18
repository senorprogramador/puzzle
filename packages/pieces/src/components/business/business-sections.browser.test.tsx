import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { AwardsSection } from "./awards-section";
import { ServicesSection } from "./services-section";
import { TeamSection } from "./team-section";

afterEach(cleanup);

describe("business section responsive layouts", () => {
  it("adapts the team grid from one mobile column to a wider desktop grid", async () => {
    const members = Array.from({ length: 4 }, (_, index) => ({
      id: `person-${index}`,
      name: `Person ${index}`,
      role: "Consultant",
    }));
    const { container } = render(<TeamSection items={members} />);
    const list = container.querySelector(".puzzle-team-section__members");

    expect(list).not.toBeNull();
    await page.viewport(375, 800);
    expect(getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(
      1,
    );

    await page.viewport(1200, 800);
    expect(
      getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });

  it("stacks list service media on mobile and splits it on desktop", async () => {
    await page.viewport(320, 800);
    const { container } = render(
      <ServicesSection
        variant="list"
        items={[
          {
            id: "strategy",
            title: "Brand strategy",
            description: "Positioning for growing teams.",
            image: { src: "", alt: "Studio workshop" },
          },
        ]}
      />,
    );
    const service = container.querySelector(".puzzle-business-service")!;

    expect(getComputedStyle(service).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    await page.viewport(768, 800);
    expect(getComputedStyle(service).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    await page.viewport(1280, 800);
    expect(getComputedStyle(service).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
  });

  it("keeps numbered and categorized service images within their cards", async () => {
    for (const variant of ["numbered", "categorized"] as const) {
      const { container } = render(
        <ServicesSection
          variant={variant}
          items={[
            {
              id: "strategy",
              title: "Brand strategy",
              category: "Consulting",
              image: {
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'/%3E",
                alt: "Studio workshop",
              },
            },
          ]}
        />,
      );
      const service = container.querySelector(".puzzle-business-service")!;
      const media = service.querySelector(".puzzle-business-service__media > *")!;
      const image = media.querySelector("img")!;
      const content = service.querySelector(".puzzle-business-service__content")!;

      for (const width of [768, 1280]) {
        await page.viewport(width, 800);
        const serviceRight = service.getBoundingClientRect().right;

        expect(media.getBoundingClientRect().right).toBeLessThanOrEqual(serviceRight);
        expect(image.getBoundingClientRect().right).toBeLessThanOrEqual(serviceRight);
        expect(image.getBoundingClientRect().bottom).toBeLessThanOrEqual(
          media.getBoundingClientRect().bottom,
        );
        expect(image.getBoundingClientRect().bottom).toBeLessThanOrEqual(
          content.getBoundingClientRect().top,
        );
        expect(image.getBoundingClientRect().bottom).toBeLessThanOrEqual(
          service.getBoundingClientRect().bottom,
        );
        expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
          document.documentElement.clientWidth,
        );
      }

      cleanup();
    }
  });

  it("stacks compact award details on mobile and aligns them on desktop", async () => {
    await page.viewport(320, 800);
    const { container } = render(
      <AwardsSection
        variant="compact"
        items={[
          {
            id: "design-award",
            title: "Independent Studio of the Year",
            organization: "European Design Council",
            year: 2025,
            logo: { src: "", alt: "Award mark" },
          },
        ]}
      />,
    );
    const award = container.querySelector(".puzzle-awards-section__award")!;

    expect(getComputedStyle(award).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    await page.viewport(768, 800);
    expect(getComputedStyle(award).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    await page.viewport(1280, 800);
    expect(getComputedStyle(award).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
  });
});
