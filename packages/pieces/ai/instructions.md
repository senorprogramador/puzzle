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

## Media management

Choose `MediaLibrary` for browsing and organizing caller-owned assets,
`AssetPickerDialog` for confirmed ID selection, `AssetDetailsPanel` for
metadata/crop/hotspot editing, and `MediaField` for a single form reference.
Import these by name from `@puzzle-ui/pieces`; compose their existing
`@puzzle-ui/ui` TreeView, DataTable, Autocomplete, upload, image-editing, Dialog,
and Drawer primitives rather than creating replacements.

Pass a `MediaLibraryAsset` client projection, never a storage-domain record.
The projection excludes object keys, tenant/audit internals, and processing
errors. Preview URLs are caller-provided temporary authorized image/poster
URLs; selection and form values are asset IDs. Upload, filtering data, access
permissions, metadata persistence, and validation policy remain caller-owned.
Media previews request unoptimized framework-image rendering; hosts still
authorize and control the lifetime of each preview URL.

## CMS authoring

Use the CMS family (`CmsShell`, `ContentList`, `ContentEditor`,
`ContentTypeBuilder`, `LocalizationEditor`, `RelationshipField`,
`RevisionHistory`, `PublishScheduler`, `EditorialCalendar`, and
`AuditLogViewer`, and `WebhookManagement`) only when the application already owns a CMS client/server
integration. These Pieces accept caller-provided content, status, locale,
revision, and audit data plus callbacks; they never fetch, authorize, schedule,
or persist. `BlockEditor` edits serializable `{ type, fields }` blocks against
caller-provided definitions. Use `ContentEditor.renderField` to compose
application-specific controls such as `MediaField` or `RelationshipField`.
CMS policy, validation, revision checks, and scheduler execution must still be
enforced by the server.
Use `CmsShell.breadcrumbs` for caller-owned navigation trails; the final UI
breadcrumb is the current page and has no link.
For server-driven content lists, use `ContentList.remote` with a controlled
query and caller-owned cursor navigation. Reset cursor history on query changes,
fetch authorized pages in the host, and keep server ordering; local filtering
and sorting are disabled in this mode.
Use controlled `ContentList.selection` for cross-page IDs and caller-authorized
bulk actions; return explicit successes and failures for every requested ID.
Enable `ContentEditor.confirmDiscard` and `warnOnUnload` where appropriate;
the host router must separately block client-side navigation while dirty. Include
`onInvalidDraftChange` in that guard: built-in JSON fields keep invalid text
locally and block save/publish until corrected or discarded. Custom renderers
must track their own invalid drafts. `BlockEditor` and `LocalizationEditor`
also expose `onInvalidDraftChange` for their built-in JSON editors; hosts must
block save/navigation and avoid externally switching locales while invalid.
For `RevisionHistory` field diffs, include the current revision in `revisions`
and set `currentRevisionNumber`; the comparison does not cover metadata.
Use `RevisionHistory.confirmRestore` when a restore needs explicit confirmation.
For server-backed relationship search, set `RelationshipField.searchMode` to
`"remote"` and provide `onSearch`; the host supplies authorized results and
must validate selected IDs again on the server.
Use `WebhookManagement` with sanitized subscription and delivery projections;
the host owns secret provisioning, authorization, fetching, worker scheduling,
and stale-response handling. Never pass secret values or references.
`AuditLogViewer` can display authorized Media audit projections as well as CMS
events; provide a stable ID and an empty resource ID when unavailable.

The CMS authoring family uses public, serializable `@puzzle-ui/cms` types.
Keep that package's service implementations and storage adapters out of client
code; Pieces renders field types and supplied values without calling CMS
services.
