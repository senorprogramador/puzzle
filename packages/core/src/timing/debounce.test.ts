import { afterEach, describe, expect, it, vi } from "vitest";

import { debounce } from "./debounce";

afterEach(() => {
  vi.useRealTimers();
});

describe("debounce", () => {
  it("waits for the delay and invokes only the latest arguments", () => {
    vi.useFakeTimers();
    const calls: Array<[string, number]> = [];
    const debounced = debounce((...args: [string, number]) => {
      calls.push(args);
    }, 100);

    debounced("first", 1);
    vi.advanceTimersByTime(60);
    debounced("last", 2);
    vi.advanceTimersByTime(99);

    expect(calls).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(calls).toEqual([["last", 2]]);
  });

  it("cancels pending work and allows later calls", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 50);

    debounced("cancelled");
    debounced.cancel();
    debounced.cancel();
    expect(vi.getTimerCount()).toBe(0);

    debounced("kept");
    vi.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("kept");
  });
});
