import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Background } from "./index";

describe("Background (browser)", () => {
  it("applies opacity and fade to the decorative layer", () => {
    render(
      <Background
        pattern="dots"
        patternOpacity={0.25}
        fade="bottom"
        data-testid="background"
      >
        <button type="button">Action</button>
      </Background>,
    );

    const background = screen.getByTestId("background");
    const decoration = window.getComputedStyle(background, "::after");

    expect(decoration.opacity).toBe("0.25");
    expect(decoration.maskImage).toContain("linear-gradient");
    expect(decoration.pointerEvents).toBe("none");
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
