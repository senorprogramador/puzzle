import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

import { developer } from "./sidebar/developer";
import { ui } from "./sidebar/ui";
import { pieces } from "./sidebar/pieces";
import { theme } from "./sidebar/theme";

const items: TreeViewItem[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    href: "/docs/getting-started",
  },
  developer,
  theme,
  pieces,
  ui,
] as const;

export { items };
