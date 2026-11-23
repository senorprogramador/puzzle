import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { CommerceBenefitsSection } from "./commerce-benefits";

it("keeps links and actions as separate, visibly focused keyboard stops", async () => {
  const user = userEvent.setup();

  render(
    <CommerceBenefitsSection
      items={[
        {
          id: "delivery",
          title: "Delivery options",
          href: "/delivery",
          action: <button type="button">Read details</button>,
        },
      ]}
    />,
  );

  const link = screen.getByRole("link", { name: "Delivery options" });
  const button = screen.getByRole("button", { name: "Read details" });

  await user.tab();
  expect(link).toHaveFocus();
  expect(getComputedStyle(link).outlineStyle).not.toBe("none");

  await user.tab();
  expect(button).toHaveFocus();
});

it("does not overflow a narrow viewport with long consumer-provided copy", async () => {
  render(
    <CommerceBenefitsSection
      items={[
        {
          id: "long-copy",
          title: "Delivery information ".repeat(8),
          description: "Store-provided details ".repeat(16),
          action: <button type="button">Read details</button>,
        },
      ]}
    />,
  );

  await page.viewport(320, 800);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
