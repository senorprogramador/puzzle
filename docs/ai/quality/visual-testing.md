# Visual testing

Visual testing combines reproducible browser rendering with human inspection.
Automated route and overflow checks do not replace review of the rendered page.

## Current infrastructure

The repository does not have a configured Playwright screenshot matcher or
maintained screenshot baselines. Storybook and Chromatic packages are present,
but their presence alone does not establish a CI visual-regression workflow.
The reference-site suite can capture optional screenshots for inspection; it
does not perform pixel comparison.

Do not add snapshots or update a baseline without identifying a stable test
data source, browser version, fonts, viewport, and animation policy. Inspect each
proposed baseline change before accepting it.

## Inspection workflow

For each page affected by a visual change:

1. Build the production preview and navigate directly to the route.
2. Use the required viewport matrix in
   [responsive testing](./responsive-testing.md), including intermediate widths
   where the layout changes.
3. Wait for `document.fonts.ready` and for every image to finish loading.
4. Disable or stabilize non-essential animation and use deterministic content.
5. Capture full-page screenshots, then open and inspect the actual images.
6. Check hierarchy, spacing, text wrapping, alignment, image crop and aspect
   ratio, container widths, card density, navigation, and footer behavior.
7. Fix defects, capture fresh screenshots, and inspect them again.
8. State which routes and widths were visually inspected. Do not claim visual
   QA passed just because screenshots were produced.

The reference-site test uses reduced motion and verifies that images are
complete. To capture images to a temporary directory, run the command in
[Playwright strategy](./playwright.md) with
`PUZZLE_REFERENCE_SCREENSHOT_DIR` set. Remove temporary captures after review;
do not commit them as baselines.

## Consistency across pages

Check for consistent typography, semantic theme tokens, container widths,
spacing, buttons, section treatments, and image styles. Keep meaningful
variation between pages and sections; avoid both repetitive component demos
and unrelated decorative styles. Prefer theme tokens for semantic color and
shared design values.
