import type { ComponentPropsWithoutRef } from "react";

type PaginationSize = "sm" | "md";

type PaginationItemType = "page" | "first" | "previous" | "next" | "last";

type PaginationItem =
  | {
      type: "page";
      page: number;
    }
  | {
      type: "ellipsis";
      position: "start" | "end";
    };

type PaginationLabels = {
  navigation: string;
  first: string;
  previous: string;
  next: string;
  last: string;
  ellipsis: string;
  page: (page: number) => string;
};

type PaginationProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children" | "onChange"
> & {
  /** Total number of available pages. */
  totalPages: number;

  /** Current page for controlled usage. Pages start at 1. */
  page?: number;

  /** Initial page for uncontrolled usage. Defaults to 1. */
  defaultPage?: number;

  /** Called when the selected page changes. */
  onPageChange?: (page: number) => void;

  /** Number of pages displayed around the current page. */
  siblingCount?: number;

  /** Number of pages always displayed at both boundaries. */
  boundaryCount?: number;

  /** Whether first and last page controls are displayed. */
  showFirstLast?: boolean;

  /** Whether all pagination controls are disabled. */
  disabled?: boolean;

  /** Visual size of the pagination controls. */
  size?: PaginationSize;

  /** Accessible labels for navigation controls. */
  labels?: Partial<PaginationLabels>;

  /** Generate a URL for a page instead of using a button. */
  getPageHref?: (page: number) => string;

  /** Accessible label for a specific page. */
  getPageAriaLabel?: (page: number) => string;
};

export type {
  PaginationProps,
  PaginationSize,
  PaginationItem,
  PaginationItemType,
  PaginationLabels,
};
