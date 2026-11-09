import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./index";

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

  it("keeps the pagination controls within the viewport width", () => {
    render(<Pagination totalPages={1000} defaultPage={500} />);

    const navigation = screen.getByRole("navigation");

    expect(navigation).toHaveClass("puzzle-pagination");

    expect(navigation.querySelector(".puzzle-pagination__list")).not.toBeNull();
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
