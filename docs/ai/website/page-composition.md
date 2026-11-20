# Page composition

Compose pages from the smallest suitable building blocks. The preference order
below is not a mandate to use a Puzzle component when it would add unnecessary
complexity.

## Component selection

1. **Pieces:** use when a page-section composition matches the content and
   behavior.
2. **UI:** use primitives and components for reusable controls, layout,
   feedback, navigation, and overlays.
3. **Existing application components:** reuse a project-owned component when
   its responsibility and contract fit.
4. **Normal React nodes and semantic HTML:** use directly when an existing
   component is not a better fit.

Search the [registry guide](../registry/README.md) and the smallest relevant
generated index first:

- `docs/ai/registry/generated/categories/pieces/<category>.json`
- `docs/ai/registry/generated/categories/ui/<category>.json`
- package-level `pieces.json` or `ui.json` only when category files are
  insufficient.

Compare candidates by purpose, content, required props, media, interactions,
responsive behavior, and composition cost. Then open the referenced component
documentation and verify its current public export, types, and props. Do not
rely on a registry description as an API contract.

For each selection, record the registry identity, selected variant (if any),
documentation path, public entry point, and API verification in the
[page specification](./templates/page-specification.md). If there is no good
fit, explain the semantic React or custom application component fallback.

## Composition plan

For every page, plan:

- **Section order and purpose:** each section advances the page objective and
  has a clear content owner.
- **Variation:** avoid repeating an identical Piece or visual treatment in
  adjacent sections; vary alignment, density, media, and layout where content
  supports it.
- **Hierarchy and spacing:** one clear primary action, predictable heading
  levels, consistent spacing tokens, and intentional changes in emphasis.
- **Content density:** match the section to the amount and certainty of
  available content; do not add filler to make a layout look full.
- **Responsive transitions:** state how columns, navigation, media, actions,
  and content order adapt; check wrapping and overflow.
- **Shared components:** reuse a shell, navigation, footer, or repeated
  application component when it provides a stable contract.
- **Consumer ownership:** route actions, business logic, data, and form
  submission stay in the application. Pieces receive consumer-provided content
  and callbacks; they do not own routing or persistence.

More Puzzle components do not automatically improve a page. A heading and
single link may be better as semantic HTML than as a full section composition.
Keep new reusable components for genuinely repeated behavior or a clear
application contract, and keep framework and database logic out of Pieces and
generic UI.
