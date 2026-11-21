import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckoutSection } from "./checkout-section";

describe("CheckoutSection", () => {
  it("renders composable checkout slots and progress", () => {
    render(
      <CheckoutSection
        steps={[
          { id: "details", title: "Details", completed: true },
          { id: "payment", title: "Payment" },
        ]}
        currentStepId="payment"
        customerDetails={<label htmlFor="email">Email</label>}
        summary={<p>$10.00</p>}
        paymentMethods={[{ id: "card", label: "Card" }]}
        selectedPaymentMethod="card"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("form")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Checkout progress" })).toBeVisible();
    expect(screen.getByLabelText("Customer details")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Order summary" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Place order" })).toBeVisible();
  });

  it("submits form data and shows an explicit loading state", async () => {
    const onSubmit = vi.fn(() => new Promise<void>(() => {}));
    render(
      <CheckoutSection
        customerDetails={<input name="email" defaultValue="guest@example.com" />}
        onSubmit={onSubmit}
      />,
    );

    screen.getByRole("button", { name: "Place order" }).click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Processing..." }),
      ).toBeDisabled(),
    );
  });

  it("rejects duplicate step IDs", () => {
    expect(() =>
      render(
        <CheckoutSection
          steps={[
            { id: "details", title: "Details" },
            { id: "details", title: "Duplicate" },
          ]}
        />,
      ),
    ).toThrow("Checkout step IDs must be non-empty and unique.");
  });
});
