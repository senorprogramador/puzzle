import { cleanup, render, screen } from "@testing-library/react";
import type { CSSProperties } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "../button";
import { ButtonGroup } from "./index";

afterEach(cleanup);

describe("ButtonGroup attached corners", () => {
  for (const orientation of ["horizontal", "vertical"] as const) {
    for (const dir of ["ltr", "rtl"] as const) {
      for (const count of [1, 2, 3]) {
        it(`joins ${count} ${orientation} buttons in ${dir}`, () => {
          render(
            <ButtonGroup attached orientation={orientation} dir={dir}>
              {Array.from({ length: count }, (_, index) => (
                <Button key={index} variant="outline">
                  Action {index + 1}
                </Button>
              ))}
            </ButtonGroup>,
          );

          screen.getAllByRole("button").forEach((button, index) => {
            const style = getComputedStyle(button);
            const first = index === 0;
            const last = index === count - 1;
            const roundedCorners = {
              "border-start-start-radius": first,
              "border-start-end-radius":
                orientation === "horizontal" ? last : first,
              "border-end-start-radius":
                orientation === "horizontal" ? first : last,
              "border-end-end-radius": last,
            };

            for (const [corner, rounded] of Object.entries(roundedCorners)) {
              const radius = parseFloat(style.getPropertyValue(corner));
              if (rounded) {
                expect(radius).toBeGreaterThan(0);
              } else {
                expect(radius).toBe(0);
              }
            }

            expect(style.marginInlineStart).toBe(
              orientation === "horizontal" && !first ? "-1px" : "0px",
            );
            expect(style.marginBlockStart).toBe(
              orientation === "vertical" && !first ? "-1px" : "0px",
            );
          });
        });
      }
    }
  }

  for (const orientation of ["horizontal", "vertical"] as const) {
    for (const variant of ["primary", "outline", "ghost"] as const) {
      it(`draws a single themed divider between ${variant} ${orientation} buttons`, () => {
        render(
          <div style={{ "--puzzle-color-border": "rgb(1, 2, 3)" } as CSSProperties}>
            <ButtonGroup attached orientation={orientation}>
              <Button variant={variant}>One</Button>
              <Button variant={variant}>Two</Button>
              <Button variant={variant}>Three</Button>
            </ButtonGroup>
          </div>,
        );

        const buttons = screen.getAllByRole("button");
        const side = orientation === "horizontal" ? "Left" : "Top";

        buttons.forEach((button, index) => {
          if (index === 0) return;
          const style = getComputedStyle(button);
          expect(style[`border${side}Width`]).toBe("1px");
          expect(style[`border${side}Style`]).toBe("solid");
          expect(style[`border${side}Color`]).toBe("rgb(1, 2, 3)");

          const previous = buttons[index - 1]!.getBoundingClientRect();
          const current = button.getBoundingClientRect();
          // Overlapping by exactly the border width collapses adjacent borders into one line.
          if (orientation === "horizontal") {
            expect(current.left).toBeCloseTo(previous.right - 1, 1);
          } else {
            expect(current.top).toBeCloseTo(previous.bottom - 1, 1);
          }
        });
      });
    }
  }

  it("preserves every corner when buttons are not attached", () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Last</Button>
      </ButtonGroup>,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(parseFloat(getComputedStyle(button).borderRadius)).toBeGreaterThan(0);
    }
  });
});
