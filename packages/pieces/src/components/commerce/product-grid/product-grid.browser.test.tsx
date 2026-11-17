import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { ProductGridSection } from "./product-grid";

it("keeps product columns responsive without horizontal page overflow", async () => {
  const { container } = render(
    <ProductGridSection
      items={Array.from({ length: 4 }, (_, index) => ({
        id: `product-${index}`,
        name: `Product ${index}`,
        price: { amount: 10 + index, currency: "USD" },
      }))}
    />,
  );
  const list = container.querySelector(".puzzle-product-grid__list")!;

  await page.viewport(375, 800);
  expect(getComputedStyle(list).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(getComputedStyle(list).gridTemplateColumns.trim().split(/\s+/).length)
    .toBeGreaterThan(1);
});
