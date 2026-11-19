import type { ResourcePriority } from "./priority";
import type {
  ResourceRegistration,
  ResourceRegistrationDefinition,
  ResourceScheduleHandle,
} from "../resources";

export type { ResourceScheduleHandle };

export type ResourceDescriptor =
  | Readonly<{
      type: "image";
      url: string;
      priority: ResourcePriority;
    }>
  | Readonly<{
      type: "script";
      url: string;
      priority: ResourcePriority;
      async?: boolean;
    }>
  | Readonly<{
      type: "stylesheet";
      url: string;
      priority: ResourcePriority;
      media?: string;
    }>
  | Readonly<{
      type: "font";
      url: string;
      priority: ResourcePriority;
      family?: string;
    }>;

export type ScheduledResourceTask = Readonly<{
  resource: ResourceDescriptor;
  load: () => void | Promise<void>;
}>;

export type ResourceSchedulerContract = Readonly<{
  schedule(task: ScheduledResourceTask): ResourceScheduleHandle;
  cancel(handle: ResourceScheduleHandle): void;
  register?<T>(
    definition: ResourceRegistrationDefinition<T>,
  ): ResourceRegistration<T>;
  dispose?: () => void;
}>;
