import type { ResourcePriority } from "./priority";

export type ResourceId = string;

export type ResourceType =
  | "module"
  | "component-chunk"
  | "data"
  | "image"
  | "script"
  | "stylesheet"
  | "font"
  | "custom"
  | (string & {});

export type ResourceLoadingStrategy = "immediate" | "scheduled" | "on-demand";

export type ResourcePrefetchStrategy =
  | "none"
  | "proximity"
  | "visibility"
  | "idle"
  | "explicit";

export type ResourceCachePolicy = "reuse" | "no-store";

export type ResourceState =
  | "registered"
  | "queued"
  | "loading"
  | "loaded"
  | "failed"
  | "cancelled";

export type ResourceLoadStage = "download" | "prepare";

export type ResourceDescriptor<TType extends string = ResourceType> =
  Readonly<{
    id?: ResourceId;
    type: TType;
    priority: ResourcePriority;
    url?: string;
    cacheKey?: string;
    cachePolicy?: ResourceCachePolicy;
    loadingStrategy?: ResourceLoadingStrategy;
    prefetchStrategy?: ResourcePrefetchStrategy;
    metadata?: Readonly<Record<string, unknown>>;
  }>;

export type IdentifiedResourceDescriptor<
  TType extends string = ResourceType,
> = ResourceDescriptor<TType> & Readonly<{ id: ResourceId }>;

export type ResourceLoadReporter = (stage: ResourceLoadStage) => void;

export type ResourceLoader<T> = (
  signal: AbortSignal,
  reportStage: ResourceLoadReporter,
) => T | Promise<T>;

export type ResourceRegistrationDefinition<T> = Readonly<{
  resource: IdentifiedResourceDescriptor;
  load: ResourceLoader<T>;
}>;

export type ResourceSnapshot<T = unknown> = Readonly<{
  id: ResourceId;
  resource: IdentifiedResourceDescriptor;
  state: ResourceState;
  priority: ResourcePriority;
  attempts: number;
  stage?: ResourceLoadStage;
  value?: T;
  error?: unknown;
}>;

export type ResourceScheduleHandle = string | number;

export type ResourceRequest<T> = Readonly<{
  handle: ResourceScheduleHandle;
  promise: Promise<T>;
  cancel: () => void;
}>;

export type ResourceRegistration<T> = Readonly<{
  id: ResourceId;
  schedule: () => ResourceRequest<T>;
  prefetch: () => ResourceRequest<T>;
  retry: () => ResourceRequest<T>;
  getSnapshot: () => ResourceSnapshot<T>;
  subscribe: (
    listener: (snapshot: ResourceSnapshot<T>) => void,
  ) => () => void;
  unregister: () => void;
}>;

export type ResourceSchedulerOptions = Readonly<{
  maxConcurrent?: number;
  maxConcurrentPrefetch?: number;
  maxQueuedResources?: number;
  maxQueuedByPriority?: Partial<Record<ResourcePriority, number>>;
  maxPrefetchResources?: number;
  maxRetries?: number;
  maxCachedResources?: number;
}>;

export interface ResourceSchedulerEngine {
  register<T>(
    definition: ResourceRegistrationDefinition<T>,
  ): ResourceRegistration<T>;
  schedule(task: ScheduledResourceTask): ResourceScheduleHandle;
  cancel(handle: ResourceScheduleHandle): void;
  getSnapshot(id: ResourceId): ResourceSnapshot | undefined;
  dispose(): void;
}

export type ScheduledResourceTask = Readonly<{
  resource: ResourceDescriptor;
  load: (signal: AbortSignal) => void | Promise<void>;
}>;

export type ResourceSchedulerContract = Readonly<{
  schedule: (task: ScheduledResourceTask) => ResourceScheduleHandle;
  cancel: (handle: ResourceScheduleHandle) => void;
  register?: <T>(
    definition: ResourceRegistrationDefinition<T>,
  ) => ResourceRegistration<T>;
  dispose?: () => void;
}>;
