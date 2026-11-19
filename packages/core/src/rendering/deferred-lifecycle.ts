import type {
  DeferredLifecycleEvent,
  DeferredLifecycleState,
} from "./types";

type DeferredLifecycleEventType = DeferredLifecycleEvent["type"];

const ALLOWED_TRANSITIONS: Readonly<
  Record<
    DeferredLifecycleState,
    Partial<Record<DeferredLifecycleEventType, DeferredLifecycleState>>
  >
> = Object.freeze({
  idle: Object.freeze({ schedule: "scheduled", cancel: "cancelled" }),
  scheduled: Object.freeze({ start: "loading", cancel: "cancelled" }),
  loading: Object.freeze({
    resolve: "ready",
    fail: "failed",
    cancel: "cancelled",
  }),
  ready: Object.freeze({
    mount: "mounted",
    fail: "failed",
    cancel: "cancelled",
  }),
  mounted: Object.freeze({ reset: "idle" }),
  failed: Object.freeze({ retry: "scheduled", reset: "idle" }),
  cancelled: Object.freeze({ retry: "scheduled", reset: "idle" }),
});

export const transitionDeferredLifecycle = (
  state: DeferredLifecycleState,
  event: DeferredLifecycleEvent,
): DeferredLifecycleState =>
  ALLOWED_TRANSITIONS[state][event.type] ?? state;
