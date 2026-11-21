import type { TreeViewItem } from "./types";

const folder = "/docs/multilingual" as const;

export const multilingual: TreeViewItem = {
  id: "multilingual",
  label: "Multilingual",
  children: [
    { id: "multilingual-overview", label: "Overview", href: folder },
    {
      id: "multilingual-locales",
      label: "Locales",
      href: `${folder}/locales`,
    },
    {
      id: "multilingual-translations",
      label: "Translations & Formatting",
      href: `${folder}/translations`,
    },
    {
      id: "multilingual-routing",
      label: "Localized Paths",
      href: `${folder}/routing`,
    },
    {
      id: "multilingual-react",
      label: "React Integration",
      href: `${folder}/react`,
    },
    {
      id: "multilingual-accessibility",
      label: "Accessibility",
      href: `${folder}/accessibility`,
    },
    {
      id: "multilingual-performance",
      label: "Performance",
      href: `${folder}/performance`,
    },
    {
      id: "multilingual-frameworks",
      label: "Framework Adapters",
      href: `${folder}/frameworks`,
    },
    {
      id: "multilingual-catalogs",
      label: "Catalog Validation",
      href: `${folder}/catalogs`,
    },
    {
      id: "multilingual-compiler",
      label: "Compiler & Scanning",
      href: `${folder}/compiler`,
    },
    {
      id: "multilingual-devtools",
      label: "Development Diagnostics",
      href: `${folder}/devtools`,
    },
    {
      id: "multilingual-security",
      label: "Security Boundaries",
      href: `${folder}/security`,
    },
    {
      id: "multilingual-sources",
      label: "Catalog Sources",
      href: `${folder}/sources`,
    },
    {
      id: "multilingual-content",
      label: "Content Resolution",
      href: `${folder}/content`,
    },
    {
      id: "multilingual-cli",
      label: "CLI",
      href: `${folder}/cli`,
    },
    {
      id: "multilingual-seo",
      label: "SEO Metadata",
      href: `${folder}/seo`,
    },
    {
      id: "multilingual-ai",
      label: "AI Suggestions",
      href: `${folder}/ai`,
    },
  ],
} as const;
