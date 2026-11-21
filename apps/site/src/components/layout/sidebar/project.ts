import type { TreeViewItem } from "./types";

export const project: TreeViewItem = {
  id: "project",
  label: "Project",
  children: [
    {
      id: "developer-contributing",
      label: "Contributing",
      href: "/docs/developer/contributing",
    },
    {
      id: "developer-testing",
      label: "Testing",
      href: "/docs/developer/testing",
    },
    {
      id: "production-release",
      label: "Production Release",
      href: "/docs/production-release",
    },
  ],
};
