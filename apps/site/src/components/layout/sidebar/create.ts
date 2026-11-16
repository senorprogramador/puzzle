import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/create" as const;

export const create: TreeViewItem = {
  id: "create",
  label: "Create",
  children: [
    {
      id: "create-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "create-deployment",
      label: "Deployment",
      href: `${folder}/deployment`,
    },
  ],
} as const;
