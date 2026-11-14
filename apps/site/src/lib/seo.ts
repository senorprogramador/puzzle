import type { SeoConfig, SeoPageMetadata } from "@puzzle-ui/seo";
import { normalizeSeoConfig } from "@puzzle-ui/seo/context";
import { resolveSeoMetadata, resolveSeoRobots } from "@puzzle-ui/seo/metadata";

export const SITE_URL = "https://puzzle-ui.com";
export const HOME_URL = `${SITE_URL}/`;
export const SITE_NAME = "Puzzle UI";

export const AUTHOR = {
  name: "Sjoerd van den Berg",
  url: "https://senorprogramador.com",
  jobTitle: "Senior Software Engineer",
  sameAs: [
    "https://github.com/senorprogramador",
    "https://www.linkedin.com/in/sjoerdberg",
  ],
};

export const PUBLISHER = {
  name: "Señor Programador",
  url: "https://senorprogramador.com",
  logo: "https://api.senorprogramador.com/favicon/apple-touch-icon.png",
};

export const SITE_DESCRIPTION =
  "Puzzle is a TypeScript-first React design system and developer ecosystem for UI components, theme tokens, hooks, icons, page sections, SEO, authentication, and project scaffolding.";

const SITE_ORIGIN = new URL(SITE_URL).origin;

const SOCIAL_IMAGE = {
  url: `${SITE_URL}/puzzle_social.png`,
  width: 1200,
  height: 675,
  alt: "Puzzle UI — TypeScript-first React design system",
  type: "image/png",
};

const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  maxSnippet: -1,
  maxImagePreview: "large" as const,
  maxVideoPreview: -1,
};

export const seoConfig: SeoConfig = {
  siteUrl: SITE_URL,

  defaultLocale: "en-US",
  supportedLocales: ["en"],

  trailingSlash: "never",

  title: {
    default: SITE_NAME,
    template: `${SITE_NAME} | %s`,
  },

  identity: {
    name: SITE_NAME,
    url: HOME_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    description: SITE_DESCRIPTION,
  },
};

const resolvedSeoConfig = normalizeSeoConfig(seoConfig);

type SeoMetaDescriptor =
  | {
      title: string;
    }
  | {
      name: string;
      content: string;
    }
  | {
      property: string;
      content: string;
    };

type SeoLinkDescriptor =
  | {
      rel: "canonical";
      href: string;
    }
  | {
      rel: "alternate";
      href: string;
      hrefLang: string;
    };

export interface SeoHead {
  meta: SeoMetaDescriptor[];
  links: SeoLinkDescriptor[];
}

/**
 * Returns a canonical URL belonging to the Puzzle website.
 *
 * Query parameters and fragments are deliberately excluded.
 * Trailing slashes are removed except for the homepage.
 */
export const getCanonicalUrl = (path: string): string => {
  const url = new URL(path, HOME_URL);

  if (url.origin !== SITE_ORIGIN) {
    throw new Error(
      `Puzzle canonical URLs must belong to ${SITE_ORIGIN}. Received: ${url.origin}`,
    );
  }

  url.search = "";
  url.hash = "";

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
};

/**
 * Resolves Puzzle SEO metadata and converts it into TanStack Router
 * metadata descriptors.
 *
 * This keeps all metadata generation on the server. No client-side
 * document.title or metadata mutation is required.
 */
export const createSeoHead = (metadata: SeoPageMetadata): SeoHead => {
  const pageMetadata: SeoPageMetadata = {
    ...metadata,

    author: metadata.author ?? SITE_NAME,

    robots: metadata.robots ?? DEFAULT_ROBOTS,

    openGraph: {
      ...metadata.openGraph,
      images: metadata.openGraph?.images ?? [SOCIAL_IMAGE],
    },
  };

  const resolved = resolveSeoMetadata(pageMetadata, resolvedSeoConfig);

  const robots = resolveSeoRobots(pageMetadata, resolvedSeoConfig);

  const meta: SeoMetaDescriptor[] = [
    {
      title: resolved.title,
    },
  ];

  const links: SeoLinkDescriptor[] = [];

  const addName = (name: string, content: string | undefined) => {
    if (content === undefined || content === "") {
      return;
    }

    meta.push({
      name,
      content,
    });
  };

  const addProperty = (property: string, content: string | undefined) => {
    if (content === undefined || content === "") {
      return;
    }

    meta.push({
      property,
      content,
    });
  };

  // Standard metadata.

  addName("description", resolved.description);
  addName("robots", robots);
  addName("author", resolved.author);
  addName("keywords", resolved.keywords?.join(", "));

  // Open Graph.

  addProperty("og:title", resolved.openGraph.title);
  addProperty("og:description", resolved.openGraph.description);
  addProperty("og:type", resolved.openGraph.type);
  addProperty("og:url", resolved.openGraph.url);
  addProperty("og:site_name", resolved.openGraph.siteName);
  addProperty("og:locale", resolved.openGraph.locale);

  for (const image of resolved.openGraph.images ?? []) {
    addProperty("og:image", image.url);
    addProperty("og:image:secure_url", image.url);

    addProperty("og:image:type", image.type);

    addProperty(
      "og:image:width",
      image.width !== undefined ? String(image.width) : undefined,
    );

    addProperty(
      "og:image:height",
      image.height !== undefined ? String(image.height) : undefined,
    );

    addProperty("og:image:alt", image.alt);
  }

  // Twitter / X.

  addName("twitter:card", resolved.twitter.card);
  addName("twitter:title", resolved.twitter.title);
  addName("twitter:description", resolved.twitter.description);
  addName("twitter:site", resolved.twitter.site);
  addName("twitter:creator", resolved.twitter.creator);
  addName("twitter:image:alt", resolved.twitter.imageAlt);

  (resolved.twitter.images ?? []).forEach((url, index) => {
    addName(index === 0 ? "twitter:image" : `twitter:image${index + 1}`, url);
  });

  // Article metadata.

  if (resolved.publishedTime) {
    addProperty("article:published_time", resolved.publishedTime);
  }

  if (resolved.modifiedTime) {
    addProperty("article:modified_time", resolved.modifiedTime);
  }

  // Canonical URL.

  if (resolved.canonical) {
    links.push({
      rel: "canonical",
      href: resolved.canonical,
    });
  }

  // Hreflang alternates.

  for (const alternate of resolved.alternates?.alternates ?? []) {
    links.push({
      rel: "alternate",
      hrefLang: alternate.locale,
      href: alternate.url,
    });
  }

  return {
    meta,
    links,
  };
};
