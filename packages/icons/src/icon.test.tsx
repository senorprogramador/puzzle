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

  it("renders an opt-in loader without passing showLoader to Iconify", () => {
    const icon = Icon({ name: "lucide:star", showLoader: true });
    expect(icon.props.showLoader).toBeUndefined();
    const loader = icon.props.children.props.children;
    expect(loader.props.children[1]).toHaveLength(12);
    expect(loader.props.children[0].props.children).toContain("prefers-reduced-motion");
  });
});
