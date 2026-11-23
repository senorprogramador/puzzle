import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { DashboardProgressCard } from "./dashboard-progress-card";

it("wraps an unbroken title within the card at phone widths", async () => {
  const { container } = render(
    <DashboardProgressCard
      title={"WorkspaceIdentifierWithoutSpaces".repeat(4)}
      value={38}
    />,
  );
  const card = container.querySelector("article")!;
  const title = card.querySelector("h2")!;

  await page.viewport(320, 800);

  expect(title.getBoundingClientRect().right).toBeLessThanOrEqual(
    card.getBoundingClientRect().right,
  );
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
