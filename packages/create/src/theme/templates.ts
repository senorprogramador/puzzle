import { DOCS_URL } from "../constants";

import type { AuthDatabase, Framework } from "../types";

export type TemplateOptions = {
  framework: Framework;
  auth?: boolean;
  database?: AuthDatabase;
};

type DocsLink = {
  title: string;
  description: string;
  href: string;
};

const getDocsLinks = ({
  framework,
  auth = false,
  database,
}: TemplateOptions): DocsLink[] => {
  const links: DocsLink[] = [
    {
      title: "Getting started",
      description: "Install Puzzle and learn how the packages fit together.",
      href: `${DOCS_URL}/getting-started`,
    },
    {
      title: "Puzzle UI",
      description: "Accessible React components for your interface.",
      href: `${DOCS_URL}/ui`,
    },
    {
      title: "Puzzle Theme",
      description: "Design tokens, color schemes and the Theme provider.",
      href: `${DOCS_URL}/theme`,
    },
  ];

  if (framework !== "react") {
    links.push({
      title: "Framework components",
      description: "How Puzzle Link and Image use your framework's components.",
      href: `${DOCS_URL}/theme/components`,
    });
  }

  if (auth) {
    links.push(
      {
        title: "Puzzle Auth",
        description: "Accounts, sessions, MFA and security defaults.",
        href: `${DOCS_URL}/auth`,
      },
      {
        title: "Puzzle Fullstack",
        description: "Auth routes for your server and React auth components.",
        href: `${DOCS_URL}/fullstack`,
      },
    );

    if (database) {
      links.push({
        title: "Puzzle Storage",
        description:
          database === "custom"
            ? "Connect your own database with a storage adapter."
            : "The storage adapters that persist users and sessions.",
        href: `${DOCS_URL}/storage`,
      });
    }

    if (framework === "next") {
      links.push({
        title: "Auth with Next.js",
        description: "A complete tutorial for production-ready auth.",
        href: `${DOCS_URL}/tutorials/auth-nextjs`,
      });
    }

    if (framework === "tanstack") {
      links.push({
        title: "Auth with TanStack Start",
        description: "A complete tutorial for production-ready auth.",
        href: `${DOCS_URL}/tutorials/auth-tanstack-start`,
      });
    }
  }

  return links;
};

const pagePaths: Record<Framework, string> = {
  next: "src/app/page.tsx",
  tanstack: "src/routes/index.tsx",
  "react-router": "app/routes/home.tsx",
  react: "src/App.tsx",
};

const indent = (value: string, spaces: number) =>
  value
    .split("\n")
    .map((line) => (line ? `${" ".repeat(spaces)}${line}` : line))
    .join("\n");

const renderDocsLinks = (options: TemplateOptions) =>
  `const docs = ${JSON.stringify(getDocsLinks(options), null, 2)};`;

const renderHomePage = (options: TemplateOptions) => {
  const showAuthLinks = options.auth && options.framework !== "react";

  const authActions = showAuthLinks
    ? `
<Stack direction="row" gap="sm" wrap="wrap">
  <Button href="/sign-up">Create an account</Button>
  <Button href="/sign-in" variant="outline">
    Sign in
  </Button>
  <Button href="/dashboard" variant="ghost">
    Open the protected dashboard
  </Button>
</Stack>
`
    : "";

  return `<Container
  as="main"
  widthPreset="content"
  style={{ paddingBlock: "var(--puzzle-space-16)" }}
>
  <Stack direction="col" gap="xl">
    <Stack direction="col" gap="sm">
      <Heading as="h1" level="display2">
        Welcome to Puzzle
      </Heading>
      <Text as="p" type="body1">
        Your new Puzzle application is ready. Edit <code>${pagePaths[options.framework]}</code> to get started.
      </Text>
    </Stack>
${indent(authActions, 4)}
    <Stack as="section" direction="col" gap="md" aria-labelledby="docs-heading">
      <Heading id="docs-heading" level="headline3">
        Documentation
      </Heading>
      <Stack
        as="ul"
        direction="col"
        gap="sm"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {docs.map((doc) => (
          <Card as="li" key={doc.href} variant="outlined" size="sm">
            <CardHeader>
              <CardTitle>
                <Link href={doc.href}>{doc.title}</Link>
              </CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </Stack>
    </Stack>
  </Stack>
</Container>`.replace(/\n{3,}/g, "\n\n");
};

const homePageImports = (options: TemplateOptions) => {
  const names = [
    ...(options.auth && options.framework !== "react" ? ["Button"] : []),
    "Card",
    "CardDescription",
    "CardHeader",
    "CardTitle",
    "Container",
    "Heading",
    "Link",
    "Stack",
    "Text",
  ];

  return `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "@puzzle-ui/ui";`;
};

const renderHomeComponent = (name: string, options: TemplateOptions) =>
  `${renderDocsLinks(options)}

const ${name} = () => (
${indent(renderHomePage(options), 2)}
);`;

const renderThemeChildren = (auth: boolean, children: string, spaces: number) =>
  auth
    ? `${" ".repeat(spaces)}<AuthProvider options={{ basePath: "/api/auth" }}>
${" ".repeat(spaces + 2)}${children}
${" ".repeat(spaces)}</AuthProvider>`
    : `${" ".repeat(spaces)}${children}`;

const authProviderImport = (auth: boolean) =>
  auth
    ? '\nimport { AuthProvider } from "@puzzle-ui/fullstack/auth/client";'
    : "";

const nextProviders = ({ auth = false }: TemplateOptions) => `"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { Theme } from "@puzzle-ui/theme";${authProviderImport(auth)}

import fonts from "../puzzle-fonts.json";

type ProvidersProps = {
  children: ReactNode;
};

// Puzzle Link and Image render the Next.js components.
const themeComponents = {
  link: Link,
  image: Image,
};

const Providers = ({ children }: ProvidersProps) => (
  <Theme
    theme="system"
    fonts={fonts}
    fontSource="local"
    components={themeComponents}
  >
${renderThemeChildren(auth, "{children}", 4)}
  </Theme>
);

export { Providers };
`;

const nextLayout = `import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Puzzle",
  description: "Built with Puzzle",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <Providers>
        {children}
      </Providers>
    </body>
  </html>
);

export default RootLayout;
`;

const nextPage = (options: TemplateOptions) => `${homePageImports(options)}

${renderHomeComponent("HomePage", options)}

export default HomePage;
`;

const tanstackRootRoute = ({ auth = false }: TemplateOptions) => `import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Theme } from "@puzzle-ui/theme";${authProviderImport(auth)}

import fonts from "../puzzle-fonts.json";

// Puzzle Link renders the TanStack Router Link, which uses a \`to\` prop.
const themeComponents = {
  link: { component: Link, hrefProp: "to" as const },
};

const RootComponent = () => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <Theme
        theme="system"
        fonts={fonts}
        fontSource="local"
        components={themeComponents}
      >
${renderThemeChildren(auth, "<Outlet />", 8)}
      </Theme>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Puzzle" },
    ],
  }),
  component: RootComponent,
});
`;

const tanstackIndexRoute = (
  options: TemplateOptions,
) => `import { createFileRoute } from "@tanstack/react-router";

${homePageImports(options)}

${renderHomeComponent("HomePage", options)}

export const Route = createFileRoute("/")({
  component: HomePage,
});
`;

const reactRouterRoot = ({ auth = false }: TemplateOptions) => `import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Theme } from "@puzzle-ui/theme";${authProviderImport(auth)}
import { Container, Heading, Text } from "@puzzle-ui/ui";

import type { Route } from "./+types/root";

import fonts from "./puzzle-fonts.json";

import "./app.css";

// Puzzle Link renders the React Router Link, which uses a \`to\` prop.
const themeComponents = {
  link: { component: Link, hrefProp: "to" as const },
};

export const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <Theme
        theme="system"
        fonts={fonts}
        fontSource="local"
        components={themeComponents}
      >
${renderThemeChildren(auth, "{children}", 8)}
      </Theme>
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const App = () => <Outlet />;

export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container
      as="main"
      widthPreset="content"
      style={{ paddingBlock: "var(--puzzle-space-16)" }}
    >
      <Heading as="h1" level="headline1">
        {message}
      </Heading>
      <Text as="p">{details}</Text>
      {stack && (
        <pre style={{ overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </Container>
  );
};
`;

const reactRouterRoutes = ({ auth = false }: TemplateOptions) =>
  auth
    ? `import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("api/auth/*", "routes/api.auth.ts"),
] satisfies RouteConfig;
`
    : `import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;
`;

const reactRouterHome = (options: TemplateOptions) => `${homePageImports(options)}

import type { Route } from "./+types/home";

export const meta = (_: Route.MetaArgs) => [
  { title: "Puzzle" },
  { name: "description", content: "Built with Puzzle" },
];

${renderHomeComponent("HomePage", options)}

export default HomePage;
`;

const reactRouterStyles = `body {
  margin: 0;
}
`;

const reactMain = ({ auth = false }: TemplateOptions) => `import React from "react";
import ReactDOM from "react-dom/client";

import { Theme } from "@puzzle-ui/theme";${authProviderImport(auth)}

import App from "./App";
import fonts from "./puzzle-fonts.json";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Theme theme="system" fonts={fonts} fontSource="local">
${renderThemeChildren(auth, "<App />", 6)}
    </Theme>
  </React.StrictMode>,
);
`;

const reactApp = (options: TemplateOptions) => `${homePageImports(options)}

${renderHomeComponent("App", options)}

export default App;
`;

const defaultFonts = `${JSON.stringify(
  {
    heading: {
      family: "Geist",
      weightRange: [400, 700],
      display: "swap",
      fallback: ["system-ui", "sans-serif"],
    },
    body: {
      family: "Geist",
      weightRange: [400, 700],
      display: "swap",
      fallback: ["system-ui", "sans-serif"],
    },
  },
  null,
  2,
)}\n`;

/**
 * Font configuration file, relative to the project root, for each framework.
 */
const fontConfigPaths: Record<Framework, string> = {
  next: "src/puzzle-fonts.json",
  tanstack: "src/puzzle-fonts.json",
  "react-router": "app/puzzle-fonts.json",
  react: "src/puzzle-fonts.json",
};

const getFontDownloadScript = (framework: Framework) =>
  `puzzle-theme fonts download --config ${fontConfigPaths[framework]} --subsets latin,latin-ext`;

const getFrameworkTemplates = (
  options: TemplateOptions,
): Record<string, string> => {
  switch (options.framework) {
    case "next":
      return {
        "src/app/providers.tsx": nextProviders(options),
        "src/app/layout.tsx": nextLayout,
        "src/app/page.tsx": nextPage(options),
      };
    case "tanstack":
      return {
        "src/routes/__root.tsx": tanstackRootRoute(options),
        "src/routes/index.tsx": tanstackIndexRoute(options),
      };
    case "react-router":
      return {
        "app/root.tsx": reactRouterRoot(options),
        "app/routes.ts": reactRouterRoutes(options),
        "app/routes/home.tsx": reactRouterHome(options),
        "app/app.css": reactRouterStyles,
      };
    case "react":
      return {
        "src/main.tsx": reactMain(options),
        "src/App.tsx": reactApp(options),
      };
  }
};

const getThemeTemplates = (options: TemplateOptions): Record<string, string> => ({
  [fontConfigPaths[options.framework]]: defaultFonts,
  ...getFrameworkTemplates(options),
});

/**
 * Template files replaced by the Puzzle templates and safe to remove.
 */
const obsoleteTemplatePaths: Partial<Record<Framework, string[]>> = {
  "react-router": ["app/welcome"],
};

export {
  fontConfigPaths,
  getDocsLinks,
  getFontDownloadScript,
  getThemeTemplates,
  obsoleteTemplatePaths,
};
