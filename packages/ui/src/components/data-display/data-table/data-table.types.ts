import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

type DataTableSortDirection = "asc" | "desc";

type DataTableSortState = {
  columnIndex: number;
  direction: DataTableSortDirection;
};

type DataTableColumnSize = number | "auto";
type DataTableCellValue = string | number | ReactNode | null;

type DataTableProps<T> = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onError"
> & {
  numberOfItems: number;
  header: Array<string | ReactNode>;
  /** Fixed column widths in CSS pixels, or "auto" for content-based sizing. */
  columnSizes?: DataTableColumnSize[];
  renderCell: (item: T) => DataTableCellValue[];
  /** Fetches the inclusive start and exclusive end range. */
  requestItems: (start: number, end: number) => Promise<T[]>;
  itemsPerPage?: number;
  /** Supplying this prop enables sort controls, including when its value is null. */
  sort?: DataTableSortState | null;
  /** Initial sort; supply null to enable sort controls without an initial order. */
  defaultSort?: DataTableSortState | null;
  onSortChange?: (sort: DataTableSortState | null) => void;
  /** Sorting is local to the items currently loaded by the table. */
  getSortValue?: (
    item: T,
    columnIndex: number,
  ) => string | number | null;
  searchable?: boolean;
  /** Placeholder shown in the search field when searching is enabled. */
  searchPlaceholder?: string;
  /** Search is local to the items currently loaded by the table. */
  getSearchValue?: (item: T) => string;
  initialItems?: T[];
  noContent?: ReactNode;
  loadingContent?: ReactNode;
  onError?: (error: unknown) => void;
  maxHeight?: CSSProperties["maxHeight"];
};

export type {
  DataTableCellValue,
  DataTableColumnSize,
  DataTableProps,
  DataTableSortDirection,
  DataTableSortState,
};
