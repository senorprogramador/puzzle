# Puzzle component API stability audit

## Scope and method

Audited all 72 individually documented components in `@puzzle-ui/ui`, all 132
canonical components documented by `@puzzle-ui/pieces` (including 14 canonical
Hero components; the package also exposes 11 aliases that are not double-counted), and 46 other React components documented by the Theme (2), Icons
(1), Fullstack (7), and SEO (36) package guides. Aliases are recorded with
their canonical component and are not double-counted. The UI component index
and shared Hero page are documentation pages, not additional components.

The public API below is taken from the package entry points and component
exports, not inferred from examples. Validation evidence is based on
component-local test files and the public package peer dependencies. The site
package declares React and React DOM 19 as peers. The component inventory
contains 250 APIs: 249 Stable and `SectionHeader` Beta. Stable classifications
include documented backward-compatibility intent within a major version.
Package-level utility and adapter APIs retain their separate maturity
classifications below.

No `@deprecated` annotations or deprecated component exports were found in the
audited component APIs.

**Status definitions used**

- **Stable** requires a consistent, tested API and an explicit backward
  compatibility intent.
- **Beta** means the API is functional and validated, but can still evolve.
- **Experimental** means validation evidence is insufficient for the current
  public surface.

These classifications assess API maturity. Package guides document the
compatibility, accessibility, and implementation limitations for each area.

## Inventory

### `@puzzle-ui/ui`

Public component and prop type names are exported by `packages/ui/src/index.ts`.
The test count is the number of test files in the component source directory
(including nested parts).

| Component | Current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| Button | `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize` | Stable | 3 local test files covering the internal ButtonContent helper, variants/sizes, native and link behavior, refs, forms, loading/disabled states, keyboard focus and themed hover. Scoped backward-compatibility intent documented. |
| Button Group | `ButtonGroup`, `ButtonGroupProps` | Stable | 2 local test files covering direct-child disabling, refs, polymorphism, props/styles, tab order, attached layout, both orientations and RTL. Scoped backward-compatibility intent documented. |
| Toggle Group | `ToggleGroup`, `ToggleGroupProps`, `ToggleGroupSingleProps`, `ToggleGroupMultipleProps`, `ToggleGroupItemProps`, `ToggleGroupSize`, `ToggleGroupOrientation` | Stable | 2 local test files covering controlled/uncontrolled single/multiple selection, required behavior, disabled/loading/ARIA-disabled states, event composition, keyboard/RTL focus and light/dark attached layout. Includes ToggleGroup.Item; scoped backward-compatibility intent documented. |
| Alert | `Alert`, `AlertProps`, `AlertSeverity`, `AlertVariant` | Stable | 3 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Avatar | `Avatar`, `AvatarProps`, `AvatarShape` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| Badge | `Badge`, `BadgeProps`, `BadgeColor`, `AnchorOrigin`, `AnchorOffset`, `AnchorOverlap` | Stable | 2 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`, `CardMedia`, card variant/size/orientation/part/props types | Stable | 2 local test files. Compound API has several named parts; within-major backward-compatibility intent documented. |
| Empty State | `EmptyState`, `EmptyStateHeader`, `EmptyStateMedia`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateContent`, related props/size/variant types | Stable | 3 local test files. Compound API; within-major backward-compatibility intent documented. |
| Image | `Image`, `ImageProps`, `ImageSource`, `ImageSourceData`, `ImageSourceSet`, `ImageFit`, `ImageRadius`, `ImagePlaceholder` | Stable | 1 local test file. Framework-specific image integrations are not implied by the core API. |
| Paper | `Paper`, `PaperProps` | Stable | 1 local test file; the component API now has within-major backward-compatibility intent. |
| Progress | `CircularProgress`, `CircularProgressProps`, `CircularProgressSize`, `LinearProgress`, `LinearProgressProps`, `ProgressProps` | Stable | 3 local test files. Two public visual primitives share a documentation page; within-major backward-compatibility intent documented. |
| Rating | `Rating`, `RatingProps`, `RatingSize` | Stable | 3 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Skeleton | `Skeleton`, `SkeletonProps`, `SkeletonRadius` | Stable | 1 local test file; the component API now has within-major backward-compatibility intent. |
| Text Editor | `TextEditor`, `TextEditorProps`, `TextEditorToolbar`, `TextEditorToolbarProps`, `TextRenderer`, `TextRendererProps`, `useTextEditor`, and exported document/mark/selection model types | Stable | 4 local test files. Rich-text document model is a broad API; within-major backward-compatibility intent documented. |
| Autocomplete | `Autocomplete` and single/multiple value, option, size, change-reason, and render-state types | Stable | 1 local test file. Multiple selection and custom rendering broaden the API; within-major backward-compatibility intent documented. |
| Checkbox | `Checkbox`, `CheckboxProps`, `CheckboxSize` | Stable | 2 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Color Picker | `ColorPicker`, `ColorPickerProps`, `ColorPickerFormat`, `ColorPickerSwatch` | Stable | 3 local test files. Several input modes are exposed; within-major backward-compatibility intent documented. |
| Date Picker | `DatePicker`, `DatePickerProps`, `DatePickerSize` | Stable | 2 local test files. Calendar interaction is framework/browser-sensitive; test the target environment. |
| Date Range Picker | `DateRangePicker`, `DateRange`, `DateRangeDayState`, `DateRangePickerProps`, `DateRangePickerSize` | Stable | 3 local test files covering local-date range selection, validation, disabled dates, keyboard navigation, and browser focus restoration. |
| File Upload | `FileUpload` and item, status, rejection, upload-context, and handler types | Stable | 3 local test files. Upload transport is supplied by the consumer; within-major backward-compatibility intent documented. |
| Form Field | `FormField`, `FormFieldProps` | Stable | 4 local test files. Composition is defined by child control relationships; within-major backward-compatibility intent documented. |
| Input Group | `InputGroup`, `InputGroupAddonProps`, `InputGroupAddonAlign`, `InputGroupProps` | Stable | 3 local test files. Compound parts; within-major backward-compatibility intent documented. |
| Label | `Label`, `LabelProps` | Stable | 1 local test file; native label behavior and the component API now have within-major backward-compatibility intent. |
| Number Input | `NumberInput`, `NumberInputProps` | Stable | 1 local test file covers numeric edge cases; within-major backward-compatibility intent documented. |
| Radio Group | `RadioGroup`, `Radio`, `RadioGroupProps`, `RadioProps`, orientation and size types | Stable | 3 local test files. Compound selection and keyboard behavior are interaction-sensitive; within-major backward-compatibility intent documented. |
| Select | `Select`, `SelectOption`, single/multiple props and size types | Stable | 1 local test file. Multiple selection and option identity need continued behavioral validation. |
| Slider | `Slider`, `SliderProps`, `SliderMark`, `SliderSize` | Stable | 2 local test files. Pointer and keyboard behavior are interaction-sensitive; within-major backward-compatibility intent documented. |
| Stepper | `Stepper`, `StepperProps`, `StepperStepProps`, `StepperOrientation` | Stable | 1 local test file. ID-based and index-based composition are distinct modes; within-major backward-compatibility intent documented. |
| Switch | `Switch`, `SwitchProps`, `SwitchSize` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| Text Area Input | `TextAreaInput`, `TextAreaInputProps` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| Text Input | `TextInput`, `TextInputProps`, `TextInputType` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| Time Picker | `TimePicker`, `TimePickerProps`, `TimePickerSize` | Stable | 3 local test files. Uses the browser's native time picker; appearance and behavior vary by browser. |
| Token Input | `TokenInput`, `TokenInputProps`, `TokenInputMode`, `TokenInputSize` | Stable | 3 local test files. Character-slot interaction is specialized; within-major backward-compatibility intent documented. |
| App Bar | `AppBar`, `AppBarNavigationItem`, `AppBarProps` | Stable | 1 local test file. Navigation is passed as data; app routing remains consumer-owned. |
| Aspect Ratio | `AspectRatio`, `AspectRatioProps` | Stable | 3 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Background | `Background`, `BackgroundProps`, `BackgroundPattern`, `BackgroundFade`, `BackgroundMeshColors` | Stable | 1 local test file covers visual configuration; the component API now has within-major backward-compatibility intent. |
| Bottom Navigation | `BottomNavigation`, `BottomNavigationItem`, `BottomNavigationProps`, `BottomNavigationItemProps` | Stable | 2 local test files. Navigation destinations remain consumer-owned; within-major backward-compatibility intent documented. |
| Breadcrumbs | `Breadcrumbs`, `BreadcrumbsProps`, `BreadcrumbItem` | Stable | 1 local test file covers navigation semantics and accessible naming; the component API now has within-major backward-compatibility intent. |
| Collapsable Sidebar | `CollapsableSidebar` and item/group/entry/expansion/link-handler types | Stable | 1 local test file. Several item forms and responsive behaviors are exposed; within-major backward-compatibility intent documented. |
| Container | `Container`, `ContainerProps`, `ContainerWidthPreset` | Stable | 3 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Grid | `Grid`, `GridItem`, generic `GridProps<C>`, `GridItemProps<C>`, `GridGap`, `GridAlignment`, `GridTracks`, `GridSpan`, `GridLine`, `GridAutoFlow` | Stable | Unit and browser test files cover composition, refs, responsive props, RTL, placement, and SSR. React 19 peer; within-major backward-compatibility intent documented. Numeric layout values are validated; CSS strings pass through to the browser. |
| Page Layout | `PageLayout`, `PageLayoutProps`, `SidebarPlacement` | Stable | 1 local test file. Compound layout slots; within-major backward-compatibility intent documented. |
| Resizable Panels | `ResizablePanels`, `ResizablePanel`, `ResizableHandle` and related props/orientation types | Stable | 3 local test files. Pointer/keyboard resizing and layout composition are interaction-sensitive. |
| Scroll Area | `ScrollArea`, `ScrollAreaProps`, `ScrollAreaOrientation` | Stable | 3 local test files. Uses native browser scrolling; within-major backward-compatibility intent documented. |
| Section Stack | `SectionStack`, `SectionStackProps` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| Section | `Section`, `SectionProps`, `SectionTheme` | Stable | 1 local test file. React 19 peer; within-major backward-compatibility intent documented. |
| SectionHeader | `SectionHeader`, `SectionHeaderAlignment`, `SectionHeaderProps` | Beta | The shared section API is still being exercised by upcoming Pieces families; a Stable compatibility commitment is not yet made. |
| Separator | `Separator`, `SeparatorProps`, `SeparatorOrientation` | Stable | 3 local test files. React 19 peer; within-major backward-compatibility intent documented. |
| Sidebar | `Sidebar`, `SidebarProps` | Stable | 1 local test file covers layout and landmark behavior; the component API now has within-major backward-compatibility intent. |
| Stack | `Stack`, `StackProps`, responsive direction and alignment types | Stable | 2 local test files. Responsive layout props; within-major backward-compatibility intent documented. |
| Accordion | `Accordion`, `AccordionProps`, item data/type/id/value types | Stable | 1 local test file. ID-based and index-based selection are separate modes; within-major backward-compatibility intent documented. |
| Carousel | `Carousel`, `CarouselController`, `useCarouselContext`, carousel/controller/context configuration types | Stable | 2 local test files. Pointer, touch, and keyboard behaviors require continued cross-browser validation. |
| Link | `Link`, `LinkProps` | Stable | 1 local test file. Optional router integration does not make the component framework-specific; within-major backward-compatibility intent documented. |
| Pagination | `Pagination`, `PaginationProps` | Stable | 3 local test files. Navigation semantics and consumer URL state remain application-owned. |
| Tabs | `Tabs`, `TabsTab`, `TabsProps`, `TabsTabProps`, `TabsPosition` | Stable | 1 local test file. Compound tab/tabpanel keyboard behavior is interaction-sensitive. |
| Tree View | `TreeView` and item/state/selection/size types | Stable | 1 local test file. Selection, expansion, and keyboard interactions are a complex public surface. |
| Backdrop | `Backdrop`, `BackdropProps` | Stable | 1 local test file covers dismissal and overlay integration; the component API now has within-major backward-compatibility intent. |
| Command | `Command`, `CommandDialog`, item/props types | Stable | 3 local test files. Search, focus, and keyboard navigation are interaction-sensitive. |
| Context Menu | `ContextMenu` and trigger/content/item/group/label/separator/checkbox/radio/submenu parts with props/state types | Stable | 3 local test files. Large compound interaction API; within-major backward-compatibility intent documented. |
| Dialog | `Dialog`, `DialogProps` | Stable | 1 local test file. Modal focus and dismissal behavior require continued accessibility validation. |
| Drawer | `Drawer`, `DrawerProps` | Stable | 2 local test files. Modal/resizable behavior is interaction-sensitive; within-major backward-compatibility intent documented. |
| Dropdown Menu | `DropdownMenu` and trigger/content/item/group/label/separator/checkbox/radio parts with props/position types | Stable | 3 local test files. Compound keyboard interaction API; within-major backward-compatibility intent documented. |
| Notification | `Notification`, `NotificationViewport`, `NotificationProvider`, `useNotification`, and notification item/action/options/severity/position/provider types | Stable | 3 local test files. Global provider and transient lifecycle are a broad API; within-major backward-compatibility intent documented. |
| Popout | `Popout`, `PopoutProps`, `PopoutPosition`, `PopoutAlignment`, `PopoutAction`, `PopoutTriggerProps` | Stable | 1 local test file. Low-level floating positioning; consumer owns content semantics. |
| Popover | `Popover`, `PopoverProps` | Stable | 2 local test files. Focus and dismissal behavior are interaction-sensitive. |
| Portal | `Portal`, `PortalTarget`, and corresponding props types | Stable | 1 local test file. Depends on a browser document target; verify server-rendered usage. |
| Tooltip | `Tooltip`, `TooltipProps`, `TooltipContentProps`, `TooltipArrowSide` | Stable | 2 local test files. Pointer/focus and non-interactive content behavior require continued accessibility validation. |
| Heading | `Heading`, `HeadingProps`, `HeadingLevel` | Stable | 1 local test file. Consumers choose semantic heading level; within-major backward-compatibility intent documented. |
| Text | `Text`, `TextProps`, `TextType` | Stable | 1 local test file. Consumers remain responsible for semantic context; within-major backward-compatibility intent documented. |
| Preview | `Preview`, `PreviewProps`, `PreviewDevice`, `PreviewAlign`, `PreviewJustify` | Stable | 2 local test files. Isolated frame and device modes have browser-specific layout behavior. |
| Scroll Lock | `ScrollLock`, `ScrollLockProps` | Stable | 3 local test files. Document/window behavior is browser-sensitive; verify server-rendered usage. |
| Transition | `Transition`, `TransitionProps`, `TransitionPhase`, `TransitionTemplate` | Stable | 1 local test file. Mount/unmount timing and CSS template behavior may evolve. |

### `@puzzle-ui/pieces`

All components are re-exported from family indexes through
`packages/pieces/src/index.ts`. The generic Hero and every preset use the `HeroProps`
composition API. `ImageHero` and `VideoHero` additionally export their
specialized required-media prop types.

| Component | Current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| AgencyHero | `AgencyHero` using `HeroProps` | Stable | Preset defaults/overrides and browser rendering covered by shared tests. No separate named props type. |
| AsymmetricHero | `AsymmetricHero` using `HeroProps` | Stable | Preset defaults and overrides are covered by shared hero tests. Aliases: `EditorialHero`, `SaaSHero`. |
| CampaignHero | `CampaignHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| CenteredHero | `CenteredHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| ComingSoonHero | `ComingSoonHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| DashboardWelcomeHero | `DashboardWelcomeHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| FullScreenHero | `FullScreenHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited.  Aliases: `AccommodationHero`. |
| Hero | `Hero`, `HeroProps`, layout/media/alignment/height/theme/overlay/content-width/video-source types | Stable | Unit and browser tests cover the generic component, preset overrides, and media behavior. Flexible `as`, title, media, action, search, meta, children, and ARIA props; within-major backward-compatibility intent documented. |
| ImageHero | `ImageHero`, `ImageHeroProps` (`backgroundImage` required) | Stable | Shared hero tests cover image rendering and layout overrides. Consumer supplies usable image URLs and meaningful alt text for non-decorative media. |
| MinimalHero | `MinimalHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| RestaurantHero | `RestaurantHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| SearchHero | `SearchHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| SplitHero | `SplitHero` using `HeroProps` | Stable | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited.  Aliases: `AppHero`, `PrintShopHero`, `ProductHero`, `StoreHero`. |
| VideoHero | `VideoHero`, `VideoHeroProps` (`backgroundVideo` required) | Stable | Shared hero tests cover video rendering and height. Browser media behavior remains environment-dependent. |

### Other `@puzzle-ui/pieces` components

| Component | Current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| AboutSection | `AboutSection` and its exported props/types | Stable | Source: `src/components/business/about-section/about-section.tsx`; reference: `pieces/components/about-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AccommodationDetailsSection | `AccommodationDetailsSection` and its exported props/types | Stable | Source: `src/components/business/accommodation-details-section/accommodation-details-section.tsx`; reference: `pieces/components/accommodation-details.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AccommodationOverviewSection | `AccommodationOverviewSection` and its exported props/types | Stable | Source: `src/components/business/accommodation-overview-section/accommodation-overview-section.tsx`; reference: `pieces/components/accommodation-overview.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ActivitySection | `ActivitySection` and its exported props/types | Stable | Source: `src/components/activity/activity-section.tsx`; reference: `pieces/components/activity.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AmenityListSection | `AmenityListSection` and its exported props/types | Stable | Source: `src/components/business/amenity-list-section/amenity-list-section.tsx`; reference: `pieces/components/amenity-list.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AnnouncementSection | `AnnouncementSection` and its exported props/types | Stable | Source: `src/components/marketing/announcement/announcement.tsx`; reference: `pieces/components/announcement.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AssetDetailsPanel | `AssetDetailsPanel`, `AssetDetailsPanelProps`, and safe metadata patch types | Stable | Source: `src/components/media/asset-details-panel.tsx`; reference: `pieces/components/asset-details-panel.mdx`. Focused component tests cover metadata editing and crop/hotspot composition; callers own persistence and conflict handling. |
| AssetPickerDialog | `AssetPickerDialog`, discriminated single/multiple props, and picker types | Stable | Source: `src/components/media/asset-picker-dialog.tsx`; reference: `pieces/components/asset-picker-dialog.mdx`. Component/browser tests cover ID selection, kind filtering, narrow Drawer presentation, and Escape; UI overlays own focus management. |
| AvailabilitySearchSection | `AvailabilitySearchSection` and its exported props/types | Stable | Source: `src/components/commerce/availability-search-section/availability-search-section.tsx`; reference: `pieces/components/availability-search.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| AvailabilityCalendar | `AvailabilityCalendar`, `AvailabilityCalendarProps`, `AvailabilityDay`, and `AvailabilityDayStatus` | Stable | Source: `src/components/commerce/availability-calendar/availability-calendar.tsx`; reference: `pieces/components/availability-calendar.mdx`. Component tests cover supplied statuses, empty state, local stay constraints, and composition with DateRangePicker. |
| AvailabilityManager | `AvailabilityManager` and its exported props/types | Stable | Source: `src/components/commerce/availability-manager/availability-manager.tsx`; reference: `pieces/components/availability-manager.mdx`. Component and browser tests cover controlled resource/day data, date and range selection, bulk-edit presentation, accessibility, and responsive layouts; callers own persistence and availability rules. |
| AwardsSection | `AwardsSection` and its exported props/types | Stable | Source: `src/components/business/awards-section/awards-section.tsx`; reference: `pieces/components/awards-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| BenefitsSection | `BenefitsSection` and its exported props/types | Stable | Source: `src/components/marketing/benefits/benefits.tsx`; reference: `pieces/components/benefits.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| BlogSection | `BlogSection` and its exported props/types | Stable | Source: `src/components/content/blog-section/blog-section.tsx`; reference: `pieces/components/blog-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| BookingSection | `BookingSection` and its exported props/types | Stable | Source: `src/components/commerce/booking-section/booking-section.tsx`; reference: `pieces/components/booking-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CTASection | `CTASection` and its exported props/types | Stable | Source: `src/components/marketing/cta/cta.tsx`; reference: `pieces/components/cta.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CareersSection | `CareersSection` and its exported props/types | Stable | Source: `src/components/business/careers-section/careers-section.tsx`; reference: `pieces/components/careers-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CartSummarySection | `CartSummarySection` and its exported props/types | Stable | Source: `src/components/commerce/cart-summary/cart-summary.tsx`; reference: `pieces/components/cart-summary.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CheckoutSection | `CheckoutSection` and its exported props/types | Stable | Source: `src/components/commerce/checkout-section/checkout-section.tsx`; reference: `pieces/components/checkout.mdx`. The complete Pieces suite passed 836 tests; within-major compatibility is committed. |
| CaseStudiesSection | `CaseStudiesSection` and its exported props/types | Stable | Source: `src/components/business/case-studies-section/case-studies-section.tsx`; reference: `pieces/components/case-studies-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CategoriesSection | `CategoriesSection` and its exported props/types | Stable | Source: `src/components/commerce/categories/categories.tsx`; reference: `pieces/components/categories.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ChangelogSection | `ChangelogSection` and its exported props/types | Stable | Source: `src/components/content/changelog-section/changelog-section.tsx`; reference: `pieces/components/changelog-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CodeShowcaseSection | `CodeShowcaseSection` and its exported props/types | Stable | Source: `src/components/marketing/code-showcase/code-showcase.tsx`; reference: `pieces/components/code-showcase.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| CommerceBenefitsSection | `CommerceBenefitsSection` and its exported props/types | Stable | Source: `src/components/commerce/commerce-benefits/commerce-benefits.tsx`; reference: `pieces/components/commerce-benefits.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ComparisonSection | `ComparisonSection` and its exported props/types | Stable | Source: `src/components/marketing/comparison/comparison.tsx`; reference: `pieces/components/comparison.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ConfirmAction | `ConfirmAction` and its exported props/types | Stable | Source: `src/components/feedback/confirm-action.tsx`; reference: `pieces/components/feedback.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ContactSection | `ContactSection` and its exported props/types | Stable | Source: `src/components/business/contact-section/contact-section.tsx`; reference: `pieces/components/contact-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ContactForm | `ContactForm`, `ContactFormProps`, `ContactFormField`, `ContactFormConsent`, and typed value/error contracts | Stable | Source: `src/components/business/contact-form/contact-form.tsx`; reference: `pieces/components/contact-form.mdx`. Component tests cover required fields, consent, typed submission, and caller-owned async feedback. |
| ContentSection | `ContentSection` and its exported props/types | Stable | Source: `src/components/content/content-section/content-section.tsx`; reference: `pieces/components/content-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardActivityFeed | `DashboardActivityFeed` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-activity-feed.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardBreadcrumbs | `DashboardBreadcrumbs` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-breadcrumbs.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardHeader | `DashboardHeader` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-header.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardMobileNavigation | `DashboardMobileNavigation` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-mobile-navigation.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardNavigation | `DashboardNavigation` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-navigation.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardOverviewSection | `DashboardOverviewSection` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-overview-section.tsx`; reference: `pieces/components/application-dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardProgressCard | `DashboardProgressCard` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-progress-card.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardShell | `DashboardShell` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-shell.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardSidebar | `DashboardSidebar` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-sidebar.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardStatCard | `DashboardStatCard` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-stat-card.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardStatGroup | `DashboardStatGroup` and its exported props/types | Stable | Source: `src/components/dashboard/dashboard-stat-group.tsx`; reference: `pieces/components/dashboard.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardTopbar | `DashboardTopbar` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-topbar.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DashboardUserMenu | `DashboardUserMenu` and its exported props/types | Stable | Source: `src/components/navigation/dashboard-user-menu.tsx`; reference: `pieces/components/navigation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DietaryInformation | `DietaryInformation` and its exported props/types | Stable | Source: `src/components/commerce/dietary-information/dietary-information.tsx`; reference: `pieces/components/dietary-information.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| DishCard | `DishCard` and its exported props/types | Stable | Source: `src/components/commerce/dish-card/dish-card.tsx`; reference: `pieces/components/dish-card.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| EmptyStatePanel | `EmptyStatePanel` and its exported props/types | Stable | Source: `src/components/data-display/empty-state-panel.tsx`; reference: `pieces/components/empty-state.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| EmptyStateSection | `EmptyStateSection` and its exported props/types | Stable | Source: `src/components/data-display/empty-state-panel.tsx`; reference: `pieces/components/empty-state.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ErrorStatePanel | `ErrorStatePanel` and its exported props/types | Stable | Source: `src/components/feedback/feedback.tsx`; reference: `pieces/components/feedback.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| EventSection | `EventSection` and its exported props/types | Stable | Source: `src/components/content/event-section/event-section.tsx`; reference: `pieces/components/event-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| FAQSection | `FAQSection` and its exported props/types | Stable | Source: `src/components/marketing/faq/faq.tsx`; reference: `pieces/components/faq.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| FeaturesSection | `FeaturesSection` and its exported props/types | Stable | Source: `src/components/marketing/features/features.tsx`; reference: `pieces/components/features.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| FooterSection | `FooterSection` and its exported props/types | Stable | Source: `src/components/footer/footer-section.tsx`; reference: `pieces/components/footer-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| FormActions | `FormActions` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| GallerySection | `GallerySection` and its exported props/types | Stable | Source: `src/components/content/gallery-section/gallery-section.tsx`; reference: `pieces/components/gallery-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| GiftVoucherSection | `GiftVoucherSection` and its exported props/types | Stable | Source: `src/components/commerce/gift-voucher-section/gift-voucher-section.tsx`; reference: `pieces/components/gift-voucher.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| GuestReviewsSection | `GuestReviewsSection` and its exported props/types | Stable | Source: `src/components/marketing/guest-reviews-section/guest-reviews-section.tsx`; reference: `pieces/components/guest-reviews.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| HostProfileSection | `HostProfileSection` and its exported props/types | Stable | Source: `src/components/business/host-profile-section/host-profile-section.tsx`; reference: `pieces/components/host-profile.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| HouseRulesSection | `HouseRulesSection` and its exported props/types | Stable | Source: `src/components/business/house-rules-section/house-rules-section.tsx`; reference: `pieces/components/house-rules.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| HowItWorksSection | `HowItWorksSection` and its exported props/types | Stable | Source: `src/components/marketing/how-it-works/how-it-works.tsx`; reference: `pieces/components/how-it-works.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| IntegrationsSection | `IntegrationsSection` and its exported props/types | Stable | Source: `src/components/marketing/integrations/integrations.tsx`; reference: `pieces/components/integrations.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| LocalGuideSection | `LocalGuideSection` and its exported props/types | Stable | Source: `src/components/content/local-guide-section/local-guide-section.tsx`; reference: `pieces/components/local-guide.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| LocationSection | `LocationSection` and its exported props/types | Stable | Source: `src/components/business/location-section/location-section.tsx`; reference: `pieces/components/location-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| LocaleSwitcher | `LocaleSwitcher`, `LocaleSwitcherProps`, `LocaleOption`, and `LocaleSwitcherPresentation` | Stable | Source: `src/components/navigation/locale-switcher/locale-switcher.tsx`; reference: `pieces/components/locale-switcher.mdx`. Component tests cover dropdown and inline presentations; destinations remain caller-supplied. |
| SiteHeader | `SiteHeader`, `SiteHeaderProps`, `SiteHeaderVariant`, and `SiteNavigationItem` | Stable | Source: `src/components/navigation/site-header/site-header.tsx`; reference: `pieces/components/site-header.mdx`. Component and browser tests cover semantic navigation, active links, mobile dialog behavior, and focus-safe close handling. |
| LogoCloudSection | `LogoCloudSection` and its exported props/types | Stable | Source: `src/components/marketing/logo-cloud/logo-cloud.tsx`; reference: `pieces/components/logo-cloud.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| MediaField | `MediaField`, `MediaFieldProps`, and asset-ID value contract | Stable | Source: `src/components/media/media-field.tsx`; reference: `pieces/components/media-field.mdx`. Component tests cover required/error relationships, selection IDs, and read-only state; validation policy remains caller-owned. |
| MediaLibrary | `MediaLibrary`, safe `MediaLibraryAsset` projection, query, folder, and action types | Stable | Source: `src/components/media/media-library.tsx`; reference: `pieces/components/media-library.mdx`. Unit, component, and browser tests cover filters, folders, ID selection, partial bulk failures, upload composition, responsive layout, and keyboard use. |
| MetricComparison | `MetricComparison` and its exported props/types | Stable | Source: `src/components/data-display/metric-comparison.tsx`; reference: `pieces/components/data-display.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| NotificationItem | `NotificationItem` and its exported props/types | Stable | Source: `src/components/feedback/feedback.tsx`; reference: `pieces/components/feedback.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| NotificationList | `NotificationList` and its exported props/types | Stable | Source: `src/components/feedback/feedback.tsx`; reference: `pieces/components/feedback.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| OnboardingSection | `OnboardingSection` and its exported props/types | Stable | Source: `src/components/onboarding/onboarding-section.tsx`; reference: `pieces/components/onboarding.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| OpeningHoursSection | `OpeningHoursSection` and its exported props/types | Stable | Source: `src/components/business/opening-hours-section/opening-hours-section.tsx`; reference: `pieces/components/opening-hours.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| PartnersSection | `PartnersSection` and its exported props/types | Stable | Source: `src/components/business/partners-section/partners-section.tsx`; reference: `pieces/components/partners-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| PricingSection | `PricingSection` and its exported props/types | Stable | Source: `src/components/marketing/pricing/pricing.tsx`; reference: `pieces/components/pricing.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProductDetailsSection | `ProductDetailsSection` and its exported props/types | Stable | Source: `src/components/commerce/product-details/product-details.tsx`; reference: `pieces/components/product-details.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProductGallerySection | `ProductGallerySection` and its exported props/types | Stable | Source: `src/components/commerce/product-gallery/product-gallery.tsx`; reference: `pieces/components/product-gallery.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProductGridSection | `ProductGridSection` and its exported props/types | Stable | Source: `src/components/commerce/product-grid/product-grid.tsx`; reference: `pieces/components/product-grid.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| PaymentMethodSelector | `PaymentMethodSelector` and its exported props/types | Stable | Source: `src/components/commerce/payment-method-selector/payment-method-selector.tsx`; reference: `pieces/components/payment-method-selector.mdx`. The complete Pieces suite passed 836 tests; within-major compatibility is committed. |
| ProductShowcaseSection | `ProductShowcaseSection` and its exported props/types | Stable | Source: `src/components/marketing/product-showcase/product-showcase.tsx`; reference: `pieces/components/product-showcase.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProfileHeader | `ProfileHeader` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectCard | `ProjectCard` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectGrid | `ProjectGrid` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectHeader | `ProjectHeader` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectList | `ProjectList` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectMembers | `ProjectMembers` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectProgress | `ProjectProgress` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ProjectStatusBadge | `ProjectStatusBadge` and its exported props/types | Stable | Source: `src/components/project/project.tsx`; reference: `pieces/components/project.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| RatePlansSection | `RatePlansSection` and its exported props/types | Stable | Source: `src/components/commerce/rate-plans-section/rate-plans-section.tsx`; reference: `pieces/components/rate-plans.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ResourceSection | `ResourceSection` and its exported props/types | Stable | Source: `src/components/content/resource-section/resource-section.tsx`; reference: `pieces/components/resource-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| RestaurantMenuSection | `RestaurantMenuSection` and its exported props/types | Stable | Source: `src/components/commerce/restaurant-menu-section/restaurant-menu-section.tsx`; reference: `pieces/components/restaurant-menu.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| RoadmapSection | `RoadmapSection` and its exported props/types | Stable | Source: `src/components/marketing/roadmap/roadmap.tsx`; reference: `pieces/components/roadmap.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| SecurityMethodCard | `SecurityMethodCard` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| SecuritySection | `SecuritySection` and its exported props/types | Stable | Source: `src/components/marketing/security/security.tsx`; reference: `pieces/components/security.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ServiceOptionsSection | `ServiceOptionsSection` and its exported props/types | Stable | Source: `src/components/business/service-options-section/service-options-section.tsx`; reference: `pieces/components/service-options.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| ServicesSection | `ServicesSection` and its exported props/types | Stable | Source: `src/components/business/services-section/services-section.tsx`; reference: `pieces/components/services-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| SettingsGroup | `SettingsGroup` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| SettingsRow | `SettingsRow` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| SettingsSection | `SettingsSection` and its exported props/types | Stable | Source: `src/components/settings/settings.tsx`; reference: `pieces/components/settings.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| StatsSection | `StatsSection` and its exported props/types | Stable | Source: `src/components/marketing/stats/stats.tsx`; reference: `pieces/components/stats.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| StaySummarySection | `StaySummarySection` and its exported props/types | Stable | Source: `src/components/commerce/stay-summary-section/stay-summary-section.tsx`; reference: `pieces/components/stay-summary.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| TableReservationSection | `TableReservationSection` and its exported props/types | Stable | Source: `src/components/commerce/table-reservation-section/table-reservation-section.tsx`; reference: `pieces/components/table-reservation.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| TeamSection | `TeamSection` and its exported props/types | Stable | Source: `src/components/business/team-section/team-section.tsx`; reference: `pieces/components/team-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| TestimonialsSection | `TestimonialsSection` and its exported props/types | Stable | Source: `src/components/marketing/testimonials/testimonials.tsx`; reference: `pieces/components/testimonials.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| TimelineSection | `TimelineSection` and its exported props/types | Stable | Source: `src/components/content/timeline-section/timeline-section.tsx`; reference: `pieces/components/timeline-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| UseCasesSection | `UseCasesSection` and its exported props/types | Stable | Source: `src/components/marketing/use-cases/use-cases.tsx`; reference: `pieces/components/use-cases.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| VideoSection | `VideoSection` and its exported props/types | Stable | Source: `src/components/content/video-section/video-section.tsx`; reference: `pieces/components/video-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |
| WaitlistSection | `WaitlistSection` and its exported props/types | Stable | Source: `src/components/marketing/waitlist-section/waitlist-section.tsx`; reference: `pieces/components/waitlist-section.mdx`. The complete Pieces suite passed 874 tests; within-major compatibility is committed. |

### CMS authoring Pieces

| Component | Current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| AuditLogViewer | `AuditLogViewer`, `AuditLogViewerProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/audit-log-viewer.mdx`. Focused component tests cover filtering and pagination; the caller must authorize and tenant-scope audit data. |
| WebhookManagement | `WebhookManagement`, `WebhookManagementProps` | Stable | Source: `src/components/cms/webhook-management.tsx`; reference: `pieces/components/webhook-management.mdx`. Component and browser tests cover editing, retry, draft protection, and keyboard/responsiveness; authorization and delivery are caller-owned. |
| BlockEditor | `BlockEditor`, `BlockEditorProps`, `CmsBlockValue` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/block-editor.mdx`. Focused component tests cover schema-based add and invalid-value preservation; persistence and schema validation remain server-owned. |
| CmsShell | `CmsShell`, `CmsShellProps`, `CmsNavigationItem` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/cms-shell.mdx`. Component tests cover active navigation and composition; routes remain caller-owned. |
| ContentEditor | `ContentEditor`, `ContentEditorProps`, `ContentEditorFieldContext` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/content-editor.mdx`. Component tests cover controlled fields, action separation, and visible failures; server validation and revision checks remain required. |
| ContentList | `ContentList`, `ContentListProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/content-list.mdx`. Component tests cover filters, row actions, loading, error, empty, and permission-denied states. |
| ContentTypeBuilder | `ContentTypeBuilder`, `ContentTypeBuilderProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/content-type-builder.mdx`. Component tests cover field addition; server schema validation and migrations remain authoritative. |
| EditorialCalendar | `EditorialCalendar`, `EditorialCalendarProps`, `EditorialCalendarItem` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/editorial-calendar.mdx`. Component tests cover timezone grouping and selection; schedule data is caller-owned. |
| LocalizationEditor | `LocalizationEditor`, `LocalizationEditorProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/localization-editor.mdx`. Component tests cover missing translation state and locale selection; fallback behavior remains explicit. |
| PublishScheduler | `PublishScheduler`, `PublishSchedulerProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/publish-scheduler.mdx`. Component and unit tests cover explicit timezones and daylight-saving transitions; a host scheduler must execute revision-bound jobs. |
| RelationshipField | `RelationshipField`, `RelationshipFieldProps`, `RelationshipOption` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/relationship-field.mdx`. Component tests cover target type, status, locale constraints, and ID selection; the server must revalidate every reference. |
| RevisionHistory | `RevisionHistory`, `RevisionHistoryProps` | Stable | Source: `src/components/cms/cms-components.tsx`; reference: `pieces/components/revision-history.mdx`. Component tests cover restore callbacks; restoration must create a new revision on the server. |
### Other documented React components

These components are documented in package guides rather than under the UI or
Pieces component catalog. Their APIs are included because the docs publish
their component names and usage.

| Component | Package and current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| Theme | `@puzzle-ui/theme`: `Theme`, `ThemeProps`, `ThemeScope` | Stable | Provider, font configuration, and token CSS tests cover the documented component behavior. React 19 peer; within-major backward-compatibility intent documented. |
| GoogleFont | `@puzzle-ui/theme`: `GoogleFont`; `GoogleFontProps` is not exported | Stable | Font component output and configuration are covered by package tests. The props type is not separately exported but can be derived from the component type; within-major backward-compatibility intent documented. |
| Icon | `@puzzle-ui/icons`: `Icon`, `IconProps` | Stable | Component tests cover rendering/layout and loader/style behavior; generated collection declarations are checked for consistency. Iconify may load icon data asynchronously; network/CSP constraints are documented. React 19 peer. |
| AuthProvider | `@puzzle-ui/fullstack/auth/client`: `AuthProvider`, `AuthProviderProps` | Stable | Covered by `auth-react.test.mjs`; React 19 client entry. No backward-compatibility promise. |
| SignInForm | `@puzzle-ui/fullstack/auth/client`: `SignInForm`, `SignInFormProps`, `AuthFormProps` | Stable | Covered by `auth-react.test.mjs`, including email/password markup. Consumer owns surrounding navigation and policy. |
| SignUpForm | `@puzzle-ui/fullstack/auth/client`: `SignUpForm`, `SignUpFormProps`, `AuthFormProps` | Stable | Covered by `auth-react.test.mjs`; custom fields and persistence require consumer/server integration. |
| MfaChallengeForm | `@puzzle-ui/fullstack/auth/client`: `MfaChallengeForm`, `MfaChallengeFormProps`, `AuthFormProps` | Stable | Covered by `auth-react.test.mjs`; pending-MFA state is driven by the client/server contract. |
| AuthScreen | `@puzzle-ui/fullstack/auth/client`: `AuthScreen`, `AuthScreenProps` | Stable | Covered by `auth-react.test.mjs`; mode and custom-child composition may evolve. |
| MfaSettings | `@puzzle-ui/fullstack/auth/client`: `MfaSettings`, `MfaSettingsProps` | Stable | Covered by `auth-react.test.mjs`; server-side authorization remains required. |
| AuthExperience | `@puzzle-ui/fullstack/auth/client`: `AuthExperience`, `AuthExperienceProps`, `AuthExperienceConfig`, branding/layout/redirect/custom-field types | Stable | Covered by `auth-experience.test.mjs` and browser tests. Custom fields are not automatically persisted to the auth user model. |
| SeoProvider | `@puzzle-ui/seo/react`: `SeoProvider`, `SeoProviderProps` | Stable | Shared React and schema-component tests. Collects graph nodes; lifecycle and validation semantics remain a substantial API. |
| SeoMetadata | `@puzzle-ui/seo/react`: `SeoMetadata`, `SeoMetadataProps` | Stable | Shared React metadata tests. Use only one metadata output strategy per document. |
| SeoHead | `@puzzle-ui/seo/react`: `SeoHead`, `SeoHeadProps` | Stable | Shared React metadata tests. Requires provider metadata context. |
| SeoJsonLd | `@puzzle-ui/seo/react`: `SeoJsonLd`, `SeoJsonLdProps`; alias `SchemaScript` | Stable | Shared schema-component tests. Registers structured data through the provider; within-major backward-compatibility intent documented. |
| Schema | `@puzzle-ui/seo/react`: `Schema`, `SchemaProps` | Stable | Shared schema-component tests. Generic/custom type shape is less constrained than named components. |
| SchemaReference | `@puzzle-ui/seo/react`: `SchemaReference`, component and type exports | Stable | Shared schema-component tests. Merges references by `id`; unresolved references become minimal Thing nodes. |
| SchemaGraph | `@puzzle-ui/seo/react`: `SchemaGraph`, `SchemaGraphProps` | Stable | Shared schema-component tests. Accepts either `nodes` or a complete `graph`; mutually exclusive shapes are typed. |
| LDOrganization | `@puzzle-ui/seo/react`: `LDOrganization`, `SchemaComponentProps<"Organization">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDPerson | `@puzzle-ui/seo/react`: `LDPerson`, `SchemaComponentProps<"Person">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDWebSite | `@puzzle-ui/seo/react`: `LDWebSite`, `SchemaComponentProps<"WebSite">`; alias `LDWebsite` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDWebPage | `@puzzle-ui/seo/react`: `LDWebPage`, `SchemaComponentProps<"WebPage">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDArticle | `@puzzle-ui/seo/react`: `LDArticle`, `SchemaComponentProps<"Article">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDBlogPosting | `@puzzle-ui/seo/react`: `LDBlogPosting`, `SchemaComponentProps<"BlogPosting">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDBreadcrumbList | `@puzzle-ui/seo/react`: `LDBreadcrumbList`, `SchemaComponentProps<"BreadcrumbList">`; alias `LDBreadcrumbs` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDProduct | `@puzzle-ui/seo/react`: `LDProduct`, `SchemaComponentProps<"Product">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDOffer | `@puzzle-ui/seo/react`: `LDOffer`, `SchemaComponentProps<"Offer">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDAggregateRating | `@puzzle-ui/seo/react`: `LDAggregateRating`, `SchemaComponentProps<"AggregateRating">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDReview | `@puzzle-ui/seo/react`: `LDReview`, `SchemaComponentProps<"Review">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDLocalBusiness | `@puzzle-ui/seo/react`: `LDLocalBusiness`, `SchemaComponentProps<"LocalBusiness">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDService | `@puzzle-ui/seo/react`: `LDService`, `SchemaComponentProps<"Service">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDImageObject | `@puzzle-ui/seo/react`: `LDImageObject`, `SchemaComponentProps<"ImageObject">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDVideoObject | `@puzzle-ui/seo/react`: `LDVideoObject`, `SchemaComponentProps<"VideoObject">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDEvent | `@puzzle-ui/seo/react`: `LDEvent`, `SchemaComponentProps<"Event">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDRecipe | `@puzzle-ui/seo/react`: `LDRecipe`, `SchemaComponentProps<"Recipe">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDCourse | `@puzzle-ui/seo/react`: `LDCourse`, `SchemaComponentProps<"Course">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDJobPosting | `@puzzle-ui/seo/react`: `LDJobPosting`, `SchemaComponentProps<"JobPosting">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDPlace | `@puzzle-ui/seo/react`: `LDPlace`, `SchemaComponentProps<"Place">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDPostalAddress | `@puzzle-ui/seo/react`: `LDPostalAddress`, `SchemaComponentProps<"PostalAddress">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDContactPoint | `@puzzle-ui/seo/react`: `LDContactPoint`, `SchemaComponentProps<"ContactPoint">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDSearchAction | `@puzzle-ui/seo/react`: `LDSearchAction`, `SchemaComponentProps<"SearchAction">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDItemList | `@puzzle-ui/seo/react`: `LDItemList`, `SchemaComponentProps<"ItemList">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDSoftwareApplication | `@puzzle-ui/seo/react`: `LDSoftwareApplication`, `SchemaComponentProps<"SoftwareApplication">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDHowTo | `@puzzle-ui/seo/react`: `LDHowTo`, `SchemaComponentProps<"HowTo">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDFaqPage | `@puzzle-ui/seo/react`: `LDFaqPage`, `SchemaComponentProps<"FAQPage">`; alias `LDFAQPage` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDCollectionPage | `@puzzle-ui/seo/react`: `LDCollectionPage`, `SchemaComponentProps<"CollectionPage">` | Stable | Generated Schema.org property types and shared schema-component tests. |
| LDProfilePage | `@puzzle-ui/seo/react`: `LDProfilePage`, `SchemaComponentProps<"ProfilePage">` | Stable | Generated Schema.org property types and shared schema-component tests. |

## Findings and follow-up

- **Stable: 249; Beta: 1; Experimental: 0 (250 components total).** The sole
  Beta component is UI `SectionHeader`; all 132 canonical Pieces components
  have a within-major backward-compatibility commitment. Component-specific
  limitations and framework boundaries remain documented; Stable does not
  mean production readiness.
- **API consistency work:** consider exporting named props types for the
  Pieces hero presets (currently only `ImageHeroProps` and `VideoHeroProps` are
  exported), and keep documenting per-preset defaults. These are quality
  improvements, not exceptions to the documented compatibility commitment.
- **Documentation limitations before this update:** component API reference
  tables exist across the UI docs, but accessibility was explicitly mentioned
  on only 36 of the original 69 UI component pages and keyboard behavior on 29
  of 69.
  Framework-specific compatibility was documented on only one UI component
  page. React 19 / React DOM 19 are the declared peer range; broader framework
  and SSR compatibility must not be inferred.
- **Documented API verification:** examples resolve through the exported UI
  and Pieces symbols in `apps/site/src/components/mdx.tsx`; the site build is
  required to validate all executable MDX examples after documentation edits.
  API reference tables are hand-maintained rather than generated from TypeScript
  declarations and may drift as implementations change.
- **GEO follow-up:** `/llms.txt` already lists all pages from the live Fumadocs
  source. `/llms-full.txt` is not implemented. A future route should derive
  its page list and canonical URLs from `source.getPages()`, include the
  corresponding source documentation text and package entry-point references,
  and clearly retain the package maturity and compatibility caveats.

## Documentation and technical SEO audit

- The site has 112 Markdown/MDX documentation pages. Frontmatter provides a
  unique title and description for each after renaming the SEO testing page.
  The docs route renders the page title as its H1; the extra H1 on the Pieces
  hero page was removed.
- Canonical URLs are normalized and constrained to the Puzzle origin. The
  sitemap and `robots.txt` are generated from the same Fumadocs page source;
  unresolved documentation routes receive `noindex, nofollow`.
- `createSeoHead` supplies description, robots, canonical, Open Graph, and
  Twitter metadata. Documentation routes add article metadata and
  Schema.org `TechArticle`/`WebPage`/breadcrumb nodes. Internal documentation
  links were checked against actual routes; three stale component links were
  corrected.
- Corrected structured-data references so the website publisher points to the
  declared publisher Organization and the homepage describes the declared
  SoftwareSourceCode entity.
- `/llms.txt` exists and lists current documentation routes. `/llms-full.txt`
  is absent; the proposed route is described above rather than exposing raw
  MDX/JSX without an extraction strategy.
- No Core Web Vitals instrumentation or lab/field measurements were found.
  Local font assets and fixed/intrinsic layout dimensions reduce avoidable
  loading shifts, but CLS/LCP/INP have not been measured. Run field or lab
  measurement against a deployed build before making performance claims.

## Tutorial API readiness — 2026-11-15

The final tutorial pass additionally checked the public package export maps,
exported contracts, and their implementations for the following workflows.
These package-level classifications extend the component inventory above.
Each listed surface has a documented within-major backward-compatibility
commitment.

| Public surface | Classification | Verified workflow and evidence |
|---|---|---|
| `@puzzle-ui/seo` and its documented subpaths | Stable | Configuration/metadata resolution, React metadata and graph collection, serialization, validation, and Next.js/TanStack/React Router endpoint adapters. Package integration, unit, browser, schema type tests, and typecheck passed; within-major compatibility is committed. |
| `@puzzle-ui/auth` | Stable | Storage-backed registration/sign-in, policy-aware user lookup, revocation, required enrollment, TOTP/recovery challenges, passkey provider and step-up contracts. Package tests and typecheck passed; within-major compatibility is committed. |
| `@puzzle-ui/session` | Stable | Persistent session creation, validation/touch, rotation/revocation, cookie and CSRF helpers. Package tests and typecheck passed; within-major compatibility is committed. |
| `@puzzle-ui/fullstack/auth/{client,server,shared,next,tanstack}` | Stable | Browser/public snapshot boundary, forms, HTTP route dispatch, cookie transport, and server initialization. Node, browser, and package typecheck passed; within-major compatibility is committed. |
| `@puzzle-ui/storage` and `/testing` | Stable | Collection/query/CRUD/concurrency/capability contracts and public conformance kit. Both package tests and typecheck passed; behavior is additionally exercised by both adapter conformance suites and within-major compatibility is committed. |
| `@puzzle-ui/storage-d1` | Stable | D1 configuration, CRUD, date serialization, conditional writes, uniqueness, atomic rollback, cursor pagination and migrations. Package tests and typecheck passed against Miniflare; within-major compatibility is committed. |
| `@puzzle-ui/storage-mongodb` | Stable | MongoDB configuration and the same persistence/concurrency contracts. Conformance tests and typecheck passed against the package's Docker replica-set fixture; within-major compatibility is committed. |

`bun run build` passed before these tests. Executing the tutorial package-export
check then found that the declared `/testing` entry was missing from Storage's
build. The build now includes that entry and bundles its conformance helpers
inside `dist`; a regression test checks every declared runtime/declaration
target. Storage's package tests and D1 conformance tests pass after this fix. The
package-level utility and adapter surfaces listed above are now **Stable**,
with within-major backward-compatibility intent. This does not imply
production readiness or guarantee behavior outside the documented contracts.
**Experimental** means insufficient validation evidence, not an alternative
word for Beta. No Experimental API is needed by these tutorials, and no
documented component API remains Experimental.

### Boundaries and unsupported assumptions

- Storage is a record persistence contract, not file/object storage or a
  database connection factory. Its shipped adapters are D1 and MongoDB only.
  Collection `schema.validate` is metadata, not automatic runtime validation.
  Upsert is a read followed by a write, not a concurrency-safe atomic upsert.
  MongoDB Auth requires a transaction-capable deployment, `client`, and
  `transactionsEnabled: true`; D1 uses atomic batches, not interactive
  transactions.
- Auth's public user is fixed, not a generic extensible user type. Application
  profile fields belong in a separate collection keyed by the authenticated
  user ID. Raw storage records are not public auth snapshots.
- Auth core does not implement password hashing, framework routes, cookies,
  application authorization, or trusted proxy resolution. Fullstack supplies
  HTTP adapters, not these deployment-specific decisions. Session validation
  is not a replacement for policy-aware `auth.getCurrentUser`.
- Session rotation creates a new record with a new creation time/lifetime and
  revokes the old record. The absolute lifetime is per record, not a global
  login-age cap across rotations; rotation is not fresh credential verification.
  Touching server-side idle activity does not itself renew the browser cookie.
- Fullstack's TOTP start handlers return the provisioning secret/URI in JSON,
  and its bundled enrollment/settings UI holds that data in React state.
  Those APIs cannot satisfy a stricter no-secrets-in-JSON/client-state
  tutorial boundary without customization. The authentication tutorial uses
  core enrollment methods on the server, no-store non-hydrated HTML for
  one-time provisioning/recovery display, and blocks the corresponding stock
  secret-returning routes. Provisioning necessarily discloses the shared
  secret to the enrolling user/authenticator, never to logs or browser storage.
- SEO framework adapters generate sitemap/robots endpoints, not Next metadata,
  TanStack head descriptors, or React Router meta functions. Metadata output
  and graph output each need a single owner. `SeoMetadata` renders metadata
  itself and resolves against config, not by deep-merging parent page metadata.
  Provider collection must not rely on late suspended SSR descendants.

These are API/design limitations to explain, not missing exports to invent.
Database deployment and third-party framework application smoke tests remain
consumer deployment checks, distinct from the executed repository suites.

### Tutorial execution and hydration verification

The tutorial validator checks 17 named TypeScript files using only public
exports from a temporary consumer installation of the built packages. It
executes publication SSR/graph assertions and all three framework endpoint
adapter shapes, builds the browser auth entry, and can execute notebook CRUD
and cookie-bound Auth enrollment/sign-in/recovery/rotation/expiration/logout
against a disposable MongoDB replica set. The database examples were executed
during this documentation pass, not just inferred from types.

Built-site HTTP checks confirm all four tutorial routes, unique metadata,
one initial-response JSON-LD graph containing WebPage/TechArticle/breadcrumbs,
and automatic sitemap and `llms.txt` inclusion. Browser cross-link navigation
from SEO to Storage to Auth also resolves.

Browser verification initially found a production hydration mismatch
(React error 418), reproduced on existing and new documentation routes.
The server and browser resolved different copies of `@tanstack/router-core`
with incompatible SSR match-ID serialization. The client discarded the
transported route state and rebuilt the document, duplicating head metadata
and JSON-LD.

The site's Vite resolver now resolves router-core and its subpaths relative
to React Router's own dependency, preserving environment-specific resolution
while keeping the server and client protocol consistent. The site also declares
the matching router-core dependency explicitly so editor types use the same
router contract instead of an incompatible stale local copy. No package upgrades,
hydration-warning suppression, document-tree changes, or post-mount duplicate
removal are required.

`bun run --filter '@puzzle-ui/site' test:hydration` runs Chromium against a
local production build on an ephemeral port. The regression reproduces the
original failure without the resolver fix and checks initial HTML, hydration,
client navigation, back/forward history and cached reloads. It requires one
title, description, canonical, Open Graph/Twitter title and JSON-LD graph,
correct current-page canonical/graph IDs, no stale route graph, and no browser
hydration errors. Coverage includes the homepage, Getting Started, the tutorial
index and each package tutorial. This is a site integration check, not a
third-party framework deployment claim.
