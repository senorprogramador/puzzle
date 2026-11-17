import type { ReactNode } from "react";

import fonts from "../puzzle-fonts.json";

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";

import appCss from "../styles/app.css?url";

import { Theme } from "@puzzle-ui/theme";

import {
  LDOrganization,
  LDWebPage,
  LDWebSite,
  Schema,
  SeoProvider,
} from "@puzzle-ui/seo";

import {
  createSeoHead,
  HOME_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  seoConfig,
  AUTHOR,
  AUTHOR_ID,
  PUBLISHER,
  PUBLISHER_ID,
} from "@/lib/seo";

import { TanStackLink } from "../components/navigation/link/link";

const rootSeoHead = createSeoHead({
  title: "TypeScript-First React Design System",
  description: SITE_DESCRIPTION,
  locale: "en-US",
  author: AUTHOR.name,

  openGraph: {
    type: "website",
  },
});

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
      ...rootSeoHead.meta,
    ],

    links: [
      ...rootSeoHead.links,

      {
        rel: "stylesheet",
        href: appCss,
      },

      {
        rel: "sitemap",
        type: "application/xml",
        href: "/sitemap.xml",
      },

      {
        rel: "alternate",
        type: "text/plain",
        title: "AI-friendly documentation index",
        href: "/llms.txt",
      },
      {
        rel: "alternate",
        type: "text/plain",
        title: "Full AI-readable documentation",
        href: "/llms-full.txt",
      },

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

      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
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

/**
 * Homepage structured data.
 *
 * Organization and WebSite are declared globally. The homepage
 * is only registered when the active route is "/".
 */
function SitePageStructuredData() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname !== "/") {
    return null;
  }

  return (
    <LDWebPage
      id={`${SITE_URL}/#webpage`}
      name="TypeScript-First React Design System"
      description={SITE_DESCRIPTION}
      url={HOME_URL}
      inLanguage="en-US"
      about={{
        "@id": `${SITE_URL}/#software`,
      }}
      isPartOf={{
        "@id": `${SITE_URL}/#website`,
      }}
    />
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
          fontPreload={false}
          components={{
            link: {
              component: TanStackLink,
              hrefProp: "to",
            },
          }}
        >
          <SeoProvider
            config={seoConfig}
            validation={{
              mode: "warn",
              baseUrl: SITE_URL,
            }}
          >
            <LDOrganization
              id={PUBLISHER_ID}
              name={PUBLISHER.name}
              url={PUBLISHER.url}
              logo={PUBLISHER.logo}
              founder={{
                "@id": AUTHOR_ID,
              }}
            />

            <Schema
              type="Person"
              id={AUTHOR_ID}
              data={{
                name: AUTHOR.name,
                url: AUTHOR.url,
                jobTitle: AUTHOR.jobTitle,
                sameAs: AUTHOR.sameAs,
                worksFor: {
                  "@id": PUBLISHER_ID,
                },
              }}
            />

            <LDWebSite
              id={`${SITE_URL}/#website`}
              name={SITE_NAME}
              url={HOME_URL}
              description={SITE_DESCRIPTION}
              inLanguage="en-US"
              publisher={{
                "@id": PUBLISHER_ID,
              }}
            />

            <SitePageStructuredData />

            {children}

            <Scripts />
          </SeoProvider>
        </Theme>
      </body>
    </html>
  );
}
