# @puzzle-ui/icons

Use Icons for Puzzle's React SVG `Icon` component backed by Iconify. Install
with `npm install @puzzle-ui/icons`; the root exports `Icon` and `IconProps`.
Icon sets under repository source are not separate package entry points.

```tsx
import { Icon, type IconProps } from "@puzzle-ui/icons";
```

Pass the documented Iconify `prefix:name` identifier and verify component
properties against the installed types. For icon-only controls, label the
control and mark decorative icons as hidden from assistive technology. Consider
network availability, Content Security Policy, and the license of the selected
icon collection.

Do not import set files from internal paths or assume that a collection's
presence grants a license. See the [Icons documentation](https://puzzle-ui.com/docs/icons).
