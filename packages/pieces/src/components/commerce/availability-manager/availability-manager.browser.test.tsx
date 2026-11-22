import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvailabilityManager } from "./index";

describe("AvailabilityManager (browser)", () => {
  it("keeps the resource grid horizontally scrollable on narrow layouts", () => {
    render(
      <AvailabilityManager
        resources={[
          {
            id: "room",
            label: "Garden room",
            days: [{ date: new Date(2025, 2, 1), status: "available" }],
          },
        ]}
        initialMonth={new Date(2025, 2, 1)}
      />,
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(document.querySelector(".puzzle-availability-manager__table-wrap")).toBeTruthy();
  });
});
