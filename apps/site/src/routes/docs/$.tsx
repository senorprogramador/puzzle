import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { createServerFn } from "@tanstack/react-start";

import {
  LDBreadcrumbList,
  LDWebPage,
  Schema,
  type SchemaValue,
} from "@puzzle-ui/seo";

import { HOME_URL, getCanonicalUrl, SITE_URL, createSeoHead } from "@/lib/seo";

import { docs, source } from "@/lib/source";

import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";

import { baseOptions } from "@/lib/layout.shared";

import { useFumadocsLoader } from "fumadocs-core/source/client";

import { Suspense, use } from "react";

import { useMDXComponents } from "@/components/mdx";

import { RootProvider } from "fumadocs-ui/provider/tanstack";

import { PageLayout } from "@puzzle-ui/ui/components/layout/page-layout";

import { Sidebar } from "@/components/layout/sidebar";

import { Header } from "@/components/layout/header";

import "./docs.css";

const normalizePath = (url: string): string => {
  const pathname = new URL(url, HOME_URL).pathname;

  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
};

/**
 * Creates breadcrumbs using actual Fumadocs pages.
 *
 * Only pages that exist in the documentation source are included.
 * This avoids creating breadcrumbs that point to non-existent URLs.
 */
const getBreadcrumbItems = (
  pageUrl: string,
  pageTitle: string,
): SchemaValue[] => {
  const currentPath = normalizePath(pageUrl);

  const ancestors = source
    .getPages()
    .filter((candidate) => {
      const candidatePath = normalizePath(candidate.url);

      return (
        candidatePath !== "/" &&
        candidatePath !== currentPath &&
        currentPath.startsWith(`${candidatePath}/`)
      );
    })
    .sort((left, right) => {
      const leftDepth = normalizePath(left.url)
        .split("/")
        .filter(Boolean).length;

      const rightDepth = normalizePath(right.url)
        .split("/")
        .filter(Boolean).length;

      return leftDepth - rightDepth;
    });

  const items: SchemaValue[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: HOME_URL,
    },
  ];

  ancestors.forEach((page, index) => {
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: page.data.title,
      item: getCanonicalUrl(page.url),
    });
  });

  items.push({
    "@type": "ListItem",
    position: ancestors.length + 2,
    name: pageTitle,
    item: pageUrl,
  });

  return items;
};

export const Route = createFileRoute("/docs/$")({
  component: Page,

  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];

    const data = await serverLoader({
      data: slugs,
    });

    await docs.getPage(data.path)?.preload();

    return data;
  },

  head: ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];

    const page = source.getPage(slugs);

    if (!page) {
      return {
        meta: [
          {
            name: "robots",
            content: "noindex, nofollow",
          },
        ],
      };
    }

    const canonical = getCanonicalUrl(page.url);

    return createSeoHead({
      title: page.data.title,
      description: page.data.description,
      canonical,
      locale: "en-US",

      openGraph: {
        type: "article",
        url: canonical,
      },
    });
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);

    if (!page) {
      throw notFound();
    }

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Content({ path }: { path: string }) {
  const page = docs.getPage(path);

  if (!page) {
    throw new Error(`Unknown documentation page: ${path}`);
  }

  const sourcePage = source
    .getPages()
    .find((candidate) => candidate.path === path);

  if (!sourcePage) {
    throw new Error(`Documentation metadata not found for page: ${path}`);
  }

  const { toc } = use(page.load());

  const MDX = page.body;

  const canonical = getCanonicalUrl(sourcePage.url);

  const description = sourcePage.data.description ?? page.description;

  const breadcrumbs = getBreadcrumbItems(canonical, page.title);

  return (
    <>
      <LDWebPage
        id={`${canonical}#webpage`}
        name={page.title}
        description={description}
        url={canonical}
        inLanguage="en-US"
        isPartOf={{
          "@id": `${SITE_URL}/#website`,
        }}
        breadcrumb={{
          "@id": `${canonical}#breadcrumbs`,
        }}
        mainEntity={{
          "@id": `${canonical}#article`,
        }}
      />

      <Schema
        type="TechArticle"
        id={`${canonical}#article`}
        data={{
          headline: page.title,
          ...(description
            ? {
                description,
              }
            : {}),
          url: canonical,
          mainEntityOfPage: {
            "@id": `${canonical}#webpage`,
          },
          author: {
            "@id": "https://senorprogramador.com/#person",
          },
          publisher: {
            "@id": "https://senorprogramador.com/#organization",
          },
          isPartOf: {
            "@id": `${SITE_URL}/#website`,
          },
          inLanguage: "en-US",
        }}
      />

      <LDBreadcrumbList
        id={`${canonical}#breadcrumbs`}
        itemListElement={breadcrumbs}
      />

      <DocsPage toc={toc}>
        <DocsTitle>{page.title}</DocsTitle>

        <DocsDescription>{page.description}</DocsDescription>

        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </>
  );
}

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <PageLayout className="puzzle-site-docs-layout">
      <PageLayout.Header className="puzzle-site-header">
        <Header />
      </PageLayout.Header>

      <PageLayout.LeftSidebar>
        <Sidebar />
      </PageLayout.LeftSidebar>

      <PageLayout.Main>
        <RootProvider theme={{ enabled: false }}>
          <DocsLayout
            {...baseOptions()}
            containerProps={{
              className: "puzzle-site-docs",
            }}
            tree={data.pageTree}
            sidebar={{
              enabled: false,
            }}
          >
            <Suspense>
              <Content path={data.path} />
            </Suspense>
          </DocsLayout>
        </RootProvider>
      </PageLayout.Main>
    </PageLayout>
  );
}
