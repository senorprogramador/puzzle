# Visual testing

Visual testing combines reproducible browser rendering with human inspection.
Automated route and overflow checks do not replace review of the rendered page.

## Canonical rendering environment

All reference-site browser tests and snapshot updates run in the official
Playwright Docker image pinned in
[`visual-support.mjs`](../../../apps/playground/tests/visual-support.mjs) and
verified against CI by the Playwright global setup:

| Setting | Pinned value |
| --- | --- |
| Image | `mcr.microsoft.com/playwright:v1.65.1-noble@sha256:56be08aca06bf736a928da2e3235a3b63ef71ee97313beb18c6019fea791aba4` |
| OS | Ubuntu 24.04.5 LTS (Noble) |
| Architecture | Linux ARM64 |
| Node.js | 26.13.1 |
| Bun | 1.4.4 |
| `playwright` and `@playwright/test` | 1.65.1 |
| Chromium | 159.0.8154.6 |
| Rendering | Chromium headless, GPU disabled, device scale factor 1 |

CI uses the `ubuntu-24.04-arm` GitHub-hosted runner and this exact ARM64 image.
On Apple Silicon, the documented commands also run ARM64 natively through
Docker Desktop; they do not capture or update baselines using the macOS browser.
The image digest fixes the distribution, browser binaries, system dependencies,
and fonts. `test:visual:diagnostics` reports installed font families and
versions, plus the actual platform fonts used by a heading and body paragraph.
Playwright checks the runtime, image reference, and Chromium version before
running browser tests.

The site uses system fonts and local images; visual tests fail on failed font
loads, broken images, browser errors, or requests to external origins. They wait
for `document.fonts.ready`, inspect fonts Chromium actually used, decode every
image, disable motion and caret rendering, and allow two animation frames for
layout to settle.

## Commands

Run these commands from the repository root or `apps/playground/`. Each public
command starts the pinned Docker image, installs dependencies from the frozen
Bun lockfile, builds the workspace and reference site, then runs the requested
suite:

```sh
bun run --filter "@puzzle-ui/playground" test:visual
bun run --filter "@puzzle-ui/playground" test:visual:update
bun run --filter "@puzzle-ui/playground" test:a11y
bun run --filter "@puzzle-ui/playground" test:reference:behavior
bun run --filter "@puzzle-ui/playground" test:visual:diagnostics
```

Docker Desktop on Apple Silicon (or a native Linux ARM64 Docker host) and
network access for the initial image and package downloads are required. Do not
use a different architecture or rely on CPU emulation for screenshot capture;
use the canonical CI job on x86-only development machines. The comparison and
update commands use the same Playwright configuration, image digest, browser
configuration, nine routes, and seven viewport projects. Updates write only to
`apps/playground/tests/__screenshots__/linux/`; native macOS screenshot
generation is not supported.

The package-only `*:container` scripts are for CI and for debugging inside the
pinned image. Prefer the public commands above on macOS. CI runs behavioral,
accessibility, and visual suites once in the canonical job; it never updates
snapshots.

Do not add snapshots or update a baseline without identifying stable test data,
the actual fonts used, the browser version, viewport, and animation policy.
Inspect each proposed baseline change before accepting it.

## Inspection workflow

For each page affected by a visual change:

1. Build the production preview and navigate directly to the route.
2. Use the required viewport matrix in
   [responsive testing](./responsive-testing.md), including intermediate widths
   where the layout changes.
3. Use the canonical command, then verify the diagnostic output reports the
   expected fonts and wait for every image to finish decoding.
4. Disable or stabilize non-essential animation and use deterministic content.
5. Capture full-page screenshots, then open and inspect the actual images.
6. Check hierarchy, spacing, text wrapping, alignment, image crop and aspect
   ratio, container widths, card density, navigation, and footer behavior.
7. Fix defects, capture fresh screenshots, and inspect them again.
8. State which routes and widths were visually inspected. Do not claim visual
   QA passed just because screenshots were produced.

On a failed comparison, inspect the actual, expected, and difference images,
error context, and trace in `apps/playground/test-results/`. CI uploads this
directory even when a test fails. The reference-site behavioral test can also
capture full-page screenshots at all route/viewport pairs by setting
`PUZZLE_REFERENCE_SCREENSHOT_DIR`; CI stores these under the same test-results
directory.

## Consistency across pages

Check for consistent typography, semantic theme tokens, container widths,
spacing, buttons, section treatments, and image styles. Keep meaningful
variation between pages and sections; avoid both repetitive component demos
and unrelated decorative styles. Prefer theme tokens for semantic color and
shared design values.
