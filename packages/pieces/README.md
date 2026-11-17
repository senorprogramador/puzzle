# @puzzle-ui/pieces

Composable React sections for marketing sites, product experiences, commerce,
business pages, dashboards, and interactive application flows. Pieces provides
presentation and accessible structure; your application owns routing, data,
validation, persistence, payments, availability, and backend behavior.

**Documentation:** [puzzle-ui.com/docs/pieces](https://puzzle-ui.com/docs/pieces)

## Install

```sh
npm install @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme
# or: bun add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme
# or: pnpm add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme
# or: yarn add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme
```

React and React DOM `^19.0.0` are peer dependencies. Pieces depends on Puzzle
Core, Hooks, Icons, Theme, and UI; no router, database, authentication,
payment, booking, or map-service dependency is required.

## Usage

Import components and their public types from the package root:

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button } from "@puzzle-ui/ui";
import { BlogSection, type BlogArticle } from "@puzzle-ui/pieces";

const articles: BlogArticle[] = [
  {
    id: "field-notes",
    title: "A more considered way to plan",
    excerpt: "Small steps for teams making useful products.",
    href: "/journal/field-notes",
  },
];

export function JournalPage() {
  return (
    <Theme>
      <BlogSection
        title="Field notes"
        description="Ideas for teams making useful products."
        items={articles}
        actions={<Button href="/journal">Read the journal</Button>}
      />
    </Theme>
  );
}
```

All family indexes are re-exported from `@puzzle-ui/pieces`. Use named imports
from this package root; the package does not promise per-family subpath
exports.

## Available section families

These are the 48 documented section families. `Hero` and existing dashboard,
navigation, project, data-display, and feedback compositions are also
available; see the [component catalog](https://puzzle-ui.com/docs/pieces).

| Category | Families |
| --- | --- |
| Marketing & Conversion (10) | Announcement, Logo Cloud, Features, Benefits, Stats, Testimonials, CTA, FAQ, How It Works, Comparison |
| SaaS & Product (7) | Product Showcase, Integrations, Use Cases, Security, Pricing, Code Showcase, Roadmap |
| Commerce (6) | Product Grid, Categories, Product Gallery, Cart Summary, Product Details, Commerce Benefits |
| Content & Editorial (5) | Blog, Content, Gallery, Timeline, Changelog |
| Business & Corporate (8) | About, Team, Services, Case Studies, Contact, Careers, Partners, Awards |
| Application & Dashboard (5) | Dashboard Overview, Activity, Onboarding, Empty State, Settings |
| Specialized & Interactive (7) | Video, Booking, Location, Waitlist, Resource, Event, Footer |

Each component has a dedicated reference with variants, previews, API details,
accessibility notes, and practical examples. Start with the category overview
to compare use cases:

- [Marketing & Conversion](https://puzzle-ui.com/docs/pieces/components/marketing)
- [SaaS & Product](https://puzzle-ui.com/docs/pieces/components/saas-product)
- [Commerce](https://puzzle-ui.com/docs/pieces/components/commerce)
- [Content & Editorial](https://puzzle-ui.com/docs/pieces/components/content)
- [Business & Corporate](https://puzzle-ui.com/docs/pieces/components/business)
- [Application & Dashboard](https://puzzle-ui.com/docs/pieces/components/application-dashboard)
- [Specialized & Interactive](https://puzzle-ui.com/docs/pieces/components/specialized-interactive)

## Styling and themes

Pieces components ship their scoped CSS with the package. Wrap the application
in Puzzle `Theme` so semantic color, typography, spacing, border, and motion
tokens are available. Sections inherit theme changes, including scoped themes;
use `className` for product-specific styling and prefer existing
`--puzzle-*` tokens over hard-coded visual values.

## Framework compatibility

Pieces is router-independent and supports React 19. Static section composition
can render on the server. Interactive forms, filters, selectors, and dialogs
use React client behavior; place those boundaries in client components when
using Next.js App Router or TanStack Start. See the
[framework integration guide](https://puzzle-ui.com/docs/pieces/framework-integration).

## TypeScript and accessibility

Public item, variant, and props types are exported from the package root.
Components use semantic HTML and native links, forms, time elements, and
controls where appropriate. Supply meaningful image alternatives and labels
for caller-provided controls, keep heading levels appropriate to the page, and
manage application-owned state and validation in your app.

## Development

From the monorepo root:

```sh
bun run --filter @puzzle-ui/pieces typecheck
bun run --filter @puzzle-ui/pieces test:all
bun run --filter @puzzle-ui/pieces build
bun run --filter @puzzle-ui/site build
```

The test suite includes Node unit tests, jsdom component tests, and Chromium
browser tests. The browser project covers responsive layouts, keyboard
interaction, focus, and media behavior.

The implementation audit and family design matrix are preserved in
[`ARCHITECTURE.md`](./ARCHITECTURE.md).
