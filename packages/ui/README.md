# @puzzle-ui/ui

Composable, token-driven React components for building React interfaces with Puzzle.

**Documentation:** [https://puzzle-ui.com/docs/ui](https://puzzle-ui.com/docs/ui)

Component API maturity is listed on each component's documentation page.
Paper, Skeleton, Label, Background, Breadcrumbs, Sidebar, and Backdrop are
Experimental because their current validation evidence is limited. Review
documented accessibility and framework details when integrating components.

`@puzzle-ui/ui` provides composable, router-independent React components:
actions, data display, editors, forms, layout, navigation, overlays,
typography, and utilities. Components use semantic HTML and native browser
behavior first, and all styling comes from the CSS custom properties supplied
by [`@puzzle-ui/theme`](https://puzzle-ui.com/docs/theme), so one `Theme`
provider styles your whole application.

## Install

```bash
npm install @puzzle-ui/ui @puzzle-ui/theme
# or
bun add @puzzle-ui/ui @puzzle-ui/theme
# or
pnpm add @puzzle-ui/ui @puzzle-ui/theme
# or
yarn add @puzzle-ui/ui @puzzle-ui/theme
```

React and React DOM 19 are peer dependencies and should already be installed
in your application.

To start a new project with Puzzle preconfigured, run
[`npx @puzzle-ui/create`](https://puzzle-ui.com/docs/create).

## Usage

Wrap your application in `Theme` and import components from `@puzzle-ui/ui`:

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button, Stack, Text } from "@puzzle-ui/ui";

export const App = () => (
  <Theme>
    <Stack direction="col" gap="sm">
      <Text>Build your interface with Puzzle.</Text>
      <Button>Get started</Button>
    </Stack>
  </Theme>
);
```

## Component categories

| Category     | Components                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Actions      | Button, ButtonGroup, ToggleGroup                                                                              |
| Data display | Alert, Avatar, Badge, Card, EmptyState, Image, Paper, Progress, Rating, Skeleton                              |
| Editors      | TextEditor, TextEditorToolbar, TextRenderer                                                                   |
| Forms        | Autocomplete, Checkbox, ColorPicker, DatePicker, FileUpload, FormField, inputs, Radio, Select, Slider, Switch |
| Layout       | AppBar, AspectRatio, Container, Grid, GridItem, PageLayout, ResizablePanels, ScrollArea, Section, Separator, Sidebar, Stack |
| Navigation   | Accordion, Breadcrumbs, Carousel, Link, Pagination, Tabs, TreeView                                            |
| Overlays     | Command, ContextMenu, Dialog, Drawer, DropdownMenu, Notification, Popover, Tooltip                            |
| Typography   | Heading, Text                                                                                                 |
| Utilities    | Portal, Preview, ScrollLock, Transition                                                                       |

Browse every component with live examples, props, and accessibility guidance
in the [component documentation](https://puzzle-ui.com/docs/ui).

## Framework integration

Components do not depend on a router or framework. Use the `components`
prop of `Theme` to provide your framework's link and image components; see
[Component Overrides](https://puzzle-ui.com/docs/theme/components).

## Related packages

- [`@puzzle-ui/theme`](https://puzzle-ui.com/docs/theme) — design tokens and the `Theme` provider.
- [`@puzzle-ui/icons`](https://puzzle-ui.com/docs/icons) — icon components.
- [`@puzzle-ui/hooks`](https://puzzle-ui.com/docs/hooks) — reusable React hooks.
