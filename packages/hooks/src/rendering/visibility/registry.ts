import type { VisibilityObserverContract } from "@puzzle-ui/core/rendering";
import type {
  FoldActivationMode,
  FoldActivationTrigger,
  FoldStateSnapshot,
  ObservedVisibilityState,
  VisibilityMeasurement,
  VisibilityObserverOptions,
} from "./types";
import {
  VisibilityObserverManager,
} from "./observer-manager";
import {
  createFoldStateSnapshot,
  transitionVisibility,
  UNKNOWN_FOLD_STATE,
} from "./state-machine";

type BoundaryRegistrationOptions = VisibilityObserverOptions &
  Readonly<{
    parentId?: string;
    activationMode?: FoldActivationMode;
    activationTrigger?: FoldActivationTrigger;
    observe?: boolean;
    initiallyActivated?: boolean;
  }>;

type BoundaryRecord = {
  readonly id: string;
  readonly token: symbol;
  parentId: string | undefined;
  visibility: ObservedVisibilityState;
  isActivated: boolean;
  hasActivatedOnce: boolean;
  activationMode: FoldActivationMode;
  activationTrigger: FoldActivationTrigger;
  snapshot: FoldStateSnapshot;
  measurement: VisibilityMeasurement | undefined;
  unsubscribeObserver: () => void;
};

const NOOP = () => {};

const matchesActivationTrigger = (
  visibility: ObservedVisibilityState,
  trigger: FoldActivationTrigger,
) => {
  if (trigger === "visible") return visibility === "visible";
  if (trigger === "nearby") {
    return visibility === "nearby" || visibility === "visible";
  }
  return false;
};

export class VisibilityRegistry implements VisibilityObserverContract {
  readonly #observerManager: VisibilityObserverManager;
  readonly #boundaries = new Map<string, BoundaryRecord>();
  readonly #subscribers = new Map<string, Set<() => void>>();
  readonly #childrenByParent = new Map<string, Set<string>>();

  constructor(observerManager = new VisibilityObserverManager()) {
    this.#observerManager = observerManager;
  }

  get observerCount() {
    return this.#observerManager.observerCount;
  }

  register(
    id: string,
    target: Element,
    options: BoundaryRegistrationOptions = {},
  ) {
    if (id.length === 0) {
      throw new TypeError("Visibility boundary IDs must be non-empty strings.");
    }
    if (this.#boundaries.has(id)) {
      throw new Error(`Visibility boundary "${id}" is already registered.`);
    }

    const initiallyActivated = options.initiallyActivated ?? false;
    const record: BoundaryRecord = {
      id,
      token: Symbol(id),
      parentId: options.parentId,
      visibility: "unknown",
      isActivated: initiallyActivated,
      hasActivatedOnce: initiallyActivated,
      activationMode: options.activationMode ?? "one-shot",
      activationTrigger: options.activationTrigger ?? "manual",
      snapshot: createFoldStateSnapshot("unknown", initiallyActivated),
      measurement: undefined,
      unsubscribeObserver: NOOP,
    };

    this.#boundaries.set(id, record);
    this.#addChild(options.parentId, id);

    try {
      if (options.observe !== false) {
        const subscription = this.#observerManager.observeVisibility(
          target,
          options,
          (visibility, measurement) =>
            this.#updateVisibility(record, visibility, measurement),
        );
        record.unsubscribeObserver = subscription.unsubscribe;

        if (!subscription.supported) {
          this.#updateVisibility(record, "visible");
        }
      }
    } catch (error) {
      this.#removeRecord(record, false);
      throw error;
    }

    this.#notify(id);
    return () => {
      if (this.#boundaries.get(id)?.token !== record.token) return;
      this.#removeRecord(record, true);
    };
  }

  getSnapshot(id: string) {
    return this.#boundaries.get(id)?.snapshot ?? UNKNOWN_FOLD_STATE;
  }

  hasBoundary(id: string) {
    return this.#boundaries.has(id);
  }

  getServerSnapshot(_id: string) {
    return UNKNOWN_FOLD_STATE;
  }

  getParentId(id: string) {
    return this.#boundaries.get(id)?.parentId;
  }

  getChildren(id: string) {
    return Object.freeze([...(this.#childrenByParent.get(id) ?? [])]);
  }

  subscribe(id: string, onChange: () => void) {
    let subscribers = this.#subscribers.get(id);
    if (!subscribers) {
      subscribers = new Set();
      this.#subscribers.set(id, subscribers);
    }
    subscribers.add(onChange);
    let active = true;

    return () => {
      if (!active) return;
      active = false;
      const currentSubscribers = this.#subscribers.get(id);
      if (!currentSubscribers) return;
      currentSubscribers.delete(onChange);
      if (currentSubscribers.size === 0) this.#subscribers.delete(id);
    };
  }

  observe(id: string, onChange: (state: FoldStateSnapshot["state"]) => void) {
    const unsubscribe = this.subscribe(id, () =>
      onChange(this.getSnapshot(id).state),
    );
    onChange(this.getSnapshot(id).state);
    return unsubscribe;
  }

  unobserve(id: string) {
    const record = this.#boundaries.get(id);
    if (!record) return;
    record.unsubscribeObserver();
    record.unsubscribeObserver = NOOP;
  }

  disconnect() {
    for (const record of this.#boundaries.values()) {
      record.unsubscribeObserver();
      record.unsubscribeObserver = NOOP;
    }
    this.#observerManager.disconnect();
  }

  activate(id: string) {
    const record = this.#boundaries.get(id);
    if (!record || record.isActivated) return false;
    if (
      record.activationMode === "one-shot" &&
      record.hasActivatedOnce
    ) {
      return false;
    }

    record.isActivated = true;
    record.hasActivatedOnce = true;
    this.#publish(record);
    return true;
  }

  deactivate(id: string) {
    const record = this.#boundaries.get(id);
    if (
      !record ||
      !record.isActivated ||
      record.activationMode === "one-shot"
    ) {
      return false;
    }

    record.isActivated = false;
    this.#publish(record);
    return true;
  }

  disposeAll() {
    for (const record of [...this.#boundaries.values()]) {
      this.#removeRecord(record, false);
    }
    this.#subscribers.clear();
    this.#childrenByParent.clear();
    this.#observerManager.disconnect();
  }

  #updateVisibility(
    record: BoundaryRecord,
    visibility: ObservedVisibilityState,
    measurement?: VisibilityMeasurement,
  ) {
    if (this.#boundaries.get(record.id)?.token !== record.token) return;

    const nextVisibility = transitionVisibility(record.visibility, visibility);
    const visibilityChanged = nextVisibility !== record.visibility;
    const measurementChanged =
      measurement !== undefined &&
      measurement.time >= (record.measurement?.time ?? Number.NEGATIVE_INFINITY) &&
      measurement !== record.measurement;
    if (!visibilityChanged && !measurementChanged) return;
    if (visibilityChanged) record.visibility = nextVisibility;
    if (measurementChanged) record.measurement = measurement;

    const triggerMatches = matchesActivationTrigger(
      nextVisibility,
      record.activationTrigger,
    );

    if (record.activationMode === "one-shot") {
      if (triggerMatches && !record.hasActivatedOnce) {
        record.isActivated = true;
        record.hasActivatedOnce = true;
      }
    } else {
      record.isActivated = triggerMatches;
      if (triggerMatches) record.hasActivatedOnce = true;
    }

    this.#publish(record);
  }

  #publish(record: BoundaryRecord) {
    const snapshot = createFoldStateSnapshot(
      record.visibility,
      record.isActivated,
      record.measurement,
    );
    if (
      snapshot.state === record.snapshot.state &&
      snapshot.visibility === record.snapshot.visibility &&
      snapshot.isActivated === record.snapshot.isActivated &&
      snapshot.measurement === record.snapshot.measurement
    ) {
      return;
    }

    record.snapshot = snapshot;
    this.#notify(record.id);
  }

  #notify(id: string) {
    for (const subscriber of [...(this.#subscribers.get(id) ?? [])]) {
      subscriber();
    }
  }

  #addChild(parentId: string | undefined, id: string) {
    if (parentId === undefined) return;
    let children = this.#childrenByParent.get(parentId);
    if (!children) {
      children = new Set();
      this.#childrenByParent.set(parentId, children);
    }
    children.add(id);
  }

  #removeRecord(record: BoundaryRecord, notify: boolean) {
    if (this.#boundaries.get(record.id)?.token !== record.token) return;

    record.unsubscribeObserver();
    this.#boundaries.delete(record.id);

    if (record.parentId !== undefined) {
      const siblings = this.#childrenByParent.get(record.parentId);
      siblings?.delete(record.id);
      if (siblings?.size === 0) {
        this.#childrenByParent.delete(record.parentId);
      }
    }

    const children = this.#childrenByParent.get(record.id);
    if (children) {
      for (const childId of children) {
        const child = this.#boundaries.get(childId);
        if (child?.parentId === record.id) child.parentId = undefined;
      }
      this.#childrenByParent.delete(record.id);
    }

    if (notify) this.#notify(record.id);
  }
}

export const visibilityRegistry = new VisibilityRegistry();
