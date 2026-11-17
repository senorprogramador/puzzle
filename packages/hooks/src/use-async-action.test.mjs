import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAsyncAction } from "./use-async-action";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let actionState;

const Harness = ({ action }) => {
  actionState = useAsyncAction(action);
  return createElement("span", null, actionState.status);
};

const mount = (action) => {
  act(() => {
    renderer = create(createElement(Harness, { action }));
  });
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  actionState = undefined;
});

describe("useAsyncAction", () => {
  it("tracks pending and successful actions and supports reset", async () => {
    let resolveAction;
    const action = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );
    mount(action);

    let request;
    act(() => {
      request = actionState.run("payload");
    });
    expect(actionState.status).toBe("loading");

    let result;
    await act(async () => {
      resolveAction();
      result = await request;
    });

    expect(result).toBe(true);
    expect(actionState.status).toBe("success");
    expect(action).toHaveBeenCalledWith("payload");

    act(() => actionState.reset());
    expect(actionState.status).toBe("idle");
    expect(actionState.error).toBeNull();
  });

  it("exposes errors and prevents overlapping submissions", async () => {
    let rejectAction;
    const action = vi.fn(
      () =>
        new Promise((_, reject) => {
          rejectAction = reject;
        }),
    );
    mount(action);

    let firstRequest;
    let secondRequest;
    await act(async () => {
      firstRequest = actionState.run("first");
      secondRequest = actionState.run("second");
      expect(await secondRequest).toBe(false);
      rejectAction(new Error("Service unavailable."));
      expect(await firstRequest).toBe(false);
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(actionState.status).toBe("error");
    expect(actionState.error).toEqual(new Error("Service unavailable."));
  });
});
