# @puzzle-ui/core

Framework-independent utilities shared by all Puzzle packages.

**Documentation:** [https://puzzle-ui.com/docs/getting-started](https://puzzle-ui.com/docs/getting-started)

See the [package documentation](https://puzzle-ui.com/docs/getting-started)
for API and compatibility details.

`@puzzle-ui/core` contains the small, dependency-free helpers that
[`@puzzle-ui/ui`](https://puzzle-ui.com/docs/ui),
[`@puzzle-ui/theme`](https://puzzle-ui.com/docs/theme), and the other Puzzle
packages build on: class name composition, string casing, CSS value safety,
color parsing and conversion, responsive value resolution, and debouncing.
It has no React dependency and runs in browsers, Node.js, Bun, and edge
runtimes.

Use it directly when you build your own components on top of Puzzle and want
the same conventions, for example `cn` for class names and the shared
breakpoints for responsive props.

## Install

```bash
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
import { cn, resolveResponsiveValue, stringWithCasing } from "@puzzle-ui/core";

cn("puzzle-button", isActive && "puzzle-button--active", className);
// "puzzle-button puzzle-button--active my-class"

stringWithCasing("hello world", "kebabcase");
// "hello-world"

resolveResponsiveValue({ mobile: "col", desktop: "row" });
// { mobile: "col", tablet: "col", desktop: "row" }
```

## API

| Area       | Exports                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strings    | `cn`, `stringWithCasing`, `normalizeSearchString`, `withSafeCharacters`, `escapeCssString`, `assertSafeCssValue`, `nameToInitials`                                                                                                  |
| Colors     | `isColor`, `isHexColor`, `isCssVariable`, `isDarkColor`, `isColorDark`, `getColorType`, `parseColor`, `parseRgb`, `hexToRgb`, `hexToRgba`, `rgbToHex`, `hslToRgb`, `rgbToHsl`, `rgbToCss`, `hslToCss`, `getColorLuminance`, `clamp` |
| Responsive | `BREAKPOINTS`, `resolveResponsiveValue`, `resolveResponsiveValueForBreakpoint`                                                                                                                                                      |
| Timing     | `debounce` (returns a debounced function with a `cancel()` method)                                                                                                                                                                  |
| Types      | `ClassnameArg`, `ColorType`, `RGBColor`, `HSLColor`, `Breakpoint`, `ResponsiveConfig`, `ResponsiveValue`, `DeepPartial`                                                                                                             |

`stringWithCasing` supports `lowercase`, `uppercase`, `snakecase`,
`kebabcase`, `camelcase`, `pascalcase`, `sentencecase`, and `headercase`.

Responsive values use the `mobile`, `tablet`, and `desktop` breakpoints;
smaller breakpoints cascade to larger ones when a value is omitted.
