import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BottomNavigation, BottomNavigationItem } from "./index";

afterEach(() => {
  cleanup();
});

describe("BottomNavigation", () => {
  it("marks only active links as the current page", () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem icon="i" label="Home" href="/" active />
        <BottomNavigationItem icon="i" label="Create" active />
      </BottomNavigation>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Create" })).not.toHaveAttribute("aria-current");
  });
});
