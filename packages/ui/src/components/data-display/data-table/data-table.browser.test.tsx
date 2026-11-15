import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table";

describe("DataTable browser", () => {
  it("keeps headers sticky and aligned while scrolling in both directions", async () => {
    render(
      <div style={{ width: "12rem" }}>
        <DataTable
          numberOfItems={3}
          itemsPerPage={3}
          maxHeight="8rem"
          header={["Name", "Description"]}
          columnSizes={[180, 240]}
          initialItems={[
            { name: "One", description: "First row" },
            { name: "Two", description: "Second row" },
            { name: "Three", description: "Third row" },
          ]}
          renderCell={(item) => [item.name, item.description]}
          requestItems={vi.fn()}
        />
      </div>,
    );

    const viewport = document.querySelector(
      ".puzzle-data-table__viewport",
    ) as HTMLDivElement;
    const header = screen.getByRole("columnheader", { name: "Name" });
    const firstCell = screen.getByRole("cell", { name: "One" });

    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    expect(getComputedStyle(header).position).toBe("sticky");
    expect(getComputedStyle(viewport).overflowX).toBe("auto");
    expect(header.getBoundingClientRect().left).toBeCloseTo(
      firstCell.getBoundingClientRect().left,
    );

    viewport.scrollTop = 80;
    viewport.scrollLeft = 80;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(header.getBoundingClientRect().top).toBeCloseTo(
      viewport.getBoundingClientRect().top,
      0,
    );
    expect(header.getBoundingClientRect().left).toBeCloseTo(
      firstCell.getBoundingClientRect().left,
    );
  });

  it("supports keyboard sorting and visible focus", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        numberOfItems={2}
        header={["Name"]}
        initialItems={[{ name: "Bea" }, { name: "Ada" }]}
        renderCell={(item) => [item.name]}
        requestItems={vi.fn()}
        getSortValue={(item) => item.name}
        defaultSort={null}
      />,
    );

    const heading = screen.getByRole("columnheader", { name: /Name/ });
    const sortButton = within(heading).getByRole("button");
    sortButton.focus();
    await user.keyboard("{Enter}");

    expect(heading).toHaveAttribute("aria-sort", "ascending");
    expect(getComputedStyle(sortButton).outlineStyle).not.toBe("none");
  });
});
