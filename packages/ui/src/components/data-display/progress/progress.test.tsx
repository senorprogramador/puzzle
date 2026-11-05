import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CircularProgress } from "./circular-progress";
import { LinearProgress } from "./linear-progress";

describe.each([
  ["LinearProgress", LinearProgress],
  ["CircularProgress", CircularProgress],
])("%s", (_name, Component) => {
  it("exposes determinate progressbar semantics", () => {
    render(<Component value={40} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });

    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("omits aria-valuenow while indeterminate", () => {
    render(<Component aria-label="Loading" />);
    const bar = screen.getByRole("progressbar");

    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("clamps out-of-range values", () => {
    const { rerender } = render(<Component value={150} aria-label="A" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "100",
    );

    rerender(<Component value={-20} aria-label="A" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "0",
    );
  });

  it("treats NaN as indeterminate", () => {
    render(<Component value={Number.NaN} aria-label="A" />);
    expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(
      false,
    );
  });
});

describe("LinearProgress", () => {
  it("merges className and style", () => {
    render(
      <LinearProgress
        value={10}
        aria-label="A"
        className="custom"
        style={{ height: 10 }}
      />,
    );
    const bar = screen.getByRole("progressbar");

    expect(bar.classList.contains("custom")).toBe(true);
    expect(bar.classList.contains("puzzle-linear-progress-track")).toBe(true);
    expect(bar.style.height).toBe("10px");
    expect(bar.style.color).not.toBe("");
  });
});
