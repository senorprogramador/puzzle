import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeView, type TreeViewItem } from "./index";

const items: TreeViewItem[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [{ id: "button", label: "Button" }],
      },
      { id: "index", label: "index.ts" },
    ],
  },
  { id: "readme", label: "README.md" },
];

const getTreeItem = (id: string) => {
  const item = screen
    .getByRole("tree")
    .querySelector<HTMLElement>(`[data-tree-item-id="${id}"]`);

  if (!item) throw new Error(`Expected tree item ${id}`);

  return item;
};

const getToggle = (item: HTMLElement) => {
  const toggle = item.querySelector<HTMLElement>("[data-tree-toggle]");

  if (!toggle) throw new Error("Expected a tree expansion toggle");

  return toggle;
};

describe("TreeView", () => {
  it("renders a labelled tree with the correct treeitem and group relationships", async () => {
    const user = userEvent.setup();

    render(<TreeView items={items} aria-label="Project files" />);

    const tree = screen.getByRole("tree", { name: "Project files" });
    const source = within(tree).getByRole("treeitem", { name: "src" });

    expect(source).toHaveAttribute("aria-level", "1");
    expect(source).toHaveAttribute("aria-expanded", "false");

    expect(
      within(tree).queryByRole("treeitem", { name: "components" }),
    ).toBeNull();

    await user.click(getToggle(source));

    expect(source).toHaveAttribute("aria-expanded", "true");
    expect(within(source).getByRole("group")).toBeInTheDocument();

    expect(
      within(source).getByRole("treeitem", { name: "components" }),
    ).toHaveAttribute("aria-level", "2");
  });

  it("supports the tree keyboard expansion and parent/child navigation pattern", async () => {
    const user = userEvent.setup();

    render(<TreeView items={items} aria-label="Project files" />);

    const source = screen.getByRole("treeitem", { name: "src" });

    source.focus();

    await user.keyboard("{ArrowRight}");

    expect(source).toHaveAttribute("aria-expanded", "true");
    expect(source).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    const components = screen.getByRole("treeitem", {
      name: "components",
    });

    expect(components).toHaveFocus();

    await user.keyboard("{ArrowLeft}");

    expect(source).toHaveFocus();
    expect(source).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowLeft}");

    expect(source).toHaveAttribute("aria-expanded", "false");
  });

  it("restores focus to the nearest visible ancestor when a focused branch is collapsed", () => {
    const { rerender } = render(
      <TreeView
        items={items}
        aria-label="Project files"
        expandedIds={["src"]}
      />,
    );

    const source = getTreeItem("src");
    const components = getTreeItem("components");

    components.focus();

    rerender(
      <TreeView items={items} aria-label="Project files" expandedIds={[]} />,
    );

    expect(source).toHaveFocus();
  });

  it("uses reversed horizontal arrow keys in right-to-left trees", async () => {
    const user = userEvent.setup();

    render(<TreeView items={items} aria-label="Project files" dir="rtl" />);

    const source = screen.getByRole("treeitem", { name: "src" });

    source.focus();

    await user.keyboard("{ArrowLeft}");

    expect(source).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowRight}");

    expect(source).toHaveAttribute("aria-expanded", "false");
  });

  it("supports single selection independently from keyboard focus", async () => {
    const user = userEvent.setup();

    render(
      <TreeView
        items={items}
        aria-label="Project files"
        defaultSelectedIds={["src"]}
      />,
    );

    const source = screen.getByRole("treeitem", { name: "src" });
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    readme.focus();

    expect(source).toHaveAttribute("aria-selected", "true");
    expect(readme).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowUp}");

    expect(readme).not.toHaveAttribute("aria-selected", "true");
    expect(source).toHaveAttribute("aria-selected", "true");

    await user.click(readme);

    expect(readme).toHaveAttribute("aria-selected", "true");
    expect(source).toHaveAttribute("aria-selected", "false");
  });

  it("allows Space to toggle off the currently selected item in single mode", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <TreeView
        items={items}
        aria-label="Project files"
        defaultSelectedIds={["src"]}
        onSelectionChange={onSelectionChange}
      />,
    );

    const source = getTreeItem("src");

    source.focus();

    await user.keyboard(" ");

    expect(source).toHaveAttribute("aria-selected", "false");
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it("supports independent multiple selection with Space", async () => {
    const user = userEvent.setup();

    render(
      <TreeView
        items={items}
        aria-label="Project files"
        selectionMode="multiple"
        defaultExpandedIds={["src"]}
      />,
    );

    const source = getTreeItem("src");
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    expect(screen.getByRole("tree")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );

    source.focus();

    await user.keyboard(" ");

    readme.focus();

    await user.keyboard(" ");

    expect(source).toHaveAttribute("aria-selected", "true");
    expect(readme).toHaveAttribute("aria-selected", "true");

    readme.focus();

    await user.keyboard(" ");

    expect(readme).toHaveAttribute("aria-selected", "false");
  });

  it("does not select disabled or explicitly non-selectable nodes", async () => {
    const user = userEvent.setup();

    const disabledItems: TreeViewItem[] = [
      { id: "disabled", label: "Disabled", disabled: true },
      { id: "structural", label: "Structural", selectable: false },
    ];

    const onSelectionChange = vi.fn();

    render(
      <TreeView
        items={disabledItems}
        aria-label="Disabled items"
        onSelectionChange={onSelectionChange}
      />,
    );

    const disabled = screen.getByRole("treeitem", { name: "Disabled" });
    const structural = screen.getByRole("treeitem", { name: "Structural" });

    await user.click(disabled);
    await user.click(structural);

    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).not.toHaveAttribute("aria-selected");
    expect(structural).not.toHaveAttribute("aria-selected");
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("keeps controlled expansion under the caller's control", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    const { rerender } = render(
      <TreeView
        items={items}
        aria-label="Project files"
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />,
    );

    const source = screen.getByRole("treeitem", { name: "src" });

    await user.click(getToggle(source));

    expect(onExpandedChange).toHaveBeenCalledWith(["src"]);
    expect(source).toHaveAttribute("aria-expanded", "false");

    rerender(
      <TreeView
        items={items}
        aria-label="Project files"
        expandedIds={["src"]}
        onExpandedChange={onExpandedChange}
      />,
    );

    expect(getTreeItem("src")).toHaveAttribute("aria-expanded", "true");
  });

  it("loads children for branches that are initially expanded", async () => {
    const loadChildren = vi.fn(async () => [
      { id: "initial-child", label: "Initial child" },
    ]);

    render(
      <TreeView
        items={[{ id: "remote", label: "Remote folder", hasChildren: true }]}
        aria-label="Remote files"
        defaultExpandedIds={["remote"]}
        loadChildren={loadChildren}
      />,
    );

    expect(
      await screen.findByRole("treeitem", { name: "Initial child" }),
    ).toBeInTheDocument();

    expect(loadChildren).toHaveBeenCalledTimes(1);
  });

  it("loads lazy children on first expansion and caches the result", async () => {
    const user = userEvent.setup();

    const loadChildren = vi.fn(async () => [
      { id: "remote-child", label: "Remote child" },
    ]);

    const lazyItems: TreeViewItem[] = [
      { id: "remote", label: "Remote folder", hasChildren: true },
    ];

    render(
      <TreeView
        items={lazyItems}
        aria-label="Remote files"
        loadChildren={loadChildren}
      />,
    );

    const remote = screen.getByRole("treeitem", {
      name: "Remote folder",
    });

    await user.click(getToggle(remote));

    expect(
      await screen.findByRole("treeitem", { name: "Remote child" }),
    ).toBeInTheDocument();

    expect(loadChildren).toHaveBeenCalledTimes(1);

    await user.click(getToggle(remote));
    await user.click(getToggle(remote));

    expect(loadChildren).toHaveBeenCalledTimes(1);
  });

  it("retries lazy loading after a failed request when the branch is reopened", async () => {
    const user = userEvent.setup();

    const loadChildren = vi
      .fn<() => Promise<TreeViewItem[]>>()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce([{ id: "recovered", label: "Recovered child" }]);

    const onLoadChildrenError = vi.fn();

    render(
      <TreeView
        items={[{ id: "remote", label: "Remote folder", hasChildren: true }]}
        aria-label="Remote files"
        loadChildren={loadChildren}
        onLoadChildrenError={onLoadChildrenError}
      />,
    );

    const remote = screen.getByRole("treeitem", {
      name: "Remote folder",
    });

    await user.click(getToggle(remote));

    expect(
      await screen.findByText(/Could not load children/),
    ).toBeInTheDocument();

    expect(onLoadChildrenError).toHaveBeenCalledTimes(1);

    await user.click(getToggle(remote));
    await user.click(getToggle(remote));

    expect(
      await screen.findByRole("treeitem", { name: "Recovered child" }),
    ).toBeInTheDocument();

    expect(loadChildren).toHaveBeenCalledTimes(2);
  });

  it("starts focus on the first controlled selected item", () => {
    render(
      <TreeView
        items={items}
        aria-label="Project files"
        selectedIds={["readme"]}
      />,
    );

    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveAttribute(
      "tabindex",
      "0",
    );

    expect(getTreeItem("src")).toHaveAttribute("tabindex", "-1");
  });

  it("cycles through repeated typeahead characters", async () => {
    const user = userEvent.setup();

    const duplicateLabels: TreeViewItem[] = [
      { id: "alpha", label: "Alpha" },
      { id: "another", label: "Another" },
      { id: "beta", label: "Beta" },
    ];

    render(
      <TreeView
        items={duplicateLabels}
        aria-label="Alphabetical items"
        defaultFocusedId="alpha"
      />,
    );

    const alpha = screen.getByRole("treeitem", { name: "Alpha" });
    const another = screen.getByRole("treeitem", { name: "Another" });

    alpha.focus();

    await user.keyboard("a");

    expect(another).toHaveFocus();

    await user.keyboard("a");

    expect(alpha).toHaveFocus();
  });

  it("supports typeahead across visible nodes", async () => {
    const user = userEvent.setup();

    render(
      <TreeView
        items={items}
        aria-label="Project files"
        defaultExpandedIds={["src"]}
      />,
    );

    const source = getTreeItem("src");
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    source.focus();

    await user.keyboard("r");

    expect(readme).toHaveFocus();
  });

  it("supports no-selection mode", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <TreeView
        items={items}
        aria-label="Project files"
        selectionMode="none"
        onSelectionChange={onSelectionChange}
      />,
    );

    const source = screen.getByRole("treeitem", { name: "src" });

    await user.click(source);

    expect(source).not.toHaveAttribute("aria-selected");
    expect(screen.getByRole("tree")).not.toHaveAttribute(
      "aria-multiselectable",
    );
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("renders an item with href as a Puzzle Link", () => {
    const linkedItems: TreeViewItem[] = [
      {
        id: "docs",
        label: "Documentation",
        href: "/docs",
      },
    ];

    render(
      <TreeView items={linkedItems} aria-label="Documentation navigation" />,
    );

    const treeItem = screen.getByRole("treeitem", {
      name: "Documentation",
    });

    const link = within(treeItem).getByRole("link", {
      name: "Documentation",
    });

    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("puzzle-link", "puzzle-tree__row");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(treeItem).toHaveAttribute("tabindex", "0");
  });

  it("keeps an ordinary div row when href is omitted", () => {
    render(
      <TreeView
        items={[{ id: "overview", label: "Overview" }]}
        aria-label="Navigation"
      />,
    );

    const treeItem = getTreeItem("overview");
    const row = treeItem.querySelector(".puzzle-tree__row");

    expect(row?.tagName).toBe("DIV");
    expect(within(treeItem).queryByRole("link")).toBeNull();
  });

  it("selects and focuses a linked item when its row is clicked", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <TreeView
        items={[
          {
            id: "docs",
            label: "Documentation",
            href: "#docs",
          },
        ]}
        aria-label="Navigation"
        onSelectionChange={onSelectionChange}
      />,
    );

    const treeItem = getTreeItem("docs");
    const link = within(treeItem).getByRole("link");

    // Prevent jsdom from changing the document hash during this interaction test.
    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });

    await user.click(link);

    expect(treeItem).toHaveFocus();
    expect(treeItem).toHaveAttribute("aria-selected", "true");
    expect(onSelectionChange).toHaveBeenCalledWith(["docs"]);
  });

  it("activates a linked row when Enter is pressed on its treeitem", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onItemActivate = vi.fn();

    render(
      <TreeView
        items={[
          {
            id: "docs",
            label: "Documentation",
            href: "#docs",
          },
        ]}
        aria-label="Navigation"
        onSelectionChange={onSelectionChange}
        onItemActivate={onItemActivate}
      />,
    );

    const treeItem = getTreeItem("docs");
    const link = within(treeItem).getByRole("link");

    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });

    treeItem.focus();

    await user.keyboard("{Enter}");

    expect(treeItem).toHaveFocus();
    expect(onSelectionChange).toHaveBeenCalledWith(["docs"]);
    expect(onItemActivate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "docs",
        href: "#docs",
      }),
    );
  });

  it("expands a linked branch when its toggle is clicked without navigating", async () => {
    const user = userEvent.setup();

    render(
      <TreeView
        items={[
          {
            id: "docs",
            label: "Documentation",
            href: "#docs",
            children: [{ id: "guide", label: "Guide" }],
          },
        ]}
        aria-label="Navigation"
      />,
    );

    const treeItem = getTreeItem("docs");
    const link = within(treeItem).getByRole("link");

    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });

    await user.click(getToggle(treeItem));

    expect(treeItem).toHaveFocus();
    expect(treeItem).toHaveAttribute("aria-expanded", "true");

    expect(
      within(treeItem).getByRole("treeitem", { name: "Guide" }),
    ).toBeInTheDocument();
  });

  it("prevents navigation and selection for a disabled linked item", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <TreeView
        items={[
          {
            id: "restricted",
            label: "Restricted",
            href: "#restricted",
            disabled: true,
          },
        ]}
        aria-label="Navigation"
        onSelectionChange={onSelectionChange}
      />,
    );

    const treeItem = getTreeItem("restricted");
    const link = within(treeItem).getByRole("link");

    expect(treeItem).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-disabled", "true");

    await user.click(link);

    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(treeItem).not.toHaveAttribute("aria-selected", "true");
  });
  it("renders linked items using Puzzle Link and marks the active route", () => {
    const route = "/components/actions/button";

    const routeItems: TreeViewItem[] = [
      {
        id: "button",
        label: "Button",
        href: "/components/actions/button",
      },
      {
        id: "button-group",
        label: "Button Group",
        href: "/components/actions/button-group",
      },
    ];

    const { rerender } = render(
      <TreeView
        items={routeItems}
        aria-label="Navigation"
        selectionMode="none"
        getItemActive={(item) => item.href === route}
      />,
    );

    const buttonItem = getTreeItem("button");
    const buttonLink = within(buttonItem).getByRole("link", {
      name: "Button",
    });

    expect(buttonLink).toHaveAttribute("href", route);
    expect(buttonLink).toHaveAttribute("aria-current", "page");
    expect(buttonItem).toHaveAttribute("data-active", "true");

    rerender(
      <TreeView
        items={routeItems}
        aria-label="Navigation"
        selectionMode="none"
        getItemActive={(item) =>
          item.href === "/components/actions/button-group"
        }
      />,
    );

    expect(getTreeItem("button")).not.toHaveAttribute("data-active");
    expect(getTreeItem("button-group")).toHaveAttribute("data-active", "true");
  });
  it("renders items without href as ordinary tree rows", () => {
    render(
      <TreeView
        items={[{ id: "folder", label: "Folder" }]}
        aria-label="Navigation"
      />,
    );

    const item = getTreeItem("folder");

    expect(item.querySelector("a")).toBeNull();
    expect(item.querySelector(".puzzle-tree__row")).toBeInstanceOf(
      HTMLDivElement,
    );
  });
});
