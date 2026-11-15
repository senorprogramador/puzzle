import { createFileRoute } from "@tanstack/react-router";

import { source } from "@/lib/source";

import {
  HOME_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  getCanonicalUrl,
} from "@/lib/seo";

const cleanText = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const escapeMarkdownLabel = (value: string): string =>
  value.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");

const buildLlmsTxt = (): string => {
  const pages = [...source.getPages()].sort((left, right) =>
    left.url < right.url ? -1 : left.url > right.url ? 1 : 0,
  );

  const pagesByUrl = new Map(
    pages.map((page) => [getCanonicalUrl(page.url), page] as const),
  );

  if (pagesByUrl.size !== pages.length) {
    throw new Error("Documentation source contains duplicate canonical URLs.");
  }

  const getPage = (path: string) => {
    const url = getCanonicalUrl(path);
    const page = pagesByUrl.get(url);

    if (!page) {
      throw new Error(`Required documentation page is missing: ${url}`);
    }

    return page;
  };

  const renderPage = (page: (typeof pages)[number]) => {
    const title = escapeMarkdownLabel(cleanText(page.data.title));

    const description = cleanText(page.data.description);

    const url = getCanonicalUrl(page.url);

    if (description) {
      return `- [${title}](${url}): ${description}`;
    }

    return `- [${title}](${url})`;
  };

  const startPage = getPage("/docs/getting-started");
  const packageOverviews = [
    "/docs/ui",
    "/docs/theme",
    "/docs/hooks",
    "/docs/icons",
    "/docs/pieces/components/hero",
    "/docs/seo",
    "/docs/auth",
    "/docs/fullstack",
    "/docs/storage",
    "/docs/create",
  ].map(getPage);
  const tutorials = [
    "/docs/tutorials/seo",
    "/docs/tutorials/auth",
    "/docs/tutorials/storage",
  ].map(getPage);
  const featuredUrls = new Set(
    [startPage, ...packageOverviews, ...tutorials].map((page) =>
      getCanonicalUrl(page.url),
    ),
  );
  const additionalDocumentation = pages.filter(
    (page) => !featuredUrls.has(getCanonicalUrl(page.url)),
  );

  return [
    `# ${SITE_NAME}`,

    `> ${SITE_DESCRIPTION}`,

    "",

    "## Official resources",

    `- Website: ${HOME_URL}`,

    `- Full documentation for AI systems: ${getCanonicalUrl("/llms-full.txt")}`,

    "- Source repository: https://github.com/senorprogramador/puzzle",

    "",

    "## Start here",

    renderPage(startPage),

    "",

    "## Package overviews",

    ...packageOverviews.map(renderPage),

    "",

    "## Tutorials",

    ...tutorials.map(renderPage),

    "",

    "## Additional documentation",

    ...additionalDocumentation.map(renderPage),

    "",

    "## API maturity and compatibility",

    "Button, ButtonGroup and ToggleGroup have Stable APIs. Storage adapters, Auth, Session, Fullstack and SEO surfaces described in the tutorials are Beta; other UI primitives have component-specific labels. Beta status does not guarantee production readiness.",

    `See ${getCanonicalUrl("/docs/tutorials")}#api-maturity.`,

    "",
  ].join("\n");
};

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "X-Content-Type-Options": "nosniff",
          },
        }),
    },
  },
});
