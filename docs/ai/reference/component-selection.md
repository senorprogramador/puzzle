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
- **Poor fit:** Use a pricing or booking section to imply live prices,
  availability, or transactions. Pieces present content; the application owns
  those data and behaviors.

More Puzzle components do not automatically mean a better or more consistent
result. Weigh fit, accessibility, API maturity, responsive behavior, and
composition cost. See [Pieces instructions](../../../packages/pieces/AGENTS.md),
[UI instructions](../../../packages/ui/AGENTS.md), and the [AI documentation
index](../README.md) for known documentation inconsistencies.

When adding or significantly changing a component, follow the [component
development workflow](../workflows/component-development.md) so tests,
documentation, previews, registry metadata, and AI guidance remain synchronized.
