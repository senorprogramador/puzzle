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
    {
      id: "hooks-use-list-filter",
      label: "List Filter",
      href: `${folder}/use-list-filter`,
    },
    {
      id: "hooks-use-reduced-motion",
      label: "Reduced Motion",
      href: `${folder}/use-reduced-motion`,
    },
    {
      id: "hooks-use-color-scheme",
      label: "Color Scheme",
      href: `${folder}/use-color-scheme`,
    },
    {
      id: "hooks-use-async-action",
      label: "Async Action",
      href: `${folder}/use-async-action`,
    },
    {
      id: "hooks-use-resource-prefetch",
      label: "Resource Prefetch",
      href: `${folder}/use-resource-prefetch`,
    },
  ],
} as const;
