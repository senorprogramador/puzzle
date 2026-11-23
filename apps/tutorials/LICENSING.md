# Tutorial Studio licensing review

Last verified: 2026-11-23

This is a technical inventory, not legal advice. The renderer and model are
selected locally, but local execution does not waive third-party license
conditions. Recheck official terms before upgrading or changing providers.

| Dependency | Version / source | License and use notes | Redistribution and uncertainty |
| --- | --- | --- | --- |
| `remotion`, `@remotion/cli` | `4.0.545` in `apps/tutorials/package.json` | Remotion's official [pricing](https://www.remotion.dev/docs/license/pricing) and [FAQ](https://www.remotion.dev/docs/license/faq) say individuals and companies of up to three people may use the Free License, including automated rendering and commercial use, subject to the terms. Larger companies need a Company License; the official page describes Automators pricing as per render with a monthly minimum. Confirm the Puzzle organization's eligibility before production renders. | Remotion's package license points to its own terms; do not treat it as MIT. Current organization size and eligibility are unknown. See the [official terms](https://www.remotion.dev/docs/terms). |
| React, React DOM | `19.3.x` resolved locally; declared as `^19.3.0` | MIT. | Preserve notices when redistributing the packages. |
| TypeScript | `7.0.2` resolved locally; dev dependency | Apache-2.0. The discovery worker uses the TypeScript 7 compiler API. | Preserve license and NOTICE files when redistributing TypeScript. The API entry used by the worker is currently under `typescript/unstable/sync`; revalidate it on upgrades. |
| Ollama runtime | External local install; this machine reports `0.40.16` | The official [Ollama source license](https://github.com/ollama/ollama/blob/main/LICENSE) is MIT. The Studio only calls a loopback Ollama endpoint and does not bundle the runtime. | Runtime and model licenses are separate. The installed version is not pinned by this workspace. |
| Qwen3 model weights | `qwen3:14b`, `qwen3:8b`, and `qwen3:4b` are supported names; the model is not bundled | The official [Qwen3 repository](https://github.com/QwenLM/Qwen3) states its open-weight models are Apache-2.0. The [Ollama library](https://ollama.com/library/qwen3) lists these variants and approximate download sizes. | Weight licensing does not establish a separate license for every training dataset or guarantee rights for every generated output. Verify the selected Ollama tag and notices when downloading. |
| FFmpeg | External executable; the machine used for this review reports `8.1.1` | FFmpeg is LGPL by default. This machine's build enables GPL and codecs including `libx264` and `libx265`; FFmpeg's [legal page](https://ffmpeg.org/legal.html) says including GPL parts makes GPL apply to FFmpeg as a whole. | FFmpeg is not bundled. Users must review the license of their own binary and dependencies; generated media and codec/patent questions may need separate review. |
| `@puzzle-ui/ui`, `@puzzle-ui/theme` | Workspace packages | Covered by this repository's [MIT license](../../LICENSE). | Keep repository notices with redistributed package code. |
| Bun | Declared as `^1.4.4` in the root workspace | Bun itself is MIT-licensed. Its [official licensing page](https://github.com/oven-sh/bun/blob/main/docs/project/license.mdx) also notes statically linked JavaScriptCore/WebKit components under LGPL-2. | Used to run workspace scripts; not bundled into the site or rendered videos. |

## Not selected or not implemented

Audio synthesis and lip-sync are not part of the current video renderer.
Kokoro ONNX was evaluated but not selected: its current Python dependency tree
includes [`phonemizer`](https://pypi.org/project/phonemizer/), which is
GPL-3.0-or-later. Although the Kokoro weights are Apache-2.0, distributing a
tool that imports that GPL library needs a separate compatibility review.
Rhubarb, WhisperX, Montreal Forced Aligner, LivePortrait, Wav2Lip, MuseTalk,
and SadTalker are not dependencies; no license or model-weight claim is made
for those unselected technologies.
