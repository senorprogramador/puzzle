import { performance } from "node:perf_hooks";

import { StorageRateLimitProvider } from "../packages/auth/dist/index.js";

import { MemoryStorage } from "../packages/auth/tests/fixtures/auth-harness.mjs";

const concurrencyLevels = [1, 10, 25, 50];

const round = (value) => Math.round(value * 100) / 100;

const percentile = (values, percentage) => {
  const sorted = [...values].sort((a, b) => a - b);

  const index = Math.min(
    sorted.length - 1,
    Math.ceil(sorted.length * percentage) - 1,
  );

  return sorted[index] ?? 0;
};

const benchmark = async (concurrency) => {
  const storage = new MemoryStorage();

  const provider = new StorageRateLimitProvider(storage, {
    maximumRetries: concurrency * 4 + 32,
  });

  await provider.initialize();

  const key = `benchmark:concurrency:${concurrency}`;

  const timings = [];

  const startedAt = performance.now();

  const results = await Promise.all(
    Array.from({ length: concurrency }, async () => {
      const requestStartedAt = performance.now();

      const result = await provider.consume({
        key,
        limit: concurrency,
        windowSeconds: 60,
      });

      timings.push(performance.now() - requestStartedAt);

      return result;
    }),
  );

  const durationMs = performance.now() - startedAt;

  const stored = await storage.findById("auth_rate_limits", key);

  if (results.some((result) => !result.allowed)) {
    throw new Error(
      `Unexpected rate-limit rejection at concurrency ${concurrency}.`,
    );
  }

  if (stored?.count !== concurrency) {
    throw new Error(
      `Lost rate-limit updates at concurrency ${concurrency}. Expected ${concurrency}, got ${stored?.count}.`,
    );
  }

  return {
    concurrency,
    operations: concurrency,
    durationMs: round(durationMs),
    operationsPerSecond: round(concurrency / (durationMs / 1000)),
    latencyMs: {
      p50: round(percentile(timings, 0.5)),
      p95: round(percentile(timings, 0.95)),
      p99: round(percentile(timings, 0.99)),
    },
    finalCounter: stored.count,
  };
};

const main = async () => {
  const results = [];

  for (const concurrency of concurrencyLevels) {
    results.push(await benchmark(concurrency));
  }

  console.log(
    JSON.stringify(
      {
        benchmark: "puzzle-auth-rate-limit",
        adapter: "MemoryStorage test fixture",
        runtime: process.version,
        note: "Local concurrency regression benchmark. Not a production database performance measurement.",
        results,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
