# Component development workflow

This workflow is mandatory for every new component and every significant
component change. A component is not complete when its implementation alone
works; it must also be tested, documented, previewable, discoverable, and
accurately represented in the AI knowledge base.

## 1. Discover and choose ownership

1. Define the required content, interaction, accessibility, and responsive
   behavior.
2. Search for existing components with equivalent or overlapping behavior.
   Prefer extending or composing a suitable component over creating a
   duplicate.
3. Follow the [component-selection guide](../reference/component-selection.md)
   to choose a Piece, UI primitive, app component, or semantic React.
4. Identify the owning package, inspect its manifest and `AGENTS.md`, then read
   the smallest relevant source area, public export, types, docs, tests, and a
   close sibling.
5. Verify client/server and framework boundaries before adding code.

## 2. Implement

- Follow the owning package's public API, naming, file-layout, CSS, and export
  conventions. Keep application routes, business logic, data, and persistence
  out of reusable presentation components.
- Reuse Puzzle Theme tokens, existing primitives, and established accessibility
  patterns. Preserve SSR compatibility and isolate browser-only behavior.
- Avoid unnecessary props, wrappers, abstractions, dependencies, and duplicate
  components.
- Do not document or export internal implementation details as public APIs.

## 3. Test the behavior

Add or update focused tests appropriate to the component's complexity. Cover
the applicable cases:

- Default rendering, public props, variants, sizes, and composition.
- Real user interactions, including keyboard, focus, pointer, and touch where
  relevant.
- Semantic HTML, accessible names and relationships, and screen-reader
  behavior.
- Responsive layouts, loading, empty, error, disabled, and controlled states
  where applicable.
- Invalid inputs, edge cases, SSR output, and framework compatibility where
  relevant.

For interactive components, test user journeys rather than only rendered
markup. Use component/browser tests when jsdom cannot prove layout, focus, or
interaction behavior.

## 4. Document and preview

Every public component needs user-facing documentation that accurately covers
its purpose, appropriate and inappropriate use, import path, public API,
variants, accessibility and responsive behavior, implementation constraints,
and practical examples. Verify every example against actual exports and types.

For `@puzzle-ui/ui` and `@puzzle-ui/pieces`, add or update an appropriate
preview through existing documentation/Storybook infrastructure. Demonstrate
the primary use case and relevant variants with realistic content; use focused
previews for complex components. Inspect the rendered result at mobile, tablet,
and desktop sizes. Do not introduce a parallel preview system.

## 5. Synchronize the AI knowledge base

For a public component in `@puzzle-ui/ui` or `@puzzle-ui/pieces`:

1. Update curated registry metadata and generated output. Verify the public
   export, import path, category, purpose, props/types, variants, dependencies,
   compatibility, documentation, and preview references from authoritative
   source. Do not infer undocumented behavior.
2. Run `bun run registry:generate` and `bun run registry:check`.
3. Update relevant AI component guidance so agents can discover when to choose
   the component, when another option is simpler, and how to import and compose
   it. Update component-selection guidance when it changes the preferred way
   to implement a common pattern.
4. Update package-level `AGENTS.md` only when the component introduces
   architecture, conventions, or composition constraints that contributors
   need to know; link to detailed docs instead of copying the API.
5. Update package AI documentation when package capabilities, architecture,
   dependencies, or recommended usage change.

Keep actual public exports, registry metadata, user docs, previews, and
AI-facing guidance consistent. Prefer generated facts and deterministic
validation over manually duplicating API details.

## 6. Validate and complete

Run the owning package's focused tests, typecheck, and build. Run the site
build when documentation, examples, or navigation change. Inspect the rendered
preview at representative viewport sizes and verify links, imports, examples,
registry metadata, and public exports.

For significant public changes, verify the following before completion:

- [ ] Existing functionality was checked for reuse; package ownership is appropriate.
- [ ] Public API and exports are correct and backward-compatible where required.
- [ ] Behavior, accessibility, responsive layout, and relevant SSR/framework cases are tested.
- [ ] User-facing documentation and examples match the actual API.
- [ ] UI/Pieces preview is current and visually inspected at mobile, tablet, and desktop sizes.
- [ ] Registry and relevant AI documentation are synchronized and validated.
- [ ] Relevant package instructions and component-selection guidance are updated when needed.
- [ ] Focused tests, typecheck/build, and documentation checks pass; unrun checks are disclosed.

Minor internal refactors that do not affect public behavior do not require
documentation changes unless existing guidance becomes incorrect.

See the [UI guide](../../../packages/ui/AGENTS.md), [Pieces guide](../../../packages/pieces/AGENTS.md),
the [component registry](../registry/README.md), and the
[testing workflow](./testing.md). Do not add a package component merely to
avoid composing existing public primitives.
