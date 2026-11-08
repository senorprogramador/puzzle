# @puzzle-ui/core

Framework-independent utilities shared by the Puzzle UI packages. Use them
directly without React, a theme provider, or CSS.

> Puzzle is under active development. APIs may change without notice; use it
> for experimentation and evaluation rather than production applications.

## Installation

Use your preferred package manager:

```sh
npm install @puzzle-ui/core
# or
bun add @puzzle-ui/core
# or
pnpm add @puzzle-ui/core
# or
yarn add @puzzle-ui/core
```

## Usage

```ts
import { cn, isHexColor } from "@puzzle-ui/core";

const selected = true;
const className = cn("navigation-item", selected && "selected");
const validColor = isHexColor("#0284C7");
```

## Public utilities

| Area | Exports |
| --- | --- |
| Class names | `cn`, `ClassnameArg` |
| Strings | `stringWithCasing`, `normalizeSearchString`, `withSafeCharacters`, `nameToInitials` |
| CSS values | `assertSafeCssValue`, `escapeCssString` |
| Colors | `isHexColor`, `isDarkColor`, `hexToRgb`, `rgbToHex` |
| Responsive values | `BREAKPOINTS`, `resolveResponsiveValue`, `resolveResponsiveValueForBreakpoint` |
| Timing | `debounce` |
| Types | `DeepPartial`, `ResponsiveConfig`, `ResponsiveValue`, `Breakpoint` |

Import from the package root; internal source paths are not public entry
points. The package ships ESM and CommonJS builds with matching TypeScript
declarations and has no React peer dependency.

## Development

From an installed repository checkout:

```sh
npm run build --workspace=@puzzle-ui/core
```

From this package directory, run the configured test script:

```sh
bun run vitest
```

`prepack` rebuilds the package before packing or publishing. See the root
[publishing guide](../../README.md#publishing-packages) for release order and
validation commands.

## License

MIT. See the repository [LICENSE](../../LICENSE); published packages include
the same license at `dist/LICENSE`.
