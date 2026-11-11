import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { createServerFn } from "@tanstack/react-start";
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
import { AppBar } from "@puzzle-ui/ui/components/layout/app-bar";

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await serverLoader({ data: slugs });
    await docs.getPage(data.path)?.preload();
    return data;
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Content({ path }: { path: string }) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <PageLayout>
      <PageLayout.Header className="puzzle-site-header">
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

      <PageLayout.Main>
        <RootProvider theme={{ enabled: false }}>
          <DocsLayout
            {...baseOptions()}
            containerProps={{ className: "puzzle-site-docs" }}
            tree={data.pageTree}
            sidebar={{ enabled: false }}
          >
            <Suspense>
              <Content path={data.path} />
            </Suspense>
          </DocsLayout>
        </RootProvider>
        ;
      </PageLayout.Main>
    </PageLayout>
  );
}
