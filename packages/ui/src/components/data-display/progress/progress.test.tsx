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
  it("uses barWidth for the track height", () => {
    render(<LinearProgress barWidth={8} />);

    expect(screen.getByRole("progressbar").style.height).toBe("8px");
  });

  it("merges className and style", () => {
    render(
      <LinearProgress
        value={10}
        aria-label="A"
        barWidth={8}
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

  it("scales the indicator to the normalized value", () => {
    const { rerender } = render(<LinearProgress value={65} />);
    const indicator = document.querySelector(".puzzle-linear-progress");

    expect(indicator?.getAttribute("style")).toContain("scaleX(0.65)");

    rerender(<LinearProgress value={140} />);
    expect(
      document.querySelector(".puzzle-linear-progress")?.getAttribute("style"),
    ).toContain("scaleX(1)");
  });

  it("applies the custom color to the track and indicator and can hide the track", () => {
    render(
      <LinearProgress
        value={25}
        color="#123456"
        showTrack={false}
        data-testid="progress"
      />,
    );

    const track = screen.getByTestId("progress");
    const indicator = track.querySelector(".puzzle-linear-progress");

    expect(track).not.toHaveClass("puzzle-linear-progress-show-track");
    expect(track.style.color).toBe("rgb(18, 52, 86)");
    expect(indicator?.getAttribute("style")).toContain(
      "background-color: rgb(18, 52, 86)",
    );
  });

  it("marks the indicator indeterminate while keeping it visually full-width", () => {
    render(<LinearProgress aria-label="Loading upload" />);

    const track = screen.getByRole("progressbar", { name: "Loading upload" });
    const indicator = track.querySelector(".puzzle-linear-progress");

    expect(indicator).toHaveClass("puzzle-linear-progress-indeterminate");
    expect(indicator?.getAttribute("style")).toContain("scaleX(1)");
  });
});

describe("CircularProgress", () => {
  it("uses barWidth for the track and progress stroke", () => {
    const { container } = render(<CircularProgress barWidth={8} />);
    const circles = container.querySelectorAll("circle");
    const strokeWidths = Array.from(circles, (circle) =>
      circle.getAttribute("stroke-width"),
    );

    expect(circles).toHaveLength(2);
    expect(strokeWidths).toEqual(["8", "8"]);
  });
});
