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
    left.url.localeCompare(right.url),
  );

  const documentation = pages.map((page) => {
    const title = escapeMarkdownLabel(cleanText(page.data.title));

    const description = cleanText(page.data.description);

    const url = getCanonicalUrl(page.url);

    if (description) {
      return `- [${title}](${url}): ${description}`;
    }

    return `- [${title}](${url})`;
  });

  return [
    `# ${SITE_NAME}`,

    `> ${SITE_DESCRIPTION}`,

    "",

    "Puzzle is an open-source, TypeScript-first React design system and developer ecosystem with UI components, theme tokens, hooks, icons, composed page sections, SEO utilities, authentication integrations, and project scaffolding.",

    "",

    "## Official resources",

    `- Website: ${HOME_URL}`,

    `- Documentation: ${getCanonicalUrl("/docs/getting-started")}`,

    "- Source repository: https://github.com/senorprogramador/puzzle",

    "",

    "## Documentation",

    ...documentation,

    "",

    "## API maturity and compatibility",

    "Component API maturity and package-specific compatibility notes are documented in the relevant package guides.",

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
