import { TreeViewItem } from "@puzzle-ui/ui";

const folder = "/docs/pieces" as const;
//#region Components
const componentsFolder = `${folder}/components` as const;
const components: TreeViewItem = {
  id: "pieces-components",
  label: "Components",
  children: [
    {
      id: "pieces-hero",
      label: "Hero",
      href: `${componentsFolder}/hero`,
    },
    {
      id: "pieces-dashboard",
      label: "Dashboard",
      href: `${componentsFolder}/dashboard`,
    },
    {
      id: "pieces-dashboard-navigation",
      label: "Dashboard Navigation",
      href: `${componentsFolder}/navigation`,
    },
    {
      id: "pieces-project",
      label: "Project",
      href: `${componentsFolder}/project`,
    },
    {
      id: "pieces-data-display",
      label: "Data Display",
      href: `${componentsFolder}/data-display`,
    },
    {
      id: "pieces-settings",
      label: "Settings",
      href: `${componentsFolder}/settings`,
    },
    {
      id: "pieces-feedback",
      label: "Feedback",
      href: `${componentsFolder}/feedback`,
    },
  ],
};
//#endregion

export const pieces: TreeViewItem = {
  id: "pieces",
  label: "Page Sections",
  children: [
    {
      id: "pieces-overview",
      label: "Overview",
      href: folder,
    },
    components,
  ],
} as const;
