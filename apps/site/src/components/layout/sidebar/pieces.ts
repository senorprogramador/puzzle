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
  ],
};
//#endregion

export const pieces: TreeViewItem = {
  id: "pieces",
  label: "Pieces",
  children: [components],
} as const;
