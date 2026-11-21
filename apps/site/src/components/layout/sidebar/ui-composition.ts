import type { TreeViewItem } from "./types";
import { pieces } from "./pieces";
import { ui } from "./ui";

export const uiComposition: TreeViewItem = {
  id: "ui-composition",
  label: "UI & Composition",
  children: [ui, pieces],
};
