import type { ReactNode } from "react";
import fonts from "../puzzle-fonts.json";
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
        name: "author",
        content: "Señor Programador",
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "Puzzle UI",
      },
      {
        property: "og:locale",
        content: "en_US",
      },
      {
        property: "og:title",
        content: "Puzzle UI",
      },
      {
        property: "og:description",
        content:
          "Puzzle UI is a React UI library for building modern web applications.",
      },
      {
        property: "og:image",
        content: "https://puzzle-ui.com/puzzle_social.png",
      },
      {
        property: "og:image:secure_url",
        content: "https://puzzle-ui.com/puzzle_social.png",
      },
      {
        property: "og:image:type",
        content: "image/png",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "675",
      },
      {
        property: "og:image:alt",
        content: "Puzzle UI Social Image",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      { name: "twitter:title", content: "Puzzle UI" },
      {
        name: "twitter:description",
        content:
          "Puzzle UI is a React UI library for building modern web applications.",
      },
      {
        name: "twitter:image",
        content: "https://puzzle-ui.com/puzzle_social.png",
      },
      { name: "twitter:image:alt", content: "Puzzle UI Social Image" },
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
          fonts={fonts}
          fontSource="local"
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
