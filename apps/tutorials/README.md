# Puzzle video tutorials

This private workspace creates silent, captioned Remotion tutorials for the
documentation site. Scenes focus on code, component previews, and on-screen
narration. Remotion and the UI packages are build-time dependencies; the site
receives MP4, poster, WebVTT, and JSON manifest files only.
It pins Remotion `4.0.545`, following the current
[existing-project installation guide](https://www.remotion.dev/docs/brownfield)
and [render CLI reference](https://www.remotion.dev/docs/cli/render).

## Architecture

- `src/tutorials/index.ts` contains tutorial metadata, scenes, narration text,
  accurate code excerpts, and source files used for incremental invalidation.
- `src/compositions/ComponentTutorial.tsx` renders reusable landscape and
  portrait layouts. Narration is burned into the video as captions.
- `src/components/PuzzlePreview.tsx` renders actual exports from
  `@puzzle-ui/ui` with local demo data.
- `scripts/render-tutorials.ts` validates, hashes inputs, renders H.264 MP4s and
  thumbnails, creates WebVTT captions, probes output metadata, and writes the
  site manifest and its generated source copy.
- `apps/site/src/components/tutorial-video.tsx` reads the generated manifest
  and renders the accessible native video player.

The local Tutorial Studio CLI is a separate authoring aid. It discovers
callable public exports from the UI, Pieces, Hooks, Icons, and Theme package
entry points, scores candidates, and can ask a local Ollama model for a
source-cited script draft. Drafts are written to the repository-level
`.tutorial-studio/drafts/` directory and require human review; they are not
automatically converted into tutorial definitions or published. The CLI only
connects to a loopback Ollama URL and never downloads models. The Remotion
renderer remains independently usable without Ollama.
The CLI runs with Bun; public-export analysis starts the TypeScript 7
compiler-service worker under Node.js because the synchronous TypeScript 7 API
is not compatible with Bun's child-process stream implementation.

The CLI defaults to `qwen3:14b`; `--lightweight` selects `qwen3:4b`. The
official [Ollama Qwen3 library](https://ollama.com/library/qwen3) lists
`qwen3:14b`, `qwen3:8b`, and `qwen3:4b` model variants and approximate sizes.
Run `check` first. It reports installed models and stops if the configured model
is missing or exceeds the configured model-memory budget. The studio never
pulls a model automatically. You may create
`tutorial-studio.config.json` from
[`tutorial-studio.config.example.json`](./tutorial-studio.config.example.json)
to choose a script model, context, timeout, and resource limits.
The default `modelKeepAlive: "0"` asks Ollama to unload the model when a
generation request completes; a duration such as `"5m"` can be configured when
repeated work matters more than releasing memory immediately.

Discovery uses TypeScript's type checker against the current public package
entry points. Relevance scores are deterministic heuristics, not quality
guarantees. Generated scripts include file and line evidence and are cached
against the selected model, prompt version, and source contents. A render lock
prevents new local model generation from competing with Remotion rendering.
The lock covers the Tutorial Studio's landscape and vertical render commands;
interactive rendering started inside Remotion Studio is not monitored.

English is the initial content language. Tutorial metadata supports English,
Dutch, Spanish, and German; a localized version should provide its own scene
narration and captions.

## Add or edit a tutorial

1. Verify the public API, package exports, examples, and documentation first.
2. Add a definition to `src/tutorials/index.ts`. Include a stable ID, target
   audience, objectives, documentation URL, scenes, narration, code, preview
   type, and source files. Keep each code example on a public package entry
   point.
3. Add an actual component preview in `src/components/PuzzlePreview.tsx` only
   when it can be rendered faithfully; label explanatory diagrams as such.
4. Import `TutorialVideo` in the relevant MDX page and add its ID after the
   introduction.
5. Run `bun run tutorials:validate`, then render the tutorial and check the
   generated video and thumbnail.

## Commands

Run these commands from the repository root:

```sh
bun run tutorials:dev
bun run tutorials:validate
bun run --filter @puzzle-ui/tutorials studio:cli -- check
bun run --filter @puzzle-ui/tutorials studio:cli -- setup
bun run --filter @puzzle-ui/tutorials studio:cli -- discover
bun run --filter @puzzle-ui/tutorials studio:cli -- recommend
bun run --filter @puzzle-ui/tutorials studio:cli -- generate --component DataTable
bun run --filter @puzzle-ui/tutorials studio:cli -- generate --component DataTable --lightweight
bun run tutorials:render:component -- file-upload
bun run tutorials:render:component -- data-table
bun run tutorials:render:vertical -- data-table-vertical /tmp/data-table-vertical.mp4 --codec=h264 --crf=25
bun run tutorials:render:all
bun run tutorials:thumbnails
bun run tutorials:manifest
```

`tutorials:render` renders all definitions by default. Rendering a specific ID
or all tutorials skips a video only when its SHA-256 source hash matches and
all published assets are present. The hash includes the definition, displayed
source files, reusable rendering components, composition, and pinned Remotion
version. Pass `--force` to regenerate even when nothing changed. The `manifest`
command requires already-rendered assets and only revalidates the generated
metadata.

The renderer outputs to `apps/site/public/videos/components/<id>/`:

- `tutorial.mp4` — silent H.264 video, 1920 × 1080, 30 fps.
- `thumbnail.jpg` — representative Remotion frame.
- `captions.vtt` — English scene narration.
- `apps/site/public/videos/manifest.json` — published metadata.

Portrait compositions are registered as `<id>-vertical` in Remotion Studio.
The `tutorials:render:vertical` command renders one to the requested path;
vertical MP4s are not added to the manifest by default. Review a portrait still
for code readability and adapt the scene layout before publishing a short-form
version.

## Validation and troubleshooting

`bun run tutorials:validate` checks IDs, metadata, scenes, documentation
embeds, source paths, and the internal suitability report.
`bun run --filter @puzzle-ui/tutorials test` and `typecheck` cover definitions
and TypeScript. Rendering additionally requires the Remotion browser and
`ffprobe`; `ffmpeg` is used by Remotion for H.264 output. The manual GitHub
Actions workflow validates the already-rendered, committed assets only. Video
rendering and asset publication are local; the workflow does not render or
upload videos to GitHub.

After rendering, run `bun run --filter @puzzle-ui/site test:video-tutorials`
to check the generated player markup and asset paths. The browser test runs
against the production server, loading each video in Chromium and checking
metadata, controls, captions, keyboard focus, and desktop/mobile overflow:

```sh
bun run --filter @puzzle-ui/site test:video-tutorials:e2e
```

Set
`TUTORIAL_VIDEO_SCREENSHOT_DIR` to capture review screenshots outside the
repository.

If rendering fails, first run `bun install`, `bun run --filter @puzzle-ui/ui
build`, and `bun run tutorials:validate`. Check that the selected ID exists, the
required browser is available, and `ffmpeg`/`ffprobe` are on `PATH`. Rendering
uses the local component bundle and demo data; no external API credentials or
network service are required.

## Licensing

See the [licensing review](./LICENSING.md) for verified dependency versions,
official license sources, commercial-use conditions, redistribution notes, and
unresolved items. Confirm Remotion eligibility for the organization using this
studio before automated production renders. This review is not legal advice.

## Review report

See [tutorial-suitability.md](./tutorial-suitability.md) for the selection
criteria, priorities, and screening limitations.
