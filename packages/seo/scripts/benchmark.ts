import { buildSeoGraph, validateSeoGraph } from "../src/core";

import { generateSitemap } from "../src/sitemap";

const BASE_URL = "https://example.com";

const ITERATIONS = 5;

interface BenchmarkResult {
  name: string;
  medianMs: number;
  targetMs: number;
  passed: boolean;
}

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);

  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};

const benchmark = (
  name: string,
  operation: () => void,
  targetMs: number,
): BenchmarkResult => {
  operation();

  const durations: number[] = [];

  for (let index = 0; index < ITERATIONS; index += 1) {
    const start = performance.now();

    operation();

    durations.push(performance.now() - start);
  }

  const medianMs = median(durations);

  return {
    name,
    medianMs: Number(medianMs.toFixed(3)),
    targetMs,
    passed: medianMs <= targetMs,
  };
};

const createNodes = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    "@type": "WebPage",
    "@id": `${BASE_URL}/pages/${index}`,
    url: `${BASE_URL}/pages/${index}`,
    name: `Page ${index}`,
    description: `Benchmark page ${index}`,
  }));

const createEntries = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    url: `/pages/${index}`,
    lastModified: "2026-11-13T12:00:00.000Z",
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

const nodes100 = createNodes(100);
const nodes1000 = createNodes(1000);

const graph100 = buildSeoGraph(nodes100, {
  baseUrl: BASE_URL,
});

const results: BenchmarkResult[] = [];

results.push(
  benchmark(
    "Graph generation (100 nodes)",
    () => {
      buildSeoGraph(nodes100, {
        baseUrl: BASE_URL,
      });
    },
    10,
  ),
);

results.push(
  benchmark(
    "Graph generation (1,000 nodes)",
    () => {
      buildSeoGraph(nodes1000, {
        baseUrl: BASE_URL,
      });
    },
    50,
  ),
);

results.push(
  benchmark(
    "Graph validation (100 nodes)",
    () => {
      validateSeoGraph(graph100, {
        baseUrl: BASE_URL,
      });
    },
    20,
  ),
);

const sitemap1000 = createEntries(1000);
const sitemap10000 = createEntries(10000);

results.push(
  benchmark(
    "Sitemap generation (1,000 entries)",
    () => {
      generateSitemap({
        baseUrl: BASE_URL,
        entries: sitemap1000,
      });
    },
    50,
  ),
);

results.push(
  benchmark(
    "Sitemap generation (10,000 entries)",
    () => {
      generateSitemap({
        baseUrl: BASE_URL,
        entries: sitemap10000,
      });
    },
    250,
  ),
);

console.log("\nPuzzle SEO — E9 Performance Benchmark\n");

console.table(
  results.map((result) => ({
    benchmark: result.name,
    median: `${result.medianMs} ms`,
    target: `${result.targetMs} ms`,
    status: result.passed ? "PASS" : "SLOW",
  })),
);

const passed = results.filter((result) => result.passed).length;

console.log(`\n${passed}/${results.length} performance targets achieved.`);

console.log(
  "Performance measurements are informational and machine-dependent.",
);
