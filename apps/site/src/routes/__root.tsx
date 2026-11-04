import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles/app.css?url";
import { Theme } from "@puzzle/theme";
import { PageLayout } from "@puzzle/ui/components/layout/page-layout";
import { AppBar } from "@puzzle/ui/components/layout/app-bar";
import { Sidebar } from "@/components/layout/sidebar";

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

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Theme
          theme="light"
          fonts={{
            heading: {
              family: "Geist",
              weights: [600, 700],
            },
            body: {
              family: "Inter",
              weights: [400, 600],
            },
            accent: {
              family: "Geist",
              weights: [400, 500],
            },
          }}
        >
          <HeadContent />
        </Theme>
      </head>
      <body>
        <PageLayout>
          <PageLayout.Header>
            <AppBar
              logo={
                <img
                  src="/favicon.svg"
                  width="48"
                  height="48"
                  alt="Logo"
                  className="h-12 w-12"
                />
              }
              title="Puzzle"
              navigationItems={[
                { label: "Home", href: "/", current: true },
                { label: "Components", href: "/components" },
                { label: "Docs", href: "/docs" },
              ]}
              sticky
            />
          </PageLayout.Header>
          <PageLayout.LeftSidebar>
            <Sidebar />
          </PageLayout.LeftSidebar>
          <PageLayout.Main>{children}</PageLayout.Main>
        </PageLayout>
        <Scripts />
      </body>
    </html>
  );
}
