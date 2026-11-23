import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { DashboardStatCard } from "./dashboard-stat-card";

it("wraps an unbroken stat label within the card at phone widths", async () => {
  const { container } = render(
    <DashboardStatCard
      label={"WorkspaceMetricIdentifierWithoutSpaces".repeat(4)}
      value={38}
    />,
  );
  const card = container.querySelector("article")!;
  const label = card.querySelector("h2")!;

  await page.viewport(320, 800);

  expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(
    card.getBoundingClientRect().right,
  );
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
