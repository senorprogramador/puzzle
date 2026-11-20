import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GiftVoucherSection } from "./gift-voucher-section";

describe("GiftVoucherSection", () => {
  it("reuses product cards for voucher prices, arrangements, and purchase links", () => {
    render(
      <GiftVoucherSection
        title="Give a little getaway"
        locale="en-GB"
        vouchers={[
          {
            id: "weekend",
            name: "A weekend for two",
            description: "A two-night stay with breakfast.",
            price: { amount: 240, currency: "EUR" },
            arrangement: "Stay package",
            purchaseHref: "https://example.test/vouchers/weekend",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "A weekend for two" }),
    ).toHaveAttribute("href", "https://example.test/vouchers/weekend");
    expect(
      screen.getByRole("link", { name: "View gift voucher" }),
    ).toHaveAttribute("href", "https://example.test/vouchers/weekend");
    expect(screen.getByText("Stay package")).toBeVisible();
    expect(screen.getByText(/€240/)).toBeVisible();
  });

  it("supports caller actions and an empty state without requiring checkout", () => {
    render(
      <GiftVoucherSection
        title="Vouchers"
        vouchers={[
          {
            id: "brunch",
            name: "Brunch for two",
            price: { amount: 60, currency: "EUR" },
            purchaseAction: <button type="button">Ask about brunch</button>,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Ask about brunch" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "View gift voucher" }),
    ).toBeNull();
  });

  it("renders a custom empty state", () => {
    render(
      <GiftVoucherSection
        title="Vouchers"
        vouchers={[]}
        emptyState={<p>Vouchers are coming soon.</p>}
      />,
    );

    expect(screen.getByText("Vouchers are coming soon.")).toBeVisible();
  });
});
