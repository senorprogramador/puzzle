# @puzzle-ui/core

Framework-independent utilities shared by all Puzzle packages.

**Documentation:** [https://puzzle-ui.com/docs/getting-started](https://puzzle-ui.com/docs/getting-started)

See the [package documentation](https://puzzle-ui.com/docs/getting-started)
for API and compatibility details.

`@puzzle-ui/core` contains the small, dependency-free helpers that
[`@puzzle-ui/ui`](https://puzzle-ui.com/docs/ui),
[`@puzzle-ui/theme`](https://puzzle-ui.com/docs/theme), and the other Puzzle
packages build on: class name composition, string casing, CSS value safety,
color parsing and conversion, responsive value resolution, international
formatting, and debouncing.
It has no React dependency and runs in browsers, Node.js, Bun, and edge
runtimes.

Use it directly when you build your own components on top of Puzzle and want
the same conventions, for example `cn` for class names and the shared
breakpoints for responsive props.

## Install

```bash
npm install @puzzle-ui/core
# or
bun add @puzzle-ui/core
# or
pnpm add @puzzle-ui/core
# or
yarn add @puzzle-ui/core
```

## Usage

```ts
import { cn, resolveResponsiveValue, stringWithCasing } from "@puzzle-ui/core";

cn("puzzle-button", isActive && "puzzle-button--active", className);
// "puzzle-button puzzle-button--active my-class"

stringWithCasing("hello world", "kebabcase");
// "hello-world"

resolveResponsiveValue({ mobile: "col", desktop: "row" });
// { mobile: "col", tablet: "col", desktop: "row" }
```

## Formatting

The formatting helpers use the platform `Intl` APIs and require an explicit
locale. Date and time formatting options, including `timeZone`, are supplied by
the caller. For consistent server and client output, pass the same locale and
timezone options in both environments.

```ts
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
  formatTime,
  type DateRange,
} from "@puzzle-ui/core";

const stay: DateRange = {
  start: new Date("2025-06-10T00:00:00.000Z"),
  end: new Date("2025-06-14T00:00:00.000Z"),
};

formatCurrency(425, "EUR", "nl-NL");
formatNumber(2, "nl-NL"); // Use for counts when no translated label is needed.
formatDateRange(stay, "nl-NL", {
  dateStyle: "medium",
  timeZone: "Europe/Amsterdam",
});
formatTime(new Date("2025-06-10T18:30:00.000Z"), "nl-NL", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Amsterdam",
});
```

`DateRange` is a framework-independent `{ start, end }` pair of `Date` values;
`formatDateRange` rejects invalid dates and ranges whose start is after their
end. Currency and numeric formatters reject non-finite values. Guest and night
labels still need translated, plural-aware copy from the consuming application.

## Rendering foundation

The `@puzzle-ui/core/rendering` subpath provides framework-neutral rendering
strategies, visibility and scheduling contracts, adapter capabilities, and
configuration and policy helpers. It has no React, router, or browser API
dependency.

```ts
import {
  normalizeGlobalRenderingConfiguration,
  resolveOptimizationProfile,
  resolveOptimizationDecision,
} from "@puzzle-ui/core/rendering";

const globalRendering = normalizeGlobalRenderingConfiguration({
  profile: "balanced",
});

const decision = resolveOptimizationDecision({ global: globalRendering });
// Uses the safe eager/SSR strategy unless an adapter reports other capabilities.

const customRendering = resolveOptimizationProfile({
  profile: "custom",
  optimization: {
    prefetch: true,
    adaptiveScheduling: false,
    resourceConcurrency: 2,
  },
});
```

The balanced profile is the recommended default; custom starts with conservative
SSR-first settings. The resolver normalizes fold, visibility, scheduler,
prefetch, adaptive, and browser-rendering options into immutable configuration.
Application and generic route overrides are supported without importing a
router. The core does not keep mutable process-global configuration, so server
requests remain isolated and initial decisions are deterministic.

`RenderingDiagnosticEvent` is the framework-neutral, typed lifecycle event
contract used by the React hooks and UI adapters. It describes boundary
registration and visibility, activation and mount timing, resource scheduling
and loading, prefetch decisions, and failures. The core defines only the event
types; it does not log, transmit, or retain diagnostic data.

Policy precedence is hard technical, accessibility, and SSR-content constraints;
explicit boundary overrides; component overrides; route and application
overrides; custom profile settings; selected profile defaults; and safe
framework defaults. An unsupported choice is reported with `supported: false`;
critical, SEO, main, and unknown content stays server-rendered when required.

Use `classifyComponent()` with semantic roles such as `navigation`, `hero`,
`gallery`, or `interactive-map` to apply configurable priority and interaction
defaults. `predictFoldPosition()` is a server-safe heuristic: it uses declared
position hints, page structure, document order, dimensions, and parent layout
metadata, but never assumes a viewport height. Positional results are predictions
with confidence below certainty. Unknown components stay eager and SSR-preserving.
With the default configuration, unknown components stay eager and
SSR-preserving. Client-side visibility confirmation and geometry come from the
hooks package's shared `IntersectionObserver` engine.

## Resource scheduling

The `@puzzle-ui/core/resources` subpath provides a framework-neutral resource
scheduler for module chunks, data, images, and extensible resource types. It
uses caller-provided loaders and does not import browser APIs, React, routers,
or a data-fetching library.

```ts
import { createResourceScheduler } from "@puzzle-ui/core/resources";

const scheduler = createResourceScheduler({
  maxConcurrent: 3,
  maxConcurrentPrefetch: 2,
});
const registration = scheduler.register({
  resource: {
    id: "dashboard-chart",
    type: "component-chunk",
    priority: "low",
  },
  load: (signal) => import("./chart"),
});
const request = registration.prefetch();
const chartModule = await request.promise;
```

`prefetch()` loads the resource but never mounts its component. Requests with
the same resource ID share in-flight work and reuse completed results by
default; `AbortSignal`, retry, state subscriptions, concurrency, queue,
priority, and prefetch budgets are part of the scheduler contract.
`maxConcurrentPrefetch` caps background work; its default leaves one scheduler
slot available for demand loads when concurrency is greater than one. Queued
prefetches are promoted when a consumer requests the resource, and cancelled
or failed prefetches release their count-based budget. Data loaders can
delegate to existing framework caches and route loaders.
Resource loading strategies distinguish immediate registration loads from
scheduled and on-demand work; use `cachePolicy: "no-store"` when the existing
loader or framework cache owns result freshness.

## API

| Area       | Exports                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strings    | `cn`, `stringWithCasing`, `normalizeSearchString`, `withSafeCharacters`, `escapeCssString`, `assertSafeCssValue`, `nameToInitials`                                                                                                  |
| Colors     | `isColor`, `isHexColor`, `isCssVariable`, `isDarkColor`, `isColorDark`, `getColorType`, `parseColor`, `parseRgb`, `hexToRgb`, `hexToRgba`, `rgbToHex`, `hslToRgb`, `rgbToHsl`, `rgbToCss`, `hslToCss`, `getColorLuminance`, `clamp` |
| Responsive | `BREAKPOINTS`, `resolveResponsiveValue`, `resolveResponsiveValueForBreakpoint`                                                                                                                                                      |
| Formatting | `formatCurrency`, `formatDate`, `formatDateRange`, `formatNumber`, `formatTime`, `DateRange`                                                                                                                                          |
| Timing     | `debounce` (returns a debounced function with a `cancel()` method)                                                                                                                                                                  |
| Rendering  | `@puzzle-ui/core/rendering` classification, fold prediction, configuration and policy helpers, priorities, and rendering, visibility, scheduler, and adapter contracts                                                                  |
| Resources  | `@puzzle-ui/core/resources` resource descriptors, priorities, scheduler, loader, registration, and lifecycle types                                                                                                                 |
| Types      | `ClassnameArg`, `ColorType`, `RGBColor`, `HSLColor`, `Breakpoint`, `ResponsiveConfig`, `ResponsiveValue`, `DeepPartial`                                                                                                             |

`stringWithCasing` supports `lowercase`, `uppercase`, `snakecase`,
`kebabcase`, `camelcase`, `pascalcase`, `sentencecase`, and `headercase`.

Responsive values use the `mobile`, `tablet`, and `desktop` breakpoints;
smaller breakpoints cascade to larger ones when a value is omitted.
