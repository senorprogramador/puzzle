# @puzzle-ui/ui

Use UI for reusable, composable, router-independent React components. It owns
interaction and presentation, not routing, business logic, or page-level
sections.

Install with `npm install @puzzle-ui/ui`. Components and types are named exports
from the package root. Rendering and framework integrations use explicit
subpaths: `/rendering/deferred`, `/rendering/ssr`, `/rendering/static`,
`/rendering/fold`, `/next/client`, `/next/server`, `/tanstack/client`,
`/tanstack/server`, and `/tanstack/shared`.

```tsx
import { Button } from "@puzzle-ui/ui";
```

Confirm each component's current props, maturity label, and docs before use.
Prefer semantic HTML, keyboard-accessible native behavior, visible focus,
existing Theme tokens, and the documented controlled/uncontrolled API. Keep
server/client imports separate and do not access browser APIs at module load.

Use `AppBar` for a responsive application header with branding and navigation.
Its `navigationItems` support `prefixIcon` and `suffixIcon` React nodes; a
string value is interpreted as an icon name from `@puzzle-ui/icons`. These
decorative icons render beside the label and inherit its color.

For image editing controls, choose `ImageCropper` for normalized crop rectangles
and `ImageHotspotEditor` for focal points or normalized hotspot points/areas.
Their value types are serializable, source-relative UI contracts; they do not
export image files, upload assets, persist values, or depend on a media package.
Use the same image coordinate space when composing both controls.
`ImageBox` accepts `unoptimized` to forward that option to configured
framework image components; native image elements ignore it.

Use `ImageUpload` when an image input needs local resize, optional named
variants, preview metadata, and crop/hotspot composition. It builds on
`FileUpload` and uses only `@puzzle-ui/media/browser`; browser processing starts
after selection, the original is retained only with `retainOriginal`, and no
transport runs unless the caller supplies `onUpload`. Crop or hotspot editors
require explicit upload confirmation so later edits are not silently uploaded.

Use `VideoUpload` when selection needs browser metadata and a local poster plus
an injected resumable transport. Supply `onUpload` to provide pause/resume/cancel
actions and report processing/ready/failed states; the UI has no server or
transcoding dependency. Without a handler it only prepares and previews the
video. For plain files or documents, continue to use `FileUpload`.

For repeatable or nested form rows, use the controlled `FieldArray` (also
exported as `RepeaterField`) and keep field state and submission with the
caller. Use `JsonEditor` for serialized JSON with parse/format actions and
caller-provided validation; use `TextEditor` for rich text documents instead.
For Zod 4 schema-driven forms, use `ZodSchemaForm` from
`@puzzle-ui/ui/zod`; applications using this optional entry point must install
Zod 4. Keep its controlled value on the schema input side and use successful
validation results for parsed output. The application still owns updates,
business logic, and submission; use `FieldArray` directly when a form only
needs repeatable rows.
JSON numbers outside JavaScript's finite range are rejected rather than
formatted into `null`.
TextEditor content is a serializable `TextDocument`; use its exported pure
normalization, validation, list-transaction, and HTML/Markdown serialization
helpers instead of persisting editable DOM. Checklist `checked` state belongs
to each item, while `listAttributes.interactive` configures whether its
checkbox can be toggled. `TextRenderer` keeps checklist interaction disabled
unless explicitly enabled with a change callback. Use the `useTextEditor`
command handle for blockquote/code-block/horizontal-rule formatting,
find/replace, text statistics, and application-registered keyboard shortcuts
rather than coupling those features to toolbar internals. `TextEditor` accepts
serializable `shortcuts` declarations; keep application command routing out of
toolbar components. Use `getSlashCommandAtSelection` to build an application
slash-command surface without embedding that menu in the editor core.
The TextEditor toolbar derives heading styles from Theme's token registry,
keeps blockquote and code block exclusive, and offers separate indentation and
horizontal-rule controls. Its clear button removes inline formatting without
resetting blocks; the existing `clearFormatting` command also resets block
formatting. Icon list settings apply icon and size immediately. Color changes
are previewed through an editor transaction and are committed as one undo step
or reverted on cancellation; nested popouts must not dismiss their parent.
Keep editor selection independent of popover focus and cover the complete
preview/cancel/apply/undo journey in Chromium browser tests.
For a simple date range, compose two controlled `DatePicker`s and constrain
their `minDate`/`maxDate`; do not add a separate range component unless the
interaction needs shared range selection or highlighting.

Use `SortableTree` for controlled nested editors or file/navigation structures
whose nodes can be reordered. Provide `onMove` or `onItemsChange` to persist a
drop; the component does not mutate `items`. The drag handle supports native
pointer dragging, long-press touch dragging, and Space/arrow-key lift and drop.
Keep `maxDepth` and the component's invalid-move protection enabled when a
hierarchy has structural constraints. Use `TreeView` instead when nodes should
only be browsed and never reordered.

Do not deep-import source, add routing or business logic, or treat Beta and
Experimental APIs as Stable. See the [UI documentation](https://puzzle-ui.com/docs/ui).
