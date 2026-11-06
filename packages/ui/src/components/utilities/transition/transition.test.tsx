import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Transition } from "./index";

afterEach(() => {
  cleanup();
});

describe("Transition", () => {
  it("renders the element given by `as` around the children", () => {
    render(
      <Transition visible as="section" data-testid="wrapper" className="x">
        <span>Content</span>
      </Transition>,
    );

    const wrapper = screen.getByTestId("wrapper");

    expect(wrapper.tagName).toBe("SECTION");
    expect(wrapper.classList.contains("x")).toBe(true);
    expect(wrapper.querySelector("span")?.textContent).toBe("Content");
  });

  it("animates the child directly when `as` is omitted", () => {
    render(
      <Transition visible id="panel">
        <div data-testid="child">Content</div>
      </Transition>,
    );

    expect(screen.getByTestId("child").id).toBe("panel");
  });

  it("keeps the child's own animation and transition handlers", () => {
    const onAnimationEnd = vi.fn();
    const onTransitionEnd = vi.fn();

    render(
      <Transition visible>
        <div
          data-testid="child"
          onAnimationEnd={onAnimationEnd}
          onTransitionEnd={onTransitionEnd}
        />
      </Transition>,
    );

    fireEvent.animationEnd(screen.getByTestId("child"));
    fireEvent.transitionEnd(screen.getByTestId("child"));

    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
    expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  });

  it("keeps handlers passed to the wrapper created by `as`", () => {
    const onTransitionEnd = vi.fn();

    render(
      <Transition
        visible
        as="div"
        data-testid="wrapper"
        onTransitionEnd={onTransitionEnd}
      >
        content
      </Transition>,
    );

    fireEvent.transitionEnd(screen.getByTestId("wrapper"));

    expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  });

  it("runs onEntered once when animationend and transitionend both fire", () => {
    const onEntered = vi.fn();

    vi.useFakeTimers();
    render(
      <Transition visible onEntered={onEntered}>
        <div data-testid="child" />
      </Transition>,
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.animationEnd(screen.getByTestId("child"));
    fireEvent.transitionEnd(screen.getByTestId("child"));
    vi.useRealTimers();

    expect(onEntered).toHaveBeenCalledTimes(1);
  });
});
