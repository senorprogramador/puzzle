"use client";

import { useSyncExternalStore } from "react";

import type { I18nRuntimeEvent } from "../runtime";

export interface I18nRouteDiagnosticEvent {
  type: "route";
  pathname: string;
  status: "matched" | "redirected" | "unmatched";
  locale?: string;
  routeId?: string;
}

export type I18nDiagnosticEvent = I18nRuntimeEvent;

export type I18nDiagnosticRecord = I18nDiagnosticEvent & {
  id: number;
  timestamp: string;
};

export interface I18nDiagnosticsStore {
  record(event: I18nDiagnosticEvent): void;
  getSnapshot(): readonly I18nDiagnosticRecord[];
  subscribe(listener: () => void): () => void;
  clear(): void;
}

export interface CreateI18nDiagnosticsOptions {
  maxEvents?: number;
  clock?: () => Date;
}

export const createI18nDiagnostics = (
  options: CreateI18nDiagnosticsOptions = {},
): I18nDiagnosticsStore => {
  const maxEvents = options.maxEvents ?? 200;

  if (!Number.isInteger(maxEvents) || maxEvents < 1) {
    throw new Error("maxEvents must be a positive integer.");
  }

  const clock = options.clock ?? (() => new Date());
  const listeners = new Set<() => void>();
  let nextId = 1;
  let snapshot: readonly I18nDiagnosticRecord[] = Object.freeze([]);

  const notify = (): void => {
    listeners.forEach((listener) => listener());
  };

  return {
    record(event) {
      const record = Object.freeze({
        ...event,
        id: nextId,
        timestamp: clock().toISOString(),
      }) as I18nDiagnosticRecord;
      nextId += 1;
      snapshot = Object.freeze([...snapshot, record].slice(-maxEvents));
      notify();
    },

    getSnapshot: () => snapshot,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    clear() {
      if (snapshot.length === 0) {
        return;
      }

      snapshot = Object.freeze([]);
      notify();
    },
  };
};

export interface I18nDevToolsProps {
  diagnostics: I18nDiagnosticsStore;
  title?: string;
}

const describeEvent = (event: I18nDiagnosticEvent): string => {
  switch (event.type) {
    case "missing-key":
      return `Missing key "${event.key}" for ${event.locale}`;
    case "fallback":
      return `"${event.key}" fell back from ${event.requestedLocale} to ${event.resolvedLocale}`;
    case "namespace-load":
      return `Namespace "${event.namespace}" ${event.status} for ${event.locale}`;
    case "route":
      return `Route ${event.status} for ${event.locale ?? "unknown locale"} at ${event.pathname}${event.routeId ? ` (${event.routeId})` : ""}`;
  }
};

export const I18nDevTools = ({
  diagnostics,
  title = "i18n diagnostics",
}: I18nDevToolsProps) => {
  const events = useSyncExternalStore(
    diagnostics.subscribe,
    diagnostics.getSnapshot,
    diagnostics.getSnapshot,
  );

  return (
    <details>
      <summary>
        {title} ({events.length})
      </summary>
      <button type="button" onClick={diagnostics.clear}>
        Clear
      </button>
      <ol aria-label="Internationalization diagnostic events">
        {events.map((event) => (
          <li key={event.id}>
            <time dateTime={event.timestamp}>{event.timestamp}</time>{" "}
            {describeEvent(event)}
          </li>
        ))}
      </ol>
    </details>
  );
};
