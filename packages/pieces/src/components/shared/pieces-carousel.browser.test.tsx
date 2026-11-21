import { render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { PiecesCarousel } from "./pieces-carousel";

it("keeps the responsive carousel controls beside content and pagination below", async () => {
  const itemKeys = Array.from({ length: 8 }, (_, index) => `item-${index}`);
  const { container } = render(
    <PiecesCarousel
      itemKeys={itemKeys}
      slides={itemKeys.map((item) => <article key={item}>{item}</article>)}
      ariaLabel="Responsive cards"
      itemLabel="card"
      panelsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap="1rem"
    />,
  );

  const viewports = [
    { width: 375, panels: 1 },
    { width: 800, panels: 2 },
    { width: 1280, panels: 4 },
  ];

  for (const { width, panels } of viewports) {
    await page.viewport(width, 800);

    const carousel = container.querySelector(".puzzle-carousel")!;
    const viewport = container.querySelector(".puzzle-carousel__viewport")!;
    const previous = container.querySelector(
      ".puzzle-carousel__navigation--previous",
    )!;
    const next = container.querySelector(
      ".puzzle-carousel__navigation--next",
    )!;
    const pager = container.querySelector(".puzzle-carousel__pager")!;
    const viewportBounds = viewport.getBoundingClientRect();

    await waitFor(() => {
      expect(pager).toHaveTextContent(`Page 1 of ${itemKeys.length / panels}`);
    });
    expect(carousel).toHaveAttribute("data-button-mobile", "aside");
    expect(carousel).toHaveAttribute("data-pager-mobile", "under");
    expect(previous.getBoundingClientRect().right).toBeLessThanOrEqual(
      viewportBounds.left + 1,
    );
    expect(next.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      viewportBounds.right - 1,
    );
    expect(pager.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      viewportBounds.bottom - 1,
    );
    expect(
      [...container.querySelectorAll(".puzzle-carousel__item")].filter(
        (item) => {
          const bounds = item.getBoundingClientRect();
          return (
            bounds.left >= viewportBounds.left - 1 &&
            bounds.right <= viewportBounds.right + 1
          );
        },
      ),
    ).toHaveLength(panels);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  }

  await screen.getByRole("button", { name: "Next card" }).click();
  expect(container.querySelector(".puzzle-carousel__pager")?.textContent).toMatch(
    /^Page 2 of \d+$/,
  );
});
