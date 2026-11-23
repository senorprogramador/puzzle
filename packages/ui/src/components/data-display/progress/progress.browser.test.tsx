import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { cdp } from "vitest/browser";
import { CircularProgress } from "./circular-progress";
import { LinearProgress } from "./linear-progress";

type EmulationSession = {
  send: (
    method: "Emulation.setEmulatedMedia",
    params: { features: Array<{ name: string; value: string }> },
  ) => Promise<unknown>;
};

afterEach(cleanup);

it("disables indeterminate motion for reduced-motion preferences", async () => {
  // Vitest exposes the CDP session as opaque, but Playwright provides `send`.
  const session = cdp() as EmulationSession;
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });

  try {
    expect(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ).toBe(true);
    render(
      <>
        <LinearProgress aria-label="Linear loading" />
        <CircularProgress aria-label="Circular loading" />
      </>,
    );

    const linearIndicator = screen
      .getByRole("progressbar", { name: "Linear loading" })
      .querySelector(".puzzle-linear-progress-indeterminate")!;
    const circularIndicator = screen.getByRole("progressbar", {
      name: "Circular loading",
    });

    expect(getComputedStyle(linearIndicator).animationName).toBe("none");
    expect(getComputedStyle(linearIndicator).transitionDuration).toBe("0s");
    expect(getComputedStyle(circularIndicator).animationName).toBe("none");
  } finally {
    await session.send("Emulation.setEmulatedMedia", { features: [] });
  }
});
