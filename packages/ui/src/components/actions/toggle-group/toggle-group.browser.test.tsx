import { cleanup, render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { ToggleGroup } from "./index";

afterEach(cleanup);

describe("ToggleGroup keyboard interaction", () => {
  it("uses a single tab stop for entry, exit and reverse entry", async () => {
    render(
      <><button>Before</button><ToggleGroup defaultValue="italic" aria-label="Formatting">
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup><button>After</button></>,
    );
    screen.getByRole("button", { name: "Before" }).focus();
    await userEvent.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
  });

  for (const [orientation, dir, forward] of [
    ["horizontal", "ltr", "{ArrowRight}"],
    ["horizontal", "rtl", "{ArrowLeft}"],
    ["vertical", "ltr", "{ArrowDown}"],
    ["vertical", "rtl", "{ArrowDown}"],
  ] as const) {
    it(`navigates ${orientation} ${dir} without selecting or wrapping`, async () => {
      render(
        <Theme scope="local">
          <ToggleGroup orientation={orientation} dir={dir} loop={false} defaultValue="first">
            <ToggleGroup.Item value="first">First</ToggleGroup.Item>
            <ToggleGroup.Item value="disabled" disabled>Disabled</ToggleGroup.Item>
            <ToggleGroup.Item value="last">Last</ToggleGroup.Item>
          </ToggleGroup>
        </Theme>,
      );
      const first = screen.getByRole("button", { name: "First" });
      const last = screen.getByRole("button", { name: "Last" });
      first.focus();
      await userEvent.keyboard(forward);
      expect(last).toHaveFocus();
      expect(first).toHaveAttribute("aria-pressed", "true");
      expect(last).toHaveAttribute("aria-pressed", "false");
      expect(last.matches(":focus-visible")).toBe(true);
      expect(getComputedStyle(last).outlineStyle).toBe("solid");
      await userEvent.keyboard(forward);
      expect(last).toHaveFocus();
      await userEvent.keyboard("{Home}");
      expect(first).toHaveFocus();
      await userEvent.keyboard("{End}");
      expect(last).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      expect(last).toHaveAttribute("aria-pressed", "true");
      expect(first).toHaveAttribute("aria-pressed", "false");
    });
  }

  it("skips loading and aria-disabled items as well as explicitly disabled items", async () => {
    render(
      <ToggleGroup defaultValue="first">
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="loading" loading>Loading</ToggleGroup.Item>
        <ToggleGroup.Item value="aria-disabled" aria-disabled="true">Unavailable</ToggleGroup.Item>
        <ToggleGroup.Item value="last">Last</ToggleGroup.Item>
      </ToggleGroup>,
    );
    screen.getByRole("button", { name: "First" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Loading" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "Unavailable" })).toHaveAttribute("tabindex", "-1");
  });

  it("activates and deselects a multiple-choice item exactly once using Space", async () => {
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard(" ");

    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("skips an entirely disabled group", async () => {
    render(
      <><button>Before</button><ToggleGroup disabled defaultValue="first">
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="second">Second</ToggleGroup.Item>
      </ToggleGroup><button>After</button></>,
    );
    screen.getByRole("button", { name: "Before" }).focus();
    await userEvent.keyboard("{Tab}");

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    expect(screen.getByRole("group")).toHaveAttribute("aria-disabled", "true");
  });
});

describe("ToggleGroup themed attached layout", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const orientation of ["horizontal", "vertical"] as const) {
      for (const dir of ["ltr", "rtl"] as const) {
        it(`fills its container and joins ${orientation} items in ${dir} ${theme} mode`, () => {
          render(
            <div style={{ width: "320px" }}>
              <Theme scope="local" theme={theme}>
                <ToggleGroup attached fullWidth orientation={orientation} dir={dir}>
                  <ToggleGroup.Item value="first">First</ToggleGroup.Item>
                  <ToggleGroup.Item value="last">Last</ToggleGroup.Item>
                </ToggleGroup>
              </Theme>
            </div>,
          );
          const group = screen.getByRole("group");
          const first = screen.getByRole("button", { name: "First" });
          const last = screen.getByRole("button", { name: "Last" });
          const firstBox = first.getBoundingClientRect();
          const lastBox = last.getBoundingClientRect();
          const firstStyle = getComputedStyle(first);
          const lastStyle = getComputedStyle(last);

          expect(group.getBoundingClientRect().width).toBeCloseTo(320, 1);
          expect(getComputedStyle(group).gap).toBe("0px");
          expect(firstBox.width).toBeCloseTo(lastBox.width, 1);
          expect(parseFloat(firstStyle.borderStartStartRadius)).toBeGreaterThan(0);
          expect(firstStyle.borderEndEndRadius).toBe("0px");
          expect(lastStyle.borderStartStartRadius).toBe("0px");
          expect(parseFloat(lastStyle.borderEndEndRadius)).toBeGreaterThan(0);
          if (orientation === "vertical") {
            expect(lastBox.top).toBeCloseTo(firstBox.bottom - 1, 1);
          } else if (dir === "rtl") {
            expect(lastBox.right).toBeCloseTo(firstBox.left + 1, 1);
          } else {
            expect(lastBox.left).toBeCloseTo(firstBox.right - 1, 1);
          }
        });
      }
    }
  }
});
