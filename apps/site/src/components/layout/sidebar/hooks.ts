import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/hooks" as const;

export const hooks: TreeViewItem = {
  id: "hooks",
  label: "Hooks",
  children: [
    {
      id: "hooks-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "hooks-use-keyboard-keys",
      label: "Keyboard Keys",
      href: `${folder}/use-keyboard-keys`,
    },
    {
      id: "hooks-use-roving-focus",
      label: "Roving Focus",
      href: `${folder}/use-roving-focus`,
    },
  ],
} as const;
