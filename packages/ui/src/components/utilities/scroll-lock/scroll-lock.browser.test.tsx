import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScrollLock } from "./index";

afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
  document.body.innerHTML = "";
});

describe("ScrollLock (browser)", () => {
  it("computes hidden overflow while mounted and restores it afterwards", () => {
    const { unmount } = render(<ScrollLock />);

    expect(getComputedStyle(document.body).overflow).toBe("hidden");

    unmount();

    expect(getComputedStyle(document.body).overflow).not.toBe("hidden");
  });

  it("keeps the lock until the last of several locks unmounts", () => {
    const first = render(<ScrollLock />);
    const second = render(<ScrollLock />);

    first.unmount();
    expect(getComputedStyle(document.body).overflow).toBe("hidden");

    second.unmount();
    expect(getComputedStyle(document.body).overflow).not.toBe("hidden");
  });
});
