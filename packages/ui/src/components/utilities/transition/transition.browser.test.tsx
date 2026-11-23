import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Transition } from "./index";

afterEach(cleanup);

it("uses the duration prop for the rendered CSS transition", async () => {
  render(
    <Transition visible duration={80}>
      <div data-testid="animated" />
    </Transition>,
  );

  const animated = screen.getByTestId("animated");

  await waitFor(() => {
    expect(animated).toHaveClass("puzzle-transition-fade-active");
  });

  expect(getComputedStyle(animated).transitionDuration).toBe("0.08s");
});
