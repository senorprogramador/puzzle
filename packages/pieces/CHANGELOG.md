# Changelog

All notable changes to `@puzzle-ui/pieces` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

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
