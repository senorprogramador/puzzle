import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PaymentMethodSelector } from "./payment-method-selector";

describe("PaymentMethodSelector (browser)", () => {
  it("keeps long provider names within a narrow checkout column", () => {
    const { container } = render(
      <div style={{ width: "20rem" }}>
        <PaymentMethodSelector
          methods={[
            {
              id: "card",
              label: "Card",
              provider: "Provider".repeat(12),
            },
          ]}
        />
      </div>,
    );

    const column = container.firstElementChild as HTMLElement;

    expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
  });

  it("supports keyboard selection of enabled methods", async () => {
    const user = userEvent.setup();

    render(
      <PaymentMethodSelector
        methods={[
          { id: "card", label: "Card" },
          { id: "bank", label: "Bank transfer" },
        ]}
      />,
    );

    await user.tab();
    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("radio", { name: "Bank transfer" }),
    ).toHaveFocus();
    expect(
      screen.getByRole("radio", { name: "Bank transfer" }),
    ).toBeChecked();
  });
});
