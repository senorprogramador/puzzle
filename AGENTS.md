# AGENTS.md

Instructions for AI coding agents working in Puzzle. Keep changes focused, token-driven, accessible, and consistent with the existing codebase.

## 1. Before coding

- Inspect the target component and its closest sibling only. Read more files only when an import, token, API, or behavior cannot be established from those files.
- Prefer existing implementations and public exports over inventing patterns. Do not scan the entire repository for routine component work.
- Check the relevant package scripts before choosing validation commands.
- If the requested behavior is clear, implement it directly; ask only when a missing decision would materially change the API or behavior.

## 2. Project conventions

- Puzzle is a TypeScript/React component library in a Bun workspace monorepo.
- UI components live under `packages/ui/src/components/<component>/`.
- Follow the target component's existing file layout. The common pattern is `<component>.tsx` plus `<component>.css`; add types, tests, stories, or an `index.ts` only when the surrounding package uses them or the task needs them.
- Follow established exports in `packages/ui/src/index.ts` and relevant package entry points. Do not add duplicate or speculative exports.
- Use functional React components and arrow functions.
- Use named exports; match the repository's existing export style.
- Use explicit, useful TypeScript types. Avoid `any`, unnecessary abstractions, and dependencies added for trivial functionality.
- Reuse shared utilities such as `cn` from `@puzzle/core` where appropriate.
- Keep components generic and router-independent. Accept React primitives such as `ReactNode` when they make a component reusable; do not couple core UI components to an app or routing framework.
- Prefer minimal, semantic HTML. Do not add wrapper elements without a layout, accessibility, or styling purpose.

## 3. Theme tokens are the source of truth

- `@puzzle/theme` owns theme tokens and generated theme CSS. `@puzzle/ui` consumes the resulting CSS custom properties; it must not duplicate the theme system.
- Before adding a CSS value, use an existing `--puzzle-*` token if one represents that purpose. Prefer semantic tokens over raw palette values.
- Use the existing token names exactly as defined in the repository. Do not guess token names: inspect the relevant theme definition only when a token is needed and its name is not already clear from nearby code.
- Prefer semantic roles such as background, surface, text, muted, border, and primary, plus existing typography, spacing, radius, shadow, layout, motion, and z-index tokens where available.
- Never hardcode colors, spacing, radii, shadows, font sizes, or z-index values when an appropriate token exists.
- If a genuinely reusable design value is missing, add the smallest sensible token to the theme architecture and use it in the component. Do not introduce one-off variables or expand the token API for a single arbitrary value without a clear design-system benefit.
- Keep theme changes centralized and consistent with the existing token types, defaults, CSS generation, and exports. Preserve light/dark and scoped-theme behavior.
- Use `rem` for font sizes and `em` for letter spacing, consistent with the theme. Follow existing typography roles and variants instead of creating parallel scales.
- CSS must work with theme changes; avoid assuming a particular default theme or color scheme.

## 4. Component quality

Build components that feel like part of a cohesive, professional UI library—not isolated demos.

- Design a clear, restrained visual hierarchy with consistent spacing, typography, borders, radii, and states.
- Cover normal, hover, focus-visible, active, disabled, loading, and error states when relevant to the component.
- Include responsive behavior where the component needs it; avoid arbitrary breakpoints when existing responsive conventions suffice.
- Respect `prefers-reduced-motion` for non-essential motion.
- Use semantic HTML and native browser behavior first. Preserve keyboard interaction and visible focus.
- Use accessible names, labels, ARIA attributes, and correct relationships only where needed. Prefer native semantics over redundant ARIA.
- Keep styling scoped to the component. Avoid global selectors, leaking styles, and unnecessary specificity.
- Avoid unnecessary DOM, wrapper elements, runtime work, effects, and dependencies.
- Do not add decorative complexity that makes the component harder to use or inconsistent with Puzzle's minimal, professional direction.
- Expose only useful, composable props. Choose predictable defaults and keep the API as small as possible.
- Preserve backward compatibility unless the task explicitly asks for a breaking change.

## 5. CSS and implementation

- Keep component styles in the component's established CSS file; do not move styles inline unless the surrounding implementation uses that pattern for a good reason.
- Use the project's existing class naming and `cn` conventions.
- Reuse existing primitives and components when they genuinely simplify implementation; do not build needless abstraction layers.
- Prefer CSS for layout, states, and transitions. Avoid adding a styling or animation library for a small effect.
- Avoid magic numbers when a matching theme token or established layout rule exists.
- Do not use `!important` to compensate for unclear cascade or specificity.
- Do not alter unrelated files or reformat unrelated code.

## 6. Efficient repository context

For a routine component task, use this read order:

1. The target component's `.tsx` and `.css` files, if present.
2. One closest sibling component that demonstrates the needed API or pattern.
3. The exact theme token definition only if a needed token is unclear.
4. The relevant export file only if exports must change.
5. Tests or stories only when adding or changing behavior that they cover.

Stop reading once the required pattern is established. Do not read package-wide files, every component, or the whole theme system by default. Use targeted search for a symbol or token instead of opening large files. Do not re-read files already available in the current context unless they may have changed.

## 7. Validation

- Run the narrowest relevant check first: targeted test, type check, lint, or build using existing scripts.
- If a check is unavailable or too expensive, say so; never claim it passed without running it.
- Review the diff for accessibility, accidental API changes, hardcoded design values, unrelated edits, and missing exports.
- Do not add tests that merely duplicate existing coverage; add focused tests for meaningful behavior and regressions.

## 8. Completion response

Briefly report what changed, key API or design decisions, and validation performed. Mention any checks not run. Keep the summary concise and do not restate the implementation in detail.
