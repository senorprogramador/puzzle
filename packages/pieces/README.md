# @puzzle-ui/pieces

Composable React sections and application workflows for marketing sites,
products, commerce, content, business pages, dashboards, and media libraries.
Pieces provides presentation and accessible structure; your application owns
routing, data, validation, persistence, uploads, payments, availability, and
backend behavior.

**Documentation:** [puzzle-ui.com/docs/pieces](https://puzzle-ui.com/docs/pieces)

## Install

```sh
npm install @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme @puzzle-ui/cms
# or: bun add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme @puzzle-ui/cms
# or: pnpm add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme @puzzle-ui/cms
# or: yarn add @puzzle-ui/pieces @puzzle-ui/ui @puzzle-ui/theme @puzzle-ui/cms
```

React and React DOM `^19.0.0` are peer dependencies. Pieces depends on Puzzle
Core, CMS (for the CMS authoring family), Hooks, Icons, Theme, and UI; no router, database, authentication,
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

These are the 63 documented section families. `Hero` and existing dashboard,
navigation, project, data-display, and feedback compositions are also
available; see the [component catalog](https://puzzle-ui.com/docs/pieces).

| Category | Families |
| --- | --- |
| Marketing & Conversion (11) | Announcement, Logo Cloud, Features, Benefits, Stats, Testimonials, Guest Reviews, CTA, FAQ, How It Works, Comparison |
| SaaS & Product (7) | Product Showcase, Integrations, Use Cases, Security, Pricing, Code Showcase, Roadmap |
| Commerce (12) | Product Grid, Gift Voucher, Categories, Product Gallery, Cart Summary, Product Details, Availability Search, Rate Plans, Stay Summary, Restaurant Menu, Table Reservation, Commerce Benefits |
| Content & Editorial (6) | Blog, Content, Gallery, Timeline, Changelog, Local Guide |
| Business & Corporate (15) | About, Team, Host Profile, Services, Service Options, Case Studies, Contact, Careers, Partners, Awards, Accommodation Overview, Accommodation Details, Amenity List, House Rules, Opening Hours |
| Application & Dashboard (5) | Dashboard Overview, Activity, Onboarding, Empty State, Settings |
| Specialized & Interactive (7) | Video, Booking, Location, Waitlist, Resource, Event, Footer |

Media & Asset Management adds four app-owned data compositions:
[`MediaLibrary`](https://puzzle-ui.com/docs/pieces/components/media-library),
[`AssetPickerDialog`](https://puzzle-ui.com/docs/pieces/components/asset-picker-dialog),
[`AssetDetailsPanel`](https://puzzle-ui.com/docs/pieces/components/asset-details-panel),
and [`MediaField`](https://puzzle-ui.com/docs/pieces/components/media-field).
They accept a safe client projection and caller-provided temporary preview
URLs; they do not include storage keys, tenant internals, processing errors,
upload transport, or persistence.

CMS authoring adds caller-data-driven admin compositions: `CmsShell`,
`ContentList`, `ContentEditor`, `BlockEditor`, `ContentTypeBuilder`,
`LocalizationEditor`, `RelationshipField`, `RevisionHistory`,
`PublishScheduler`, `EditorialCalendar`, `AuditLogViewer`, and
`WebhookManagement`. These components
do not fetch data, authorize actions, or persist content; the host application
must use the CMS and Fullstack APIs for those responsibilities.
`ContentList` supports local filtering and pagination by default, or a
caller-controlled `remote` query and cursor navigation for server-driven pages.
The host owns server sorting, cursor history, authorization, and stale responses.
Optional controlled selection spans pages; bulk action callbacks report
per-entry success and failure and remain authorized by the host.
`ContentEditor` can opt into dirty-discard confirmation and browser unload
warnings; client-side navigation blocking remains the host router's job. The
built-in JSON editors in `ContentEditor`, `BlockEditor`, and `LocalizationEditor`
report invalid local text through `onInvalidDraftChange` so hosts can guard
save and navigation actions.
`RelationshipField` supports caller-backed remote search and retains removable
previews for selected IDs outside the current results.
`WebhookManagement` accepts sanitized subscriptions and delivery history;
secret provisioning, authorized API calls, and background delivery remain
host-owned.

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

## API maturity

All 127 canonical component APIs and their published aliases are **Stable**.
Their documented contracts are intended to remain backward-compatible within
a major version; breaking changes require a major release. Stable describes API
compatibility, not production readiness or suitability for a particular
application.

The accommodation sections are presentation-only: compose them with the
existing `AccommodationHero`, `GallerySection`, `TestimonialsSection`, and
`CTASection`. The [accommodation discovery example](https://puzzle-ui.com/docs/pieces/components/accommodation-discovery)
shows the presentation composition. Hospitality search, rates, summaries, and
house rules are also caller-data-driven; availability checks, price
calculations, reservations, payments, and persisted guest data remain
application responsibilities. See the [booking flow example](https://puzzle-ui.com/docs/pieces/components/hospitality-booking-flow).

- [AccommodationOverviewSection](https://puzzle-ui.com/docs/pieces/components/accommodation-overview)
- [AccommodationDetailsSection](https://puzzle-ui.com/docs/pieces/components/accommodation-details)
- [AmenityListSection](https://puzzle-ui.com/docs/pieces/components/amenity-list)
- [AvailabilitySearchSection](https://puzzle-ui.com/docs/pieces/components/availability-search)
- [RatePlansSection](https://puzzle-ui.com/docs/pieces/components/rate-plans)
- [StaySummarySection](https://puzzle-ui.com/docs/pieces/components/stay-summary)
- [HouseRulesSection](https://puzzle-ui.com/docs/pieces/components/house-rules)

Restaurant menus are also presentation-only. `RestaurantMenuSection`,
`DishCard`, and `DietaryInformation` render caller-supplied menu, price,
dietary-tag, and allergen data. Filtering matches supplied dietary-tag IDs;
allergen accuracy, ordering, and payment remain application responsibilities.
See the [Restaurant Menu reference](https://puzzle-ui.com/docs/pieces/components/restaurant-menu).

For restaurant hours, `OpeningHoursSection` requires an explicit venue timezone
and supplied instant to show an open/closed status; it never assumes the
server's or browser's timezone. `TableReservationSection` validates local form
values and calls the supplied callback or links to an external provider. It
does not check table availability or create a reservation. See the [Opening
Hours](https://puzzle-ui.com/docs/pieces/components/opening-hours), [Table
Reservation](https://puzzle-ui.com/docs/pieces/components/table-reservation),
and [Restaurant Experience](https://puzzle-ui.com/docs/pieces/components/restaurant-experience)
references.

Shared hospitality presentation builds on existing `TestimonialsSection`,
`ResourceSection`, `TeamSection`, `ServicesSection`, and `ProductGridSection`
renderers. Use `GuestReviewsSection` for review dates, sources, and supplied
score distributions; `LocalGuideSection` for caller-supplied places, distances,
travel times, and optional map content; `HostProfileSection` for one host and
their story; `ServiceOptionsSection` for included or optional services; and
`GiftVoucherSection` for externally purchased vouchers and packages. These
components do not calculate routes, prices, availability, ratings, or checkout.
See the [Hospitality Overview](https://puzzle-ui.com/docs/pieces/components/hospitality-overview),
[Boutique B&B](https://puzzle-ui.com/docs/pieces/components/boutique-bnb), and
[Restaurant Experience](https://puzzle-ui.com/docs/pieces/components/restaurant-experience)
compositions.

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
