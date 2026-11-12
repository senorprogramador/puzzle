import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Theme } from "@puzzle-ui/theme";
import { BottomNavigation, BottomNavigationItem } from "./index";
import linkCss from "../../navigation/link/link.css?inline";

afterEach(cleanup);

describe("BottomNavigation (browser)", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`keeps inactive links muted in ${theme} mode when shared link styles load last`, async () => {
      render(
        <Theme theme={theme}>
          <BottomNavigation>
            <BottomNavigationItem icon="H" label="Home" href="#home" active />
            <BottomNavigationItem icon="S" label="Search" href="#search" />
            <BottomNavigationItem icon="C" label="Create" />
          </BottomNavigation>
          <span
            hidden
            data-testid="primary-color"
            style={{ color: "var(--puzzle-color-primary)" }}
          />
          <span
            hidden
            data-testid="muted-color"
            style={{ color: "var(--puzzle-color-text-muted)" }}
          />
          <style>{linkCss}</style>
        </Theme>,
      );

      const home = screen.getByRole("link", { name: "Home" });
      const search = screen.getByRole("link", { name: "Search" });
      const create = screen.getByRole("button", { name: "Create" });
      const primaryColor = getComputedStyle(screen.getByTestId("primary-color")).color;
      const mutedColor = getComputedStyle(screen.getByTestId("muted-color")).color;
      expect(primaryColor).not.toBe(mutedColor);
      await expect.poll(() => getComputedStyle(home).color).toBe(primaryColor);
      await expect.poll(() => getComputedStyle(search).color).toBe(mutedColor);
      expect(getComputedStyle(create).color).toBe(getComputedStyle(search).color);
      expect(getComputedStyle(search).textDecorationLine).toBe("none");
      expect(home).toHaveAttribute("aria-current", "page");
      expect(search).not.toHaveAttribute("aria-current");
    });
  }
});
