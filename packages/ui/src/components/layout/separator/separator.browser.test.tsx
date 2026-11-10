import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "./index";

afterEach(() => {
  cleanup();
});

describe("Separator (browser)", () => {
  it("renders a horizontal separator across its container", () => {
    render(
      <div style={{ width: 320, height: 160 }}>
        <Separator data-testid="separator" />
      </div>,
    );

    const separator = screen.getByTestId("separator");
    const rect = separator.getBoundingClientRect();

    expect(rect.width).toBe(320);
    expect(rect.height).toBeGreaterThan(0);
  });

  it("renders a vertical separator across its container", () => {
    render(
      <div style={{ width: 320, height: 160 }}>
        <Separator orientation="vertical" data-testid="separator" />
      </div>,
    );

    const separator = screen.getByTestId("separator");
    const rect = separator.getBoundingClientRect();

    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBe(160);
  });

  it("does not shrink inside a horizontal flex container", () => {
    render(
      <div
        style={{
          display: "flex",
          width: 320,
          gap: 0,
        }}
      >
        <div style={{ width: 100, flexShrink: 0 }} />
        <Separator orientation="vertical" data-testid="separator" />
        <div style={{ width: 100, flexShrink: 0 }} />
      </div>,
    );

    const rect = screen.getByTestId("separator").getBoundingClientRect();

    expect(rect.width).toBeGreaterThan(0);
  });

  it("does not shrink inside a vertical flex container", () => {
    render(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: 320,
          gap: 0,
        }}
      >
        <div style={{ height: 100, flexShrink: 0 }} />
        <Separator data-testid="separator" />
        <div style={{ height: 100, flexShrink: 0 }} />
      </div>,
    );

    const rect = screen.getByTestId("separator").getBoundingClientRect();

    expect(rect.height).toBeGreaterThan(0);
  });
});
