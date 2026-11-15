# TextEditor audit

## Scope and status

This audit covers the complete `packages/ui/src/components/editors/text-editor/`
directory, its package exports, its documentation, existing tests, and the
repository's direct editor usage. The request names Epic E1 but does not include
the epic/story breakdown. E1 is therefore treated as the explicitly requested
transaction foundation; this does not imply that later, unspecified epics are
complete.

## Architecture

- `text-editor.types.ts` defines the serializable Puzzle document: a `doc`
  contains paragraph, heading, or list-item blocks; inline text carries marks;
  block attributes include typography variant, alignment, list type, and
  optional semantic heading level. Selection is represented by block index and
  UTF-16 text offset.
- `text-document.ts` normalizes this model and implements pure helpers for
  marks, block formatting, insertion, and selection ordering. All document
  transforms return a `TextTransaction` containing a document and selection.
- `editor.tsx` is a client component. It keeps document and selection refs as
  the immediate state, mirrors document state into React, renders editable DOM
  imperatively, maps DOM selection to model offsets, and exposes commands via
  an imperative handle.
- `index.tsx` provides the `TextEditor` wrapper and formatting context. The
  optional `TextEditorToolbar` consumes the imperative commands. The separate
  `TextRenderer` renders semantic headings, lists, and inline marks.
- `text-parser.ts` parses pasted HTML and a small Markdown subset into the
  existing Puzzle model. The editor uses HTML parsing to read browser-mutated
  content after native input.
- Component CSS is token-based and shared by the editor and renderer.

## Current user behavior

| Area | Current behavior |
| --- | --- |
| Rendering | The editor creates `<p>` blocks and marked inline elements directly in the DOM. An empty block uses a placeholder `<br>`. The renderer creates semantic `<p>`, heading, `<ul>`, and `<ol>` output. |
| Selection | A document-level `selectionchange` listener maps the active document's selection to block/offset coordinates. Formatting commands restore selection after rendering. |
| Input | A native `beforeinput` listener records the input type and pre-input selection and intercepts native history undo/redo. Other typing, deletion, Enter, and line breaks are performed by the browser; `input` parses the resulting `innerHTML` back into the Puzzle model. |
| Clipboard | Paste is prevented, then HTML is preferred over plain text. HTML is parsed as supported document content; plain text is passed through the Markdown parser. The parsed document replaces the current selection. |
| IME | There are no explicit composition event handlers. Native input is retained, including `insertCompositionText`, and composition input shares the time-based history grouping path with typing. |
| History | Commands save a document/selection snapshot. Native edits group by matching input type and an 800 ms interval; history is capped at 100 entries. Undo/redo restore both document and selection. |
| Controlled mode | A changed `value` resets selection to the start and clears history. Structurally equal values are ignored, preserving selection/history. Without `value`, `defaultValue` initializes the editor. |
| Keyboard | Cmd/Ctrl+Z, Shift+Cmd/Ctrl+Z, Cmd/Ctrl+Y, Cmd/Ctrl+B/I/U and Cmd/Ctrl+Shift+S are handled by Puzzle. The prior Cmd/Ctrl+Shift+X strike shortcut remains an alias. Other editor keyboard behavior is native. Toolbar navigation uses roving focus. |

## Existing coverage and public usage

- Pure document normalization is covered by `text-document-normalize.unit.test.ts`.
- Document operations and HTML alignment parsing are covered by
  `text-document.test.ts`.
- Rendering, toolbar navigation/accessibility and command execution are covered
  by component tests.
- Editor component tests cover transform selection restoration, undo/redo,
  changed controlled values, structurally equal controlled values, and keyboard
  shortcuts.
- Browser tests cover native typing, keyboard undo/redo, toolbar formatting and
  toolbar history actions. Iframe tests cover plain-text and line-break
  selection mapping across documents.
- Clipboard, IME composition, and framework-level Next.js/TanStack Start
  hydration are not directly tested.
- The package exports `TextEditor`, `TextEditorToolbar`, `TextRenderer`, their
  prop types, and the Puzzle document/selection types from
  `packages/ui/src/index.ts`. Direct editor use outside its directory is limited
  to the iframe browser test. The site has one TextEditor documentation page.

## Problems and risks observed

1. **Native `beforeinput` was not observed by React's handler in Chromium.**
   Actual input retained an empty `inputType`, so repeated typing was recorded
   as separate history entries and one undo removed only the last character.
   E1 replaces the synthetic handler with an owner-element native listener and
   adds a real-browser typing/undo/redo regression test.
2. **Native edits are parsed from the entire editable DOM.** Browser-generated
   structure is accepted temporarily and then flattened/normalized. The parser
   deliberately drops unsupported HTML, so a DOM round trip can still lose
   unsupported content.
3. **Composition behavior is implicit.** No composition lifecycle is tracked;
   correctness depends on browser input event ordering and the existing typing
   grouping heuristic. An actual IME integration test remains outstanding.
4. **DOM selection restoration suppresses failures.** A stale/unmappable range
   is caught and ignored. This avoids crashing after a DOM change, but can leave
   model and visible selection out of sync.
5. **Some model attributes need additional round-trip coverage.** E1 now writes
   and parses `headingLevel`, including semantic h5/h6 headings. Lists remain
   Puzzle list-item blocks in the editor and are visualized with CSS markers
   rather than semantic list containers.
6. **Framework behavior is not integration-tested.** E1 adds the missing
   `"use client"` boundary to the hook-using wrapper, but no Next.js or TanStack
   Start app is present here to verify end-to-end SSR/hydration.
7. **History grouping differs from Tiptap.** Puzzle retains its 800 ms,
   same-input-type grouping and 100-entry cap. Tiptap documents a 500 ms
   grouping delay; adjacency-specific behavior remains a possible improvement.
8. **Selection edge-case coverage remains limited.** DOM node type checks are
   now realm-independent, and iframe tests cover text and line breaks. Reversed,
   block-crossing, and nested marked selections still merit real-browser
   coverage.

## Tiptap 3 comparison

Tiptap 3 is a behavior and UX reference only; adding it as a dependency is not
part of this work. Tiptap builds on ProseMirror's schema-backed editor state:
document and selection changes are carried through transactions, with update,
selection, transaction, focus, paste, and related lifecycle events. Its
UndoRedo extension documents a default history depth of 100 and a 500 ms
grouping delay. Keyboard defaults include Mod-Z/Mod-Shift-Z/Mod-Y and
Mod-Shift-S for strikethrough.

Puzzle already has a serializable schema-like model, pure transformation
helpers, explicit selection, custom history, and DOM-independent rendering.
E1 now gives document transforms a common transaction result and routes
commands, history, controlled values, and native input through a shared
document/selection synchronizer. The browser still performs most contenteditable
mutations, which Puzzle reparses; there is no explicit composition lifecycle.
The target remains to retain Puzzle's model and public API while making every
Puzzle-owned operation atomic with its selection, history, and DOM
synchronization.

References:

- [Tiptap core concepts](https://tiptap.dev/docs/editor/core-concepts)
- [Tiptap events](https://tiptap.dev/docs/editor/api/events)
- [Tiptap keyboard shortcuts](https://tiptap.dev/docs/editor/core-concepts/keyboard-shortcuts)
- [Tiptap UndoRedo extension](https://tiptap.dev/docs/editor/extensions/functionality/undo-redo)
- [Tiptap commands](https://tiptap.dev/docs/editor/api/commands)

## Desired interactions

- Toolbar actions must always reach the live editor and preserve the current
  selection.
- Every document transform must return one transaction containing the next
  document and its corresponding selection.
- Puzzle-handled keyboard actions must prevent the browser default and commit
  exactly once; native text input should remain available where it is safer,
  especially during IME composition.
- Undo/redo must restore document and selection together; adjacent typing may
  group, while formatting, paste, and non-adjacent edits form predictable
  boundaries.
- Parsing, serialization, normalization, and DOM synchronization must preserve
  supported marks and block attributes.
- Controlled updates must not cause accidental edits or cursor jumps when the
  parent echoes the emitted value.
- Selection and DOM mapping must work in the editor's owner document and must
  be tested for collapsed/ranged, forward/reversed, block-crossing, and
  line-break selections.

## Proposed architecture

1. **Complete (E1):** use `{ document, selection }` as the transaction result
   for every pure document transform. Keep the Puzzle schema and existing API;
   add the `TextTransaction` type as an additive export.
2. **Complete (E1):** centralize document/selection synchronization for Puzzle
   commands, undo/redo, native input, and external controlled values. The
   browser-native input path still owns typing and composition.
3. **Partial:** native input captures pre-input selection and parses/commits
   through the shared synchronizer; explicit composition lifecycle and
   composition-specific history grouping remain open.
4. **Partial:** editable HTML now preserves semantic heading levels, and iframe
   selection mapping covers text and line breaks. Reversed, block-crossing, and
   nested marked selections still need tests.
5. **Partial:** unit, component, and browser coverage now verifies transaction
   results, selection restoration, controlled updates, keyboard input, typing,
   and history. Paste, IME, and framework integration tests remain open.

## Validation strategy and results

Use the UI package's existing Vitest projects and TypeScript check:

- Unit: document normalization and transaction tests.
- Component: document/parser, renderer, toolbar, and editor integration tests.
- Browser: editor typing/history/toolbar actions and iframe selection; clipboard
  and composition coverage remain open.
- TypeScript: `bun run --filter @puzzle-ui/ui typecheck`.
- Lint: run the repository's applicable lint command if one exists; the UI
  package currently declares no lint script.

Baseline checks run before E1:

- Unit: 1 file, 12 tests passed.
- Component: 3 files, 22 tests passed.
- Browser: 1 file, 5 tests passed.

Checks run after E1:

- Unit and component: 90 files, 1,176 tests passed.
- Browser: 42 files, 313 tests passed, including editor typing/undo/redo,
  toolbar history, and iframe text/line-break selection.
- TypeScript: `bun run --filter @puzzle-ui/ui typecheck` passed.
- UI package build and site build passed. The UI build reports a TypeScript 7.0
  `tsgo` deprecation warning; the site build reports an oversized chunk warning.
- `git diff --check` passed. The UI package has no lint script.

Clipboard, actual IME, remaining selection edge cases, and Next.js/TanStack
Start SSR/hydration remain unverified. These are explicit follow-up checks, not
completed Definition-of-Done items.
