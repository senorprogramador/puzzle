import { cleanup, render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "./index";

afterEach(cleanup);

for (const theme of ["light", "dark"] as const) {
  for (const variant of ["primary", "secondary"] as const) {
    it(`changes only the ${variant} background on hover in ${theme} mode`, async () => {
      render(
        <Theme theme={theme} scope="local">
          <Button variant={variant} style={{ transition: "none" }}>Action</Button>
        </Theme>,
      );

      const button = screen.getByRole("button", { name: "Action" });
      const background = getComputedStyle(button).backgroundColor;
      const foreground = getComputedStyle(button).color;

      await userEvent.hover(button);

      expect(getComputedStyle(button).backgroundColor).not.toBe(background);
      expect(getComputedStyle(button).color).toBe(foreground);
      expect(getComputedStyle(button).filter).toBe("none");
    });

    for (const state of ["disabled", "loading", "disabled-link"] as const) {
      it(`keeps the ${state} ${variant} background unchanged in ${theme} mode`, async () => {
        render(
          <Theme theme={theme} scope="local">
            <Button
              variant={variant}
              disabled={state !== "loading"}
              loading={state === "loading"}
              href={state === "disabled-link" ? "/example" : undefined}
              style={{ transition: "none" }}
            >
              Action
            </Button>
          </Theme>,
        );

        const button = screen.getByRole(
          state === "disabled-link" ? "link" : "button",
          { name: "Action" },
        );
        const background = getComputedStyle(button).backgroundColor;

        await userEvent.hover(button);

        expect(getComputedStyle(button).backgroundColor).toBe(background);
        expect(getComputedStyle(button).filter).toBe("none");
      });
    }
  }
}
