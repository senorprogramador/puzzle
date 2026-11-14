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
  icons,
  hooks,
  seo,
  auth,
  fullstack,
  storage,
  create,
] as const;

export { items };
