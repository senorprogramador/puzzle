import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles/app.css?url";
import { Theme } from "@puzzle-ui/theme";
import { TanStackLink } from "../components/navigation/link/link";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Puzzle UI",
      },
      {
        name: "description",
        content:
          "Puzzle UI is a React UI library for building modern web applications.",
      },
      {
        name: "robots",
        content: "index, follow",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const siteFont = {
  family: "Geist",
  weights: [300, 400, 500, 600, 650, 700],
  display: "optional",
  fallback: ["system-ui", "sans-serif"],
} as const;

function RootDocument({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        <Theme
          theme="light"
          fonts={{
            heading: siteFont,
            body: siteFont,
            accent: siteFont,
          }}
          components={{
            link: {
              component: TanStackLink,
              hrefProp: "to",
            },
          }}
        >
          {children}
          <Scripts />
        </Theme>
      </body>
    </html>
  );
}
