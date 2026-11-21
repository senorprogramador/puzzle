import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { page } from "vitest/browser";
import { expect, it, vi } from "vitest";
import { WebhookManagement } from "./webhook-management";

it("supports keyboard editing without horizontal overflow at mobile, tablet, and desktop sizes", async () => {
  const user = userEvent.setup();
  const onSelectSubscription = vi.fn();
  const { container } = render(
    <WebhookManagement
      subscriptions={[{ id: "hook", revision: 1, endpoint: "https://example.com/a-long-webhook-endpoint", events: ["entry:publish"], enabled: true, secretConfigured: true }]}
      eventTypes={["entry:publish", "entry:save-draft"]}
      deliveries={[]}
      onSelectSubscription={onSelectSubscription}
      onCreate={(values) => ({ ...values, id: "new", revision: 1, secretConfigured: true })}
      onUpdate={(_id, values) => ({ ...values, id: "hook", revision: 2, secretConfigured: true })}
      onRetry={() => undefined}
    />,
  );
  const select = screen.getByRole("button", { name: /example.com/ });
  select.focus();
  await user.keyboard("{Enter}");
  expect(onSelectSubscription).toHaveBeenCalledWith("hook");
  const checkbox = screen.getByLabelText("entry:save-draft");
  checkbox.focus();
  await user.keyboard(" ");
  expect(checkbox).toBeChecked();
  for (const width of [320, 768, 1280]) {
    await page.viewport(width, 800);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    expect(container.querySelector(".puzzle-cms-webhooks__form")).toBeVisible();
  }
});
