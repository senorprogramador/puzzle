import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Theme } from "@puzzle-ui/theme";
import { WorkspaceAuthProvider } from "@puzzle-ui/workspace-ui";
import { Button, Container, Heading } from "@puzzle-ui/ui";

import fonts from "../puzzle-fonts.json";

// Puzzle Link renders the TanStack Router Link, which uses a `to` prop.
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
        <WorkspaceAuthProvider>
          <Outlet />
        </WorkspaceAuthProvider>
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
  notFoundComponent: () => (
    <Container
      as="main"
      widthPreset="content"
      style={{ paddingBlock: "var(--puzzle-space-16)" }}
    >
      <Heading as="h1" level="headline1">Page not found</Heading>
      <Button href="/">Back to home</Button>
    </Container>
  ),
});
