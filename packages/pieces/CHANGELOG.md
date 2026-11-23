# Changelog

All notable changes to `@puzzle-ui/pieces` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.18.0 - 2026-11-23

- Changed `ConfirmAction` to use an `alertdialog`, support async `onConfirm` with a pending state and retry error message, and restore focus to the trigger on close.
- Added keyboard and focus support to horizontal `ActivitySection` lists, ticker `Announcement` lists, and horizontal `GallerySection` lists.
- Fixed `Announcement` to move focus to the next dismiss button after dismissing a message.
- Fixed `GallerySection` to return focus to the triggering item when its lightbox closes.
- Fixed `NotificationItem` accessibility with unread status text and a dismiss button labelled by the notification title.
- Fixed `DashboardMobileNavigation` to close after an item is navigated.
- Fixed `CartSummary` mobile layout, showing product images and aligning item columns.
- Fixed `ContentSection`, `Features`, and `GallerySection` layouts when media or a sidebar is absent, and improved responsive stacking, container-based breakpoints, and long-text wrapping.
- Fixed `VideoSection` vertical video aspect ratio and sizing.
- Improved responsive styling of booking, checkout, payment method, dashboard, and data-display pieces, and added extensive browser test coverage.

## 0.17.0 - 2026-11-22

- Added `SiteHeader` with default, transparent, overlay, minimal, and centered variants, nested navigation, primary and secondary actions, sticky/scrolled states, and a mobile menu.
- Added `LocaleSwitcher` for caller-supplied language destinations, with dropdown, inline, and compact presentations.
- Added `ContactForm` with configurable text, email, phone, textarea, select, and checkbox fields, consent and privacy-link support, honeypot spam protection, and loading, error, and success states, leaving submission and validation to the application.
- Added `AvailabilityCalendar` for caller-supplied day-level accommodation availability, with stay-range selection, minimum/maximum nights, one or two months, status legends, and per-day prices.
- Added `AvailabilityManager`, a resource-by-day availability grid with single, range, and multiple selection, bulk status and minor-unit price edits, and customizable slots for application-owned editors.
- Updated the Boutique B&B reference page and hospitality booking flow to use the new site header, availability calendar, and contact form.
- The number of stable canonical Pieces component APIs is now 132.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- Added caller-data-driven Media compositions: `MediaLibrary`, `AssetPickerDialog`, `AssetDetailsPanel`, and `MediaField`, with sanitized Media audit presentation.
- Added CMS authoring compositions: `CmsShell`, `ContentList`, `ContentEditor`, `BlockEditor`, `ContentTypeBuilder`, `LocalizationEditor`, `RelationshipField`, `RevisionHistory`, `PublishScheduler`, `EditorialCalendar`, `AuditLogViewer`, and `WebhookManagement`.
- Added remote content-list controls, draft protection, revision comparisons, and relationship search with removable previews.
- Added commerce `CheckoutSection` and `PaymentMethodSelector` pieces.
- Refactored carousel-based and grid sections (categories, product grid/gallery, product showcase, gallery, testimonials, logo cloud, integrations, how-it-works, and others) onto a shared carousel primitive and trimmed styles.
- Marked all canonical component APIs and aliases as Stable, with updated registry and docs.
- Fixed point-hotspot persistence and media preview sizing with framework image overrides, including Next.js.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Added hospitality sections for accommodation discovery: `AccommodationOverviewSection`, `AccommodationDetailsSection`, `AmenityListSection`, `AvailabilitySearchSection`, `RatePlansSection`, `StaySummarySection`, `HouseRulesSection`, `HostProfileSection`, `ServiceOptionsSection`, `GuestReviewsSection`, `LocalGuideSection` and `GiftVoucherSection`.
- Added restaurant sections: `RestaurantMenuSection`, `DishCard`, `DietaryInformation`, `OpeningHoursSection` and `TableReservationSection`.
- Extended testimonial items with optional `metadata`. Resource items now have optional `href` and `metadata`, for reusable hospitality compositions.
- Marketing, content, business, commerce, dashboard, footer and other sections now use `Heading`, `Text`, `Select`, `Slider` and `RadioGroup` from `@puzzle-ui/ui`, replacing raw HTML elements. The Pricing billing interval is now a `RadioGroup` and its calculator uses `Slider`.
- `HowItWorks` now lazy-loads its carousel and falls back to a static ordered list. The footer has a background change and better wrapping of long group headings.
- Added packaged AI guidance (`ai/` instructions and manifest) and updated the README.

## 0.12.0 - 2026-11-18

- Added marketing sections: `Announcement`, `Benefits`, `CodeShowcase`, `Comparison`, `CTA`, `FAQ`, `Features`, `HowItWorks`, `Integrations`, `LogoCloud`, `Pricing`, `ProductShowcase`, `Roadmap`, `Security`, `Stats`, `Testimonials`, `UseCases` and `WaitlistSection`.
- Added business sections: `AboutSection`, `AwardsSection`, `CareersSection`, `CaseStudiesSection`, `ContactSection`, `LocationSection`, `PartnersSection`, `ServicesSection` and `TeamSection`.
- Added commerce sections: `ProductGrid`, `ProductGallery`, `ProductDetails`, `CartSummary`, `Categories`, `CommerceBenefits` and `BookingSection`.
- Added content sections: `BlogSection`, `ChangelogSection`, `ContentSection`, `EventSection`, `GallerySection`, `ResourceSection`, `TimelineSection` and `VideoSection`.
- Added application pieces: dashboard shell, header, stat cards, progress card and activity feed with `DashboardOverviewSection`, dashboard navigation (sidebar, topbar, mobile navigation, breadcrumbs, user menu), `ActivitySection`, `OnboardingSection`, `ProjectSection`, settings, feedback and confirm-action pieces, and data-display pieces such as the empty-state panel and metric comparison.
- Added `FooterSection` and a shared section types module.
- Added `AsymmetricHero` preset.
- Improved hero layouts: media now fills its frame, tablet and mobile spacing and aspect ratios are refined, stacked layout rules apply only when a media position is set, and `SplitHero` now defaults to large height.
- Fixed hero and section rendering during server-side rendering.
- Updated the package description to cover page sections and dashboard components, and added a README and architecture guide.

## 0.11.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.1 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

### Added

- Initial release of reusable, configurable hero components, including `Hero` and layout, alignment, theme, media, and content-width options.
- Added ready-made hero variants for split, centered, full-screen, video, image, minimal, editorial, agency, product, SaaS, store, restaurant, accommodation, print-shop, dashboard, app, campaign, coming-soon, and search layouts.
