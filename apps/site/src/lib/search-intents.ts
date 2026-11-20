import { getCanonicalUrl, SITE_URL } from "./seo";

export type SearchIntentEntry = {
  intent: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  title: string;
  description: string;
  canonical: string;
  structuredData: readonly string[];
  internalLinks: readonly string[];
};

export const searchIntentMap = {
  "/": {
    intent: "Discover a TypeScript-first React UI toolkit and ecosystem.",
    primaryKeyword: "React UI library",
    secondaryKeywords: [
      "React component library",
      "TypeScript UI components",
      "accessible React components",
      "React design system",
      "responsive React components",
    ],
    title: "React UI Library and Developer Toolkit",
    description:
      "Build modern React applications with accessible UI components, responsive page sections, design tokens, SEO tools, hooks, and full-stack packages.",
    canonical: getCanonicalUrl("/"),
    structuredData: [
      "Organization",
      "WebSite",
      "WebPage",
      "SoftwareSourceCode",
    ],
    internalLinks: [
      `${SITE_URL}/docs`,
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/seo`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/hooks`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs": {
    intent: "Find the right Puzzle package and developer guide.",
    primaryKeyword: "React developer toolkit documentation",
    secondaryKeywords: [
      "Puzzle React documentation",
      "React UI toolkit",
      "TypeScript React packages",
    ],
    title: "React Development Toolkit Documentation",
    description:
      "Explore Puzzle's React UI components, page sections, SEO utilities, theming, hooks, authentication, and developer guides.",
    canonical: getCanonicalUrl("/docs"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/getting-started`,
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/seo`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/hooks`,
    ],
  },
  "/docs/ui": {
    intent: "Compare accessible, reusable React UI components.",
    primaryKeyword: "React UI component library",
    secondaryKeywords: [
      "TypeScript React components",
      "accessible React UI components",
      "React design system",
      "React form components",
    ],
    title: "React UI Component Library",
    description:
      "Explore accessible TypeScript React components for actions, forms, data display, navigation, layout, overlays, and typography, with live examples and API guidance.",
    canonical: getCanonicalUrl("/docs/ui"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs/pieces": {
    intent: "Find responsive React website sections and compositions.",
    primaryKeyword: "React website sections",
    secondaryKeywords: [
      "responsive React sections",
      "React page compositions",
      "React marketing sections",
      "React landing page components",
    ],
    title: "React Website Sections",
    description:
      "Browse responsive React website sections for marketing, commerce, content, business, and dashboard experiences, with real previews and component references.",
    canonical: getCanonicalUrl("/docs/pieces"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/pieces/components/hero`,
    ],
  },
  "/docs/seo": {
    intent: "Add metadata, structured data, and technical SEO to React apps.",
    primaryKeyword: "React SEO library",
    secondaryKeywords: [
      "React metadata",
      "JSON-LD React",
      "Schema.org React",
      "Open Graph React",
      "React canonical URLs",
      "XML sitemap generation",
      "robots.txt generation",
    ],
    title: "React SEO Library",
    description:
      "Add server-rendered metadata, canonical URLs, Open Graph, JSON-LD, Schema.org, sitemaps, and robots.txt to React applications.",
    canonical: getCanonicalUrl("/docs/seo"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/tutorials/seo`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs/fullstack": {
    intent: "Connect browser authentication UI with React server handlers.",
    primaryKeyword: "full-stack React authentication",
    secondaryKeywords: [
      "Next.js authentication",
      "TanStack Start authentication",
      "TypeScript authentication",
      "React authentication UI",
    ],
    title: "Full-Stack React Authentication",
    description:
      "Connect React authentication experiences to server handlers and Next.js or TanStack Start adapters with a browser-safe auth client.",
    canonical: getCanonicalUrl("/docs/fullstack"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/auth`,
      `${SITE_URL}/docs/storage`,
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/tutorials/auth`,
    ],
  },
  "/docs/theme": {
    intent: "Configure design tokens, typography, and color themes for React.",
    primaryKeyword: "React design tokens",
    secondaryKeywords: [
      "React theming",
      "React design system",
      "CSS custom properties React",
      "light and dark themes React",
    ],
    title: "React Design Tokens and Theming",
    description:
      "Create a React design system with typed design tokens, light and dark color schemes, typography, local fonts, and scoped theme providers.",
    canonical: getCanonicalUrl("/docs/theme"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/tutorials/theme`,
    ],
  },
  "/docs/hooks": {
    intent: "Choose reusable TypeScript hooks for React interactions and rendering.",
    primaryKeyword: "React hooks",
    secondaryKeywords: [
      "TypeScript React hooks",
      "React keyboard navigation hooks",
      "React visibility hooks",
      "React resource prefetching",
    ],
    title: "React Hooks for TypeScript Applications",
    description:
      "Browse reusable React hooks for keyboard interactions, focus management, rendering boundaries, resource prefetching, color schemes, and motion preferences.",
    canonical: getCanonicalUrl("/docs/hooks"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/theme`,
    ],
  },
  "/docs/getting-started": {
    intent: "Install Puzzle and build a first interface in an existing React app.",
    primaryKeyword: "getting started with Puzzle UI",
    secondaryKeywords: [
      "install React UI components",
      "Puzzle UI setup",
      "React design system setup",
    ],
    title: "Get Started with Puzzle",
    description:
      "Install Puzzle in a React application, build a first interface with UI components, and configure the shared theme.",
    canonical: getCanonicalUrl("/docs/getting-started"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/tutorials`,
    ],
  },
  "/docs/auth": {
    intent: "Configure framework-independent authentication services and policies.",
    primaryKeyword: "React authentication core",
    secondaryKeywords: [
      "TypeScript authentication services",
      "React sessions and MFA",
      "framework-independent authentication",
    ],
    title: "React Authentication Core",
    description:
      "Configure framework-independent account, session, MFA, passkey, and authentication lifecycle services for React applications.",
    canonical: getCanonicalUrl("/docs/auth"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/storage`,
      `${SITE_URL}/docs/tutorials/auth`,
    ],
  },
  "/docs/tutorials/seo": {
    intent: "Implement a server-rendered React publication with end-to-end SEO.",
    primaryKeyword: "React SEO tutorial",
    secondaryKeywords: [
      "React metadata tutorial",
      "React JSON-LD example",
      "canonical URLs in React",
    ],
    title: "Build a Searchable Publication with Puzzle SEO",
    description:
      "Implement server-rendered publication pages with canonical URLs, social metadata, connected JSON-LD, and SEO endpoints using Puzzle.",
    canonical: getCanonicalUrl("/docs/tutorials/seo"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/seo`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/tutorials`,
    ],
  },
  "/docs/tutorials/auth": {
    intent: "Build a protected React dashboard with sessions and MFA.",
    primaryKeyword: "React authentication tutorial",
    secondaryKeywords: [
      "React MFA tutorial",
      "TypeScript sessions",
      "protected React dashboard",
    ],
    title: "Build a Protected Dashboard with Puzzle Auth",
    description:
      "A beginner-friendly guide to accounts, passwords, sessions, authenticator-app MFA, recovery codes, and MongoDB persistence with Puzzle Auth and Bun.",
    canonical: getCanonicalUrl("/docs/tutorials/auth"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/auth`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/storage`,
    ],
  },
  "/docs/developer": {
    intent: "Set up and maintain a React application using Puzzle developer tools.",
    primaryKeyword: "React application developer tools",
    secondaryKeywords: [
      "React project scaffolding",
      "TypeScript React development workflow",
      "React application architecture",
    ],
    title: "React Developer Tools",
    description:
      "Set up Puzzle applications with project scaffolding, theme tooling, testing guidance, and practical development workflows.",
    canonical: getCanonicalUrl("/docs/developer"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/create`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/fullstack`,
      `${SITE_URL}/docs/tutorials`,
    ],
  },
} as const satisfies Record<string, SearchIntentEntry>;
