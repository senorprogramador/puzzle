import type { DataTableSortState } from "./data-table.types";

const getDataTablePageCount = (numberOfItems: number, itemsPerPage: number) =>
  Math.ceil(numberOfItems / itemsPerPage);

const getDataTableRange = (
  numberOfItems: number,
  itemsPerPage: number | undefined,
  page: number,
) => {
  if (itemsPerPage === undefined) {
    return { start: 0, end: numberOfItems };
  }

  const start = (page - 1) * itemsPerPage;
  return {
    start,
    end: Math.min(start + itemsPerPage, numberOfItems),
  };
};

const normalizeDataTableSearch = (search: string) => search.trim().toLowerCase();

const getSortedDataTableItems = <T>(
  items: T[],
  sort: DataTableSortState | null,
  getSortValue: ((item: T, columnIndex: number) => string | number | null) | undefined,
) => {
  if (!sort || !getSortValue) return items;

  return items
    .map((item, index) => ({
      item,
      index,
      value: getSortValue(item, sort.columnIndex),
    }))
    .sort((left, right) => {
      if (left.value === null || right.value === null) {
        if (left.value === right.value) return left.index - right.index;
        return left.value === null ? 1 : -1;
      }

      const comparison =
        typeof left.value === "number" && typeof right.value === "number"
          ? left.value < right.value
            ? -1
            : left.value > right.value
              ? 1
              : 0
          : String(left.value).toLowerCase() < String(right.value).toLowerCase()
            ? -1
            : String(left.value).toLowerCase() > String(right.value).toLowerCase()
              ? 1
              : 0;

      const directedComparison =
        sort.direction === "asc" ? comparison : -comparison;
      return directedComparison || left.index - right.index;
    })
    .map(({ item }) => item);
};

export {
  getDataTablePageCount,
  getDataTableRange,
  getSortedDataTableItems,
  normalizeDataTableSearch,
};
