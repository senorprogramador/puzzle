import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./index";

describe("Pagination", () => {
  it("renders an accessible navigation landmark", () => {
    render(<Pagination totalPages={10} />);

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("renders all pages when the total is small", () => {
    render(<Pagination totalPages={5} />);

    for (let page = 1; page <= 5; page += 1) {
      expect(
        screen.getByRole("button", {
          name: `Go to page ${page}`,
        }),
      ).toBeInTheDocument();
    }
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination totalPages={10} defaultPage={5} />);

    expect(
      screen.getByRole("button", { name: "Go to page 5" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("supports uncontrolled page changes", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        totalPages={10}
        defaultPage={1}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);

    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("supports controlled page changes", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    const { rerender } = render(
      <Pagination totalPages={10} page={1} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);

    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");

    rerender(
      <Pagination totalPages={10} page={2} onPageChange={onPageChange} />,
    );

    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("navigates to the next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        totalPages={10}
        defaultPage={3}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("navigates to the previous page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        totalPages={10}
        defaultPage={3}
        onPageChange={onPageChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Go to previous page" }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous and first controls on the first page", () => {
    render(<Pagination totalPages={10} defaultPage={1} />);

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Go to first page" }),
    ).toBeDisabled();
  });

  it("disables next and last controls on the last page", () => {
    render(<Pagination totalPages={10} defaultPage={10} />);

    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Go to last page" }),
    ).toBeDisabled();
  });

  it("supports hiding first and last controls", () => {
    render(<Pagination totalPages={10} showFirstLast={false} />);

    expect(
      screen.queryByRole("button", { name: "Go to first page" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Go to last page" }),
    ).not.toBeInTheDocument();
  });

  it("supports a disabled state", () => {
    render(<Pagination totalPages={10} disabled />);

    expect(screen.getByRole("button", { name: "Go to page 2" })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });

  it("renders no page numbers when there are no pages", () => {
    render(<Pagination totalPages={0} />);

    expect(screen.queryByRole("button", { name: /Go to page/ })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });

  it("supports custom accessible labels", () => {
    render(
      <Pagination
        totalPages={5}
        labels={{
          navigation: "Paginering",
          next: "Volgende",
          previous: "Vorige",
          page: (page) => `Pagina ${page}`,
        }}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Paginering" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Volgende" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Pagina 2" }),
    ).toBeInTheDocument();
  });

  it("supports a custom navigation label", () => {
    render(<Pagination totalPages={5} aria-label="Article navigation" />);

    expect(
      screen.getByRole("navigation", {
        name: "Article navigation",
      }),
    ).toBeInTheDocument();
  });

  it("generates links when getPageHref is provided", () => {
    render(
      <Pagination
        totalPages={5}
        defaultPage={2}
        getPageHref={(page) => `/articles?page=${page}`}
      />,
    );

    expect(screen.getByRole("link", { name: "Go to page 3" })).toHaveAttribute(
      "href",
      "/articles?page=3",
    );

    expect(
      screen.getByRole("link", { name: "Go to next page" }),
    ).toHaveAttribute("href", "/articles?page=3");
  });

  it("supports custom page labels", () => {
    render(
      <Pagination
        totalPages={5}
        getPageAriaLabel={(page) => `Open page ${page}`}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Open page 2" }),
    ).toBeInTheDocument();
  });

  it("supports the small size", () => {
    render(<Pagination totalPages={5} size="sm" />);

    expect(screen.getByRole("navigation")).toHaveClass("puzzle-pagination--sm");
  });

  it("does not notify when the current page is selected", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination totalPages={5} defaultPage={2} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole("button", { name: "Go to page 2" })).toBeDisabled();

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("clamps the initial page to the valid range", () => {
    render(<Pagination totalPages={5} defaultPage={20} />);

    expect(
      screen.getByRole("button", { name: "Go to page 5" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
