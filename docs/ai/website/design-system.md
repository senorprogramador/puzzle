# Design-system planning

Plan a single visual language before composing pages. Puzzle Theme is the
design-token source of truth; inspect the current
[Theme package instructions](../../../packages/theme/AGENTS.md) and public API
instead of introducing a parallel token system.

## Required decisions

Complete the [design-system template](./templates/design-system.md) for:

- **Visual direction:** short, concrete descriptors and verified references.
- **Color scheme:** semantic roles, contrast expectations, and whether both
  light and dark modes are required.
- **Typography:** hierarchy, font families/weights, loading/fallback behavior,
  and readable line lengths.
- **Spacing and containers:** page gutters, content widths, grids, section
  rhythm, and narrow-screen behavior.
- **Borders, radii, and shadows:** restrained rules for surfaces and emphasis.
- **Layout patterns:** shared shells, navigation, content columns, sidebars,
  and page-specific arrangements.
- **Image treatment:** aspect ratios, crop/focal-point handling, responsive
  sources, alt text ownership, and behavior when an asset is missing.
- **Responsive behavior:** content reflow, navigation changes, wrapping,
  touch targets, and media scaling at actual breakpoints.
- **Motion:** purpose, reduced-motion fallback, and no motion that blocks use.
- **Dark/light behavior:** required modes, contrast, and testing if the site
  supports theme switching.

Use existing Theme tokens and components where they fit. Do not hardcode a
second set of colors, spacing, radii, shadows, or typography in page CSS. If an
essential reusable design value is missing, verify the Theme token API before
proposing a shared token change; do not invent token names.

## Variety without inconsistency

Consistency comes from shared tokens and layout rules, not identical sections.
Plan deliberate differences in section width, alignment, density, image
placement, background treatment, and content hierarchy. Avoid repeating the
same card grid or centered text treatment in adjacent sections unless the
content genuinely calls for it. Keep interaction, focus, and responsive states
consistent across those variations.

## Validation

- Check representative pages and narrow, medium, and wide viewports.
- Verify text wrapping, media crop, overflow, focus visibility, and contrast.
- Test light/dark modes where required and respect reduced motion.
- Use real or clearly marked placeholder assets; do not invent brand assets or
  claim unverified imagery represents the organization.
