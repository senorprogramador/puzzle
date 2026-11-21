# Playwright strategy

Use Playwright for user-visible behavior that depends on a real browser: layout,
navigation, keyboard interaction, focus, forms, and browser diagnostics. Keep
pure logic and component contracts in their existing unit and component tests.

## Existing infrastructure

| Area | Runner and scope |
| --- | --- |
| UI and Pieces | Vitest projects: unit, component, and Playwright browser |
| Create CLI | Vitest plus Playwright for generated application flows |
| Workspace Next and TanStack apps | Node's test runner with Playwright for rendering and hydration |
| Documentation site | Targeted Playwright scripts for preview-layout, hydration, and homepage theme QA |
| Reference website | Node's test runner with Playwright against the built Vite preview |

Use the affected package or app manifest for exact commands. The reference-site
browser commands run in the pinned Playwright Docker image and perform the
workspace and playground builds there:

```sh
bun run --filter "@puzzle-ui/playground" test:e2e
bun run --filter "@puzzle-ui/playground" test:reference:behavior
bun run --filter "@puzzle-ui/playground" test:a11y
bun run --filter "@puzzle-ui/playground" test:visual
```

See [visual testing](./visual-testing.md) for the canonical Linux ARM64 image,
diagnostics, baseline updates, and artifact inspection.

## Reference-site coverage

The browser suite verifies:

- All top-level routes, article routes, the not-found page, one main landmark,
  one page-level heading, and no unexpected redirects.
- Primary navigation and footer links, the mobile menu, skip-link keyboard
  order, breadcrumbs, and a recovery link from not-found.
- Feature tabs, FAQ accordion keyboard activation, journal search and topic
  filters, and contact form required-field validation and confirmation.
- Browser console errors, uncaught page errors, failed requests, HTTP failures,
  broken images, and horizontal overflow.
- Every implemented route at each viewport in the
  [responsive matrix](./responsive-testing.md).

Tests should cover only behavior present in the application. Add checks for
loading, empty, error, persistence, authorization, or authentication states only
when the app implements those states. The reference website has no remote data,
database, or Auth.

## Runtime diagnostics

Fail on unhandled errors and unexpected failed requests. Do not silence a
legitimate browser error to make a test pass. Determine whether it is an
application defect, an intentional test condition, or an external dependency
that should be removed or controlled. Keep test data deterministic and avoid
unnecessary external requests.

For static Vite routes, verify both the returned response and the rendered
client-side not-found state. A SPA fallback can return HTTP 200 for a route the
client does not recognize; report that distinction instead of implying a
server-side 404.

## Screenshots for inspection

The documentation site's `test:homepage:theme` check runs against the
production build, switches the homepage from dark to light mode, checks
theme color consistency and WCAG AA text contrast, and verifies overflow at six
responsive widths. It captures the AI section in both themes at mobile (390px)
and desktop (1440px) widths. `bun run test:all` and the site's
`validate:seo` command include this check. Screenshots are diagnostic captures,
not baseline comparisons; inspect them using the workflow in
[visual testing](./visual-testing.md).

By default, captures are written to
`apps/site/test-results/homepage-theme/`. Set
`PUZZLE_HOMEPAGE_THEME_SCREENSHOT_DIR` to use another directory. CI uploads the
captures as a per-Node-version artifact.

The reference-site test can optionally capture full-page screenshots at every
route and required viewport. After building the packages and app, set an output
directory:

```sh
PUZZLE_REFERENCE_SCREENSHOT_DIR=/tmp/puzzle-reference \
  bun run --filter "@puzzle-ui/playground" test:e2e
```

Open and inspect the captured images as described in
[visual testing](./visual-testing.md). This option captures images only; it
does not compare them with baselines.
