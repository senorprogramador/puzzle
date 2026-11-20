import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it } from "vitest";

import { useRovingFocus } from "./use-roving-focus";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let api;
let focused;

const Harness = (options) => {
  api = useRovingFocus(options);

  return createElement(
    "div",
    null,
    options.items.map((item) =>
      createElement("button", {
        key: item.id,
        id: item.id,
        ref: api.getItemRef(item.id),
        tabIndex: api.getItemTabIndex(item.id, item.disabled),
        onFocus: () => api.onItemFocus(item.id),
        onKeyDown: (event) => api.onItemKeyDown(event, item.id),
      }),
    ),
  );
};

const mount = (options) => {
  focused = [];
  act(() => {
    renderer = create(createElement(Harness, options), {
      createNodeMock: (element) => ({
        focus: () => focused.push(element.props.id),
      }),
    });
  });
  return renderer;
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
});

describe("useRovingFocus", () => {
  it("starts on an enabled item and assigns exactly one tab stop", () => {
    mount({
      items: [
        { id: "disabled", disabled: true },
        { id: "first" },
        { id: "last" },
      ],
      initialActiveId: "disabled",
    });

    expect(api.activeId).toBe("first");
    expect(renderer.root.findAllByType("button").map((node) => node.props.tabIndex))
      .toEqual([-1, 0, -1]);
  });

  it("supports Home and End and skips disabled items", () => {
    mount({
      items: [
        { id: "first" },
        { id: "disabled", disabled: true },
        { id: "last" },
      ],
    });

    const buttons = renderer.root.findAllByType("button");
    act(() => {
      api.onItemKeyDown(
        { key: "End", defaultPrevented: false, preventDefault() {} },
        "first",
      );
    });
    expect(focused).toEqual(["last"]);

    act(() => {
      api.onItemKeyDown(
        { key: "Home", defaultPrevented: false, preventDefault() {} },
        "last",
      );
    });
    expect(focused).toEqual(["last", "first"]);
    expect(buttons[1].props.tabIndex).toBe(-1);
  });

  it("respects orientation, RTL direction, and loop boundaries", () => {
    mount({
      items: [{ id: "first" }, { id: "middle" }, { id: "last" }],
      orientation: "horizontal",
      dir: "rtl",
      loop: false,
    });

    const event = (key) => ({
      key,
      defaultPrevented: false,
      prevented: false,
      preventDefault() {
        this.prevented = true;
      },
    });

    const verticalKey = event("ArrowDown");
    act(() => api.onItemKeyDown(verticalKey, "middle"));
    expect(verticalKey.prevented).toBe(false);
    expect(focused).toEqual([]);

    const rtlLeft = event("ArrowLeft");
    act(() => api.onItemKeyDown(rtlLeft, "middle"));
    expect(rtlLeft.prevented).toBe(true);
    expect(focused).toEqual(["last"]);

    const boundary = event("ArrowRight");
    act(() => api.onItemKeyDown(boundary, "first"));
    expect(boundary.prevented).toBe(true);
    expect(focused).toEqual(["last", "first"]);
  });

  it("supports vertical arrows and wraps when looping is enabled", () => {
    mount({
      items: [{ id: "first" }, { id: "last" }],
      orientation: "vertical",
      loop: true,
    });

    act(() =>
      api.onItemKeyDown(
        { key: "ArrowDown", defaultPrevented: false, preventDefault() {} },
        "last",
      ),
    );
    expect(focused).toEqual(["first"]);

    act(() =>
      api.onItemKeyDown(
        { key: "ArrowUp", defaultPrevented: false, preventDefault() {} },
        "first",
      ),
    );
    expect(focused).toEqual(["first", "last"]);
  });

  it("does not handle prevented events and resolves changes to disabled items", () => {
    mount({
      items: [{ id: "first" }, { id: "second" }],
      initialActiveId: "first",
    });
    const prevented = {
      key: "ArrowRight",
      defaultPrevented: true,
      preventDefault() {
        throw new Error("already prevented");
      },
    };

    act(() => api.onItemKeyDown(prevented, "first"));
    expect(focused).toEqual([]);

    act(() => {
      renderer.update(
        createElement(Harness, {
          items: [{ id: "first", disabled: true }, { id: "second" }],
          initialActiveId: "first",
        }),
      );
    });
    expect(api.activeId).toBe("second");
    expect(renderer.root.findAllByType("button").map((node) => node.props.tabIndex))
      .toEqual([-1, 0]);
  });

  it("cleans up cached item refs when the component unmounts", () => {
    mount({ items: [{ id: "item" }] });
    const firstRef = api.getItemRef("item");

    act(() => renderer.unmount());
    renderer = undefined;

    expect(api.getItemRef("item")).not.toBe(firstRef);
  });
});
