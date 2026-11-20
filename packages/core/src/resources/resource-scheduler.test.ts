import { describe, expect, it, vi } from "vitest";
import {
  ResourceRetryLimitError,
  ResourceScheduler,
  ResourceSchedulerLimitError,
} from "./resource-scheduler";
import type {
  IdentifiedResourceDescriptor,
  ResourceLoader,
} from "./types";
import type { ResourcePriority } from "./priority";

const resource = (
  id: string,
  priority: ResourcePriority = "normal",
  cachePolicy?: "reuse" | "no-store",
): IdentifiedResourceDescriptor => ({
  id,
  type: "data",
  priority,
  ...(cachePolicy === undefined ? {} : { cachePolicy }),
});

const flushMicrotasks = async () => {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
  }
};

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("ResourceScheduler", () => {
  it("runs queued work by priority without interrupting active resources", async () => {
    const scheduler = new ResourceScheduler({ maxConcurrent: 1 });
    const starts: string[] = [];
    const releases = new Map<string, () => void>();
    const loader = (id: string): ResourceLoader<string> => () =>
      new Promise((resolve) => {
        starts.push(id);
        releases.set(id, () => resolve(id));
      });
    const active = scheduler.register({
      resource: resource("active", "low"),
      load: loader("active"),
    });
    const activeRequest = active.schedule();
    await flushMicrotasks();

    const low = scheduler.register({
      resource: resource("low", "low"),
      load: loader("low"),
    });
    const normal = scheduler.register({
      resource: resource("normal", "normal"),
      load: loader("normal"),
    });
    const high = scheduler.register({
      resource: resource("high", "high"),
      load: loader("high"),
    });
    const lowRequest = low.schedule();
    const normalRequest = normal.schedule();
    const highRequest = high.schedule();

    expect(starts).toEqual(["active"]);
    expect(scheduler.getSnapshot("active")?.state).toBe("loading");

    releases.get("active")?.();
    await activeRequest.promise;
    await flushMicrotasks();
    expect(starts).toEqual(["active", "high"]);

    releases.get("high")?.();
    await highRequest.promise;
    await flushMicrotasks();
    expect(starts).toEqual(["active", "high", "normal"]);

    releases.get("normal")?.();
    await normalRequest.promise;
    await flushMicrotasks();
    expect(starts).toEqual(["active", "high", "normal", "low"]);

    releases.get("low")?.();
    await lowRequest.promise;
    scheduler.dispose();
  });

  it("reserves concurrency for demand loads and promotes queued prefetches", async () => {
    const scheduler = new ResourceScheduler({
      maxConcurrent: 2,
      maxConcurrentPrefetch: 1,
      maxPrefetchResources: 2,
    });
    const starts: string[] = [];
    const releases = new Map<string, () => void>();
    const loader = (id: string): ResourceLoader<string> => () =>
      new Promise((resolve) => {
        starts.push(id);
        releases.set(id, () => resolve(id));
      });
    const background = scheduler.register({
      resource: resource("background", "low"),
      load: loader("background"),
    });
    const queued = scheduler.register({
      resource: resource("queued-prefetch", "normal"),
      load: loader("queued-prefetch"),
    });
    const critical = scheduler.register({
      resource: resource("critical", "critical"),
      load: loader("critical"),
    });

    const backgroundRequest = background.prefetch();
    const queuedRequest = queued.prefetch();
    await flushMicrotasks();
    expect(starts).toEqual(["background"]);

    const criticalRequest = critical.schedule();
    await flushMicrotasks();
    expect(starts).toEqual(["background", "critical"]);

    const promotedRequest = queued.schedule();
    releases.get("background")?.();
    await backgroundRequest.promise;
    await flushMicrotasks();
    expect(starts).toEqual(["background", "critical", "queued-prefetch"]);

    releases.get("critical")?.();
    releases.get("queued-prefetch")?.();
    await Promise.all([
      criticalRequest.promise,
      queuedRequest.promise,
      promotedRequest.promise,
    ]);
    scheduler.dispose();
  });

  it("deduplicates in-flight work and reuses loaded values", async () => {
    const scheduler = new ResourceScheduler();
    const deferred = createDeferred<string>();
    const load = vi.fn(() => deferred.promise);
    const first = scheduler.register({
      resource: resource("shared-module"),
      load,
    });
    const second = scheduler.register({
      resource: resource("shared-module"),
      load,
    });

    const requestA = first.schedule();
    const requestB = second.prefetch();
    await flushMicrotasks();
    expect(load).toHaveBeenCalledTimes(1);

    deferred.resolve("module");
    await expect(requestA.promise).resolves.toBe("module");
    await expect(requestB.promise).resolves.toBe("module");

    const reused = second.schedule();
    await expect(reused.promise).resolves.toBe("module");
    expect(load).toHaveBeenCalledTimes(1);
    expect(first.getSnapshot()).toMatchObject({
      state: "loaded",
      value: "module",
      attempts: 1,
    });
    scheduler.dispose();
  });

  it("supports immediate loading at registration when requested", async () => {
    const scheduler = new ResourceScheduler();
    const load = vi.fn(async () => "ready");
    const registration = scheduler.register({
      resource: {
        ...resource("immediate"),
        loadingStrategy: "immediate",
      },
      load,
    });

    expect(registration.getSnapshot().state).toBe("loading");
    await flushMicrotasks();
    expect(registration.getSnapshot().state).toBe("loaded");
    expect(load).toHaveBeenCalledOnce();
    scheduler.dispose();
  });

  it("enforces concurrency limits", async () => {
    const scheduler = new ResourceScheduler({ maxConcurrent: 2 });
    const starts: string[] = [];
    const releases = new Map<string, () => void>();
    const registerTask = (id: string) =>
      scheduler.register({
        resource: resource(id),
        load: () =>
          new Promise<string>((resolve) => {
            starts.push(id);
            releases.set(id, () => resolve(id));
          }),
      });
    const first = registerTask("first").schedule();
    const second = registerTask("second").schedule();
    const third = registerTask("third").schedule();
    await flushMicrotasks();

    expect(starts).toEqual(["first", "second"]);
    expect(scheduler.getSnapshot("third")?.state).toBe("queued");

    releases.get("first")?.();
    await first.promise;
    await flushMicrotasks();
    expect(starts).toEqual(["first", "second", "third"]);

    releases.get("second")?.();
    releases.get("third")?.();
    await Promise.all([second.promise, third.promise]);
    scheduler.dispose();
  });

  it("cancels a request without aborting other consumers of the same resource", async () => {
    const scheduler = new ResourceScheduler();
    const deferred = createDeferred<string>();
    let signal: AbortSignal | undefined;
    const registration = scheduler.register({
      resource: resource("shared"),
      load: (loadSignal) => {
        signal = loadSignal;
        return deferred.promise;
      },
    });
    const first = registration.schedule();
    const second = registration.schedule();
    await flushMicrotasks();

    first.cancel();
    await expect(first.promise).rejects.toMatchObject({ name: "AbortError" });
    expect(signal?.aborted).toBe(false);

    second.cancel();
    await expect(second.promise).rejects.toMatchObject({ name: "AbortError" });
    expect(signal?.aborted).toBe(true);
    expect(registration.getSnapshot().state).toBe("cancelled");
    scheduler.dispose();
  });

  it("removes cancelled queued work before it can load", async () => {
    const scheduler = new ResourceScheduler({ maxConcurrent: 1 });
    const activeDeferred = createDeferred<void>();
    const queuedLoad = vi.fn();
    const active = scheduler.register({
      resource: resource("active"),
      load: () => activeDeferred.promise,
    });
    const queued = scheduler.register({
      resource: resource("queued"),
      load: queuedLoad,
    });
    const activeRequest = active.schedule();
    await flushMicrotasks();
    const queuedRequest = queued.schedule();
    queuedRequest.cancel();
    await expect(queuedRequest.promise).rejects.toMatchObject({
      name: "AbortError",
    });
    expect(queued.getSnapshot().state).toBe("cancelled");

    activeDeferred.resolve();
    await activeRequest.promise;
    await flushMicrotasks();
    expect(queuedLoad).not.toHaveBeenCalled();
    scheduler.dispose();
  });

  it("exposes failures and supports bounded manual retries", async () => {
    const failure = new Error("network failed");
    const load = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce("recovered");
    const scheduler = new ResourceScheduler({ maxRetries: 1 });
    const registration = scheduler.register({
      resource: resource("retryable"),
      load,
    });

    await expect(registration.schedule().promise).rejects.toBe(failure);
    expect(registration.getSnapshot()).toMatchObject({
      state: "failed",
      error: failure,
      attempts: 1,
    });
    await expect(registration.retry().promise).resolves.toBe("recovered");
    expect(registration.getSnapshot()).toMatchObject({
      state: "loaded",
      attempts: 2,
    });
    expect(load).toHaveBeenCalledTimes(2);
    scheduler.dispose();
  });

  it("reports retry exhaustion", async () => {
    const load = vi.fn<() => Promise<void>>().mockRejectedValue(new Error("no"));
    const scheduler = new ResourceScheduler({ maxRetries: 0 });
    const registration = scheduler.register({
      resource: resource("no-retry"),
      load,
    });

    await expect(registration.schedule().promise).rejects.toThrow("no");
    await expect(registration.retry().promise).rejects.toBeInstanceOf(
      ResourceRetryLimitError,
    );
    expect(load).toHaveBeenCalledTimes(1);
    scheduler.dispose();
  });

  it("enforces queue, per-priority, and prefetch budgets", async () => {
    const blocker = createDeferred<void>();
    const scheduler = new ResourceScheduler({
      maxConcurrent: 1,
      maxQueuedResources: 1,
      maxQueuedByPriority: { low: 0 },
      maxPrefetchResources: 1,
    });
    const active = scheduler.register({
      resource: resource("active", "critical"),
      load: () => blocker.promise,
    });
    const activeRequest = active.schedule();
    await flushMicrotasks();

    const low = scheduler.register({
      resource: resource("low", "low"),
      load: vi.fn(),
    });
    await expect(low.schedule().promise).rejects.toBeInstanceOf(
      ResourceSchedulerLimitError,
    );

    const queued = scheduler.register({
      resource: resource("queued", "normal"),
      load: vi.fn(),
    });
    const queuedRequest = queued.prefetch();
    await expect(
      scheduler
        .register({
          resource: resource("over-budget"),
          load: vi.fn(),
        })
        .prefetch().promise,
    ).rejects.toBeInstanceOf(ResourceSchedulerLimitError);
    queuedRequest.cancel();
    await expect(queuedRequest.promise).rejects.toMatchObject({
      name: "AbortError",
    });
    const replacement = scheduler.register({
      resource: resource("replacement"),
      load: vi.fn(),
    });
    const replacementRequest = replacement.prefetch();
    expect(replacement.getSnapshot().state).toBe("queued");
    replacementRequest.cancel();
    await expect(replacementRequest.promise).rejects.toMatchObject({
      name: "AbortError",
    });
    blocker.resolve();
    await activeRequest.promise;
    scheduler.dispose();
  });

  it("freezes descriptor metadata and reports preparation stages", async () => {
    const scheduler = new ResourceScheduler();
    const descriptor = {
      ...resource("module"),
      type: "component-chunk",
      metadata: { chunk: "dashboard" },
    } as const;
    const registration = scheduler.register({
      resource: descriptor,
      load: (_signal, reportStage) => {
        reportStage("prepare");
        return "ready";
      },
    });

    expect(Object.isFrozen(registration.getSnapshot().resource)).toBe(true);
    expect(Object.isFrozen(registration.getSnapshot().resource.metadata)).toBe(
      true,
    );
    const observedStages: string[] = [];
    const unsubscribe = registration.subscribe((snapshot) => {
      if (snapshot.stage) observedStages.push(snapshot.stage);
    });
    const request = registration.schedule();
    await flushMicrotasks();
    expect(observedStages).toContain("prepare");
    await expect(request.promise).resolves.toBe("ready");
    unsubscribe();
    scheduler.dispose();
  });

  it("reloads completed resources configured with no-store caching", async () => {
    const scheduler = new ResourceScheduler();
    const load = vi.fn(async () => load.mock.calls.length);
    const registration = scheduler.register({
      resource: resource("uncached", "normal", "no-store"),
      load,
    });

    await expect(registration.schedule().promise).resolves.toBe(1);
    await expect(registration.schedule().promise).resolves.toBe(2);
    expect(load).toHaveBeenCalledTimes(2);
    scheduler.dispose();
  });

  it("aborts active work when disposed", async () => {
    const scheduler = new ResourceScheduler();
    const deferred = createDeferred<void>();
    let signal: AbortSignal | undefined;
    const registration = scheduler.register({
      resource: resource("active"),
      load: (loadSignal) => {
        signal = loadSignal;
        return deferred.promise;
      },
    });
    const request = registration.schedule();
    await flushMicrotasks();

    scheduler.dispose();
    await expect(request.promise).rejects.toMatchObject({ name: "AbortError" });
    expect(signal?.aborted).toBe(true);
  });
});
