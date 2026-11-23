import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricComparison } from ".";

describe("MetricComparison (browser)", () => {
  it("wraps long values inside a narrow comparison column", () => {
    const longValue = "1234567890123456789012345678901234567890";
    render(
      <div style={{ width: 280 }}>
        <MetricComparison
          title="Monthly signups"
          primaryLabel="This month"
          primaryValue={longValue}
          comparisonLabel="Last month"
          comparisonValue="104"
        />
      </div>,
    );

    const value = screen.getByText(longValue);
    const cell = value.closest<HTMLElement>("dd");
    if (!cell) {
      throw new Error("Expected the metric value to be in a definition description.");
    }

    expect(cell.scrollWidth).toBeLessThanOrEqual(cell.clientWidth);
    expect(cell.getBoundingClientRect().height).toBeGreaterThan(20);
  });
});
