import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { CartSummarySection } from "./cart-summary";

it("keeps the mobile variant compact and within narrow viewports", async () => {
  const { container } = render(
    <CartSummarySection
      variant="mobile"
      items={[
        {
          id: "mug",
          name: "Stoneware mug",
          quantity: 1,
          unitPrice: { amount: 24, currency: "USD" },
          lineTotal: { amount: 24, currency: "USD" },
          image: { src: "/mug.png", alt: "White stoneware mug" },
        },
      ]}
    />,
  );
  const item = container.querySelector(".puzzle-cart-summary__item")!;
  const image = container.querySelector(".puzzle-commerce__image")!;

  await page.viewport(375, 800);
  expect(getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/))
    .toHaveLength(2);
  expect(getComputedStyle(image).display).toBe("none");
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(768, 800);
  expect(getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/))
    .toHaveLength(3);
  expect(getComputedStyle(image).display).not.toBe("none");

  await page.viewport(1280, 800);
  expect(getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/))
    .toHaveLength(3);
  expect(getComputedStyle(image).display).not.toBe("none");
});

it("keeps detailed item totals in the same row as their images", async () => {
  const { container } = render(
    <CartSummarySection
      variant="detailed"
      items={[
        {
          id: "mug",
          name: "Stoneware mug",
          description: "Hand-thrown stoneware",
          quantity: 1,
          unitPrice: { amount: 24, currency: "USD" },
          lineTotal: { amount: 24, currency: "USD" },
          image: { src: "/mug.png", alt: "White stoneware mug" },
        },
      ]}
    />,
  );
  const image = container.querySelector(".puzzle-commerce__image")!;
  const lineTotal = container.querySelector(
    ".puzzle-cart-summary__line-total",
  )!;

  await page.viewport(1280, 800);

  expect(
    Math.abs(
      image.getBoundingClientRect().top -
        lineTotal.getBoundingClientRect().top,
    ),
  ).toBeLessThanOrEqual(1);
});
