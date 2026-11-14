# Puzzle component API stability audit

## Scope and method

Audited all 70 individually documented components in `@puzzle-ui/ui`, all 20
individually exported hero components documented by `@puzzle-ui/pieces`, and 46
other React components documented by the Theme (2), Icons (1), Fullstack (7),
and SEO (36) package guides. Aliases are recorded with their canonical
component and are not double-counted. The UI component index and shared hero
page are documentation pages, not additional components.

The public API below is taken from the package entry points and component
exports, not inferred from examples. Validation evidence is based on
component-local test files and the public package peer dependencies. The site
package declares React and React DOM 19 as peers. The project READMEs explicitly
warn that APIs can change without notice; no component-level backward
compatibility commitment or deprecation policy was found.

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
| Button | `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize` | Beta | 2 local test files. React 19 peer; project does not promise backward compatibility. |
| Button Group | `ButtonGroup`, `ButtonGroupProps` | Beta | 2 local test files. React 19 peer; project does not promise backward compatibility. |
| Toggle Group | `ToggleGroup`, `ToggleGroupProps`, `ToggleGroupSingleProps`, `ToggleGroupMultipleProps`, `ToggleGroupItemProps`, `ToggleGroupSize`, `ToggleGroupOrientation` | Beta | 1 local test file. Compound selection API is more complex than the shared examples; no compatibility promise. |
| Alert | `Alert`, `AlertProps`, `AlertSeverity`, `AlertVariant` | Beta | 3 local test files. React 19 peer; project does not promise backward compatibility. |
| Avatar | `Avatar`, `AvatarProps`, `AvatarShape` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Badge | `Badge`, `BadgeProps`, `BadgeColor`, `AnchorOrigin`, `AnchorOffset`, `AnchorOverlap` | Beta | 2 local test files. React 19 peer; project does not promise backward compatibility. |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`, `CardMedia`, card variant/size/orientation/part/props types | Beta | 2 local test files. Compound API has several named parts; no compatibility promise. |
| Empty State | `EmptyState`, `EmptyStateHeader`, `EmptyStateMedia`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateContent`, related props/size/variant types | Beta | 3 local test files. Compound API; no compatibility promise. |
| Image | `Image`, `ImageProps`, `ImageSource`, `ImageSourceData`, `ImageSourceSet`, `ImageFit`, `ImageRadius`, `ImagePlaceholder` | Beta | 1 local test file. Framework-specific image integrations are not implied by the core API. |
| Paper | `Paper`, `PaperProps` | Experimental | No component-local test files found. API is simple but insufficiently validated for a compatibility commitment. |
| Progress | `CircularProgress`, `CircularProgressProps`, `CircularProgressSize`, `LinearProgress`, `LinearProgressProps`, `ProgressProps` | Beta | 3 local test files. Two public visual primitives share a documentation page; no compatibility promise. |
| Rating | `Rating`, `RatingProps`, `RatingSize` | Beta | 3 local test files. React 19 peer; project does not promise backward compatibility. |
| Skeleton | `Skeleton`, `SkeletonProps`, `SkeletonRadius` | Experimental | No component-local test files found. API is simple but insufficiently validated for a compatibility commitment. |
| Text Editor | `TextEditor`, `TextEditorProps`, `TextEditorToolbar`, `TextEditorToolbarProps`, `TextRenderer`, `TextRendererProps`, `useTextEditor`, and exported document/mark/selection model types | Beta | 4 local test files. Rich-text document model is a broad API; no compatibility promise. |
| Autocomplete | `Autocomplete` and single/multiple value, option, size, change-reason, and render-state types | Beta | 1 local test file. Multiple selection and custom rendering broaden the API; no compatibility promise. |
| Checkbox | `Checkbox`, `CheckboxProps`, `CheckboxSize` | Beta | 2 local test files. React 19 peer; project does not promise backward compatibility. |
| Color Picker | `ColorPicker`, `ColorPickerProps`, `ColorPickerFormat`, `ColorPickerSwatch` | Beta | 3 local test files. Several input modes are exposed; no compatibility promise. |
| Date Picker | `DatePicker`, `DatePickerProps`, `DatePickerSize` | Beta | 2 local test files. Calendar interaction is framework/browser-sensitive; test the target environment. |
| File Upload | `FileUpload` and item, status, rejection, upload-context, and handler types | Beta | 3 local test files. Upload transport is supplied by the consumer; no compatibility promise. |
| Form Field | `FormField`, `FormFieldProps` | Beta | 4 local test files. Composition is defined by child control relationships; no compatibility promise. |
| Input Group | `InputGroup`, `InputGroupAddonProps`, `InputGroupAddonAlign`, `InputGroupProps` | Beta | 3 local test files. Compound parts; no compatibility promise. |
| Label | `Label`, `LabelProps` | Experimental | No component-local test files found. Native label behavior is straightforward, but the public surface lacks component-local validation. |
| Number Input | `NumberInput`, `NumberInputProps` | Beta | 1 local test file. Numeric edge behavior remains subject to API evolution; no compatibility promise. |
| Radio Group | `RadioGroup`, `Radio`, `RadioGroupProps`, `RadioProps`, orientation and size types | Beta | 3 local test files. Compound selection and keyboard behavior are interaction-sensitive; no compatibility promise. |
| Select | `Select`, `SelectOption`, single/multiple props and size types | Beta | 1 local test file. Multiple selection and option identity need continued behavioral validation. |
| Slider | `Slider`, `SliderProps`, `SliderMark`, `SliderSize` | Beta | 2 local test files. Pointer and keyboard behavior are interaction-sensitive; no compatibility promise. |
| Stepper | `Stepper`, `StepperProps`, `StepperStepProps`, `StepperOrientation` | Beta | 1 local test file. ID-based and index-based composition are distinct modes; no compatibility promise. |
| Switch | `Switch`, `SwitchProps`, `SwitchSize` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Text Area Input | `TextAreaInput`, `TextAreaInputProps` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Text Input | `TextInput`, `TextInputProps`, `TextInputType` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Time Picker | `TimePicker`, `TimePickerProps`, `TimePickerSize` | Beta | 3 local test files. Uses the browser's native time picker; appearance and behavior vary by browser. |
| Token Input | `TokenInput`, `TokenInputProps`, `TokenInputMode`, `TokenInputSize` | Beta | 3 local test files. Character-slot interaction is specialized; no compatibility promise. |
| App Bar | `AppBar`, `AppBarNavigationItem`, `AppBarProps` | Beta | 1 local test file. Navigation is passed as data; app routing remains consumer-owned. |
| Aspect Ratio | `AspectRatio`, `AspectRatioProps` | Beta | 3 local test files. React 19 peer; project does not promise backward compatibility. |
| Background | `Background`, `BackgroundProps`, `BackgroundPattern`, `BackgroundFade`, `BackgroundMeshColors` | Experimental | No component-local test files found. Multiple visual configuration types lack component-local validation. |
| Bottom Navigation | `BottomNavigation`, `BottomNavigationItem`, `BottomNavigationProps`, `BottomNavigationItemProps` | Beta | 2 local test files. Navigation destinations remain consumer-owned; no compatibility promise. |
| Breadcrumbs | `Breadcrumbs`, `BreadcrumbsProps`, `BreadcrumbItem` | Experimental | No component-local test files found. Navigation semantics and accessible naming lack component-local validation. |
| Collapsable Sidebar | `CollapsableSidebar` and item/group/entry/expansion/link-handler types | Beta | 1 local test file. Several item forms and responsive behaviors are exposed; no compatibility promise. |
| Container | `Container`, `ContainerProps`, `ContainerWidthPreset` | Beta | 3 local test files. React 19 peer; project does not promise backward compatibility. |
| Grid | `Grid`, `GridItem`, generic `GridProps<C>`, `GridItemProps<C>`, `GridGap`, `GridAlignment`, `GridTracks`, `GridSpan`, `GridLine`, `GridAutoFlow` | Beta | Unit and browser test files cover composition, refs, responsive props, RTL, placement, and SSR. React 19 peer; no compatibility promise. Numeric layout values are validated; CSS strings pass through to the browser. |
| Page Layout | `PageLayout`, `PageLayoutProps`, `SidebarPlacement` | Beta | 1 local test file. Compound layout slots; no compatibility promise. |
| Resizable Panels | `ResizablePanels`, `ResizablePanel`, `ResizableHandle` and related props/orientation types | Beta | 3 local test files. Pointer/keyboard resizing and layout composition are interaction-sensitive. |
| Scroll Area | `ScrollArea`, `ScrollAreaProps`, `ScrollAreaOrientation` | Beta | 3 local test files. Uses native browser scrolling; no compatibility promise. |
| Section Stack | `SectionStack`, `SectionStackProps` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Section | `Section`, `SectionProps`, `SectionTheme` | Beta | 1 local test file. React 19 peer; project does not promise backward compatibility. |
| Separator | `Separator`, `SeparatorProps`, `SeparatorOrientation` | Beta | 3 local test files. React 19 peer; project does not promise backward compatibility. |
| Sidebar | `Sidebar`, `SidebarProps` | Experimental | No component-local test files found. Layout and landmark behavior lack component-local validation. |
| Stack | `Stack`, `StackProps`, responsive direction and alignment types | Beta | 2 local test files. Responsive layout props; no compatibility promise. |
| Accordion | `Accordion`, `AccordionProps`, item data/type/id/value types | Beta | 1 local test file. ID-based and index-based selection are separate modes; no compatibility promise. |
| Carousel | `Carousel`, `CarouselController`, `useCarouselContext`, carousel/controller/context configuration types | Beta | 2 local test files. Pointer, touch, and keyboard behaviors require continued cross-browser validation. |
| Link | `Link`, `LinkProps` | Beta | 1 local test file. Optional router integration does not make the component framework-specific; no compatibility promise. |
| Pagination | `Pagination`, `PaginationProps` | Beta | 3 local test files. Navigation semantics and consumer URL state remain application-owned. |
| Tabs | `Tabs`, `TabsTab`, `TabsProps`, `TabsTabProps`, `TabsPosition` | Beta | 1 local test file. Compound tab/tabpanel keyboard behavior is interaction-sensitive. |
| Tree View | `TreeView` and item/state/selection/size types | Beta | 1 local test file. Selection, expansion, and keyboard interactions are a complex public surface. |
| Backdrop | `Backdrop`, `BackdropProps` | Experimental | No component-local test files found. Dismissal and overlay integration lack component-local validation. |
| Command | `Command`, `CommandDialog`, item/props types | Beta | 3 local test files. Search, focus, and keyboard navigation are interaction-sensitive. |
| Context Menu | `ContextMenu` and trigger/content/item/group/label/separator/checkbox/radio/submenu parts with props/state types | Beta | 3 local test files. Large compound interaction API; no compatibility promise. |
| Dialog | `Dialog`, `DialogProps` | Beta | 1 local test file. Modal focus and dismissal behavior require continued accessibility validation. |
| Drawer | `Drawer`, `DrawerProps` | Beta | 2 local test files. Modal/resizable behavior is interaction-sensitive; no compatibility promise. |
| Dropdown Menu | `DropdownMenu` and trigger/content/item/group/label/separator/checkbox/radio parts with props/position types | Beta | 3 local test files. Compound keyboard interaction API; no compatibility promise. |
| Notification | `Notification`, `NotificationViewport`, `NotificationProvider`, `useNotification`, and notification item/action/options/severity/position/provider types | Beta | 3 local test files. Global provider and transient lifecycle are a broad API; no compatibility promise. |
| Popout | `Popout`, `PopoutProps`, `PopoutPosition`, `PopoutAlignment`, `PopoutAction`, `PopoutTriggerProps` | Beta | 1 local test file. Low-level floating positioning; consumer owns content semantics. |
| Popover | `Popover`, `PopoverProps` | Beta | 2 local test files. Focus and dismissal behavior are interaction-sensitive. |
| Portal | `Portal`, `PortalTarget`, and corresponding props types | Beta | 1 local test file. Depends on a browser document target; verify server-rendered usage. |
| Tooltip | `Tooltip`, `TooltipProps`, `TooltipContentProps`, `TooltipArrowSide` | Beta | 2 local test files. Pointer/focus and non-interactive content behavior require continued accessibility validation. |
| Heading | `Heading`, `HeadingProps`, `HeadingLevel` | Beta | 1 local test file. Consumers choose semantic heading level; no compatibility promise. |
| Text | `Text`, `TextProps`, `TextType` | Beta | 1 local test file. Consumers remain responsible for semantic context; no compatibility promise. |
| Preview | `Preview`, `PreviewProps`, `PreviewDevice`, `PreviewAlign`, `PreviewJustify` | Beta | 2 local test files. Isolated frame and device modes have browser-specific layout behavior. |
| Scroll Lock | `ScrollLock`, `ScrollLockProps` | Beta | 3 local test files. Document/window behavior is browser-sensitive; verify server-rendered usage. |
| Transition | `Transition`, `TransitionProps`, `TransitionPhase`, `TransitionTemplate` | Beta | 1 local test file. Mount/unmount timing and CSS template behavior may evolve. |

### `@puzzle-ui/pieces`

All components are exported from `packages/pieces/src/index.ts` through the
hero barrel. The generic component and every preset use the `HeroProps`
composition API. `ImageHero` and `VideoHero` additionally export their
specialized required-media prop types.

| Component | Current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| Hero | `Hero`, `HeroProps`, layout/media/alignment/height/theme/overlay/content-width/video-source types | Beta | 3 local unit/browser test files. Flexible `as`, title, media, action, search, meta, children, and ARIA props; no backward-compatibility promise. |
| SplitHero | `SplitHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| CenteredHero | `CenteredHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| FullScreenHero | `FullScreenHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| VideoHero | `VideoHero`, `VideoHeroProps` (`backgroundVideo` required) | Beta | Shared hero tests cover video rendering and height. Browser media behavior remains environment-dependent. |
| ImageHero | `ImageHero`, `ImageHeroProps` (`backgroundImage` required) | Beta | Shared hero tests cover image rendering and layout overrides. Consumer supplies usable image URLs and meaningful alt text for non-decorative media. |
| MinimalHero | `MinimalHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| EditorialHero | `EditorialHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| AgencyHero | `AgencyHero` using `HeroProps` | Beta | Preset defaults/overrides and browser rendering covered by shared tests. No separate named props type. |
| ProductHero | `ProductHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| SaaSHero | `SaaSHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| StoreHero | `StoreHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| RestaurantHero | `RestaurantHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| AccommodationHero | `AccommodationHero` using `HeroProps` | Beta | Preset defaults/overrides and browser rendering covered by shared tests. No separate named props type. |
| PrintShopHero | `PrintShopHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| DashboardWelcomeHero | `DashboardWelcomeHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| AppHero | `AppHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| CampaignHero | `CampaignHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| ComingSoonHero | `ComingSoonHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |
| SearchHero | `SearchHero` using `HeroProps` | Beta | Preset defaults and overrides covered by shared hero tests. No separate named props type; generic composition is inherited. |

### Other documented React components

These components are documented in package guides rather than under the UI or
Pieces component catalog. Their APIs are included because the docs publish
their component names and usage.

| Component | Package and current public API | Status | Evidence and outstanding issues |
|---|---|---|---|
| Theme | `@puzzle-ui/theme`: `Theme`, `ThemeProps`, `ThemeScope` | Beta | `theme.test.tsx` covers the provider; package has 6 test files. React 19 peer. No compatibility promise. |
| GoogleFont | `@puzzle-ui/theme`: `GoogleFont`; `GoogleFontProps` is not exported | Experimental | No component-local test file found. The prop type is private, limiting consumers' ability to import/document the exact prop contract. |
| Icon | `@puzzle-ui/icons`: `Icon`, `IconProps` | Beta | 1 component test file. Iconify may load icon data asynchronously; network/CSP constraints are documented. React 19 peer. |
| AuthProvider | `@puzzle-ui/fullstack/auth/client`: `AuthProvider`, `AuthProviderProps` | Beta | Covered by `auth-react.test.mjs`; React 19 client entry. No backward-compatibility promise. |
| SignInForm | `@puzzle-ui/fullstack/auth/client`: `SignInForm`, `SignInFormProps`, `AuthFormProps` | Beta | Covered by `auth-react.test.mjs`, including email/password markup. Consumer owns surrounding navigation and policy. |
| SignUpForm | `@puzzle-ui/fullstack/auth/client`: `SignUpForm`, `SignUpFormProps`, `AuthFormProps` | Beta | Covered by `auth-react.test.mjs`; custom fields and persistence require consumer/server integration. |
| MfaChallengeForm | `@puzzle-ui/fullstack/auth/client`: `MfaChallengeForm`, `MfaChallengeFormProps`, `AuthFormProps` | Beta | Covered by `auth-react.test.mjs`; pending-MFA state is driven by the client/server contract. |
| AuthScreen | `@puzzle-ui/fullstack/auth/client`: `AuthScreen`, `AuthScreenProps` | Beta | Covered by `auth-react.test.mjs`; mode and custom-child composition may evolve. |
| MfaSettings | `@puzzle-ui/fullstack/auth/client`: `MfaSettings`, `MfaSettingsProps` | Beta | Covered by `auth-react.test.mjs`; server-side authorization remains required. |
| AuthExperience | `@puzzle-ui/fullstack/auth/client`: `AuthExperience`, `AuthExperienceProps`, `AuthExperienceConfig`, branding/layout/redirect/custom-field types | Beta | Covered by `auth-experience.test.mjs` and browser tests. Custom fields are not automatically persisted to the auth user model. |
| SeoProvider | `@puzzle-ui/seo/react`: `SeoProvider`, `SeoProviderProps` | Beta | Shared React and schema-component tests. Collects graph nodes; lifecycle and validation semantics remain a substantial API. |
| SeoMetadata | `@puzzle-ui/seo/react`: `SeoMetadata`, `SeoMetadataProps` | Beta | Shared React metadata tests. Use only one metadata output strategy per document. |
| SeoHead | `@puzzle-ui/seo/react`: `SeoHead`, `SeoHeadProps` | Beta | Shared React metadata tests. Requires provider metadata context. |
| SeoJsonLd | `@puzzle-ui/seo/react`: `SeoJsonLd`, `SeoJsonLdProps`; alias `SchemaScript` | Beta | Shared schema-component tests. Registers structured data through the provider; no compatibility promise. |
| Schema | `@puzzle-ui/seo/react`: `Schema`, `SchemaProps` | Beta | Shared schema-component tests. Generic/custom type shape is less constrained than named components. |
| SchemaReference | `@puzzle-ui/seo/react`: `SchemaReference`, component and type exports | Beta | Shared schema-component tests. Merges references by `id`; unresolved references become minimal Thing nodes. |
| SchemaGraph | `@puzzle-ui/seo/react`: `SchemaGraph`, `SchemaGraphProps` | Beta | Shared schema-component tests. Accepts either `nodes` or a complete `graph`; mutually exclusive shapes are typed. |
| LDOrganization | `@puzzle-ui/seo/react`: `LDOrganization`, `SchemaComponentProps<"Organization">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDPerson | `@puzzle-ui/seo/react`: `LDPerson`, `SchemaComponentProps<"Person">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDWebSite | `@puzzle-ui/seo/react`: `LDWebSite`, `SchemaComponentProps<"WebSite">`; alias `LDWebsite` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDWebPage | `@puzzle-ui/seo/react`: `LDWebPage`, `SchemaComponentProps<"WebPage">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDArticle | `@puzzle-ui/seo/react`: `LDArticle`, `SchemaComponentProps<"Article">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDBlogPosting | `@puzzle-ui/seo/react`: `LDBlogPosting`, `SchemaComponentProps<"BlogPosting">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDBreadcrumbList | `@puzzle-ui/seo/react`: `LDBreadcrumbList`, `SchemaComponentProps<"BreadcrumbList">`; alias `LDBreadcrumbs` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDProduct | `@puzzle-ui/seo/react`: `LDProduct`, `SchemaComponentProps<"Product">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDOffer | `@puzzle-ui/seo/react`: `LDOffer`, `SchemaComponentProps<"Offer">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDAggregateRating | `@puzzle-ui/seo/react`: `LDAggregateRating`, `SchemaComponentProps<"AggregateRating">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDReview | `@puzzle-ui/seo/react`: `LDReview`, `SchemaComponentProps<"Review">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDLocalBusiness | `@puzzle-ui/seo/react`: `LDLocalBusiness`, `SchemaComponentProps<"LocalBusiness">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDService | `@puzzle-ui/seo/react`: `LDService`, `SchemaComponentProps<"Service">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDImageObject | `@puzzle-ui/seo/react`: `LDImageObject`, `SchemaComponentProps<"ImageObject">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDVideoObject | `@puzzle-ui/seo/react`: `LDVideoObject`, `SchemaComponentProps<"VideoObject">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDEvent | `@puzzle-ui/seo/react`: `LDEvent`, `SchemaComponentProps<"Event">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDRecipe | `@puzzle-ui/seo/react`: `LDRecipe`, `SchemaComponentProps<"Recipe">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDCourse | `@puzzle-ui/seo/react`: `LDCourse`, `SchemaComponentProps<"Course">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDJobPosting | `@puzzle-ui/seo/react`: `LDJobPosting`, `SchemaComponentProps<"JobPosting">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDPlace | `@puzzle-ui/seo/react`: `LDPlace`, `SchemaComponentProps<"Place">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDPostalAddress | `@puzzle-ui/seo/react`: `LDPostalAddress`, `SchemaComponentProps<"PostalAddress">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDContactPoint | `@puzzle-ui/seo/react`: `LDContactPoint`, `SchemaComponentProps<"ContactPoint">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDSearchAction | `@puzzle-ui/seo/react`: `LDSearchAction`, `SchemaComponentProps<"SearchAction">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDItemList | `@puzzle-ui/seo/react`: `LDItemList`, `SchemaComponentProps<"ItemList">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDSoftwareApplication | `@puzzle-ui/seo/react`: `LDSoftwareApplication`, `SchemaComponentProps<"SoftwareApplication">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDHowTo | `@puzzle-ui/seo/react`: `LDHowTo`, `SchemaComponentProps<"HowTo">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDFaqPage | `@puzzle-ui/seo/react`: `LDFaqPage`, `SchemaComponentProps<"FAQPage">`; alias `LDFAQPage` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDCollectionPage | `@puzzle-ui/seo/react`: `LDCollectionPage`, `SchemaComponentProps<"CollectionPage">` | Beta | Generated Schema.org property types and shared schema-component tests. |
| LDProfilePage | `@puzzle-ui/seo/react`: `LDProfilePage`, `SchemaComponentProps<"ProfilePage">` | Beta | Generated Schema.org property types and shared schema-component tests. |

## Findings and follow-up

- **Stable: 0; Beta: 128; Experimental: 8 (136 components total).** Stable is
  not assigned because the repository explicitly allows public APIs to change
  without notice and no component-level compatibility guarantee was found.
- **Experimental components needing validation:** Paper, Skeleton, Label,
  Background, Breadcrumbs, Sidebar, Backdrop, and GoogleFont. These have no
  component-local test file in the source tree; add focused
  behavioral/accessibility coverage before considering a higher maturity
  status. GoogleFont also needs an exported props type for a complete public
  TypeScript contract.
- **API consistency work:** consider exporting named props types for the
  Pieces hero presets (currently only `ImageHeroProps` and `VideoHeroProps` are
  exported), and document the per-preset default configuration. These are
  quality improvements, not reasons to change APIs as part of this audit.
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
