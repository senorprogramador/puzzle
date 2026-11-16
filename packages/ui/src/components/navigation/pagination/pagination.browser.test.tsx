import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { Pagination } from "./index";

afterEach(async () => {
  await page.viewport(1280, 800);
});

describe("Pagination browser", () => {
  it("supports keyboard navigation through native controls", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        totalPages={10}
        defaultPage={2}
        onPageChange={onPageChange}
      />,
    );

    const next = screen.getByRole("button", {
      name: "Go to next page",
    });

    next.focus();

    await user.keyboard("{Enter}");

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("maintains a visible focus indicator", async () => {
    const user = userEvent.setup();

    render(<Pagination totalPages={5} />);

    const pageTwo = screen.getByRole("button", {
      name: "Go to page 2",
    });

    await user.tab();

    expect(pageTwo).toHaveFocus();

    const outline = getComputedStyle(pageTwo).outlineStyle;

    expect(outline).not.toBe("none");
  });

  it("supports pointer interaction", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        totalPages={10}
        defaultPage={1}
        onPageChange={onPageChange}
      />,
    );

    const pageThree = screen.getByRole("button", {
      name: "Go to page 3",
    });

    await user.click(pageThree);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not allow pointer interaction when disabled", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination totalPages={10} disabled onPageChange={onPageChange} />);

    const pageTwo = screen.getByRole("button", {
      name: "Go to page 2",
    });

    await user.click(pageTwo);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("fits compact controls and switches to the expanded window at tablet widths", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    await page.viewport(320, 800);
    render(<Pagination totalPages={1000} defaultPage={500} onPageChange={onPageChange} />);
    const navigation = screen.getByRole("navigation");
    const list = navigation.querySelector<HTMLElement>(".puzzle-pagination__list")!;
    const visiblePages = () =>
      [...navigation.querySelectorAll<HTMLElement>(".puzzle-pagination__page")]
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => element.textContent);

    expect(visiblePages()).toEqual(["1", "500", "1000"]);
    expect(list.scrollWidth).toBeLessThanOrEqual(320);
    const items = [...list.children].filter((element) => element.getClientRects().length > 0);
    const centers = items.map((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(2);
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(onPageChange).toHaveBeenCalledWith(501);
    expect(visiblePages()).toEqual(["1", "501", "1000"]);

    await page.viewport(768, 800);
    expect(visiblePages()).toEqual(["1", "500", "501", "502", "1000"]);
    await page.viewport(1024, 800);
    expect(visiblePages()).toEqual(["1", "500", "501", "502", "1000"]);
  });

  it("respects configured counts and link navigation across breakpoints", async () => {
    await page.viewport(320, 800);
    render(
      <Pagination totalPages={20} defaultPage={10} boundaryCount={0} siblingCount={2}
        getPageHref={(number) => `/items?page=${number}`} />,
    );
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute("href", "/items?page=11");
    expect(screen.queryByRole("link", { name: "Go to page 9" })).toBeNull();
    await page.viewport(768, 800);
    expect(screen.getByRole("link", { name: "Go to page 8" })).toHaveAttribute("href", "/items?page=8");
    expect(screen.queryByRole("link", { name: "Go to page 1" })).toBeNull();
  });

  it("supports link navigation", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <div onClick={(event) => event.preventDefault()}>
        <Pagination
          totalPages={10}
          defaultPage={2}
          getPageHref={(page) => `/items?page=${page}`}
          onPageChange={onPageChange}
        />
      </div>,
    );

    const pageThree = screen.getByRole("link", {
      name: "Go to page 3",
    });

    expect(pageThree).toHaveAttribute("href", "/items?page=3");

    await user.click(pageThree);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
