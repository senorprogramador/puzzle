# @puzzle-ui/create

Create a new React application with Puzzle UI already installed and configured.

The CLI scaffolds a working application, configures the Puzzle theme, optionally configures Tailwind CSS, and installs the required dependencies.

## Requirements

- Node.js 20.19 or later.
- A supported package manager: npm, Bun, pnpm, or Yarn.
- An internet connection to download the selected framework and dependencies.

## Quick start

Choose the command for your package manager:

### npm

```bash
npx @puzzle-ui/create
```

### Bun

```bash
bunx @puzzle-ui/create
```

### pnpm

```bash
pnpm dlx @puzzle-ui/create
```

### Yarn

```bash
yarn dlx @puzzle-ui/create
```

Yarn's <code>dlx</code> command requires Yarn 2 or later. With Yarn Classic, use <code>npx @puzzle-ui/create</code> instead.

The CLI detects the package manager from the environment in which it was started. It uses that package manager for framework generation and dependency installation.

## Supported frameworks

| Framework      | Description                                |
| -------------- | ------------------------------------------ |
| Next.js        | Next.js with the App Router and TypeScript |
| TanStack Start | Full-stack React application               |
| Basic React    | React, Vite, and TypeScript                |

## Setup options

The interactive setup asks for:

1. **Project name** — converted to kebab-case and used as the project directory and package name.
2. **Framework** — Next.js, TanStack Start, or Basic React.
3. **Tailwind CSS** — optionally configures Tailwind CSS v4.

The CLI then:

1. Checks that the target directory does not already exist.
2. Generates the selected framework.
3. Configures the Puzzle theme provider.
4. Updates the generated package name.
5. Optionally configures and installs Tailwind CSS.
6. Installs `@puzzle-ui/ui` and `@puzzle-ui/theme`.

The CLI does not overwrite an existing directory.

## Run your application

After creation, move into the generated project and start its development server.

```bash
cd my-awesome-app
npm run dev
```

Use the package manager you selected during setup. For example, with Bun:

```bash
cd my-awesome-app
bun run dev
```

## Generated application

The generated project includes:

- React 19 and TypeScript.
- A configured Puzzle `Theme` provider.
- A starter page using the Puzzle `Button` component.
- A framework-specific entry point and development configuration.
- Optional Tailwind CSS v4 integration.

## Manual installation

You can also add Puzzle to an existing React application.

Install the packages:

```bash
npm install @puzzle-ui/ui @puzzle-ui/theme
```

Wrap your application in the theme provider:

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button } from "@puzzle-ui/ui";

const App = () => (
  <Theme theme="system">
    <main>
      <h1>Welcome to Puzzle</h1>
      <Button>Get started</Button>
    </main>
  </Theme>
);

export default App;
```

Your bundler must support CSS imports. Puzzle's component styles are imported by the components themselves.

## Compatibility

The generated templates target React 19.

Framework templates are generated using their official CLI tools. Their generated configuration can change as those tools evolve.

Puzzle is under active development and is not ready for production use. Review and test the generated application before using it in a real project.

## Troubleshooting

### The target directory already exists

Choose another project name or remove the existing directory yourself before running the CLI again. The CLI intentionally does not overwrite existing projects.

### A framework generator fails

The CLI invokes the official framework generator through your selected package manager. Check that the package manager is installed and that your environment can access the package registry.

### Dependency installation fails

Run the failed installation command manually from the generated project directory. Check the package manager output for registry, network, or version errors.

### Tailwind CSS is not configured

Tailwind is optional. If you skipped it, the generated application still works with Puzzle's own theme and component styling. You can add Tailwind later by following the official Tailwind CSS v4 setup for your framework.

## License

MIT
