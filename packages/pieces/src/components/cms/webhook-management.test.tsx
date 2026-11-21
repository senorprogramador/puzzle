import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { WebhookManagement } from "./webhook-management";
import type { WebhookManagementProps, WebhookSubscriptionItem } from "./cms.types";

const subscription: WebhookSubscriptionItem = {
  id: "hook-1",
  revision: 3,
  endpoint: "https://example.com/hook",
  events: ["entry:publish"],
  enabled: true,
  secretConfigured: true,
};

const props = (): WebhookManagementProps => ({
  subscriptions: [subscription],
  eventTypes: ["entry:publish", "entry:save-draft"],
  deliveries: [{
    id: "delivery-1",
    revision: 5,
    status: "failed",
    attempts: 2,
    lastStatus: 503,
    lastFailure: "http",
    createdAt: "2026-01-01T00:00:00.000Z",
  }],
  deliverySubscriptionId: "hook-1",
  attemptsByDelivery: {
    "delivery-1": [{ id: "attempt-1", number: 2, completedAt: "2026-01-01T00:00:00.000Z", status: 503, failure: "http" }],
  },
  onSelectSubscription: vi.fn(),
  onCreate: vi.fn(async (values) => ({ ...subscription, ...values, id: "new", revision: 1 })),
  onUpdate: vi.fn(async (_id, values) => ({ ...subscription, ...values, revision: 4 })),
  onRetry: vi.fn(),
  onRequestAttempts: vi.fn(),
});

describe("WebhookManagement", () => {
  it("renders on the server without showing secret values", () => {
    const markup = renderToString(<WebhookManagement {...props()} />);
    expect(markup).toContain("Webhooks");
    expect(markup).not.toContain("secretRef");
  });

  it("edits and rotates without accepting secret values, and presents attempts and retry", async () => {
    const user = userEvent.setup();
    const input = props();
    render(<WebhookManagement {...input} />);
    await user.click(screen.getByRole("button", { name: /example.com\/hook/ }));
    expect(input.onSelectSubscription).toHaveBeenCalledWith("hook-1");
    expect(screen.getByText("Secret: Configured")).toBeVisible();
    expect(screen.queryByLabelText(/^secret$/i)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Rotate secret when saving"));
    await user.click(screen.getByLabelText("entry:save-draft"));
    await user.click(screen.getByRole("button", { name: "Save webhook" }));
    expect(input.onUpdate).toHaveBeenCalledWith("hook-1", {
      endpoint: subscription.endpoint,
      enabled: true,
      events: ["entry:publish", "entry:save-draft"],
      expectedRevision: 3,
      rotateSecret: true,
    });
    await waitFor(() => expect(screen.getByLabelText("Rotate secret when saving")).not.toBeChecked());
    await user.click(screen.getByText("Attempt history"));
    expect(input.onRequestAttempts).toHaveBeenCalledWith("delivery-1");
    expect(screen.getByText(/Attempt 2/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Retry delivery" }));
    expect(input.onRetry).toHaveBeenCalledWith("delivery-1", 5);
  });

  it("validates event selection and surfaces callback errors without losing drafts", async () => {
    const user = userEvent.setup();
    const input = { ...props(), onCreate: vi.fn().mockRejectedValue(new Error("Creation denied")) };
    render(<WebhookManagement {...input} />);
    await user.click(screen.getByRole("button", { name: "New webhook" }));
    await user.type(screen.getByLabelText("Endpoint URL"), "https://example.com/new");
    await user.click(screen.getByRole("button", { name: "Create webhook" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Select at least one event");
    expect(input.onCreate).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText("entry:publish"));
    await user.click(screen.getByRole("button", { name: "Create webhook" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Creation denied"));
    expect(screen.getByLabelText("Endpoint URL")).toHaveValue("https://example.com/new");
  });

  it("does not display another subscription's stale delivery history", async () => {
    const user = userEvent.setup();
    render(<WebhookManagement {...props()} deliverySubscriptionId="other" />);
    await user.click(screen.getByRole("button", { name: /example.com\/hook/ }));
    expect(screen.getByText("Delivery history not loaded.")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Retry delivery" })).not.toBeInTheDocument();
  });

  it("allows removing existing events omitted from the supplied event catalog", async () => {
    const user = userEvent.setup();
    const input = props();
    render(<WebhookManagement {...input} eventTypes={["entry:save-draft"]} />);
    await user.click(screen.getByRole("button", { name: /example.com\/hook/ }));
    expect(screen.getByLabelText("entry:publish")).toBeChecked();
    await user.click(screen.getByLabelText("entry:publish"));
    expect(screen.getByLabelText("entry:publish")).not.toBeChecked();
    await user.click(screen.getByLabelText("entry:publish"));
    expect(screen.getByLabelText("entry:publish")).toBeChecked();
    await user.click(screen.getByLabelText("entry:save-draft"));
    await user.click(screen.getByLabelText("entry:publish"));
    await user.click(screen.getByRole("button", { name: "Save webhook" }));
    expect(input.onUpdate).toHaveBeenCalledWith("hook-1", {
      endpoint: subscription.endpoint,
      enabled: true,
      events: ["entry:save-draft"],
      expectedRevision: 3,
      rotateSecret: false,
    });
  });

  it("confirms before discarding a draft when switching subscriptions", async () => {
    const user = userEvent.setup();
    const onDirtyChange = vi.fn();
    render(<WebhookManagement {...props()} onDirtyChange={onDirtyChange} />);
    await user.click(screen.getByRole("button", { name: /example.com\/hook/ }));
    await user.click(screen.getByLabelText("Rotate secret when saving"));
    expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByRole("button", { name: "New webhook" }));
    expect(screen.getByRole("dialog", { name: "Discard unsaved webhook changes?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(screen.getByLabelText("Rotate secret when saving")).toBeChecked();
    await user.click(screen.getByRole("button", { name: "New webhook" }));
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(screen.getByRole("button", { name: "Create webhook" })).toBeVisible();
    expect(onDirtyChange).toHaveBeenLastCalledWith(false);
  });

  it("distinguishes a committed save from a failed history refresh", async () => {
    const user = userEvent.setup();
    const input = {
      ...props(),
      onSelectSubscription: vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("Refresh failed")),
    };
    render(<WebhookManagement {...input} />);
    await user.click(screen.getByRole("button", { name: /example.com\/hook/ }));
    await user.click(screen.getByRole("button", { name: "Save webhook" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("webhook was saved"));
    expect(screen.getByRole("alert")).toHaveTextContent("Refresh failed");
  });
});
