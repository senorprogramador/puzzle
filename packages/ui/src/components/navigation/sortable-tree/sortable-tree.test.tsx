import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SortableTree, type SortableTreeItem, type SortableTreeMove } from "./index";

const items: SortableTreeItem[] = [
  {
    id: "pages",
    label: "Pages",
    children: [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
    ],
  },
  { id: "settings", label: "Settings" },
];

const treeItem = (id: string) =>
  screen.getByRole("tree").querySelector<HTMLElement>(
    `[data-sortable-tree-item-id="${id}"]`,
  )!;

describe("SortableTree", () => {
  it("renders nested accessible tree items and supports controlled selection and expansion", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onExpandedChange = vi.fn();

    render(
      <SortableTree
        items={items}
        aria-label="Site pages"
        onSelectionChange={onSelectionChange}
        onExpandedChange={onExpandedChange}
      />,
    );

    const pages = screen.getByRole("treeitem", { name: /Pages/ });
    expect(pages).toHaveAttribute("aria-level", "1");
    expect(within(pages).queryByRole("treeitem", { name: "Home" })).toBeNull();

    await user.click(within(pages).getByRole("button", { name: "Expand Pages" }));
    expect(onExpandedChange).toHaveBeenCalledWith(["pages"]);

    await user.click(screen.getByRole("treeitem", { name: "Settings" }));
    expect(onSelectionChange).toHaveBeenCalledWith(["settings"]);
  });

  it("lifts, moves, and drops with the keyboard without mutating controlled data", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn<(move: SortableTreeMove) => void>();
    const { rerender } = render(
      <SortableTree items={items} aria-label="Site pages" onMove={onMove} />,
    );

    const pages = treeItem("pages");
    pages.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("status")).toHaveTextContent(/moved after Settings/);
    await user.keyboard(" ");

    expect(onMove).toHaveBeenCalledWith({
      id: "pages",
      targetId: "settings",
      parentId: null,
      index: 2,
      position: "after",
    });
    expect(treeItem("pages")).toBeInTheDocument();

    rerender(<SortableTree items={[items[1]!, items[0]!]} aria-label="Site pages" />);
    expect(screen.getByRole("treeitem", { name: /Pages/ })).toBeInTheDocument();
  });

  it("protects descendants and max-depth violations", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    render(
      <SortableTree
        items={items}
        aria-label="Site pages"
        defaultExpandedIds={["pages"]}
        maxDepth={1}
        onMove={onMove}
      />,
    );

    const pages = treeItem("pages");
    pages.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");

    expect(onMove).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("That item cannot be moved there.");

    await user.keyboard("{Escape}");
    expect(treeItem("pages")).not.toHaveAttribute("aria-grabbed");
  });

  it("exposes a touch-friendly handle, actions, and custom rendering", () => {
    render(
      <SortableTree
        items={[{ id: "one", label: "One", actions: <button>Rename</button> }]}
        aria-label="Editable pages"
        renderLabel={(item) => <strong>{item.label}</strong>}
      />,
    );

    const item = screen.getByRole("treeitem", { name: /One/ });
    expect(within(item).getByRole("button", { name: "Drag One" })).toHaveAttribute(
      "data-sortable-tree-handle",
    );
    expect(within(item).getByRole("button", { name: "Rename" })).toBeInTheDocument();
    expect(within(item).getByText("One").tagName).toBe("STRONG");
  });
});
