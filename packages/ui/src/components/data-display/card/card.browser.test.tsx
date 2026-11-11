import { cleanup, render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, expect, it } from "vitest";

import { Card, CardTitle } from "./index";

afterEach(cleanup);

it("uses the local dark theme text color inside a light root theme", () => {
  render(
    <Theme theme="light">
      <Card data-testid="light-card">Light card</Card>
      <Theme theme="dark" scope="local">
        <Card data-testid="dark-card">
          <CardTitle>Dark card</CardTitle>
        </Card>
        <span data-testid="dark-text" style={{ color: "var(--puzzle-color-text)" }}>
          Reference text
        </span>
      </Theme>
    </Theme>,
  );

  const darkColor = getComputedStyle(screen.getByTestId("dark-card")).color;

  expect(darkColor).toBe(getComputedStyle(screen.getByTestId("dark-text")).color);
  expect(darkColor).toBe(getComputedStyle(screen.getByText("Dark card")).color);
  expect(darkColor).not.toBe(getComputedStyle(screen.getByTestId("light-card")).color);
});
