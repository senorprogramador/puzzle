import type { TreeViewItem } from "./types";

export const gettingStarted: TreeViewItem = {
  id: "getting-started-section",
  label: "Getting Started",
  children: [
    {
      id: "documentation-overview",
      label: "Overview",
      href: "/docs",
    },
    {
      id: "about",
      label: "Introduction",
      href: "/docs/about",
    },
    {
      id: "getting-started",
      label: "Getting Started",
      href: "/docs/getting-started",
    },
    {
      id: "architecture",
      label: "Architecture",
      href: "/docs/architecture",
    },
  ],
};
