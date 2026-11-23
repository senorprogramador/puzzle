# Video tutorial suitability screen

## Scope and method

Puzzle currently has separate public workspaces for UI, Pieces, theme, icons,
hooks, authentication, sessions, storage adapters, media, CMS, full-stack
integrations, SEO, and application scaffolding. The public UI/Pieces component
registry contains 277 canonical components (145 UI and 132 Pieces); the
registry inventory is an export list, not a line-by-line behavioral audit.
This first video screen focused on public UI documentation where the behavior
is interactive or asynchronous and a visual walkthrough adds value beyond the
existing examples. It does not claim that every prop of all 277 components or
every developer feature has been individually audited.

Selection criteria: interaction/state changes, asynchronous workflows,
configuration pitfalls, accessibility behavior, and whether the documentation
already explains the API sufficiently without a video. No tutorial should
duplicate a short static example or imply a capability the implementation does
not provide.

## Selected

| Priority | Component | Tutorial | Why video helps | Rendered length |
| --- | --- | --- | --- | ---: |
| P0 | `FileUpload` from `@puzzle-ui/ui` | Build a reliable file upload flow | Shows the file-selection boundary, upload-handler contract, progress reporting, recoverable failure, retry, and cancellation. The local retry example is explicitly identified as a simulation and sends no file data. | 1:34 |
| P1 | `DataTable` from `@puzzle-ui/ui` | Build a data table with range loading | Visualizes the range-loading contract, pagination, sorting, and the important limitation that built-in search/sort affect only loaded rows. | 1:36 |

All three use public package root exports. Each scene has on-screen narration
and companion WebVTT captions. The videos are silent and use no presenter,
voice-over, or lip-sync.
`DataTable` is rendered in the Remotion composition with local rows. `FileUpload`
is rendered as the actual component; upload-progress/retry behavior is explained
from the documented handler example rather than presented as a captured
interaction.

## Guided setup

| Priority | API | Tutorial | Why video helps | Rendered length |
| --- | --- | --- | --- | ---: |
| P1 | `Theme` from `@puzzle-ui/theme` | Set Up a Puzzle UI Theme for React | Walks through the existing root provider, color mode and palette, focused token overrides, and the build-time workflow for self-hosted fonts. The initial font download requires network access; the browser uses the generated local assets. | 2:24 |

## Candidates not selected for this initial release

| Priority | Candidate | Decision |
| --- | --- | --- |
| P1 | `TextEditor` | Valuable for a longer editing/data-lifecycle course, but its broad API needs a dedicated, carefully scoped script and realistic editing capture. Defer rather than compress it into a short component walkthrough. |
| Excluded | `FAQSection` | Its variants, keyboard behavior, and searchable mode are already shown by the page examples; a video would mostly repeat the existing preview. |
| Excluded | Other UI/Pieces primitives and static sections | The initial screen favors visible state transitions. For components whose main value is a straightforward static rendering, API table, or short variant example, the current docs and previews are more direct. Revisit only when evidence shows a recurring implementation difficulty. |

Video structured data is not added. The generated manifest records the asset's
last-rendered time, not a verified publication/upload date, so it cannot safely
populate all required `VideoObject` metadata without inventing facts.

## Inventory limitation

The canonical export inventory is maintained separately from this tutorial
screen. Remaining public component APIs, non-component package exports,
framework adapters, and developer workflows were not individually scored for
video suitability in this pass. The report therefore records an initial
evidence-backed shortlist, not a claim that video is either required or
unhelpful for every remaining public API.
