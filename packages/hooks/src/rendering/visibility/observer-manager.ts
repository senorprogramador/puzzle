import type { FoldPriority } from "@puzzle-ui/core/rendering";
import type {
  ObservedVisibilityState,
  VisibilityMeasurement,
  VisibilityRect,
  VisibilityObserverOptions,
} from "./types";

export const DEFAULT_PROXIMITY_ROOT_MARGINS: Readonly<
  Record<FoldPriority, string>
> = Object.freeze({
  critical: "800px 0px",
  high: "600px 0px",
  normal: "400px 0px",
  low: "200px 0px",
});

type NormalizedObserverOptions = Readonly<{
  root: Element | Document | null;
  rootMargin: string;
  threshold: readonly number[];
}>;

type ObservationSignal = Readonly<{
  isIntersecting: boolean;
  time: number;
}>;

type ObserverListener = (entry: IntersectionObserverEntry) => void;

type ObserverPool = {
  observer: IntersectionObserver;
  targets: Map<Element, Set<ObserverListener>>;
};

export type VisibilityObserverSubscription = Readonly<{
  supported: boolean;
  unsubscribe: () => void;
}>;

const NOOP = () => {};

const normalizeThreshold = (
  threshold: number | readonly number[] | undefined,
): readonly number[] => {
  const values =
    threshold === undefined
      ? [0]
      : typeof threshold === "number"
        ? [threshold]
        : [...threshold];

  if (
    values.length === 0 ||
    values.some((value) => !Number.isFinite(value) || value < 0 || value > 1)
  ) {
    throw new RangeError("Visibility thresholds must be numbers from 0 to 1.");
  }

  return Object.freeze([...new Set(values)].sort((left, right) => left - right));
};

const normalizeRootMargin = (rootMargin: string) => {
  const normalized = rootMargin.trim().replace(/\s+/g, " ");
  const values = normalized.split(" ");
  const validLength = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:px|%)$/i;

  if (
    values.length > 4 ||
    values.some((value) => value !== "0" && !validLength.test(value))
  ) {
    throw new TypeError(
      "Visibility rootMargin must contain one to four CSS pixel or percentage lengths.",
    );
  }

  return normalized;
};

const toVisibilityRect = (
  rect: DOMRectReadOnly | null | undefined,
): VisibilityRect | undefined =>
  rect == null
    ? undefined
    : Object.freeze({
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

const createMeasurement = (
  channel: VisibilityMeasurement["channel"],
  entry: IntersectionObserverEntry,
  viewportRoot: boolean,
): VisibilityMeasurement | undefined => {
  const element = toVisibilityRect(entry.boundingClientRect);
  if (!element) return undefined;

  const root =
    toVisibilityRect(entry.rootBounds) ??
    (viewportRoot
      ? (() => {
          const view = entry.target.ownerDocument?.defaultView;
          return view
            ? Object.freeze({
                top: 0,
                right: view.innerWidth,
                bottom: view.innerHeight,
                left: 0,
                width: view.innerWidth,
                height: view.innerHeight,
              })
            : undefined;
        })()
      : undefined);
  return Object.freeze({
    channel,
    isIntersecting: entry.isIntersecting,
    intersectionRatio: entry.intersectionRatio,
    element,
    ...(root === undefined ? {} : { root }),
    time: entry.time,
  });
};

const sameRect = (left: VisibilityRect, right: VisibilityRect) =>
  left.top === right.top &&
  left.right === right.right &&
  left.bottom === right.bottom &&
  left.left === right.left &&
  left.width === right.width &&
  left.height === right.height;

const sameMeasurement = (
  left: VisibilityMeasurement | undefined,
  right: VisibilityMeasurement,
) =>
  left !== undefined &&
  left.channel === right.channel &&
  left.isIntersecting === right.isIntersecting &&
  left.intersectionRatio === right.intersectionRatio &&
  sameRect(left.element, right.element) &&
  (left.root === undefined
    ? right.root === undefined
    : right.root !== undefined && sameRect(left.root, right.root));

export const normalizeVisibilityObserverOptions = (
  options: VisibilityObserverOptions = {},
): NormalizedObserverOptions => {
  const priority = options.priority ?? "normal";

  if (!Object.hasOwn(DEFAULT_PROXIMITY_ROOT_MARGINS, priority)) {
    throw new TypeError(`Unknown fold priority: ${String(priority)}.`);
  }

  const rootMargin = options.rootMargin ?? DEFAULT_PROXIMITY_ROOT_MARGINS[priority];

  if (typeof rootMargin !== "string" || rootMargin.trim().length === 0) {
    throw new TypeError("Visibility rootMargin must be a non-empty string.");
  }

  return Object.freeze({
    root: options.root ?? null,
    rootMargin: normalizeRootMargin(rootMargin),
    threshold: normalizeThreshold(options.threshold),
  });
};

export class VisibilityObserverManager {
  readonly #pools = new Map<string, ObserverPool>();
  readonly #rootIds = new WeakMap<object, number>();
  #nextRootId = 1;

  get observerCount() {
    return this.#pools.size;
  }

  observeVisibility(
    target: Element,
    options: VisibilityObserverOptions,
    onChange: (
      state: ObservedVisibilityState,
      measurement?: VisibilityMeasurement,
    ) => void,
  ): VisibilityObserverSubscription {
    const normalized = normalizeVisibilityObserverOptions(options);
    const Observer = globalThis.IntersectionObserver;

    if (typeof Observer !== "function") {
      return Object.freeze({ supported: false, unsubscribe: NOOP });
    }

    let visibleSignal: ObservationSignal | undefined;
    let nearbySignal: ObservationSignal | undefined;
    let lastState: ObservedVisibilityState = "unknown";
    let lastMeasurement: VisibilityMeasurement | undefined;
    let visibleMeasurement: VisibilityMeasurement | undefined;
    let nearbyMeasurement: VisibilityMeasurement | undefined;

    const publish = (measurementChanged = false) => {
      const state: ObservedVisibilityState = visibleSignal?.isIntersecting
        ? "visible"
        : nearbySignal?.isIntersecting
          ? "nearby"
          : visibleSignal && nearbySignal
            ? "outside"
            : "unknown";

      if (state === lastState && !measurementChanged) return;
      lastState = state;
      onChange(state, lastMeasurement);
    };

    const updateSignal = (
      channel: "visible" | "nearby",
      entry: IntersectionObserverEntry,
    ) => {
      const signal = { isIntersecting: entry.isIntersecting, time: entry.time };
      const previous =
        channel === "visible" ? visibleSignal : nearbySignal;

      if (previous && signal.time < previous.time) return;

      if (channel === "visible") visibleSignal = signal;
      else nearbySignal = signal;
      const measurement = createMeasurement(
        channel === "visible" || observersAreEquivalent
          ? "viewport"
          : "proximity",
        entry,
        normalized.root === null &&
          (channel === "visible" || observersAreEquivalent),
      );
      if (measurement !== undefined) {
        if (channel === "visible" || observersAreEquivalent) {
          visibleMeasurement = measurement;
        } else {
          nearbyMeasurement = measurement;
        }
      }

      let preferredMeasurement: VisibilityMeasurement | undefined;
      if (visibleSignal?.isIntersecting) {
        if (
          visibleMeasurement &&
          nearbyMeasurement &&
          nearbyMeasurement.time > visibleMeasurement.time
        ) {
          preferredMeasurement = Object.freeze({
            channel: "viewport",
            isIntersecting: nearbyMeasurement.isIntersecting,
            intersectionRatio: nearbyMeasurement.intersectionRatio,
            element: nearbyMeasurement.element,
            ...(visibleMeasurement.root === undefined
              ? {}
              : { root: visibleMeasurement.root }),
            time: nearbyMeasurement.time,
          });
        } else {
          preferredMeasurement = visibleMeasurement ?? nearbyMeasurement;
        }
      } else {
        preferredMeasurement = nearbySignal?.isIntersecting
          ? (nearbyMeasurement ?? visibleMeasurement)
          : (visibleMeasurement ?? nearbyMeasurement);
      }
      const measurementChanged =
        preferredMeasurement !== undefined &&
        !sameMeasurement(lastMeasurement, preferredMeasurement);
      if (measurementChanged) lastMeasurement = preferredMeasurement;
      publish(measurementChanged);
    };

    const visibleOptions: NormalizedObserverOptions = Object.freeze({
      ...normalized,
      rootMargin: "0px",
    });
    const nearbyOptions: NormalizedObserverOptions = Object.freeze({
      ...normalized,
      threshold: Object.freeze([0]),
    });
    const observersAreEquivalent =
      visibleOptions.root === nearbyOptions.root &&
      visibleOptions.rootMargin === nearbyOptions.rootMargin &&
      visibleOptions.threshold.join(",") === nearbyOptions.threshold.join(",");

    const unsubscribeVisible = this.#observe(
      Observer,
      target,
      visibleOptions,
      (entry) => updateSignal("visible", entry),
    );

    let unsubscribeNearby: () => void;
    try {
      unsubscribeNearby = this.#observe(
        Observer,
        target,
        nearbyOptions,
        (entry) => updateSignal("nearby", entry),
      );
    } catch (error) {
      unsubscribeVisible();
      throw error;
    }

    let active = true;
    return Object.freeze({
      supported: true,
      unsubscribe: () => {
        if (!active) return;
        active = false;
        unsubscribeVisible();
        unsubscribeNearby();
      },
    });
  }

  disconnect() {
    for (const pool of this.#pools.values()) {
      pool.observer.disconnect();
      pool.targets.clear();
    }
    this.#pools.clear();
  }

  #observe(
    Observer: typeof IntersectionObserver,
    target: Element,
    options: NormalizedObserverOptions,
    listener: ObserverListener,
  ) {
    const key = this.#getPoolKey(options);
    let pool = this.#pools.get(key);

    if (!pool) {
      let createdPool: ObserverPool;
      const observer = new Observer(
        (entries) => {
          for (const entry of entries) {
            const listeners = createdPool.targets.get(entry.target);
            if (!listeners) continue;
            for (const notify of [...listeners]) notify(entry);
          }
        },
        {
          root: options.root,
          rootMargin: options.rootMargin,
          threshold: [...options.threshold],
        },
      );
      createdPool = { observer, targets: new Map() };
      this.#pools.set(key, createdPool);
      pool = createdPool;
    }

    let listeners = pool.targets.get(target);
    if (!listeners) {
      listeners = new Set();
      pool.targets.set(target, listeners);
      try {
        pool.observer.observe(target);
      } catch (error) {
        pool.targets.delete(target);
        if (pool.targets.size === 0) {
          pool.observer.disconnect();
          this.#pools.delete(key);
        }
        throw error;
      }
    }

    listeners.add(listener);
    let active = true;

    return () => {
      if (!active) return;
      active = false;
      const currentListeners = pool.targets.get(target);
      if (!currentListeners) return;

      currentListeners.delete(listener);
      if (currentListeners.size > 0) return;

      pool.targets.delete(target);
      pool.observer.unobserve(target);
      if (pool.targets.size > 0) return;

      pool.observer.disconnect();
      this.#pools.delete(key);
    };
  }

  #getPoolKey(options: NormalizedObserverOptions) {
    const rootId =
      options.root === null
        ? 0
        : this.#getRootId(options.root);

    return `${rootId}|${options.rootMargin}|${options.threshold.join(",")}`;
  }

  #getRootId(root: Element | Document) {
    const existingId = this.#rootIds.get(root);
    if (existingId !== undefined) return existingId;

    const id = this.#nextRootId;
    this.#nextRootId += 1;
    this.#rootIds.set(root, id);
    return id;
  }
}
