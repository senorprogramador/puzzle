import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { ContentSection } from "./content-section";

it("places custom media after the copy in the image-right variant", async () => {
  const { container, rerender } = render(
    <ContentSection
      variant="image-right"
      media={<div data-testid="custom-media">A custom media node</div>}
    >
      <p>Editorial copy</p>
    </ContentSection>,
  );

  const media = container.querySelector(".puzzle-content-section__body > *")!;
  const copy = container.querySelector(".puzzle-content-section__body > p")!;

  await page.viewport(375, 800);
  expect(media.getBoundingClientRect().top).toBeLessThan(
    copy.getBoundingClientRect().top,
  );

  await page.viewport(1280, 800);
  expect(media.getBoundingClientRect().left).toBeGreaterThan(
    copy.getBoundingClientRect().left,
  );

  rerender(
    <ContentSection
      variant="image-right"
      image={{ src: "", alt: "An editorial photograph" }}
    >
      <p>Editorial copy</p>
    </ContentSection>,
  );

  const figure = container.querySelector(".puzzle-content-section__body > figure")!;
  const updatedCopy = container.querySelector(".puzzle-content-section__body > p")!;
  expect(figure.getBoundingClientRect().left).toBeGreaterThan(
    updatedCopy.getBoundingClientRect().left,
  );
});

it("uses the full body width when a media layout has no media", async () => {
  const { container } = render(
    <ContentSection variant="editorial">
      <p>Editorial copy</p>
    </ContentSection>,
  );

  await page.viewport(1280, 800);

  const body = container.querySelector(".puzzle-content-section__body")!;
  const copy = body.querySelector("p")!;
  expect(copy.getBoundingClientRect().width).toBeGreaterThanOrEqual(
    body.getBoundingClientRect().width * 0.95,
  );
});

it("does not reserve a sidebar column when no sidebar is supplied", async () => {
  const { container } = render(
    <ContentSection variant="split">
      <p>Editorial copy</p>
    </ContentSection>,
  );

  await page.viewport(1280, 800);

  const layout = container.querySelector(".puzzle-content-section__layout")!;
  const body = container.querySelector(".puzzle-content-section__body")!;
  expect(body.getBoundingClientRect().width).toBeGreaterThanOrEqual(
    layout.getBoundingClientRect().width * 0.95,
  );
});

it("stacks three-column content on narrow viewports", async () => {
  const { container } = render(
    <ContentSection variant="three-column" columns={["One", "Two", "Three"]} />,
  );

  await page.viewport(768, 800);

  const columns = container.querySelector(".puzzle-content-section__columns")!;
  expect(
    getComputedStyle(columns).gridTemplateColumns.trim().split(/\s+/),
  ).toHaveLength(3);

  await page.viewport(375, 800);

  expect(
    getComputedStyle(columns).gridTemplateColumns.trim().split(/\s+/),
  ).toHaveLength(1);
});
