import { source } from "@/lib/source";
import {
  getCanonicalUrl,
  HOME_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo";

import { extractMdxToMarkdown } from "./mdx-to-markdown";
import { formatFaqMarkdown } from "./faq";

const rawPages = import.meta.glob<string>(
  ["../../content/docs/**/*.md", "../../content/docs/**/*.mdx"],
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
);

const cleanText = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const getPageUrlFromModule = (moduleId: string): string => {
  const marker = "content/docs/";
  const markerIndex = moduleId.lastIndexOf(marker);

  if (markerIndex < 0 || !/\.mdx?$/.test(moduleId)) {
    throw new Error(`Unexpected documentation source module: ${moduleId}`);
  }

  let slug = moduleId
    .slice(markerIndex + marker.length)
    .replace(/\.mdx?$/, "");

  if (slug === "index") {
    slug = "";
  } else if (slug.endsWith("/index")) {
    slug = slug.slice(0, -"/index".length);
  }

  return getCanonicalUrl(slug ? `/docs/${slug}` : "/docs");
};

const getPublicPages = () => {
  const pages = source.getPages();
  const pagesByUrl = new Map(
    pages.map((page) => [getCanonicalUrl(page.url), page] as const),
  );
  const seen = new Set<string>();

  if (pagesByUrl.size !== pages.length) {
    throw new Error("Documentation source contains duplicate canonical URLs.");
  }

  const entries = Object.entries(rawPages).flatMap(([moduleId, content]) => {
    const url = getPageUrlFromModule(moduleId);
    const page = pagesByUrl.get(url);

    if (!page) {
      return [];
    }

    if (seen.has(url)) {
      throw new Error(`Multiple MDX files resolve to ${url}.`);
    }

    seen.add(url);

    return [{ page, url, content }];
  });

  const missingPages = [...pagesByUrl.keys()].filter((url) => !seen.has(url));

  if (missingPages.length > 0) {
    throw new Error(
      `Missing MDX source for public documentation pages: ${missingPages.join(", ")}`,
    );
  }

  return entries.sort((left, right) =>
    left.url < right.url ? -1 : left.url > right.url ? 1 : 0,
  );
};

export const buildFullLlmsText = (): string => {
  const pages = getPublicPages();
  const documents = pages.map(({ page, url, content }) => {
    const title = cleanText(page.data.title) || url;
    const description = cleanText(page.data.description);
    const markdown = extractMdxToMarkdown(content, url);
    const faq = page.data.faq;

    return [
      `## ${title}`,
      "",
      `Source: ${url}`,
      ...(description ? ["", description] : []),
      ...(markdown ? ["", markdown] : []),
      ...(faq ? ["", formatFaqMarkdown(faq)] : []),
    ].join("\n");
  });

  return [
    `# ${SITE_NAME} - Full documentation`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Official resources",
    `- Website: ${HOME_URL}`,
    `- Documentation: ${getCanonicalUrl("/docs/getting-started")}`,
    `- Source repository: https://github.com/senorprogramador/puzzle`,
    "",
    "## API maturity",
    "Button, ButtonGroup and ToggleGroup have Stable APIs. Storage adapters, Auth, Session, Fullstack and SEO surfaces described in the tutorials are Beta; other UI primitives have component-specific labels. Beta status does not guarantee production readiness.",
    `See ${getCanonicalUrl("/docs/tutorials")}#api-maturity.`,
    "",
    "## Documentation pages",
    ...documents,
    "",
  ].join("\n");
};

let cachedFullText: string | undefined;

export const getFullLlmsText = (): string => {
  cachedFullText ??= buildFullLlmsText();
  return cachedFullText;
};
