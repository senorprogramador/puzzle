import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

export const tutorials: TreeViewItem = {
  id: "tutorials",
  label: "Tutorials",
  children: [
    { id: "tutorials-overview", label: "Overview", href: "/docs/tutorials" },
    { id: "tutorials-theme", label: "Theme", href: "/docs/tutorials/theme" },
    { id: "tutorials-seo", label: "SEO", href: "/docs/tutorials/seo" },
    { id: "tutorials-auth", label: "Auth", href: "/docs/tutorials/auth" },
    { id: "tutorials-auth-tanstack-start", label: "Auth with TanStack Start", href: "/docs/tutorials/auth-tanstack-start" },
    { id: "tutorials-auth-nextjs", label: "Auth with Next.js", href: "/docs/tutorials/auth-nextjs" },
    { id: "tutorials-storage", label: "Storage", href: "/docs/tutorials/storage" },
  ],
} as const;
