# AI quality assurance

Use this guide to validate user-visible behavior in Puzzle applications and
the repository's reference website without adding a parallel test system.

## Start with the narrowest relevant check

| Change | Start with |
| --- | --- |
| Reference website or shared app composition | `bun run test:reference` |
| UI or Pieces behavior | The package's `test:unit`, `test:component`, or `test:browser` command |
| Documentation preview layout | `bun run --filter "@puzzle-ui/site" test:preview-layout` |
| Framework rendering or hydration | The affected app's rendering tests and the site's hydration validator |
| Broad release or cross-package change | `bun run test:all` |

`bun run test:reference` builds workspace packages and the playground, then runs
Playwright against the production preview. It requires the Playwright Chromium
browser. `bun run test:all` includes this suite and the repository's package,
browser, and MongoDB integration tests; MongoDB tests require Docker Compose.
The separate `bun run test:e2e` command exercises generated CLI projects and
requires Docker and network access.

Read [Playwright strategy](./playwright.md), [visual testing](./visual-testing.md),
[responsive testing](./responsive-testing.md), and
[accessibility](./accessibility.md) when the task affects those areas.

## Testing architecture

- UI and Pieces use Vitest projects for unit, component, and Playwright browser
  tests.
- Create uses Vitest for its generated-project suite and Playwright for running
  generated apps.
- Workspace framework apps use Node's test runner with Playwright for rendering
  and hydration behavior.
- The documentation site has Playwright validators for preview layout,
  hydration, and SEO endpoints.
- `apps/playground` is the client-side reference website and Storybook app. Its
  production-preview tests use Node's test runner and Playwright. The e2e
  command also runs axe-core checks and screenshot comparisons across the
  reference route and viewport matrix.
- Storybook's a11y addon is configured in error mode, but there is no dedicated
  Storybook CI test project.

Reuse these runners and utilities. Do not introduce a second browser runner or
snapshot system without a demonstrated gap and an explicit maintenance plan.

## Reference website

The reference experience lives in [`apps/playground`](../../../apps/playground)
and uses public exports from `@puzzle-ui/pieces`, `@puzzle-ui/ui`, and
`@puzzle-ui/theme`. It is a client-side Vite app, not an SSR or framework
compatibility example. The current routes are Home, About, Capabilities,
Journal, three sample article pages, Contact, and a client-rendered not-found
page.

Its content and data are static. The Contact form demonstrates native
validation and a local success state only; it does not send or persist data.
There is no database, Auth, loading state, or remote data source to test.

## Automated and manual evidence

Automated checks can establish route availability, control behavior, DOM
semantics, runtime diagnostics, and measurable layout constraints. They cannot
decide whether the visual hierarchy, typography, image treatment, contrast, or
content density looks right. Use the screenshot workflow and manual keyboard
inspection in the linked guides, and state which manual checks were performed.

The reference site has 63 full-page screenshot baselines across nine routes and
seven viewports, alongside automated axe-core checks. A passing comparison
does not establish that the overall design is correct; manually inspect
representative screenshots and review each proposed baseline update.
