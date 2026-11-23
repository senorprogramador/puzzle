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
  "/docs/ui/actions": {
    intent: "Choose React components for actions and toggle selection.",
    primaryKeyword: "React action components",
    secondaryKeywords: [
      "React buttons",
      "React toggle group",
      "TypeScript React actions",
    ],
    title: "React Action Components",
    description:
      "Choose React buttons and toggle groups for clear actions, grouped commands, and single- or multiple-selection controls.",
    canonical: getCanonicalUrl("/docs/ui/actions"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/navigation`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs/ui/data-display": {
    intent: "Present application data with reusable React display components.",
    primaryKeyword: "React data display components",
    secondaryKeywords: [
      "React data table",
      "React status components",
      "React empty state",
    ],
    title: "React Data Display Components",
    description:
      "Present React application data with cards, status indicators, tables, images, progress, ratings, and empty states.",
    canonical: getCanonicalUrl("/docs/ui/data-display"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/layout`,
      `${SITE_URL}/docs/ui/forms`,
    ],
  },
  "/docs/ui/editors": {
    intent: "Add rich-text editing to a React application.",
    primaryKeyword: "React rich text editor component",
    secondaryKeywords: [
      "TypeScript React text editor",
      "React content editor",
      "Puzzle Text Editor",
    ],
    title: "React Text Editors",
    description:
      "Add a rich-text editing surface to React applications with Puzzle's text editor and its documented formatting and rendering APIs.",
    canonical: getCanonicalUrl("/docs/ui/editors"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/forms`,
      `${SITE_URL}/docs/ui/editors/text-editor`,
    ],
  },
  "/docs/ui/forms": {
    intent: "Build React forms with typed inputs and selection controls.",
    primaryKeyword: "React form components",
    secondaryKeywords: [
      "React form inputs",
      "React form controls",
      "TypeScript React form components",
    ],
    title: "React Form Components",
    description:
      "Build React forms with typed inputs, selection controls, date and time pickers, file upload, validation feedback, and accessible field composition.",
    canonical: getCanonicalUrl("/docs/ui/forms"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/forms/form-field`,
      `${SITE_URL}/docs/tutorials`,
    ],
  },
  "/docs/ui/layout": {
    intent: "Structure responsive React pages with layout primitives.",
    primaryKeyword: "React layout components",
    secondaryKeywords: [
      "React responsive layout",
      "React layout primitives",
      "TypeScript React layout",
    ],
    title: "React Layout Components",
    description:
      "Structure responsive React interfaces with Puzzle containers, grids, stacks, page regions, sidebars, and resizable panels.",
    canonical: getCanonicalUrl("/docs/ui/layout"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/layout/page-layout`,
      `${SITE_URL}/docs/pieces`,
    ],
  },
  "/docs/ui/navigation": {
    intent: "Choose React components for navigation and related views.",
    primaryKeyword: "React navigation components",
    secondaryKeywords: [
      "React tabs component",
      "React pagination component",
      "React router-independent links",
    ],
    title: "React Navigation Components",
    description:
      "Organize React navigation and in-page choices with links, tabs, accordions, carousels, pagination, and tree views.",
    canonical: getCanonicalUrl("/docs/ui/navigation"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/navigation/link`,
      `${SITE_URL}/docs/ui/actions`,
    ],
  },
  "/docs/ui/overlays": {
    intent: "Present modal and contextual content with React overlays.",
    primaryKeyword: "React overlay components",
    secondaryKeywords: [
      "React dialog component",
      "React popover component",
      "React notification component",
    ],
    title: "React Overlay Components",
    description:
      "Present focused and contextual React interface layers with dialogs, drawers, menus, popovers, tooltips, and notifications.",
    canonical: getCanonicalUrl("/docs/ui/overlays"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/overlays/dialog`,
      `${SITE_URL}/docs/ui/navigation`,
    ],
  },
  "/docs/ui/typography": {
    intent: "Style semantic React headings and text with theme-aware components.",
    primaryKeyword: "React typography components",
    secondaryKeywords: [
      "React heading component",
      "React text component",
      "themed React typography",
    ],
    title: "React Typography Components",
    description:
      "Apply consistent React heading and text styles with Puzzle's theme-aware typography components.",
    canonical: getCanonicalUrl("/docs/ui/typography"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/typography/heading`,
      `${SITE_URL}/docs/theme/typography`,
    ],
  },
  "/docs/ui/utilities": {
    intent: "Use rendering and interaction utilities in React UI.",
    primaryKeyword: "React UI utilities",
    secondaryKeywords: [
      "React rendering strategies",
      "React scroll lock",
      "React transition utility",
    ],
    title: "React UI Utilities",
    description:
      "Explore Puzzle UI utilities for component previews, rendering strategies, scroll locking, and transitions in React applications.",
    canonical: getCanonicalUrl("/docs/ui/utilities"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/ui/utilities/rendering`,
      `${SITE_URL}/docs/pieces/framework-integration`,
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
  "/docs/pieces/components/marketing": {
    intent: "Choose composed React sections for marketing and conversion pages.",
    primaryKeyword: "React marketing sections",
    secondaryKeywords: [
      "React landing page sections",
      "React conversion components",
      "Puzzle marketing components",
    ],
    title: "Marketing & Conversion Sections",
    description:
      "Compose responsive marketing sections for product discovery, customer proof, conversion, FAQs, and comparisons with Puzzle Pieces.",
    canonical: getCanonicalUrl("/docs/pieces/components/marketing"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/features`,
      `${SITE_URL}/docs/pieces/components/cta`,
    ],
  },
  "/docs/pieces/components/saas-product": {
    intent: "Compose React sections for SaaS product information and pricing.",
    primaryKeyword: "React SaaS website sections",
    secondaryKeywords: [
      "SaaS product showcase React",
      "React pricing sections",
      "React integration sections",
    ],
    title: "SaaS & Product Sections",
    description:
      "Explore product showcases, integrations, use cases, pricing, security, code, and roadmap sections.",
    canonical: getCanonicalUrl("/docs/pieces/components/saas-product"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/product-showcase`,
      `${SITE_URL}/docs/pieces/components/pricing`,
    ],
  },
  "/docs/pieces/components/commerce": {
    intent: "Present product catalogs and commerce content with React sections.",
    primaryKeyword: "React commerce sections",
    secondaryKeywords: [
      "React product grid",
      "React product details components",
      "React restaurant menu components",
    ],
    title: "Commerce Sections",
    description:
      "Compose product catalogs, restaurant menus, accommodation booking presentation, product details, cart summaries, and commerce benefits.",
    canonical: getCanonicalUrl("/docs/pieces/components/commerce"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/product-grid`,
      `${SITE_URL}/docs/pieces/components/product-details`,
    ],
  },
  "/docs/pieces/components/content": {
    intent: "Present editorial and publication content with React sections.",
    primaryKeyword: "React editorial website sections",
    secondaryKeywords: [
      "React blog sections",
      "React timeline section",
      "React content components",
    ],
    title: "Content & Editorial Sections",
    description:
      "Arrange articles, galleries, timelines, changelogs, video, resources, and event content.",
    canonical: getCanonicalUrl("/docs/pieces/components/content"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/blog-section`,
      `${SITE_URL}/docs/pieces/components/gallery-section`,
    ],
  },
  "/docs/pieces/components/business": {
    intent: "Build organizational and corporate pages with React sections.",
    primaryKeyword: "React corporate website sections",
    secondaryKeywords: [
      "React team sections",
      "React agency website components",
      "React business profile sections",
    ],
    title: "Business & Corporate Sections",
    description:
      "Present organizational profiles, teams, services, accommodation details, house rules, case studies, careers, contacts, and partners.",
    canonical: getCanonicalUrl("/docs/pieces/components/business"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/team-section`,
      `${SITE_URL}/docs/pieces/components/case-studies-section`,
    ],
  },
  "/docs/pieces/components/application-dashboard": {
    intent: "Compose React application dashboards and administration screens.",
    primaryKeyword: "React dashboard sections",
    secondaryKeywords: [
      "React admin dashboard components",
      "React onboarding section",
      "React application settings UI",
    ],
    title: "Application & Dashboard Sections",
    description:
      "Compose dashboard overviews, activity, onboarding, empty states, settings, and project administration screens.",
    canonical: getCanonicalUrl("/docs/pieces/components/application-dashboard"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/dashboard`,
      `${SITE_URL}/docs/pieces/components/settings`,
    ],
  },
  "/docs/pieces/components/specialized-interactive": {
    intent: "Choose specialized interactive React website sections.",
    primaryKeyword: "React interactive website sections",
    secondaryKeywords: [
      "React booking sections",
      "React event sections",
      "React resource sections",
    ],
    title: "Specialized & Interactive Sections",
    description:
      "Explore video, booking, location, waitlist, resource, event, and footer sections with app-owned interactions.",
    canonical: getCanonicalUrl("/docs/pieces/components/specialized-interactive"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/pieces`,
      `${SITE_URL}/docs/pieces/components/availability-search`,
      `${SITE_URL}/docs/pieces/components/event-section`,
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
    intent:
      "Connect Puzzle Auth, Media, CMS, and commerce services across browser clients and server integrations.",
    primaryKeyword: "React full-stack integrations",
    secondaryKeywords: [
      "React server integrations",
      "Next.js full-stack adapters",
      "TanStack Start integrations",
      "browser-safe React clients",
    ],
    title: "Fullstack integrations",
    description:
      "Connect Puzzle Auth, Media, CMS, and payment services to browser clients, server handlers, and Next.js or TanStack Start adapters.",
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
  "/docs/core": {
    intent: "Use framework-independent TypeScript utilities shared by Puzzle.",
    primaryKeyword: "TypeScript utility library",
    secondaryKeywords: [
      "framework-independent TypeScript utilities",
      "responsive value utilities",
      "TypeScript resource scheduler",
    ],
    title: "Core Utilities",
    description:
      "Use Puzzle's framework-independent TypeScript helpers for class names, responsive values, formatting, rendering, and resource scheduling.",
    canonical: getCanonicalUrl("/docs/core"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/hooks`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/ui`,
    ],
  },
  "/docs/icons": {
    intent: "Render and style typed icon sets in React applications.",
    primaryKeyword: "React SVG icon library",
    secondaryKeywords: [
      "Iconify React icons",
      "TypeScript React icons",
      "theme-aware React icons",
    ],
    title: "Icons",
    description:
      "Render Iconify icons as React SVG components and style them with CSS, currentColor, or Puzzle theme tokens.",
    canonical: getCanonicalUrl("/docs/icons"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/ui`,
      `${SITE_URL}/docs/theme`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs/session": {
    intent: "Manage secure server-side sessions in TypeScript applications.",
    primaryKeyword: "TypeScript session management",
    secondaryKeywords: [
      "secure server-side sessions",
      "session rotation and revocation",
      "HttpOnly cookie sessions",
    ],
    title: "Session Management",
    description:
      "Create, validate, rotate, and revoke secure server-side sessions with Puzzle Storage and HttpOnly cookies.",
    canonical: getCanonicalUrl("/docs/session"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/auth`,
      `${SITE_URL}/docs/storage`,
      `${SITE_URL}/docs/tutorials/auth`,
    ],
  },
  "/docs/storage": {
    intent: "Choose database-neutral TypeScript storage contracts and adapters.",
    primaryKeyword: "TypeScript storage adapters",
    secondaryKeywords: [
      "MongoDB storage adapter",
      "Cloudflare D1 storage adapter",
      "database-neutral persistence contracts",
    ],
    title: "Storage",
    description:
      "Vendor-neutral persistence contracts, migrations, adapter conformance testing, and database adapters for Puzzle.",
    canonical: getCanonicalUrl("/docs/storage"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/auth`,
      `${SITE_URL}/docs/session`,
      `${SITE_URL}/docs/tutorials/storage`,
    ],
  },
  "/docs/multilingual": {
    intent: "Add typed translations and locale-aware behavior with Puzzle i18n.",
    primaryKeyword: "TypeScript internationalization library",
    secondaryKeywords: [
      "React ICU translations",
      "locale-aware React routes",
      "typed translation catalogs",
    ],
    title: "Puzzle Multilingual",
    description:
      "Type-safe locale management, ICU translations, localized paths, React bindings, and SEO metadata with Puzzle.",
    canonical: getCanonicalUrl("/docs/multilingual"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/core`,
      `${SITE_URL}/docs/seo`,
      `${SITE_URL}/docs/getting-started`,
    ],
  },
  "/docs/create": {
    intent: "Scaffold a React application with Puzzle packages and integrations.",
    primaryKeyword: "React project generator",
    secondaryKeywords: [
      "Next.js starter generator",
      "TanStack Start starter",
      "React application scaffolding",
    ],
    title: "Create",
    description:
      "Generate a React application with Puzzle UI, framework-aware theme setup, and optional Tailwind CSS and Puzzle Auth with a working database.",
    canonical: getCanonicalUrl("/docs/create"),
    structuredData: ["WebPage", "TechArticle", "BreadcrumbList"],
    internalLinks: [
      `${SITE_URL}/docs/getting-started`,
      `${SITE_URL}/docs/create/configuration`,
      `${SITE_URL}/docs/developer`,
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
