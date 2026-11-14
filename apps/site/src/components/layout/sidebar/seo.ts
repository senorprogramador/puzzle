import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/seo" as const;

export const seo: TreeViewItem = {
  id: "seo",
  label: "SEO",
  children: [
    {
      id: "seo-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "seo-metadata",
      label: "Metadata & URLs",
      href: `${folder}/metadata`,
    },
    {
      id: "seo-structured-data",
      label: "Structured Data",
      href: `${folder}/structured-data`,
    },
    {
      id: "seo-react",
      label: "React Integration",
      href: `${folder}/react`,
    },
    {
      id: "seo-sitemaps",
      label: "Sitemaps",
      href: `${folder}/sitemaps`,
    },
    {
      id: "seo-robots",
      label: "Robots",
      href: `${folder}/robots`,
    },
    {
      id: "seo-validation",
      label: "Validation",
      href: `${folder}/validation`,
    },
    {
      id: "seo-frameworks",
      label: "Framework Adapters",
      href: `${folder}/frameworks`,
    },
    {
      id: "seo-testing",
      label: "Testing",
      href: `${folder}/testing`,
    },
  ],
} as const;
