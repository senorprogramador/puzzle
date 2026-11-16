import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon loading layout", () => {
  it("reserves an explicit size on the icon and its fallback", () => {
    const icon = Icon({ name: "lucide:star", size: 32 });
    expect(icon.props.style.width).toBe(32);
    expect(icon.props.style.height).toBe(32);
    expect(icon.props.children.type).toBe("svg");
    expect(icon.props.children.props.style).toEqual(icon.props.style);
  });

  it("reserves one em by default", () => {
    const icon = Icon({ name: "lucide:star" });
    expect(icon.props.width).toBe("1em");
    expect(icon.props.height).toBe("1em");
    expect(icon.props.children.props.width).toBe("1em");
    expect(icon.props.children.props.height).toBe("1em");
    expect(icon.props.style.width).toBeUndefined();
  });

  it("preserves caller styling and dimensions", () => {
    const icon = Icon({
      name: "lucide:star",
      width: 24,
      height: 30,
      style: { marginLeft: 8, color: "red" },
      className: "custom",
      "aria-hidden": true,
    });
    expect(icon.props.style).toMatchObject({ width: 24, height: 30, marginLeft: 8, color: "red" });
    expect(icon.props.children.props.className).toBe("custom");
    expect(icon.props.children.props["aria-hidden"]).toBe(true);
  });

  it("lets size and color override caller styling, including a zero size", () => {
    const icon = Icon({ name: "lucide:star", size: 0, color: "blue", style: { width: 24, color: "red" } });
    expect(icon.props.style).toMatchObject({ width: 0, height: 0, color: "blue" });
  });

  it("uses explicit size before width and height props or style dimensions", () => {
    const icon = Icon({
      name: "lucide:star",
      size: 20,
      width: 24,
      height: 30,
      style: { width: 40, height: 50, color: "red" },
    });

    expect(icon.props.width).toBe(20);
    expect(icon.props.height).toBe(20);
    expect(icon.props.style).toMatchObject({ width: 20, height: 20, color: "red" });
    expect(icon.props.children.props.width).toBe(20);
    expect(icon.props.children.props.height).toBe(20);
  });

  it("uses the color prop before style color and retains unrelated styles", () => {
    const icon = Icon({
      name: "lucide:star",
      color: "blue",
      style: { color: "red", marginTop: 4 },
    });

    expect(icon.props.style).toMatchObject({ color: "blue", marginTop: 4 });
    expect(icon.props.children.props.style.color).toBe("blue");
  });

  it("renders caller children unless the loader is enabled", () => {
    const child = createElement("title", null, "Search");
    const withChildren = Icon({ name: "lucide:search", children: child });
    const withLoader = Icon({
      name: "lucide:search",
      children: child,
      showLoader: true,
    });

    expect(withChildren.props.children.props.children).toBe(child);
    expect(withLoader.props.children.props.children.type).toBe(Symbol.for("react.fragment"));
    expect(withLoader.props.children.props.children.props.children).not.toContain(child);
  });

  it("renders an opt-in loader without passing showLoader to Iconify", () => {
    const icon = Icon({ name: "lucide:star", showLoader: true });
    expect(icon.props.showLoader).toBeUndefined();
    const loader = icon.props.children.props.children;
    expect(loader.props.children[1]).toHaveLength(12);
    expect(loader.props.children[0].props.children).toContain("prefers-reduced-motion");
  });

  it("assigns each loader bar a stable angle, delay, opacity, and fill color", () => {
    const icon = Icon({
      name: "lucide:star",
      color: "purple",
      showLoader: true,
    });
    const bars = icon.props.children.props.children.props.children[1];

    expect(bars[0].props.transform).toBe("rotate(0 50 50)");
    expect(bars[0].props.style).toEqual({ animationDelay: "0s", opacity: 1 / 12 });
    expect(bars[1].props.style.animationDelay).toBe("0.1s");
    expect(bars[11].props.style.animationDelay).toBe("1.1s");
    expect(bars[11].props.style.opacity).toBe(1);
    expect(bars[0].props.fill).toBe("purple");
  });
});
