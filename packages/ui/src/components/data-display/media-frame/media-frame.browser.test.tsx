import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { MediaFrame } from "./index";

it("keeps a mobile device frame within its responsive container", async () => {
  await page.viewport(375, 800);
  const { container } = render(
    <div style={{ width: "100%" }}>
      <MediaFrame frame="mobile">
        <img src="/mobile.png" alt="Mobile app screenshot" />
      </MediaFrame>
    </div>,
  );
  const frame = container.querySelector(".puzzle-media-frame")!;
  const shell = container.querySelector(".puzzle-media-frame__shell")!;

  expect(shell.getBoundingClientRect().width).toBeLessThanOrEqual(
    frame.getBoundingClientRect().width,
  );
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(shell.getBoundingClientRect().width).toBeGreaterThan(0);
});
