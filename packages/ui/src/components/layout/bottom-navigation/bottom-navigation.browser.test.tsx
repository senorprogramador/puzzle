import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Theme } from "@puzzle/theme";
import { BottomNavigation, BottomNavigationItem } from "./index";
import linkCss from "../../navigation/link/link.css?inline";

afterEach(cleanup);

describe("BottomNavigation (browser)", () => {
  it("keeps inactive links muted when shared link styles load last", async () => {
    render(
      <Theme>
        <BottomNavigation>
          <BottomNavigationItem icon="H" label="Home" href="#home" active />
          <BottomNavigationItem icon="S" label="Search" href="#search" />
          <BottomNavigationItem icon="C" label="Create" />
        </BottomNavigation>
        <style>{linkCss}</style>
      </Theme>,
    );

    const home = screen.getByRole("link", { name: "Home" });
    const search = screen.getByRole("link", { name: "Search" });
    const create = screen.getByRole("button", { name: "Create" });
    await expect.poll(() => getComputedStyle(home).color).toBe("rgb(2, 132, 199)");
    await expect.poll(() => getComputedStyle(search).color).toBe("rgb(95, 100, 133)");
    expect(getComputedStyle(create).color).toBe(getComputedStyle(search).color);
    expect(getComputedStyle(search).textDecorationLine).toBe("none");
    expect(home).toHaveAttribute("aria-current", "page");
    expect(search).not.toHaveAttribute("aria-current");
  });
});
