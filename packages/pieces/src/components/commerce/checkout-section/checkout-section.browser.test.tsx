import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { CheckoutSection } from "./checkout-section";

describe("CheckoutSection (browser)", () => {
  it("stacks split and sidebar layouts when their container is narrow", async () => {
    await page.viewport(1280, 800);

    const { container } = render(
      <div style={{ width: "34rem" }}>
        <CheckoutSection
          variant="sidebar"
          className="checkout-sidebar-test"
          summary={<p>$36.00</p>}
        />
        <CheckoutSection
          variant="split"
          className="checkout-split-test"
          summary={<p>$36.00</p>}
          customerDetails={<p>Guest details</p>}
        />
      </div>,
    );

    const frame = container.firstElementChild as HTMLElement;
    const getColumnCount = (selector: string) => {
      const layout = container.querySelector(
        `${selector} .puzzle-checkout-section__layout`,
      );
      return getComputedStyle(layout!).gridTemplateColumns.split(" ").length;
    };

    expect(getColumnCount(".checkout-sidebar-test")).toBe(1);
    expect(getColumnCount(".checkout-split-test")).toBe(1);

    frame.style.width = "56rem";

    expect(getColumnCount(".checkout-sidebar-test")).toBe(2);
    expect(getColumnCount(".checkout-split-test")).toBe(2);
  });
});
