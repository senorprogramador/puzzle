import { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/theme" as const;

export const theme: TreeViewItem = {
  id: "theme",
  label: "Theme",
  children: [
    {
      id: "theme-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "theme-provider",
      label: "Theme Provider",
      href: `${folder}/theme-provider`,
    },
    {
      id: "theme-tokens",
      label: "Design Tokens",
      href: `${folder}/tokens`,
    },
    {
      id: "theme-colors",
      label: "Colors",
      href: `${folder}/colors`,
    },
    {
      id: "theme-typography",
      label: "Typography & Fonts",
      href: `${folder}/typography`,
    },
    {
      id: "theme-breakpoints",
      label: "Breakpoints",
      href: `${folder}/breakpoints`,
    },
    {
      id: "theme-components",
      label: "Component Overrides",
      href: `${folder}/components`,
    },
  ],
} as const;
