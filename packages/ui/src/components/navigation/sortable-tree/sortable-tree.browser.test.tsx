import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SortableTree } from "./index";

describe("SortableTree browser", () => {
  it("keeps the drag handle keyboard reachable and announces a keyboard move", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    render(
      <SortableTree
        items={[
          { id: "first", label: "First" },
          { id: "second", label: "Second" },
        ]}
        aria-label="Reorder pages"
        onMove={onMove}
      />,
    );

    const first = screen.getByRole("treeitem", { name: /First/ });
    first.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("status")).toHaveTextContent(/moved after Second/);
    await user.keyboard(" ");
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Drag First" })).toBeVisible();
  });
});
