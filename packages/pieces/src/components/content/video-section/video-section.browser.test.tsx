import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { VideoSection } from "./video-section";

const video = {
  id: "mobile-walkthrough",
  title: "Mobile walkthrough",
  sources: [{ src: "/mobile-walkthrough.mp4", type: "video/mp4" }],
};

it("stacks split content on mobile and keeps phone media portrait", async () => {
  const { container } = render(
    <>
      <VideoSection title="Studio film" variant="split" videos={[video]} />
      <VideoSection title="Mobile walkthrough" variant="phone" videos={[video]} />
    </>,
  );
  const split = container.querySelector(
    '[data-marketing-family="video"][data-variant="split"] .puzzle-video-section__featured',
  )!;
  const phonePlayer = container.querySelector(
    '[data-marketing-family="video"][data-variant="phone"] .puzzle-video-section__player',
  )!;

  await page.viewport(375, 800);
  expect(getComputedStyle(split).gridTemplateColumns.split(" ")).toHaveLength(1);
  expect(phonePlayer.getBoundingClientRect().height).toBeGreaterThan(
    phonePlayer.getBoundingClientRect().width,
  );
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(getComputedStyle(split).gridTemplateColumns.split(" ")).toHaveLength(2);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
