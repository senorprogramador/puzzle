import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CartSummarySection } from "./cart-summary";
import { CategoriesSection } from "./categories";
import { CommerceBenefitsSection } from "./commerce-benefits";
import { formatMoney } from "./shared";
import { ProductDetailsSection } from "./product-details";
import { ProductGallerySection } from "./product-gallery";
import { ProductGridSection } from "./product-grid";

describe("commerce currency formatting", () => {
  it("uses explicit locales and the currency's native precision", () => {
    const us = formatMoney({ amount: 1234.5, currency: "USD" }, "en-US");
    const netherlands = formatMoney(
      { amount: 1234.5, currency: "EUR" },
      "nl-NL",
    );
    const yen = formatMoney({ amount: 1234, currency: "JPY" }, "ja-JP");

    expect(us).toBe(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(1234.5),
    );
    expect(netherlands).toBe(
      new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(1234.5),
    );
    expect(yen).toBe(
      new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
      }).format(1234),
    );
    expect(formatMoney({ amount: 0, currency: "USD" })).toContain("0");
    expect(formatMoney({ amount: -5, currency: "USD" })).toContain("5");
  });

  it("rejects non-finite values, invalid currency codes, and invalid locales", () => {
    expect(() => formatMoney({ amount: Number.NaN, currency: "USD" })).toThrow(
      "Currency amount must be a finite number.",
    );
    expect(() =>
      formatMoney({ amount: Number.POSITIVE_INFINITY, currency: "USD" }),
    ).toThrow("Currency amount must be a finite number.");
    expect(() => formatMoney({ amount: 1, currency: "" })).toThrow(
      "Currency must be a non-empty ISO 4217 code.",
    );
    expect(() => formatMoney({ amount: 1, currency: "not-a-code" })).toThrow(
      RangeError,
    );
    expect(() =>
      formatMoney({ amount: 1, currency: "USD" }, "not_a_locale"),
    ).toThrow(RangeError);
  });
});

describe("commerce section server rendering", () => {
  it("renders a product grid without browser globals", () => {
    expect(
      renderToString(createElement(ProductGridSection, { items: [] })),
    ).toContain("puzzle-section");
  });

  it("renders categories without browser globals", () => {
    expect(
      renderToString(createElement(CategoriesSection, { items: [] })),
    ).toContain("puzzle-section");
  });

  it("renders a product gallery without browser globals", () => {
    expect(
      renderToString(createElement(ProductGallerySection, { images: [] })),
    ).toContain("puzzle-section");
  });

  it("renders a cart summary without browser globals", () => {
    expect(
      renderToString(createElement(CartSummarySection, { items: [] })),
    ).toContain("puzzle-section");
  });

  it("renders product details without browser globals", () => {
    expect(
      renderToString(
        createElement(ProductDetailsSection, {
          product: { id: "plain", name: "Plain product" },
        }),
      ),
    ).toContain("puzzle-section");
  });

  it("renders commerce benefits without browser globals", () => {
    expect(
      renderToString(createElement(CommerceBenefitsSection, { items: [] })),
    ).toContain("puzzle-section");
  });
});
