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
| Documentation site | Targeted Playwright scripts, including preview-layout and hydration |
| Reference website | Node's test runner with Playwright against the built Vite preview |

Use the affected package or app manifest for exact commands. Root
`bun run test:reference` builds workspace packages and the playground before
running `apps/playground/tests/reference-site.test.mjs`. The test can also be
run from the app after the workspace packages and app have been built:

```sh
bun run build
bun run --filter "@puzzle-ui/playground" build
bun run --filter "@puzzle-ui/playground" test:e2e
```

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
