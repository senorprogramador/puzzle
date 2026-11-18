import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { IntegrationsSection } from "./integrations";
import type { IntegrationItem } from "./integrations.types";

const items: IntegrationItem[] = [
  {
    id: "relay",
    name: "Relay Email",
    logo: <span aria-hidden="true">R</span>,
    category: "Messaging",
    description: "Send project updates to the right team channel.",
  },
  {
    id: "beacon",
    name: "Beacon Analytics",
    logo: <span aria-hidden="true">B</span>,
    category: "Analytics",
    description: "Bring product events into workspace reports.",
  },
  {
    id: "atlas",
    name: "Atlas Storage",
    logo: <span aria-hidden="true">A</span>,
    category: "Storage",
    description: "Attach shared files to a project record.",
  },
  {
    id: "northstar",
    name: "Northstar CRM",
    logo: <span aria-hidden="true">N</span>,
    category: "CRM",
    description: "Keep account context close to delivery work.",
  },
];

afterEach(cleanup);

describe("IntegrationsSection responsive layouts", () => {
  it("keeps orbit and network cards readable at mobile, tablet, and desktop widths", async () => {
    const { container } = render(
      <>
        <IntegrationsSection
          variant="orbit"
          items={items}
          centerLabel="Northstar"
        />
        <IntegrationsSection
          variant="network"
          items={items}
          centerLabel="Northstar"
        />
      </>,
    );
    const orbit = container.querySelector<HTMLElement>(
      '.puzzle-integrations[data-variant="orbit"]',
    )!;
    const network = container.querySelector<HTMLElement>(
      '.puzzle-integrations[data-variant="network"]',
    )!;
    const orbitList = orbit.querySelector<HTMLElement>(
      ".puzzle-integrations__list",
    )!;
    const networkList = network.querySelector<HTMLElement>(
      ".puzzle-integrations__list",
    )!;
    const columnCount = (element: HTMLElement) =>
      getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length;

    await page.viewport(375, 844);
    expect(columnCount(orbitList)).toBe(1);
    expect(columnCount(networkList)).toBe(1);
    expect(
      orbit.querySelector(".puzzle-integrations__center")!.getBoundingClientRect()
        .bottom,
    ).toBeLessThan(orbitList.getBoundingClientRect().top);
    expect(orbit.scrollWidth).toBeLessThanOrEqual(orbit.clientWidth);
    expect(network.scrollWidth).toBeLessThanOrEqual(network.clientWidth);

    for (const [width, height] of [
      [768, 1024],
      [1280, 800],
    ] as const) {
      await page.viewport(width, height);
      expect(columnCount(orbitList)).toBe(2);
      expect(columnCount(networkList)).toBe(2);

      const relationship = orbit.querySelector(
        ".puzzle-integrations__relationship",
      )!;
      const center = orbit.querySelector(
        ".puzzle-integrations__center",
      )!.getBoundingClientRect();
      const relationshipBounds = relationship.getBoundingClientRect();

      expect(center.left + center.width / 2).toBeCloseTo(
        relationshipBounds.left + relationshipBounds.width / 2,
        0,
      );
      expect(center.top + center.height / 2).toBeCloseTo(
        relationshipBounds.top + relationshipBounds.height / 2,
        0,
      );
      expect(orbit.scrollWidth).toBeLessThanOrEqual(orbit.clientWidth);
      expect(network.scrollWidth).toBeLessThanOrEqual(network.clientWidth);
    }
  });
});
