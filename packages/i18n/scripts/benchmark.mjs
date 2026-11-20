import { stat } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { createI18n } from "../dist/index.js";

const bundleBudgets = new Map([
  ["dist/index.js", 64 * 1024],
  ["dist/react/index.js", 32 * 1024],
  ["dist/devtools/index.js", 32 * 1024],
]);
const bundleSizes = {};

for (const [file, budget] of bundleBudgets) {
  const { size } = await stat(new URL(`../${file}`, import.meta.url));
  bundleSizes[file] = size;

  if (size > budget) {
    throw new Error(
      `${file} is ${size} bytes, above its ${budget}-byte bundle budget.`,
    );
  }
}

const i18n = createI18n({
  locales: [{ locale: "en" }, { locale: "nl" }],
  defaultLocale: "en",
  catalogs: {
    en: { common: { greeting: "Hello {name}" } },
    nl: { common: { greeting: "Hallo {name}" } },
  },
});
const translator = i18n.createTranslator("en");
const warmupIterations = 20_000;
const measuredIterations = 100_000;

for (let index = 0; index < warmupIterations; index += 1) {
  translator.t("common.greeting", { name: "Puzzle" });
}

const samples = [];

for (let sample = 0; sample < 5; sample += 1) {
  const start = performance.now();

  for (let index = 0; index < measuredIterations; index += 1) {
    translator.t("common.greeting", { name: "Puzzle" });
  }

  samples.push(
    ((performance.now() - start) * 1_000) / measuredIterations,
  );
}

samples.sort((left, right) => left - right);
const medianMicrosecondsPerLookup = samples[Math.floor(samples.length / 2)];
const lookupBudgetMicroseconds = 100;

if (medianMicrosecondsPerLookup > lookupBudgetMicroseconds) {
  throw new Error(
    `Median translation lookup took ${medianMicrosecondsPerLookup.toFixed(2)}us, above the ${lookupBudgetMicroseconds}us budget.`,
  );
}

let namespaceLoads = 0;
const lazyI18n = createI18n({
  locales: [{ locale: "en" }],
  defaultLocale: "en",
  catalogs: { en: { dashboard: { title: "" } } },
  namespaceLoader: {
    async load() {
      namespaceLoads += 1;
      return { title: "Dashboard" };
    },
  },
});

await Promise.all(
  Array.from({ length: 32 }, () =>
    lazyI18n.loadNamespace("en", "dashboard"),
  ),
);

if (namespaceLoads !== 1) {
  throw new Error(
    `Concurrent namespace loads were not coalesced (received ${namespaceLoads} loads).`,
  );
}

console.log(JSON.stringify({
  bundleSizes,
  medianMicrosecondsPerLookup: Number(medianMicrosecondsPerLookup.toFixed(2)),
  lookupBudgetMicroseconds,
  namespaceLoadCoalescing: { callers: 32, loads: namespaceLoads },
}, null, 2));
