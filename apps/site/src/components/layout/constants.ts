import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

import { developer } from "./sidebar/developer";
import { ui } from "./sidebar/ui";
import { pieces } from "./sidebar/pieces";
import { theme } from "./sidebar/theme";
import { create } from "./sidebar/create";
import { hooks } from "./sidebar/hooks";
import { icons } from "./sidebar/icons";
import { seo } from "./sidebar/seo";
import { auth } from "./sidebar/auth";
import { fullstack } from "./sidebar/fullstack";
import { storage } from "./sidebar/storage";
import { tutorials } from "./sidebar/tutorials";

const items: TreeViewItem[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    href: "/docs/getting-started",
  },
  {
    id: "project",
    label: "Project",
    children: [
      {
        id: "about",
        label: "About Puzzle",
        href: "/docs/about",
      },
      {
        id: "architecture",
        label: "Architecture",
        href: "/docs/architecture",
      },
    ],
  },
  developer,
  tutorials,
  theme,
  pieces,
  ui,
  icons,
  hooks,
  seo,
  auth,
  fullstack,
  storage,
  create,
] as const;

export { items };
