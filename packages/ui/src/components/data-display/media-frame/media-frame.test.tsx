import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaFrame } from "./index";

describe("MediaFrame", () => {
  it.each(["none", "browser", "desktop", "mobile"] as const)(
    "renders the %s frame",
    (frame) => {
      const { container } = render(
        <MediaFrame frame={frame} caption="Analytics dashboard">
          <img src="/dashboard.png" alt="Analytics dashboard screenshot" />
        </MediaFrame>,
      );

      expect(
        container.querySelector(`[data-frame="${frame}"]`),
      ).not.toBeNull();
      expect(
        screen.getByRole("img", { name: "Analytics dashboard screenshot" }),
      ).toBeVisible();
      expect(screen.getByText("Analytics dashboard", { selector: "figcaption" }))
        .toBeVisible();
    },
  );

  it("uses a decorative browser bar that is hidden from assistive technology", () => {
    const { container } = render(
      <MediaFrame frame="browser" title="App preview">
        <div>Dashboard</div>
      </MediaFrame>,
    );

    expect(
      container.querySelector(".puzzle-media-frame__browser-bar"),
    ).toHaveAttribute("aria-hidden", "true");
  });
});
