# @puzzle-ui/create

Create a new React application with Puzzle UI installed and configured.

The CLI scaffolds a React application, configures the Puzzle theme, optionally configures Tailwind CSS, and can add the Puzzle authentication client and framework integration.

## Requirements

- Node.js 20.19 or later.
- npm, Bun, pnpm, or Yarn.
- An internet connection to download framework templates and dependencies.

## Quick start

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

The CLI detects the package manager from the execution environment and uses it for framework generation and dependency installation.

## Supported frameworks

| Framework      | Description                        |
| -------------- | ---------------------------------- |
| Next.js        | Next.js App Router with TypeScript |
| TanStack Start | Full-stack React application       |
| Basic React    | React, Vite, and TypeScript        |

## Setup options

The interactive setup asks for:

1. **Project name** — converted to kebab-case and used as the project directory and package name.
2. **Framework** — Next.js, TanStack Start, or Basic React.
3. **Tailwind CSS** — optionally configures Tailwind CSS v4.
4. **Puzzle Auth** — optionally installs and configures the Puzzle authentication client and framework integration.

The CLI then:

1. Checks that the target directory does not already exist.
2. Generates the selected framework.
3. Configures framework package transpilation where required.
4. Configures the Puzzle theme provider.
5. Updates the generated package name.
6. Optionally configures and installs Tailwind CSS.
7. Optionally configures Puzzle Auth.
8. Installs the selected Puzzle packages.

The CLI does not overwrite an existing directory.

## Puzzle UI and Theme

The generated application includes:

- React 19 and TypeScript.
- A configured Puzzle <code>Theme</code> provider.
- A starter page using the Puzzle <code>Button</code> component.
- A framework-specific entry point and development configuration.
- Optional Tailwind CSS v4 integration.

## Puzzle Auth

When enabled, the generator installs:

- <code>@puzzle-ui/auth</code>
- <code>@puzzle-ui/fullstack</code>
- <code>@puzzle-ui/session</code>

The generated client integration includes:

- An <code>AuthProvider</code> configured with <code>/api/auth</code>.
- A sign-in page using <code>AuthExperience</code>.
- A sign-up page using <code>AuthExperience</code>.
- A framework-specific authentication API route for Next.js or TanStack Start.
- A server-only AuthServer registration boundary.
- A bootstrap function for application-specific server configuration.

### Important server setup

Puzzle Auth intentionally does not ship an insecure default password hasher, storage adapter, or production rate limiter.

You must configure the following application dependencies:

- A storage adapter with the atomicity and uniqueness capabilities required by Puzzle Auth.
- A secure password hashing provider.
- A shared, atomic rate limiter.
- A session manager.
- An MFA manager and secret protector.
- A step-up manager.
- Secure cookie and CSRF configuration.
- Trusted client IP resolution.

The generated API route returns HTTP 503 until the application registers an actual <code>AuthServer</code>.

This is intentional. The generator must never silently create an authentication endpoint that appears functional while using unsafe or incomplete security providers.

See the [Authentication setup guide](/docs/developer/authentication) for the required configuration.

### Basic React limitation

A Basic React project is a browser application. The generator adds the Auth provider and authentication screens, but does not create a server runtime or API route.

Host the authentication API in a separate server application and configure the Auth client's base path accordingly.

## Run your application

After creation, move into the generated project and start its development server.

```bash
cd my-awesome-app
npm run dev
```

Use the package manager selected during setup. For example, with Bun:

```bash
cd my-awesome-app
bun run dev
```

## Manual installation

Install the UI and theme packages:

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

To add the authentication client and framework integrations:

```bash
npm install @puzzle-ui/auth @puzzle-ui/fullstack @puzzle-ui/session
```

See the [Authentication setup guide](/docs/developer/authentication) before exposing authentication routes.

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

Tailwind is optional. If you skipped it, the generated application still works with Puzzle's own theme and component styling.

### Authentication returns HTTP 503

The generated server bootstrap is intentionally incomplete. Configure your storage adapter, password hasher, rate limiter, session manager, MFA manager, step-up manager, cookies, CSRF policy, and trusted client IP resolver.

Register the resulting <code>AuthServer</code> with <code>configureAuthServer</code> from the generated server-only module.

## License

MIT
