import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScrollLock } from "./index";

afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
});

describe("ScrollLock", () => {
  it("hides body overflow while mounted and restores it on unmount", () => {
    const { unmount } = render(<ScrollLock />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("does nothing when disabled", () => {
    render(<ScrollLock enabled={false} />);

    expect(document.body.style.overflow).toBe("");
  });

  it("follows the `enabled` prop", () => {
    const { rerender } = render(<ScrollLock enabled={false} />);

    rerender(<ScrollLock enabled />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<ScrollLock enabled={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("restores the original inline overflow value", () => {
    document.body.style.setProperty("overflow", "scroll", "important");

    const { unmount } = render(<ScrollLock />);
    unmount();

    expect(document.body.style.getPropertyValue("overflow")).toBe("scroll");
    expect(document.body.style.getPropertyPriority("overflow")).toBe(
      "important",
    );
  });

  it("stays locked until the last lock is released", () => {
    const first = render(<ScrollLock />);
    const second = render(<ScrollLock />);

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
