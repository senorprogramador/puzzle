import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AvailabilityManager } from "./index";

afterEach(cleanup);

const days = Array.from({ length: 31 }, (_, index) => ({
  date: new Date(2025, 2, index + 1),
  status: "available" as const,
  price: { amount: 1250, currency: "USD" },
}));

describe("AvailabilityManager", () => {
  it("renders resources, minor-unit prices, and a multi-month view", () => {
    render(
      <AvailabilityManager
        title="Manage availability"
        resources={[{ id: "room", label: "Garden room", days }]}
        initialMonth={new Date(2025, 2, 15)}
        months={2}
      />,
    );

    expect(screen.getAllByText("Garden room").length).toBe(2);
    expect(screen.getAllByText("$12.50").length).toBeGreaterThan(0);
    expect(screen.getByRole("grid", { name: /availability: march 2025/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
  });

  it("reports selected cells and exposes typed bulk-action context", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const bulkActions = vi.fn(({ cells, clearSelection }) => (
      <button type="button" onClick={clearSelection}>
        Edit {cells.length}
      </button>
    ));

    render(
      <AvailabilityManager
        resources={[{ id: "room", label: "Garden room", days }]}
        initialMonth={new Date(2025, 2, 1)}
        locale="en-GB"
        onSelectionChange={onSelectionChange}
        slots={{ bulkActions }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Garden room, Saturday, 1 March 2025/i }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cells: [{ resourceId: "room", date: new Date(2025, 2, 1) }],
      }),
    );
    expect(screen.getByRole("button", { name: "Edit 1" })).toBeInTheDocument();
  });

  it("keeps selection caller-owned when value is supplied", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AvailabilityManager
        resources={[{ id: "room", label: "Garden room", days }]}
        initialMonth={new Date(2025, 2, 1)}
        locale="en-GB"
        value={{ cells: [] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Garden room, Saturday, 1 March 2025/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("1 day selected")).not.toBeInTheDocument();
  });

  it("selects an inclusive range and hands bulk edits to the caller", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onBulkEdit = vi.fn();
    render(
      <AvailabilityManager
        resources={[{ id: "room", label: "Garden room", days }]}
        initialMonth={new Date(2025, 2, 1)}
        locale="en-GB"
        selectionMode="range"
        onSelectionChange={onSelectionChange}
        onBulkEdit={onBulkEdit}
        slots={{
          bulkActions: ({ applyBulkEdit }) => (
            <button
              type="button"
              onClick={() => applyBulkEdit({ status: "blocked" })}
            >
              Block selected
            </button>
          ),
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Garden room, Saturday, 1 March 2025/i }));
    await user.click(screen.getByRole("button", { name: /Garden room, Monday, 3 March 2025/i }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cells: expect.arrayContaining([
          { resourceId: "room", date: new Date(2025, 2, 1) },
          { resourceId: "room", date: new Date(2025, 2, 2) },
          { resourceId: "room", date: new Date(2025, 2, 3) },
        ]),
      }),
    );

    await user.click(screen.getByRole("button", { name: "Block selected" }));
    expect(onBulkEdit).toHaveBeenCalledWith(
      expect.arrayContaining([
        { resourceId: "room", date: new Date(2025, 2, 1) },
      ]),
      { status: "blocked" },
    );
  });
});
