import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { SettingsRow } from ".";

it("preserves settings row direction at the responsive breakpoint", async () => {
  const { container } = render(
    <SettingsRow label="Email" control={<input type="email" />} />,
  );
  const row = container.querySelector(".puzzle-settings-row");

  expect(row).not.toBeNull();
  for (const [width, direction] of [
    [320, "column"],
    [768, "column"],
    [769, "row"],
  ] as const) {
    await page.viewport(width, 800);
    expect(getComputedStyle(row!).flexDirection).toBe(direction);
  }
});
