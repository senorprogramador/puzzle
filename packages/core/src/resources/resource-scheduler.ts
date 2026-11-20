import {
  compareResourcePriority,
  getResourcePriorityRank,
  RESOURCE_PRIORITY_ORDER,
} from "./priority";
import type {
  IdentifiedResourceDescriptor,
  ResourceDescriptor,
  ResourceLoadReporter,
  ResourceLoader,
  ResourceRegistration,
  ResourceRegistrationDefinition,
  ResourceRequest,
  ResourceScheduleHandle,
  ResourceSchedulerOptions,
  ResourceSchedulerEngine,
  ResourceSnapshot,
  ResourceState,
  ScheduledResourceTask,
} from "./types";

type RequestMode = "load" | "prefetch";

type Subscriber = Readonly<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}>;

type ResourceEntry = {
  resource: IdentifiedResourceDescriptor;
  load: ResourceLoader<unknown> | undefined;
  state: ResourceState;
  value: unknown;
  hasValue: boolean;
  error: unknown;
  stage: "download" | "prepare" | undefined;
  attempts: number;
  retries: number;
  registrations: number;
  queueOrder: number;
  lastUsed: number;
  controller: AbortController | undefined;
  mode: RequestMode | undefined;
  readonly subscribers: Map<ResourceScheduleHandle, Subscriber>;
  readonly listeners: Set<(snapshot: ResourceSnapshot) => void>;
};

type LegacyRequest = Readonly<{
  request: ResourceRequest<void>;
  unregister: () => void;
}>;

const DEFAULT_OPTIONS = Object.freeze({
  maxConcurrent: 4,
  maxQueuedResources: 100,
  maxQueuedByPriority: Object.freeze({
    critical: 100,
    high: 75,
    normal: 50,
    low: 25,
  }),
  maxPrefetchResources: 20,
  maxRetries: 1,
  maxCachedResources: 100,
});

const VALID_PRIORITIES = new Set<string>(RESOURCE_PRIORITY_ORDER);

const createAbortError = (message: string) => {
  const error = new Error(message);
  error.name = "AbortError";
  return error;
};

export class ResourceSchedulerLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceSchedulerLimitError";
  }
}

export class ResourceRetryLimitError extends Error {
  constructor(resourceId: string) {
    super(`The retry limit for resource "${resourceId}" has been reached.`);
    this.name = "ResourceRetryLimitError";
  }
}

const assertNonNegativeInteger = (name: string, value: number) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer.`);
  }
};

const freezeResource = (
  resource: IdentifiedResourceDescriptor,
): IdentifiedResourceDescriptor =>
  Object.freeze({
    ...resource,
    ...(resource.metadata === undefined
      ? {}
      : { metadata: Object.freeze({ ...resource.metadata }) }),
  });

const sameResource = (
  left: IdentifiedResourceDescriptor,
  right: IdentifiedResourceDescriptor,
) =>
  left.type === right.type &&
  left.url === right.url &&
  left.cacheKey === right.cacheKey &&
  left.priority === right.priority &&
  left.cachePolicy === right.cachePolicy &&
  left.loadingStrategy === right.loadingStrategy;

export class ResourceScheduler implements ResourceSchedulerEngine {
  private readonly options: Required<ResourceSchedulerOptions>;
  private readonly entries = new Map<string, ResourceEntry>();
  private readonly queue: ResourceEntry[] = [];
  private readonly handles = new Map<ResourceScheduleHandle, ResourceEntry>();
  private readonly legacyRequests = new Map<ResourceScheduleHandle, LegacyRequest>();
  private readonly prefetchedResources = new Set<string>();
  private nextHandle = 0;
  private nextQueueOrder = 0;
  private activeCount = 0;
  private activePrefetchCount = 0;
  private disposed = false;

  constructor(options: ResourceSchedulerOptions = {}) {
    const maxConcurrent =
      options.maxConcurrent ?? DEFAULT_OPTIONS.maxConcurrent;
    const priorityLimits = Object.freeze({
      ...DEFAULT_OPTIONS.maxQueuedByPriority,
      ...options.maxQueuedByPriority,
    });

    for (const [priority, limit] of Object.entries(priorityLimits)) {
      if (!VALID_PRIORITIES.has(priority)) {
        throw new TypeError(`Unsupported resource priority: ${priority}.`);
      }
      if (limit !== undefined) {
        assertNonNegativeInteger(`maxQueuedByPriority.${priority}`, limit);
      }
    }

    this.options = {
      maxConcurrent,
      maxConcurrentPrefetch:
        options.maxConcurrentPrefetch ?? Math.max(1, maxConcurrent - 1),
      maxQueuedResources:
        options.maxQueuedResources ?? DEFAULT_OPTIONS.maxQueuedResources,
      maxQueuedByPriority: priorityLimits,
      maxPrefetchResources:
        options.maxPrefetchResources ?? DEFAULT_OPTIONS.maxPrefetchResources,
      maxRetries: options.maxRetries ?? DEFAULT_OPTIONS.maxRetries,
      maxCachedResources:
        options.maxCachedResources ?? DEFAULT_OPTIONS.maxCachedResources,
    };

    if (
      !Number.isInteger(this.options.maxConcurrent) ||
      this.options.maxConcurrent < 1
    ) {
      throw new RangeError("maxConcurrent must be a positive integer.");
    }

    if (
      !Number.isInteger(this.options.maxConcurrentPrefetch) ||
      this.options.maxConcurrentPrefetch < 1 ||
      this.options.maxConcurrentPrefetch > this.options.maxConcurrent
    ) {
      throw new RangeError(
        "maxConcurrentPrefetch must be a positive integer no greater than maxConcurrent.",
      );
    }

    assertNonNegativeInteger(
      "maxQueuedResources",
      this.options.maxQueuedResources,
    );
    assertNonNegativeInteger(
      "maxPrefetchResources",
      this.options.maxPrefetchResources,
    );
    assertNonNegativeInteger("maxRetries", this.options.maxRetries);
    assertNonNegativeInteger(
      "maxCachedResources",
      this.options.maxCachedResources,
    );
  }

  register<T>(
    definition: ResourceRegistrationDefinition<T>,
  ): ResourceRegistration<T> {
    if (this.disposed) {
      throw new Error("Cannot register a resource on a disposed scheduler.");
    }

    if (
      typeof definition.resource.id !== "string" ||
      definition.resource.id.length === 0
    ) {
      throw new TypeError("A registered resource must have a non-empty ID.");
    }
    if (
      typeof definition.resource.type !== "string" ||
      definition.resource.type.length === 0
    ) {
      throw new TypeError("A resource type must be a non-empty string.");
    }
    getResourcePriorityRank(definition.resource.priority);

    const resource = freezeResource(definition.resource);
    let entry = this.entries.get(resource.id);

    if (entry && !sameResource(entry.resource, resource)) {
      throw new TypeError(
        `Resource ID "${resource.id}" is already registered for a different resource.`,
      );
    }

    if (
      entry?.load &&
      entry.load !== definition.load &&
      (entry.state === "registered" ||
        entry.state === "queued" ||
        entry.state === "loading")
    ) {
      throw new TypeError(
        `Resource ID "${resource.id}" is already registered with a different loader.`,
      );
    }

    if (!entry) {
      entry = {
        resource,
        load: definition.load as ResourceLoader<unknown>,
        state: "registered",
        value: undefined,
        hasValue: false,
        error: undefined,
        stage: undefined,
        attempts: 0,
        retries: 0,
        registrations: 0,
        queueOrder: 0,
        lastUsed: Date.now(),
        controller: undefined,
        mode: undefined,
        subscribers: new Map(),
        listeners: new Set(),
      };
      this.entries.set(resource.id, entry);
    } else if (entry.state !== "loaded" || !entry.hasValue) {
      entry.load = definition.load as ResourceLoader<unknown>;
    }

    entry.registrations += 1;
    entry.lastUsed = Date.now();
    const registeredEntry = entry;
    const registrationListeners = new Set<
      (snapshot: ResourceSnapshot<T>) => void
    >();
    const wrappedListeners = new Map<
      (snapshot: ResourceSnapshot<T>) => void,
      (snapshot: ResourceSnapshot) => void
    >();
    let registered = true;

    const subscribe = (
      listener: (snapshot: ResourceSnapshot<T>) => void,
    ) => {
      if (!registered) return () => undefined;
      registrationListeners.add(listener);
      const wrapped = (snapshot: ResourceSnapshot) => {
        listener(snapshot as ResourceSnapshot<T>);
      };
      wrappedListeners.set(listener, wrapped);
      registeredEntry.listeners.add(wrapped);
      return () => {
        registrationListeners.delete(listener);
        const registeredListener = wrappedListeners.get(listener);
        if (registeredListener) {
          registeredEntry.listeners.delete(registeredListener);
          wrappedListeners.delete(listener);
        }
      };
    };

    const createRequest = (mode: RequestMode) =>
      this.createRequest<T>(registeredEntry, mode);

    const registration: ResourceRegistration<T> = Object.freeze({
      id: resource.id,
      schedule: () => createRequest("load"),
      prefetch: () => createRequest("prefetch"),
      retry: () => this.retryEntry<T>(registeredEntry),
      getSnapshot: () =>
        this.createSnapshot(registeredEntry) as ResourceSnapshot<T>,
      subscribe,
      unregister: () => {
        if (!registered) return;
        registered = false;
        for (const listener of registrationListeners) {
          const wrapped = wrappedListeners.get(listener);
          if (wrapped) registeredEntry.listeners.delete(wrapped);
        }
        registrationListeners.clear();
        wrappedListeners.clear();
        registeredEntry.registrations -= 1;

        if (registeredEntry.registrations > 0) return;

        if (
          registeredEntry.state === "queued" ||
          registeredEntry.state === "loading"
        ) {
          this.cancelEntry(
            registeredEntry,
            createAbortError(
              `Resource "${registeredEntry.resource.id}" has no remaining registrations.`,
            ),
          );
        }

        if (
          registeredEntry.state !== "loaded" ||
          !registeredEntry.hasValue
        ) {
          this.entries.delete(registeredEntry.resource.id);
        } else {
          registeredEntry.load = undefined;
          this.pruneCache();
        }
      },
    });

    if (resource.loadingStrategy === "immediate" && entry.state === "registered") {
      const request = createRequest("load");
      void request.promise.catch(() => undefined);
    }

    return registration;
  }

  schedule(task: ScheduledResourceTask): ResourceScheduleHandle {
    const id =
      task.resource.id ?? `legacy-resource-${this.nextHandle++}`;
    const resource: IdentifiedResourceDescriptor = {
      ...task.resource,
      id,
      cachePolicy: "no-store",
    };
    const registration = this.register({
      resource,
      load: (signal) => task.load(signal),
    });
    const request = registration.schedule();

    this.legacyRequests.set(request.handle, {
      request,
      unregister: registration.unregister,
    });
    void request.promise.then(
      () => this.releaseLegacyRequest(request.handle),
      () => this.releaseLegacyRequest(request.handle),
    );

    return request.handle;
  }

  cancel(handle: ResourceScheduleHandle): void {
    const legacy = this.legacyRequests.get(handle);
    if (legacy) {
      legacy.request.cancel();
      legacy.unregister();
      this.legacyRequests.delete(handle);
      return;
    }

    this.cancelRequest(handle);
  }

  getSnapshot(id: string): ResourceSnapshot | undefined {
    const entry = this.entries.get(id);
    return entry ? this.createSnapshot(entry) : undefined;
  }

  private retryEntry<T>(entry: ResourceEntry): ResourceRequest<T> {
    if (entry.state === "failed") {
      if (entry.retries >= this.options.maxRetries) {
        return this.rejectedRequest<T>(
          entry,
          new ResourceRetryLimitError(entry.resource.id),
        );
      }

      entry.retries += 1;
      entry.error = undefined;
      entry.stage = undefined;
      entry.state = "registered";
      this.notify(entry);
    }

    return this.createRequest<T>(entry, "load");
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    for (const entry of this.entries.values()) {
      if (entry.state === "queued" || entry.state === "loading") {
        this.cancelEntry(
          entry,
          createAbortError("The resource scheduler was disposed."),
        );
      }
      entry.listeners.clear();
    }

    this.queue.length = 0;
    this.entries.clear();
    this.handles.clear();
    this.legacyRequests.clear();
    this.prefetchedResources.clear();
  }

  private createRequest<T>(
    entry: ResourceEntry,
    mode: RequestMode,
  ): ResourceRequest<T> {
    if (this.disposed) {
      return this.rejectedRequest<T>(
        entry,
        new Error("Cannot schedule a resource on a disposed scheduler."),
      );
    }

    entry.lastUsed = Date.now();

    if (entry.state === "loaded" && entry.hasValue) {
      return this.resolvedRequest(entry.value as T);
    }

    if (entry.state === "loaded") {
      entry.state = "registered";
      entry.value = undefined;
      this.notify(entry);
    }

    if (entry.state === "failed") {
      return this.rejectedRequest<T>(entry, entry.error);
    }

    if (entry.state === "cancelled" || entry.state === "registered") {
      const limitError = this.checkQueueLimits(entry, mode);
      if (limitError) return this.rejectedRequest<T>(entry, limitError);
      this.enqueue(entry, mode);
    } else if (
      entry.state === "queued" &&
      mode === "load" &&
      entry.mode === "prefetch"
    ) {
      entry.mode = "load";
      this.prefetchedResources.delete(entry.resource.id);
      this.drain();
    }

    const handle = this.nextHandle++;
    let resolve!: (value: T) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });

    entry.subscribers.set(handle, {
      resolve: (value) => resolve(value as T),
      reject,
    });
    this.handles.set(handle, entry);

    return Object.freeze({
      handle,
      promise,
      cancel: () => this.cancelRequest(handle),
    });
  }

  private resolvedRequest<T>(
    value: T,
  ): ResourceRequest<T> {
    const handle = this.nextHandle++;
    return Object.freeze({
      handle,
      promise: Promise.resolve(value),
      cancel: () => undefined,
    });
  }

  private rejectedRequest<T>(
    _entry: ResourceEntry,
    error: unknown,
  ): ResourceRequest<T> {
    const handle = this.nextHandle++;
    return Object.freeze({
      handle,
      promise: Promise.reject(error),
      cancel: () => undefined,
    });
  }

  private enqueue(entry: ResourceEntry, mode: RequestMode): void {
    entry.state = "queued";
    entry.error = undefined;
    entry.stage = undefined;
    entry.mode = mode;
    entry.queueOrder = this.nextQueueOrder++;
    this.queue.push(entry);
    this.notify(entry);
    this.drain();
  }

  private checkQueueLimits(
    entry: ResourceEntry,
    mode: RequestMode,
  ): Error | undefined {
    if (
      this.activeCount >= this.options.maxConcurrent &&
      this.queue.length >= this.options.maxQueuedResources
    ) {
      return new ResourceSchedulerLimitError(
        "The resource queue is at capacity.",
      );
    }

    const priorityLimit =
      this.options.maxQueuedByPriority[entry.resource.priority];
    if (
      this.activeCount >= this.options.maxConcurrent &&
      priorityLimit !== undefined &&
      this.queue.filter(
        (queued) => queued.resource.priority === entry.resource.priority,
      ).length >= priorityLimit
    ) {
      return new ResourceSchedulerLimitError(
        `The ${entry.resource.priority} resource queue is at capacity.`,
      );
    }

    if (
      mode === "prefetch" &&
      !this.prefetchedResources.has(entry.resource.id)
    ) {
      if (
        this.prefetchedResources.size >= this.options.maxPrefetchResources
      ) {
        return new ResourceSchedulerLimitError(
          "The resource prefetch budget has been exhausted.",
        );
      }
      this.prefetchedResources.add(entry.resource.id);
    }

    return undefined;
  }

  private drain(): void {
    while (this.activeCount < this.options.maxConcurrent && this.queue.length) {
      this.queue.sort((left, right) => {
        const priority = compareResourcePriority(
          left.resource.priority,
          right.resource.priority,
        );
        return priority || left.queueOrder - right.queueOrder;
      });

      const nextIndex = this.queue.findIndex(
        (entry) =>
          entry.mode !== "prefetch" ||
          this.activePrefetchCount < this.options.maxConcurrentPrefetch,
      );
      if (nextIndex === -1) return;

      const [entry] = this.queue.splice(nextIndex, 1);
      if (!entry || entry.state !== "queued") continue;
      this.start(entry);
    }
  }

  private start(entry: ResourceEntry): void {
    const load = entry.load;
    if (!load) {
      this.failEntry(
        entry,
        new Error(`Resource "${entry.resource.id}" has no registered loader.`),
      );
      return;
    }

    const controller = new AbortController();
    entry.controller = controller;
    entry.state = "loading";
    entry.stage = "download";
    entry.attempts += 1;
    this.activeCount += 1;
    if (entry.mode === "prefetch") this.activePrefetchCount += 1;
    this.notify(entry);

    let rejectOnAbort!: (error: unknown) => void;
    const aborted = new Promise<never>((_, reject) => {
      rejectOnAbort = reject;
    });
    const onAbort = () =>
      rejectOnAbort(
        controller.signal.reason ??
          createAbortError(`Resource "${entry.resource.id}" was cancelled.`),
      );
    controller.signal.addEventListener("abort", onAbort, { once: true });

    const reportStage: ResourceLoadReporter = (stage) => {
      if (entry.state !== "loading" || entry.controller !== controller) return;
      entry.stage = stage;
      this.notify(entry);
    };
    const work = Promise.resolve().then(() => {
      if (controller.signal.aborted) {
        throw (
          controller.signal.reason ??
          createAbortError(`Resource "${entry.resource.id}" was cancelled.`)
        );
      }
      return load(controller.signal, reportStage);
    });

    void Promise.race([work, aborted])
      .then(
        (value) => {
          if (!controller.signal.aborted) this.finishEntry(entry, undefined, value);
        },
        (error: unknown) => {
          if (!controller.signal.aborted) this.failEntry(entry, error);
        },
      )
      .finally(() => {
        controller.signal.removeEventListener("abort", onAbort);
        if (entry.controller === controller) entry.controller = undefined;
        this.activeCount -= 1;
        if (entry.mode === "prefetch") this.activePrefetchCount -= 1;
        this.drain();
      });
  }

  private finishEntry(
    entry: ResourceEntry,
    error: unknown,
    value?: unknown,
  ): void {
    if (error !== undefined) {
      this.failEntry(entry, error);
      return;
    }

    entry.state = "loaded";
    entry.error = undefined;
    entry.stage = undefined;
    entry.hasValue = entry.resource.cachePolicy !== "no-store";
    entry.value = entry.hasValue ? value : undefined;
    entry.lastUsed = Date.now();
    this.notify(entry);

    for (const [handle, subscriber] of entry.subscribers) {
      this.handles.delete(handle);
      subscriber.resolve(value);
    }
    entry.subscribers.clear();
    this.pruneCache();
  }

  private failEntry(entry: ResourceEntry, error: unknown): void {
    if (entry.mode === "prefetch") {
      this.prefetchedResources.delete(entry.resource.id);
    }
    entry.state = "failed";
    entry.error = error;
    entry.stage = undefined;
    entry.controller = undefined;
    this.notify(entry);

    for (const [handle, subscriber] of entry.subscribers) {
      this.handles.delete(handle);
      subscriber.reject(error);
    }
    entry.subscribers.clear();
  }

  private cancelEntry(entry: ResourceEntry, error: unknown): void {
    if (entry.mode === "prefetch") {
      this.prefetchedResources.delete(entry.resource.id);
    }
    const queueIndex = this.queue.indexOf(entry);
    if (queueIndex !== -1) this.queue.splice(queueIndex, 1);
    entry.state = "cancelled";
    entry.error = error;
    entry.stage = undefined;

    for (const [handle, subscriber] of entry.subscribers) {
      this.handles.delete(handle);
      subscriber.reject(error);
    }
    entry.subscribers.clear();
    this.notify(entry);
    entry.controller?.abort(error);
    entry.controller = undefined;
  }

  private cancelRequest(handle: ResourceScheduleHandle): void {
    const entry = this.handles.get(handle);
    if (!entry) return;

    const subscriber = entry.subscribers.get(handle);
    if (!subscriber) return;
    entry.subscribers.delete(handle);
    this.handles.delete(handle);
    subscriber.reject(
      createAbortError(`Resource request "${String(handle)}" was cancelled.`),
    );

    if (
      entry.subscribers.size === 0 &&
      (entry.state === "queued" || entry.state === "loading")
    ) {
      this.cancelEntry(
        entry,
        createAbortError(`Resource "${entry.resource.id}" was cancelled.`),
      );
    }
  }

  private createSnapshot(entry: ResourceEntry): ResourceSnapshot {
    return Object.freeze({
      id: entry.resource.id,
      resource: entry.resource,
      state: entry.state,
      priority: entry.resource.priority,
      attempts: entry.attempts,
      ...(entry.stage === undefined ? {} : { stage: entry.stage }),
      ...(entry.hasValue ? { value: entry.value } : {}),
      ...(entry.error === undefined ? {} : { error: entry.error }),
    });
  }

  private notify(entry: ResourceEntry): void {
    const snapshot = this.createSnapshot(entry);
    for (const listener of entry.listeners) listener(snapshot);
  }

  private releaseLegacyRequest(handle: ResourceScheduleHandle): void {
    const request = this.legacyRequests.get(handle);
    if (!request) return;
    request.unregister();
    this.legacyRequests.delete(handle);
  }

  private pruneCache(): void {
    const cachedEntries = [...this.entries.values()]
      .filter(
        (entry) =>
          entry.registrations === 0 &&
          entry.state === "loaded" &&
          entry.hasValue,
      )
      .sort((left, right) => left.lastUsed - right.lastUsed);

    while (cachedEntries.length > this.options.maxCachedResources) {
      const entry = cachedEntries.shift();
      if (entry) this.entries.delete(entry.resource.id);
    }
  }
}

export const createResourceScheduler = (
  options?: ResourceSchedulerOptions,
): ResourceScheduler => new ResourceScheduler(options);
