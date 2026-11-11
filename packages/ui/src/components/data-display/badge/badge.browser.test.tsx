import { cleanup, render, screen } from "@testing-library/react";
import { Theme } from "@puzzle-ui/theme";
import { afterEach, describe, expect, it } from "vitest";

import { Badge } from "./index";

afterEach(cleanup);

const rgb = (color: string) => {
  const channels = color.match(/\d+/g);
  if (!channels || channels.length < 3) {
    throw new Error(`Unexpected computed color: ${color}`);
  }
  return channels.slice(0, 3).map(Number);
};

const luminance = (color: number[]) =>
  color
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0);

describe("Badge colors (browser)", () => {
  const colors = ["primary", "secondary", "accent", "danger", "info"] as const;

  for (const theme of ["light", "dark"] as const) {
    it(`keeps default ${theme} roles distinct and readable`, () => {
      render(
        <Theme theme={theme}>
          {colors.map((color) => (
            <Badge key={color} content={color} color={color} />
          ))}
        </Theme>,
      );

      const backgrounds = colors.map((color) => {
        const style = getComputedStyle(screen.getByText(color));
        const background = rgb(style.backgroundColor);
        const foreground = rgb(style.color);
        const levels = [luminance(background), luminance(foreground)];
        expect((Math.max(...levels) + 0.05) / (Math.min(...levels) + 0.05)).toBeGreaterThanOrEqual(4.5);
        return background;
      });

      for (let i = 0; i < backgrounds.length; i++) {
        for (let j = i + 1; j < backgrounds.length; j++) {
          const distance = Math.hypot(
            ...backgrounds[i]!.map((channel, index) => channel - backgrounds[j]![index]!),
          );
          expect(distance).toBeGreaterThanOrEqual(50);
        }
      }
    });
  }

  it("uses role colors from a scoped theme", () => {
    render(
      <Theme theme="light">
        <Theme
          scope="local"
          theme="dark"
          tokens={{
            colorSchemes: {
              dark: { secondary: "#123456", secondaryForeground: "#ffffff" },
            },
          }}
        >
          <Badge color="secondary" content="scoped" />
        </Theme>
      </Theme>,
    );

    const style = getComputedStyle(screen.getByText("scoped"));
    expect(style.backgroundColor).toBe("rgb(18, 52, 86)");
    expect(style.color).toBe("rgb(255, 255, 255)");
  });
});

describe("Badge layout (browser)", () => {
  for (const overlap of ["rectangular", "circular"] as const) {
    for (const vertical of ["top", "bottom"] as const) {
      for (const horizontal of ["left", "right"] as const) {
        it(`anchors ${overlap} badges at ${vertical}-${horizontal}`, () => {
          render(
            <Theme>
              <Badge
                content="99+"
                anchorOverlap={overlap}
                anchorOrigin={{ vertical, horizontal }}
              >
                <div data-testid="target" style={{ width: 100, height: 100 }} />
              </Badge>
            </Theme>,
          );

          const target = screen.getByTestId("target").getBoundingClientRect();
          const indicator = screen.getByText("99+").getBoundingClientRect();
          const centerX = indicator.x + indicator.width / 2;
          const centerY = indicator.y + indicator.height / 2;

          if (horizontal === "right") {
            expect(centerX).toBeGreaterThan(target.x + target.width / 2);
          } else {
            expect(centerX).toBeLessThan(target.x + target.width / 2);
          }
          if (vertical === "top") {
            expect(centerY).toBeLessThan(target.y + target.height / 2);
          } else {
            expect(centerY).toBeGreaterThan(target.y + target.height / 2);
          }
          if (overlap === "rectangular") {
            expect(centerX).toBeCloseTo(target[horizontal], 0);
            expect(centerY).toBeCloseTo(target[vertical], 0);
          }
        });
      }
    }
  }

  it("keeps standalone labels in flow with padding around their text", () => {
    render(
      <Theme>
        <Badge content="Component showcase" />
      </Theme>,
    );

    const indicator = screen.getByText("Component showcase");
    const wrapper = indicator.parentElement!;
    const bounds = indicator.getBoundingClientRect();
    const wrapperBounds = wrapper.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(indicator);
    const text = range.getBoundingClientRect();

    expect(bounds.width).toBeGreaterThan(bounds.height);
    expect(wrapperBounds.width).toBeCloseTo(bounds.width, 0);
    expect(wrapperBounds.height).toBeCloseTo(bounds.height, 0);
    expect(bounds.left).toBeCloseTo(wrapperBounds.left, 0);
    expect(bounds.top).toBeCloseTo(wrapperBounds.top, 0);
    expect(text.left).toBeGreaterThan(bounds.left);
    expect(text.right).toBeLessThan(bounds.right);
    expect(text.top).toBeGreaterThanOrEqual(bounds.top);
    expect(text.bottom).toBeLessThanOrEqual(bounds.bottom);
  });
});
