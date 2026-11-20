# Puzzle rendering optimization benchmark

**Measured:** 2026-11-18  
**Detailed data:** [rendering-benchmark.json](./rendering-benchmark.json)

## Summary

The production builds and benchmark scenarios completed, and critical SSR content remained available in both frameworks. This fixture does **not** demonstrate an initial JavaScript reduction: every optimization profile transferred more JavaScript initially than its normal-rendering baseline. After the deferred table loaded, total JavaScript transfer was higher still. The fold runtime overhead outweighs the small deferred panel in this comparison.

The profile activation thresholds were distinguishable, but the four profiles transferred the same initial JavaScript per framework. Balanced and aggressive therefore did not show a bundle-size advantage over conservative or custom here.

## Method

- Command: `PUZZLE_RENDERING_BENCHMARK_RUNS=3 bun run benchmark:rendering` (exit 0). This builds the workspace packages, Next.js app, and TanStack Start app before running the production benchmark.
- Primary matrix: baseline plus all four profiles, both frameworks, cold and warm cache, three repetitions each.
- Supplemental matrix: desktop-slow, mobile-fast, and mobile-slow, cold cache; baseline, balanced, and aggressive; one run per combination. Conservative and custom were not included in the supplemental matrix.
- Total: 78 measured page runs. Primary comparisons use medians of three; supplemental comparisons are single observations.
- Warm runs use a new page in the same browser context after the cold run has loaded and activated the deferred module.
- Emulated conditions: desktop-fast 1365×768 / 10 Mbps / 20 ms / CPU ×1; desktop-slow 1365×768 / 1.5 Mbps / 150 ms / CPU ×1; mobile-fast 390×844 / 10 Mbps / 20 ms / CPU ×4; mobile-slow 390×844 / 1.5 Mbps / 150 ms / CPU ×4.
- Lab environment: Chromium 159.0.8154.6, Node v24.15.0, macOS arm64, Apple M4 Max.
- Installed versions: Next.js 16.4.6 / React 19.3.0 / TypeScript 7.0.2; TanStack React Start 1.169.5 / Router 1.170.46 / React 19.3.1 / TypeScript 7.0.2.

The pages share critical content, long-page sections, and an interactive data table. Profile routes defer the table behind an SSR fallback; the baseline renders the table eagerly. Browser metrics are local lab data, not field data.

## Primary results

Cold-cache desktop-fast medians (three runs):

| Framework | Initial JS, baseline → profiles | Delta | JS after table activation, baseline → profiles | Initial script duration, baseline → profiles | FCP/LCP, baseline → profiles |
|---|---:|---:|---:|---:|---:|
| Next.js | 196,039 → 203,566 B | +7,527 B (+3.8%) | 196,039 → 208,007 B (+11,968 B, +6.1%) | 16.90 → 19.42–20.72 ms | 116 → 92–96 ms |
| TanStack Start | 454,252 → 502,361 B | +48,109 B (+10.6%) | 454,252 → 514,367 B (+60,115 B, +13.2%) | 22.71 → 24.46–26.39 ms | 200 → 176–180 ms |

Across these primary runs, CLS and initial lab TBT were zero for all scenarios. Initial JS request count was one lower for profiles, but the activated profile pages made three more total requests than baseline. The deferred panel measured 4,141 encoded bytes in Next.js and 11,706 encoded bytes in TanStack Start. Initial JS heap was also higher for profiles: Next.js 5.86–5.91 MB versus 4.88 MB baseline; TanStack Start 5.39–5.42 MB versus 4.23 MB baseline.

FCP/LCP were lower in these runs, but this lab result is not sufficient to attribute the change to the optimization. It does not offset the measured increases in initial JS transfer, script execution, and heap use.

For warm-cache runs, measured JS transfer was 0 B for baseline and profiles in both frameworks because the same-context cache was reused. Encoded JS body size still differed: Next.js baseline 192,739 B versus 199,966 B for profiles; TanStack Start baseline 450,352 B versus 498,461 B. Warm FCP was 116 ms baseline versus 88–92 ms for Next.js profiles, and 72 ms versus 52 ms for TanStack Start; warm script duration remained higher for profiles (Next.js 19.62–21.08 ms versus 17.28 ms; TanStack Start 24.38–27.14 ms versus 21.58 ms).

### Profile activation

Measured scroll gap at table activation and fallback-to-table activation latency:

| Profile | Activation gap | Next.js latency | TanStack Start latency |
|---|---:|---:|---:|
| Conservative | -100 px | 34.6 ms | 42.0 ms |
| Balanced | 400 px | 33.6 ms | 42.6 ms |
| Aggressive | 800 px | 32.5 ms | 42.5 ms |
| Custom | 0 px | 32.8 ms | 42.6 ms |

These are fixture-specific measurements, not general guarantees about activation timing.

## Bundle comparison

- **Next.js route chunks:** baseline 197,013 B raw / 60,914 B gzip; profile 220,807 B / 68,085 B. The profile route is larger by 23,794 B raw and 7,171 B gzip.
- **TanStack Start assets:** the benchmark build emitted a 56,464 B fold-boundary JS asset (15,714 B gzip) and an 11,706 B deferred panel JS asset (4,156 B gzip), among the benchmark assets. The runner does not have a directly paired baseline/profile route-manifest comparison for TanStack; runtime transfer measurements above are used for that comparison.

No duplicate-dependency or unused-export analysis was performed. These bundle results do not establish that the same overhead applies to every application route.

## SSR, SEO, and compatibility checks

- Both framework routes passed the benchmark's SSR and JavaScript-disabled checks for all five scenarios.
- Page title, description, main heading, critical content, 24 long-page sections, navigation links, and image alt text were present.
- Critical content remained SSR-rendered. Profile routes returned the table fallback in server HTML; only the eager baseline included the interactive table itself in server HTML.
- No JSON-LD structured data was present in the fixture, so structured-data correctness was not exercised.
- Dynamic import activation and production builds worked in both frameworks. Only the installed framework/React/TypeScript versions and Chromium were tested; this is not a cross-version or cross-browser compatibility matrix.

## Limitations and observed failures

- INP and hydration duration were not measured. The scripted interaction timing is a lab proxy, not field INP. TTFB, FCP, LCP, CLS, TBT, script/task duration, heap, request counts, deferred bytes, and activation latency are local lab measurements only.
- The fixture does not attach scheduled resources to the resource scheduler; prefetch transfer and waste were not measured. Resource-level timing beyond the deferred module load was not analyzed.
- Supplemental network/device scenarios have one run and omit conservative/custom profiles; their timing results are directional only.
- Every Next.js sample recorded 404s for `/fonts/puzzle-fonts.css` and `/fonts/puzzle-font-geist.woff2`, and a 503 for `/api/auth/state` (39 of each across 39 Next.js samples). These requests were not changed as part of this benchmark and may affect absolute request and timing metrics. No corresponding errors were recorded for TanStack Start.
- Accessibility tooling and non-Chromium browsers were not part of this benchmark run.

## Conclusions and recommendations

1. The acceptance criterion for demonstrating initial JavaScript reduction is **not met** for this fixture. Do not present these results as a performance win.
2. The current profile/runtime cost is measurable for a small deferred table. Before recommending profiles for general use, reduce or justify the client runtime overhead and repeat the comparison with representative production workloads whose deferred code is large enough to outweigh it.
3. Keep the profile semantics and SSR fallback checks; no critical content disappeared. Add real scheduled resources and measure prefetch waste before making claims about scheduler or prefetch benefits.
4. Re-run after addressing the repeated Next.js font and auth-state failures, then add field LCP/INP and broader browser/version coverage if those claims are required.
