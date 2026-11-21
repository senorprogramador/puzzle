import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethodSelector } from "./payment-method-selector";

describe("PaymentMethodSelector", () => {
  it("renders provider-neutral methods with descriptions", () => {
    render(
      <PaymentMethodSelector
        methods={[
          { id: "card", label: "Card", provider: "Provider A" },
          {
            id: "bank",
            label: "Bank transfer",
            description: "Complete payment from your bank.",
          },
        ]}
      />,
    );

    expect(screen.getByRole("radio", { name: /card/i })).toBeVisible();
    expect(screen.getByText("Provider A")).toBeVisible();
    expect(
      screen.getByText("Complete payment from your bank."),
    ).toBeVisible();
  });

  it("emits selected method changes", async () => {
    const onValueChange = vi.fn();
    render(
      <PaymentMethodSelector
        methods={[
          { id: "card", label: "Card" },
          { id: "bank", label: "Bank transfer" },
        ]}
        onValueChange={onValueChange}
      />,
    );

    screen.getByRole("radio", { name: /bank transfer/i }).click();
    expect(onValueChange).toHaveBeenCalledWith("bank");
  });

  it("rejects duplicate method IDs", () => {
    expect(() =>
      render(
        <PaymentMethodSelector
          methods={[
            { id: "card", label: "Card" },
            { id: "card", label: "Duplicate" },
          ]}
        />,
      ),
    ).toThrow("Payment method IDs must be non-empty and unique.");
  });
});
