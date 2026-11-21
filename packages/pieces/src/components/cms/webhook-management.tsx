"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@puzzle-ui/ui";
import type {
  WebhookManagementProps,
  WebhookSubscriptionItem,
  WebhookSubscriptionValues,
} from "./cms.types";
import "./cms.css";

const errorMessage = (error: unknown): string =>
  error instanceof Error && error.message ? error.message : "The webhook action could not be completed.";

const formatTime = (value: Date | string): string => {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : "Invalid timestamp";
};

const emptyValues = (): WebhookSubscriptionValues => ({
  endpoint: "",
  events: [],
  enabled: true,
});

export const WebhookManagement = ({
  subscriptions,
  eventTypes,
  deliveries,
  deliverySubscriptionId,
  attemptsByDelivery,
  onSelectSubscription,
  onCreate,
  onUpdate,
  onRetry,
  onRequestAttempts,
  onDirtyChange,
  loading = false,
  error,
  className,
}: WebhookManagementProps) => {
  const id = useId();
  const [values, setValues] = useState<WebhookSubscriptionValues>(emptyValues);
  const [editing, setEditing] = useState<WebhookSubscriptionItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [rotateSecret, setRotateSecret] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<WebhookSubscriptionItem | "new" | null>(null);
  const busyRef = useRef(false);
  const original = editing ?? emptyValues();
  const availableEvents = [...new Set([...eventTypes, ...(editing?.events ?? []), ...values.events])];
  const dirty = formOpen && (
    values.endpoint !== original.endpoint ||
    values.enabled !== original.enabled ||
    values.events.join("\0") !== original.events.join("\0") ||
    rotateSecret
  );
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  const run = async (action: () => void | Promise<void>): Promise<void> => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (caught) {
      setActionError(errorMessage(caught));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const select = (subscription: WebhookSubscriptionItem): void => {
    void run(async () => {
      setEditing(subscription);
      setValues({
        endpoint: subscription.endpoint,
        events: [...subscription.events],
        enabled: subscription.enabled,
      });
      setRotateSecret(false);
      setFormOpen(true);
      await onSelectSubscription(subscription.id);
    });
  };

  const startNew = (): void => {
    setEditing(null);
    setValues(emptyValues());
    setRotateSecret(false);
    setFormOpen(true);
    setActionError(null);
  };

  const changeSelection = (next: WebhookSubscriptionItem | "new"): void => {
    if (next !== "new" && editing?.id === next.id) return;
    if (dirty) {
      setPendingSelection(next);
    } else if (next === "new") {
      startNew();
    } else {
      select(next);
    }
  };

  const save = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (values.events.length === 0) {
      setActionError("Select at least one event.");
      return;
    }
    void run(async () => {
      const saved = editing
        ? await onUpdate(editing.id, { ...values, expectedRevision: editing.revision, rotateSecret })
        : await onCreate(values);
      setEditing(saved);
      setValues({ endpoint: saved.endpoint, events: [...saved.events], enabled: saved.enabled });
      setRotateSecret(false);
      try {
        await onSelectSubscription(saved.id);
      } catch (caught) {
        throw new Error(`The webhook was saved, but delivery history could not be refreshed: ${errorMessage(caught)}`);
      }
    });
  };

  return (
    <section className={["puzzle-cms-webhooks", className].filter(Boolean).join(" ")} aria-labelledby={`${id}-title`} aria-busy={loading || busy}>
      <header className="puzzle-cms-webhooks__header">
        <div>
          <h2 id={`${id}-title`}>Webhooks</h2>
          <p>Manage endpoints and delivery history.</p>
        </div>
        <button type="button" disabled={loading || busy} onClick={() => changeSelection("new")}>New webhook</button>
      </header>
      {error ? <p role="alert">{error}</p> : null}
      {actionError ? <p role="alert">{actionError}</p> : null}
      {loading ? <p role="status">Loading webhooks…</p> : null}
      {!loading && subscriptions.length === 0 ? <p>No webhooks configured.</p> : null}
      {subscriptions.length > 0 ? (
        <ul className="puzzle-cms-webhooks__subscriptions" aria-label="Webhook subscriptions">
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <button
                type="button"
                disabled={loading || busy}
                aria-pressed={editing?.id === subscription.id}
                onClick={() => changeSelection(subscription)}
              >
                <span>{subscription.endpoint}</span>
                <span>{subscription.enabled ? "Enabled" : "Disabled"}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {formOpen ? (
        <form className="puzzle-cms-webhooks__form" onSubmit={save}>
          <fieldset disabled={loading || busy}>
            <legend>{editing ? "Edit webhook" : "New webhook"}</legend>
            <label className="puzzle-cms-webhooks__endpoint">
              Endpoint URL
              <input
                type="url"
                required
                value={values.endpoint}
                placeholder="https://example.com/webhook"
                onChange={(event) => setValues({ ...values, endpoint: event.currentTarget.value })}
              />
            </label>
            <fieldset className="puzzle-cms-webhooks__events">
              <legend>Subscribed events</legend>
              {availableEvents.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={values.events.includes(type)}
                    onChange={(event) => setValues({
                      ...values,
                      events: event.currentTarget.checked
                        ? [...values.events, type]
                        : values.events.filter((item) => item !== type),
                    })}
                  />
                  {type}
                </label>
              ))}
            </fieldset>
            <label className="puzzle-cms-webhooks__checkbox">
              <input type="checkbox" checked={values.enabled} onChange={(event) => setValues({ ...values, enabled: event.currentTarget.checked })} />
              Enabled
            </label>
            {editing ? (
              <>
                <p>Secret: {editing.secretConfigured ? "Configured" : "Not configured"}</p>
                <label className="puzzle-cms-webhooks__checkbox">
                  <input type="checkbox" checked={rotateSecret} onChange={(event) => setRotateSecret(event.currentTarget.checked)} />
                  Rotate secret when saving
                </label>
              </>
            ) : <p>The host configures the signing secret.</p>}
            <button type="submit">{busy ? "Saving…" : editing ? "Save webhook" : "Create webhook"}</button>
          </fieldset>
        </form>
      ) : null}
      <Dialog
        open={pendingSelection !== null}
        onOpenChange={(open) => { if (!open) setPendingSelection(null); }}
        title="Discard unsaved webhook changes?"
        description="Switching webhooks will discard your current changes."
        footer={(
          <>
            <button type="button" onClick={() => setPendingSelection(null)}>Keep editing</button>
            <button type="button" onClick={() => {
              const next = pendingSelection;
              setPendingSelection(null);
              if (next === "new") startNew();
              else if (next) select(next);
            }}>Discard changes</button>
          </>
        )}
      />
      {editing ? (
        <section className="puzzle-cms-webhooks__history" aria-labelledby={`${id}-history`}>
          <h3 id={`${id}-history`}>Delivery history</h3>
          {deliverySubscriptionId !== editing.id ? <p>Delivery history not loaded.</p> : deliveries.length === 0 ? <p>No deliveries for this webhook.</p> : (
            <ul>
              {deliveries.map((delivery) => (
                <li key={delivery.id}>
                  <div>
                    <strong>{delivery.status}</strong> · {formatTime(delivery.createdAt)} · {delivery.attempts} attempts
                    {delivery.lastStatus !== null ? ` · HTTP ${delivery.lastStatus}` : ""}
                    {delivery.lastFailure ? ` · ${delivery.lastFailure}` : ""}
                  </div>
                  {delivery.status === "failed" ? (
                    <button type="button" disabled={loading || busy} onClick={() => void run(() => onRetry(delivery.id, delivery.revision))}>Retry delivery</button>
                  ) : null}
                  {onRequestAttempts || attemptsByDelivery?.[delivery.id] ? (
                    <details onToggle={(event) => {
                      if (event.currentTarget.open && onRequestAttempts) void run(() => onRequestAttempts(delivery.id));
                    }}>
                      <summary>Attempt history</summary>
                      {attemptsByDelivery?.[delivery.id] ? (
                        <ul>
                          {attemptsByDelivery[delivery.id]?.map((attempt) => (
                            <li key={attempt.id}>
                              Attempt {attempt.number} · {formatTime(attempt.completedAt)}
                              {attempt.status !== null ? ` · HTTP ${attempt.status}` : ""}
                              {attempt.failure ? ` · ${attempt.failure}` : ""}
                            </li>
                          ))}
                        </ul>
                      ) : <p>Attempt history not loaded.</p>}
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </section>
  );
};
