import { render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { describe, expect, it } from "vitest";
import { PageLayout } from "./index";

describe("PageLayout.Main background (browser)", () => {
  for (const rootTheme of ["light", "dark"] as const) {
    it(`follows the active local theme inside a ${rootTheme} root`, () => {
      const layout = (theme: "light" | "dark") => (
        <Theme theme={rootTheme}>
          <Theme
            scope="local"
            theme={theme}
            tokens={{
              colorSchemes: {
                light: { background: "#ffffff" },
                dark: { background: "#112233" },
              },
            }}
          >
            <PageLayout>
              <PageLayout.Main>Content</PageLayout.Main>
            </PageLayout>
          </Theme>
        </Theme>
      );
      const { rerender } = render(layout("light"));

      for (const theme of ["light", "dark", "light"] as const) {
        rerender(layout(theme));
        expect(getComputedStyle(screen.getByRole("main")).backgroundColor).toBe(
          theme === "light" ? "rgb(255, 255, 255)" : "rgb(17, 34, 51)",
        );
      }
    });
  }

  it("allows explicit region styles to override the theme background", () => {
    render(
      <Theme>
        <PageLayout>
          <PageLayout.Main style={{ backgroundColor: "rgb(18, 52, 86)" }}>
            Content
          </PageLayout.Main>
        </PageLayout>
      </Theme>,
    );
    expect(getComputedStyle(screen.getByRole("main")).backgroundColor).toBe(
      "rgb(18, 52, 86)",
    );
  });
});
