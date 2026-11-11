import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/developer" as const;

export const developer: TreeViewItem = {
  id: "developer",
  label: "Developer Guide",
  children: [
    {
      id: "developer-create-project",
      label: "Create a Project",
      href: `${folder}/create-project`,
    },
    {
      id: "developer-authentication",
      label: "Authentication Setup",
      href: `${folder}/authentication`,
    },
    {
      id: "developer-contributing",
      label: "Contributing",
      href: `${folder}/contributing`,
    },
    {
      id: "developer-testing",
      label: "Testing",
      href: `${folder}/testing`,
    },
  ],
} as const;
