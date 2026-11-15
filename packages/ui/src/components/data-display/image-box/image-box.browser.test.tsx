import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ImageBox, type ImageBoxImage } from "./index";

afterEach(cleanup);

const createImages = (count: number): ImageBoxImage[] =>
  Array.from({ length: count }, (_, index) => ({
    src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
    alt: `Photo ${index + 1}`,
  }));

describe("ImageBox browser geometry", () => {
  it.each([3, 4, 5, 6])(
    "keeps the collage geometry aligned for %s images across desktop, tablet and mobile",
    async (count) => {
      render(
        <div style={{ width: "100%" }}>
          <ImageBox images={createImages(count)} gap={8} />
        </div>,
      );

      for (const width of [1280, 768, 390]) {
        await page.viewport(width, 800);

        const supporting = document.querySelector<HTMLElement>(
          ".puzzle-image-box__supporting",
        )!;
        const main = document.querySelector<HTMLElement>(
          ".puzzle-image-box__main",
        )!;
        const gallery = document.querySelector<HTMLElement>(".puzzle-image-box")!;
        const galleryRect = gallery.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();

        if (width < 640) {
          expect(getComputedStyle(supporting).display).toBe("none");
          expect(mainRect.width).toBeCloseTo(galleryRect.width, 0);
          const mobileViewAll = main.querySelector<HTMLElement>(
            ".puzzle-image-box__view-all",
          )!;
          expect(getComputedStyle(mobileViewAll).display).toBe("grid");
          expect(mobileViewAll.getBoundingClientRect().height).toBeGreaterThanOrEqual(
            44,
          );
        } else {
          const supportingRect = supporting.getBoundingClientRect();
          expect(mainRect.height).toBeCloseTo(supportingRect.height, 1);
          expect(mainRect.width / supportingRect.width).toBeCloseTo(
            count >= 5 ? 1 : 2,
            1,
          );
          expect(supportingRect.left - mainRect.right).toBeCloseTo(8, 1);

          const tiles = Array.from(
            supporting.querySelectorAll<HTMLElement>("[data-image-index]"),
          );
          const firstRect = tiles[0]!.getBoundingClientRect();
          const secondRect = tiles[1]!.getBoundingClientRect();
          expect(firstRect.height).toBeCloseTo(secondRect.height, 1);

          if (count < 5) {
            expect(secondRect.top - firstRect.bottom).toBeCloseTo(8, 1);
          }

          if (count === 4) {
            const thirdRect = tiles[2]!.getBoundingClientRect();
            expect(thirdRect.top - secondRect.bottom).toBeCloseTo(8, 1);
            expect(thirdRect.bottom).toBeCloseTo(supportingRect.bottom, 1);
          } else if (count === 3) {
            expect(secondRect.bottom).toBeCloseTo(supportingRect.bottom, 1);
          }

          if (count >= 5) {
            const thirdRect = tiles[2]!.getBoundingClientRect();
            const fourthRect = tiles[3]!.getBoundingClientRect();
            expect(secondRect.top).toBeCloseTo(firstRect.top, 1);
            expect(secondRect.left - firstRect.right).toBeCloseTo(8, 1);
            expect(thirdRect.top - firstRect.bottom).toBeCloseTo(8, 1);
            expect(fourthRect.top).toBeCloseTo(thirdRect.top, 1);
            expect(fourthRect.right).toBeCloseTo(supportingRect.right, 1);
          }
        }

        expect(gallery.scrollWidth).toBeLessThanOrEqual(gallery.clientWidth);
        expect(galleryRect.height).toBeCloseTo(galleryRect.width / 2, 1);
      }
    },
  );

  it("keeps custom gaps equal in both axes and changes the main ratio", async () => {
    render(
      <div style={{ width: "100%" }}>
        <ImageBox
          images={createImages(5)}
          aspectRatio={1.5}
          gap="10px"
        />
      </div>,
    );
    await page.viewport(1024, 800);

    const gallery = document.querySelector<HTMLElement>(".puzzle-image-box")!;
    const style = getComputedStyle(gallery);
    const bounds = gallery.getBoundingClientRect();

    expect(style.gap).toBe("10px");
    expect(bounds.height).toBeCloseTo(bounds.width / 1.5, 1);
  });

  it("shows a visible focus ring on keyboard-activated image controls", async () => {
    const user = userEvent.setup();

    render(
      <ImageBox
        images={createImages(6)}
        onImageClick={() => {}}
        onViewAll={() => {}}
      />,
    );
    await page.viewport(1280, 800);
    await user.tab();

    const focused = document.activeElement as HTMLElement;

    expect(focused.className).toContain("puzzle-image-box__image-button");
    expect(getComputedStyle(focused).outlineStyle).toBe("solid");
  });
});
