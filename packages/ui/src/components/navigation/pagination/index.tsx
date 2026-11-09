"use client";

import { useState } from "react";
import { cn } from "@puzzle-ui/core";
import { Link } from "../link";

import type {
  PaginationItemType,
  PaginationLabels,
  PaginationProps,
} from "./pagination.types";

import { getPaginationItems, normalizePage } from "./pagination.utils";

import "./pagination.css";

const defaultLabels: PaginationLabels = {
  navigation: "Pagination",
  first: "Go to first page",
  previous: "Go to previous page",
  next: "Go to next page",
  last: "Go to last page",
  ellipsis: "More pages",
  page: (page) => `Go to page ${page}`,
};

const Pagination = ({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  disabled = false,
  size = "md",
  labels,
  getPageHref,
  getPageAriaLabel,
  className,
  ...navProps
}: PaginationProps) => {
  const [internalPage, setInternalPage] = useState(() =>
    normalizePage(defaultPage, totalPages),
  );

  const isControlled = page !== undefined;
  const currentPage = normalizePage(
    isControlled ? page : internalPage,
    totalPages,
  );

  const resolvedLabels = {
    ...defaultLabels,
    ...labels,
  };

  const items = getPaginationItems(
    totalPages,
    currentPage,
    boundaryCount,
    siblingCount,
  );

  const changePage = (nextPage: number) => {
    if (disabled) return;

    const normalizedPage = normalizePage(nextPage, totalPages);

    if (normalizedPage === 0 || normalizedPage === currentPage) return;

    if (!isControlled) {
      setInternalPage(normalizedPage);
    }

    onPageChange?.(normalizedPage);
  };

  const renderControl = (
    type: PaginationItemType,
    targetPage: number,
    content: React.ReactNode,
    ariaLabel: string,
  ) => {
    const isDisabled =
      disabled ||
      totalPages === 0 ||
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === currentPage;

    const controlClass = cn(
      "puzzle-pagination__control",
      "puzzle-pagination__navigation",
      isDisabled && "puzzle-pagination__control--disabled",
    );

    if (getPageHref && !isDisabled) {
      return (
        <Link
          href={getPageHref(targetPage)}
          className={controlClass}
          aria-label={ariaLabel}
          onClick={() => changePage(targetPage)}
          data-pagination-action={type}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={controlClass}
        disabled={isDisabled}
        aria-label={ariaLabel}
        onClick={() => changePage(targetPage)}
        data-pagination-action={type}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      {...navProps}
      aria-label={navProps["aria-label"] ?? resolvedLabels.navigation}
      className={cn(
        "puzzle-pagination",
        `puzzle-pagination--${size}`,
        className,
      )}
      data-disabled={disabled || undefined}
    >
      <ul className="puzzle-pagination__list">
        {showFirstLast && (
          <li className="puzzle-pagination__item">
            {renderControl(
              "first",
              1,
              <span aria-hidden="true">«</span>,
              resolvedLabels.first,
            )}
          </li>
        )}

        <li className="puzzle-pagination__item">
          {renderControl(
            "previous",
            currentPage - 1,
            <span aria-hidden="true">‹</span>,
            resolvedLabels.previous,
          )}
        </li>

        {items.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <li
                key={`ellipsis-${item.position}`}
                className="puzzle-pagination__item"
              >
                <span
                  className="puzzle-pagination__ellipsis"
                  aria-label={resolvedLabels.ellipsis}
                >
                  …
                </span>
              </li>
            );
          }

          const isCurrent = item.page === currentPage;
          const ariaLabel =
            getPageAriaLabel?.(item.page) ?? resolvedLabels.page(item.page);

          const pageClass = cn(
            "puzzle-pagination__control",
            "puzzle-pagination__page",
            isCurrent && "puzzle-pagination__page--active",
          );

          return (
            <li key={item.page} className="puzzle-pagination__item">
              {getPageHref ? (
                isCurrent ? (
                  <span
                    className={pageClass}
                    aria-label={ariaLabel}
                    aria-current="page"
                    aria-disabled={disabled || undefined}
                  >
                    {item.page}
                  </span>
                ) : disabled ? (
                  <span
                    className={cn(
                      pageClass,
                      "puzzle-pagination__control--disabled",
                    )}
                    aria-label={ariaLabel}
                    aria-disabled="true"
                  >
                    {item.page}
                  </span>
                ) : (
                  <Link
                    href={getPageHref(item.page)}
                    className={pageClass}
                    aria-label={ariaLabel}
                    aria-current={undefined}
                    onClick={() => changePage(item.page)}
                  >
                    {item.page}
                  </Link>
                )
              ) : isCurrent ? (
                <span
                  className={pageClass}
                  aria-label={ariaLabel}
                  aria-current="page"
                  aria-disabled={disabled || undefined}
                >
                  {item.page}
                </span>
              ) : (
                <button
                  type="button"
                  className={pageClass}
                  aria-label={ariaLabel}
                  aria-current={isCurrent ? "page" : undefined}
                  disabled={disabled || isCurrent}
                  onClick={() => changePage(item.page)}
                >
                  {item.page}
                </button>
              )}
            </li>
          );
        })}

        <li className="puzzle-pagination__item">
          {renderControl(
            "next",
            currentPage + 1,
            <span aria-hidden="true">›</span>,
            resolvedLabels.next,
          )}
        </li>

        {showFirstLast && (
          <li className="puzzle-pagination__item">
            {renderControl(
              "last",
              totalPages,
              <span aria-hidden="true">»</span>,
              resolvedLabels.last,
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export { Pagination, type PaginationProps };
