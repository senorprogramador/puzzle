import { Sidebar as PuzzleSidebar } from "@puzzle/ui/components/layout/sidebar";
import {
  TreeView,
  TreeViewItem,
} from "@puzzle/ui/components/navigation/tree-view";

type TreeViewItemData = {
  href?: string;
};

const items: TreeViewItem<TreeViewItemData>[] = [
  {
    id: "components",
    label: "Components",
    children: [
      {
        id: "actions",
        label: "Actions",
        children: [
          {
            id: "button",
            label: "Button",
            data: { href: "/components/actions/button" },
          },
          {
            id: "button-group",
            label: "Button Group",
            data: { href: "/components/actions/button-group" },
          },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <PuzzleSidebar>
      <TreeView
        aria-label="Navigation"
        items={items}
        selectionMode="single"
        defaultExpandedIds={["components"]}
        onItemActivate={(item) => {
          console.log(item);
          if (item.data?.href) {
            window.location.href = item.data.href;
          }
        }}
      />
    </PuzzleSidebar>
  );
};

export { Sidebar };
