import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { ActivitySection } from "./activity-section";

it("makes the horizontally scrolling activity list keyboard-accessible", async () => {
  await page.viewport(375, 800);
  const { container } = render(
    <ActivitySection
      variant="horizontal"
      items={Array.from({ length: 5 }, (_, index) => ({
        id: `activity-${index}`,
        action: `Updated record ${index}`,
        timestamp: "Today",
      }))}
    />,
  );
  const list = container.querySelector(
    ".puzzle-activity-section__list",
  ) as HTMLOListElement;

  await userEvent.keyboard("{Tab}");

  expect(list).toHaveAttribute("tabindex", "0");
  expect(list).toHaveAttribute("aria-label", "Activity items");
  expect(list).toHaveFocus();
  expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  expect(getComputedStyle(list).outlineStyle).toBe("solid");
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await userEvent.keyboard("{ArrowRight}");

  expect(list.scrollLeft).toBeGreaterThan(0);

  for (const width of [768, 1280]) {
    await page.viewport(width, 800);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  }
});
