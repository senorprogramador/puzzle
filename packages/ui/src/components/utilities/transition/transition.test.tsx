import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
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

  it("does not restart the enter transition when onEnter changes", () => {
    const firstOnEnter = vi.fn();
    const nextOnEnter = vi.fn();

    vi.useFakeTimers();
    const { rerender } = render(
      <Transition visible onEnter={firstOnEnter}>
        <div data-testid="child" />
      </Transition>,
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const child = screen.getByTestId("child");
    expect(child).toHaveClass("puzzle-transition-fade-active");

    rerender(
      <Transition visible onEnter={nextOnEnter}>
        <div data-testid="child" />
      </Transition>,
    );
    vi.useRealTimers();

    expect(firstOnEnter).toHaveBeenCalledTimes(1);
    expect(nextOnEnter).not.toHaveBeenCalled();
    expect(child).toHaveClass("puzzle-transition-fade-active");
  });

  it("keeps the exit timer and calls the latest onExited when callbacks change", () => {
    const onExit = vi.fn();
    const firstOnExited = vi.fn();
    const nextOnExited = vi.fn();

    vi.useFakeTimers();
    const { rerender } = render(
      <Transition visible duration={300}>
        <div data-testid="child" />
      </Transition>,
    );

    rerender(
      <Transition
        visible={false}
        duration={300}
        onExit={onExit}
        onExited={firstOnExited}
      >
        <div data-testid="child" />
      </Transition>,
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender(
      <Transition
        visible={false}
        duration={300}
        onExit={() => onExit()}
        onExited={nextOnExited}
      >
        <div data-testid="child" />
      </Transition>,
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });
    vi.useRealTimers();

    expect(onExit).toHaveBeenCalledTimes(1);
    expect(firstOnExited).not.toHaveBeenCalled();
    expect(nextOnExited).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });
});
