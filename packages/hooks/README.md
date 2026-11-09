# Getting Started

Install Puzzle in your React app, build your first interface, and customize the theme.

> \[!WARNING\] **Puzzle is not ready for production use.**
>
> This project is under active development. APIs, component props,
> package exports, styling, and internal implementation may change
> without notice. Components may be incomplete, and testing,
> accessibility, documentation, and framework compatibility are not yet
> guaranteed. Use it for experimentation and evaluation only---not for
> production applications.

Puzzle is a TypeScript and React UI component library built around reusable components and shared design tokens. Its components are composable and router-independent, with styling supplied by `"@puzzle-ui/theme`. The framework is setup to be compatible with `Next.js`, `Tanstack Start` and `react-router`.

**Puzzle is under active development and is not ready for production use.** APIs, props, exports, and styling may change without notice. Accessibility and framework compatibility are still being tested. Use the project for experimentation and evaluation.

## Prerequisites

- A package manager: npm, Bun, pnpm, or Yarn.
- An existing React application with a bundler that supports CSS imports, such as Vite.
- Familiarity with React and TypeScript. The UI and theme packages require React and React DOM 19 or later within the supported React 19 range.

## Set up a new project

Simple run our @puzzle-ui/create project template to get started.

npm:

```bash
npx @puzzle-ui/create
```

bun:

```bash
bunx @puzzle-ui/create
```

Puzzle can set up a new project for you with the following framework options:

- Basic React app
- Tanstack start
- Next.js

Furthermore you can choose to install tailwindcss or not.
It directly installs all dependencies and sets up the project for you.

## Set up in an existing project:

Install the UI library and theme package in your application's directory. Choose your package manager below:

npm:

```bash
npm install @puzzle-ui/ui --save
```

bun:

```bash
bun add @puzzle-ui/create
```

pnpm:

```bash
pnpm add @puzzle-ui/ui
```

yarn:

```bash
yarn add @puzzle-ui/ui
```

These commands install published packages; they do not clone the repository or build its workspaces. Puzzle does not require Bun in your application. React and React DOM are peer dependencies and should already be installed in your app.

## Your first interface

Import components from `"@puzzle-ui/ui` and wrap your application in `Theme` from `"@puzzle-ui/theme`:

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button } from "@puzzle-ui/ui";

export const App = () => (
  <Theme>
    <main>
      <h1>Hello, Puzzle</h1>
      <p>Build your interface with reusable components and shared tokens.</p>
      <Button onClick={() => window.alert("Welcome to Puzzle!")}>
        Get started
      </Button>
    </main>
  </Theme>
);
```
