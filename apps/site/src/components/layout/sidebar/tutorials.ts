import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

export const tutorials: TreeViewItem = {
  id: "tutorials",
  label: "Tutorials",
  children: [
    { id: "tutorials-overview", label: "Overview", href: "/docs/tutorials" },
    { id: "tutorials-seo", label: "SEO", href: "/docs/tutorials/seo" },
    { id: "tutorials-auth", label: "Auth", href: "/docs/tutorials/auth" },
    { id: "tutorials-storage", label: "Storage", href: "/docs/tutorials/storage" },
  ],
} as const;
