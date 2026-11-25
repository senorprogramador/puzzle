# Component selection

Choose the simplest implementation that meets the visual, interaction, and
accessibility requirements. Reusing Puzzle is preferred when it improves
consistency or saves meaningful work, not as an end in itself.

## Decision process

1. Describe the required content, layout, interaction, and responsive states.
2. Search the [Pieces catalog](../../../apps/site/content/docs/pieces/index.mdx)
   by purpose, category, page type, content type, layout, functionality, and
   variant.
3. Compare likely Pieces and inspect the family's documentation, live index,
   types, and root export. Confirm the exact props and variant.
4. If no Piece fits, search the [UI catalog](../../../apps/site/content/docs/ui/index.mdx)
   and verify the component's public export, API, and maturity label.
5. Compose UI primitives when they provide the needed behavior without an
   oversized section composition.
6. Otherwise use normal React nodes and semantic HTML. Create a new reusable
   component only when there is a real repeated use case or a useful public
   contract.

Preferred starting order:

1. `@puzzle-ui/pieces` for an appropriate page-section composition.
2. `@puzzle-ui/ui` for reusable interface primitives.
3. Existing shared components in the application or project.
4. Normal React components and semantic HTML.

This is a preference, not a mandate. Do not use a Piece when its composition is
unnecessarily complex, and do not recreate functionality already available in
UI.

## Good and poor fits

- **Good fit:** A page needs a complete, responsive hero composition. Search
  Pieces for the hero family, inspect its exact export and content contract,
  and pass copy, media, and consumer-owned actions.
- **Simpler fit:** A page needs only a heading and one link. Use a semantic
  heading and link (or a suitable UI control); do not assemble a full section
  Piece just to render them.
- **Good fit:** A custom application form needs shared accessible controls.
  Compose UI primitives and keep validation, submission, and business rules in
  the application.
- **Good fit:** A controlled application form should render from a Zod 4 object
  schema with automatic fields and schema validation. Use `ZodSchemaForm` from
  `@puzzle-ui/ui/zod`; install Zod 4 for that optional entry point and keep raw
  values and submission in the application.
- **Good fit:** A form repeats or nests caller-owned entries. Use `FieldArray`
  (or its `RepeaterField` alias) for accessible add/remove/order controls and
  render the nested inputs with the existing form primitives.
- **Good fit:** An application edits serialized JSON. Use `JsonEditor` for
  parsing, formatting, and caller-defined validation; use `TextEditor` for its
  structured rich-text document contract instead.
- **Good fit:** An application needs a specialized image or video file input.
  Use `ImageUpload` for orientation-aware local resizing, named variants, and
  optional crop/hotspot editors, or `VideoUpload` for metadata, a poster, and an
  injected resumable client. Neither component chooses a backend or sends data
  without a supplied upload handler. Use `FileUpload` for generic files and
  documents.
- **Good fit:** A form needs a start and end date with shared range
  highlighting, keyboard selection, localized calendar labels, or a two-month
  view. Use `DateRangePicker` from `@puzzle-ui/ui`; use `DatePicker` for a
  single date. Compose two controlled `DatePicker` components only when the
  fields intentionally have independent semantics.
- **Good fit:** A public website needs branding, navigation, a mobile menu, or
  locale and CTA slots. Use `SiteHeader` from `@puzzle-ui/pieces`; use
  `DashboardNavigation` for authenticated workspace navigation instead.
- **Good fit:** A lodging page needs caller-supplied day statuses and a
  check-in/check-out range. Use `AvailabilityCalendar`; use `DateRangePicker`
  directly when no hospitality availability presentation is needed.
- **Good fit:** An authorized application needs a responsive resource/day
  availability matrix with monthly navigation, selection, and a hand-off to
  its own bulk editor. Use `AvailabilityManager`; keep availability rules,
  price arithmetic, authorization, and persistence in the application.
- **Good fit:** A reusable inquiry flow needs standard fields, local validation,
  consent, async feedback, and a typed callback. Use `ContactForm`; use
  `ContactSection` when the page needs contact details and slots rather than
  form behavior.
- **Good fit:** An application needs a standalone image crop or focal
  point/hotspot editor. Use `ImageCropper` and `ImageHotspotEditor` from
  `@puzzle-ui/ui`; their normalized values are source-relative presentation
  contracts. Use `ImageUpload` when those edits need to compose with local
  image processing and an injected upload action.
- **Good fit:** A CMS application needs an authoring shell, content list,
  schema-driven form, block list, locale switcher, relationship picker,
  revision history, publication scheduling controls, calendar, or audit table.
  Compose the CMS Pieces with caller-provided data and Fullstack CMS actions;
  keep authorization, validation, revisions, persistence, and job execution on
  the server.
- **Good fit:** A lodging page needs date/guest search presentation, rate cards,
  a stay summary, or house rules. Use the hospitality Pieces with values and
  actions supplied by the application; the app still owns provider-specific
  validation and every availability or price calculation.
- **Good fit:** A restaurant page needs caller-provided menus, category
  navigation, dish cards, or dietary labels. Compose `RestaurantMenuSection`
  with `DishCard` and `DietaryInformation`; the application supplies accurate
  allergen data and owns ordering and payment.
- **Good fit:** A restaurant page needs opening hours or a reservation form.
  Compose `OpeningHoursSection` and `TableReservationSection` with the
  application-provided schedule, timezone, status instant, and submit action.
  The application still owns availability, reservation confirmation, and
  persistence.
- **Good fit:** A hospitality page needs reviews with sources/dates, nearby
  recommendations, a single host profile, included/optional services, or gift
  vouchers. Prefer `GuestReviewsSection`, `LocalGuideSection`,
  `HostProfileSection`, `ServiceOptionsSection`, or `GiftVoucherSection`;
  each reuses the relevant Testimonials, Resource, Team, Services, or Product
  Grid renderer. Keep review scores, distances, prices, and purchase links
  caller-supplied.
- **Simpler fit:** Generic quotes, a venue address, a team directory, general
  service cards, or an ordinary product catalog should continue to use
  `TestimonialsSection`, `LocationSection`, `TeamSection`, `ServicesSection`,
  or `ProductGridSection` directly.
- **Poor fit:** Use a pricing or booking section to imply live prices,
  availability, reservations, or transactions. Pieces present supplied data;
  the application owns those data and behaviors.
- **Poor fit:** Ask a local guide to geocode or calculate routes, derive a
  guest score from source reviews, or let a voucher section manage checkout.
  Supply those results and actions from the application.

More Puzzle components do not automatically mean a better or more consistent
result. Weigh fit, accessibility, API maturity, responsive behavior, and
composition cost. See [Pieces instructions](../../../packages/pieces/AGENTS.md),
[UI instructions](../../../packages/ui/AGENTS.md), and the [AI documentation
index](../README.md) for known documentation inconsistencies.

When adding or significantly changing a component, follow the [component
development workflow](../workflows/component-development.md) so tests,
documentation, previews, registry metadata, and AI guidance remain synchronized.
