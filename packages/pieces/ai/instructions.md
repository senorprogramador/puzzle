# @puzzle-ui/pieces

Use Pieces for composable React page sections. Pieces are presentation
components; the application owns routing, data loading, validation,
authentication, payments, availability, and backend behavior.

Install with `npm install @puzzle-ui/pieces`. Components are named exports from
the package root (`@puzzle-ui/pieces`); family subpaths are not public. Find a
component in the published documentation and confirm its export, props, and
supported variants in the installed types before using it.

Compose a page from purpose-fit sections, UI primitives, and semantic Theme
tokens. Keep layouts fluid and mobile-first; supply meaningful alternative text
and consumer-owned actions, links, copy, and media.

## API maturity

All canonical public component APIs and published aliases are Stable, with
backward compatibility intended within a major version. Use only documented
props and variants; breaking API changes require a major release. Stable is an
API compatibility commitment, not a production-readiness guarantee.

For accommodation booking presentation, use `AvailabilitySearchSection`,
`RatePlansSection`, and `StaySummarySection` with application-provided values;
use `HouseRulesSection` for owner-provided policies. These components perform
only local search-form validation and currency/date display. The application
owns availability checks, provider-specific validation, price calculations,
reservations, persistence, navigation, and payment. Use the existing
`BookingSection` instead when its generic booking slots are the simpler fit.

For restaurant menus, compose `RestaurantMenuSection` with the supporting
`DishCard` and `DietaryInformation` components. Provide menu, price, dietary,
and allergen data explicitly; filtering only matches supplied dietary-tag IDs.
Pieces does not infer allergens or provide ordering or payment behavior.

For restaurant pages, use `OpeningHoursSection` for caller-owned weekly,
seasonal, and exception schedules; current status requires an explicit venue
timezone and status instant. Use `TableReservationSection` to present a
reservation request or external provider link. Its validation is local form
validation only: the application owns availability, confirmation, and
reservation persistence. The `Restaurant Experience` docs show the complete
composition.

For shared hospitality content, prefer `GuestReviewsSection` over
`TestimonialsSection` only when review dates, sources, or a supplied rating
distribution are needed. Use `LocalGuideSection` for nearby recommendations
with distances and travel times supplied by the application; use
`LocationSection` for the venue itself. `HostProfileSection` composes one host
through `TeamSection`, `ServiceOptionsSection` reuses `ServicesSection`, and
`GiftVoucherSection` reuses `ProductGridSection`. These Pieces do not calculate
ratings, routes, service prices, or checkout.

Do not add fetches, navigation, persistence, or business rules to a Piece. Do
not assume a universal variant or item type, deep-import a family, or infer API
stability from a component name. See the [Pieces documentation](https://puzzle-ui.com/docs/pieces).
