"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { Pagination } from "../../navigation/pagination";
import { TextInput } from "../../forms/input";
import {
  getDataTablePageCount,
  getDataTableRange,
  getSortedDataTableItems,
  normalizeDataTableSearch,
} from "./data-table.utils";
import type {
  DataTableProps,
  DataTableSortState,
} from "./data-table.types";

import "./data-table.css";

type RequestState = {
  key: string;
  status: "loading" | "ready" | "error";
  error: unknown;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "Unable to load table data.";
};

const validateSort = (
  sort: DataTableSortState | null,
  columnCount: number,
) => {
  if (
    sort &&
    (!Number.isInteger(sort.columnIndex) ||
      sort.columnIndex < 0 ||
      sort.columnIndex >= columnCount ||
      (sort.direction !== "asc" && sort.direction !== "desc"))
  ) {
    throw new RangeError("DataTable sort must reference a valid column.");
  }
};

const DataTable = <T,>({
  numberOfItems,
  header,
  columnSizes,
  renderCell,
  requestItems,
  itemsPerPage,
  sort,
  defaultSort,
  onSortChange,
  getSortValue,
  searchable = false,
  getSearchValue,
  initialItems,
  noContent = "No items found.",
  loadingContent,
  onError,
  maxHeight,
  className,
  style,
  ...divProps
}: DataTableProps<T>) => {
  if (!Number.isInteger(numberOfItems) || numberOfItems < 0) {
    throw new RangeError("DataTable numberOfItems must be a non-negative integer.");
  }
  if (header.length === 0) {
    throw new RangeError("DataTable requires at least one column header.");
  }
  if (
    itemsPerPage !== undefined &&
    (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0)
  ) {
    throw new RangeError("DataTable itemsPerPage must be a positive integer.");
  }
  if (columnSizes && columnSizes.length !== header.length) {
    throw new RangeError("DataTable columnSizes must match the number of headers.");
  }
  if (
    columnSizes &&
    header.some((_, index) => {
      if (!(index in columnSizes)) return true;
      const size = columnSizes[index];
      if (size === undefined) return true;
      return size !== "auto" && (!Number.isFinite(size) || size <= 0);
    })
  ) {
    throw new RangeError("DataTable column sizes must be positive numbers or auto.");
  }
  if (searchable && !getSearchValue) {
    throw new TypeError("DataTable searchable requires getSearchValue.");
  }

  const isSortControlled = sort !== undefined;
  const isSortingEnabled =
    getSortValue !== undefined &&
    (isSortControlled || defaultSort !== undefined);
  const [uncontrolledSort, setUncontrolledSort] =
    useState<DataTableSortState | null>(defaultSort ?? null);
  const activeSort = isSortControlled ? sort : uncontrolledSort;
  validateSort(activeSort ?? null, header.length);
  if (activeSort && !getSortValue) {
    throw new TypeError("DataTable sorting requires getSortValue.");
  }

  const pageCount =
    itemsPerPage === undefined
      ? 0
      : getDataTablePageCount(numberOfItems, itemsPerPage);
  const [requestedPage, setRequestedPage] = useState(1);
  const currentPage =
    pageCount === 0 ? 1 : Math.min(Math.max(1, requestedPage), pageCount);
  const { start, end } = getDataTableRange(
    numberOfItems,
    itemsPerPage,
    currentPage,
  );
  const requestKey = `${numberOfItems}:${itemsPerPage ?? "all"}:${start}:${end}`;

  const [items, setItems] = useState<T[]>(() =>
    numberOfItems === 0 ? [] : (initialItems ?? []),
  );
  const [requestState, setRequestState] = useState<RequestState>(() => ({
    key: requestKey,
    status:
      initialItems !== undefined || numberOfItems === 0 ? "ready" : "loading",
    error: null,
  }));
  const [retryCount, setRetryCount] = useState(0);
  const requestIdRef = useRef(0);
  const inFlightRef = useRef(new Map<string, Promise<T[]>>());
  const requestedRangesRef = useRef(new Set<string>());
  const initialRequestKeyRef = useRef(requestKey);
  const hasInitialItemsRef = useRef(initialItems !== undefined);
  const requestItemsRef = useRef(requestItems);
  const onErrorRef = useRef(onError);
  requestItemsRef.current = requestItems;
  onErrorRef.current = onError;

  const [search, setSearch] = useState("");
  const normalizedSearch = normalizeDataTableSearch(search);
  const searchValueAccessor = searchable ? getSearchValue : undefined;

  const isError =
    requestState.status === "error" && requestState.key === requestKey;
  const isLoading =
    !isError &&
    (requestState.status === "loading" || requestState.key !== requestKey);

  useEffect(() => {
    if (numberOfItems === 0) {
      setItems([]);
      setRequestState({ key: requestKey, status: "ready", error: null });
      return;
    }

    if (
      hasInitialItemsRef.current &&
      requestedRangesRef.current.size === 0 &&
      requestKey === initialRequestKeyRef.current
    ) {
      return;
    }

    const requestId = ++requestIdRef.current;
    const requestIdentity = `${requestKey}:${retryCount}`;
    setRequestState({ key: requestKey, status: "loading", error: null });

    let promise = inFlightRef.current.get(requestIdentity);

    if (!promise) {
      requestedRangesRef.current.add(requestIdentity);
      promise = Promise.resolve().then(() =>
        requestItemsRef.current(start, end),
      );
      inFlightRef.current.set(requestIdentity, promise);
    }

    const handleError = (error: unknown) => {
      if (requestIdRef.current !== requestId) return;
      setRequestState({ key: requestKey, status: "error", error });
      try {
        onErrorRef.current?.(error);
      } catch (callbackError) {
        setRequestState({
          key: requestKey,
          status: "error",
          error: callbackError,
        });
      }
    };

    promise.then(
      (nextItems) => {
        if (!Array.isArray(nextItems)) {
          handleError(new TypeError("DataTable requestItems must resolve to an array."));
          return;
        }
        if (requestIdRef.current !== requestId) return;
        setItems(nextItems);
        setRequestState({ key: requestKey, status: "ready", error: null });
      },
      handleError,
    ).finally(() => {
      if (inFlightRef.current.get(requestIdentity) === promise) {
        inFlightRef.current.delete(requestIdentity);
      }
    });

    return () => {
      if (requestIdRef.current === requestId) {
        requestIdRef.current += 1;
      }
    };
  }, [end, numberOfItems, requestKey, retryCount, start]);

  useEffect(() => {
    if (isSortControlled) setRequestedPage(1);
  }, [isSortControlled, sort?.columnIndex, sort?.direction]);

  const visibleItems = useMemo(() => {
    const filteredItems =
      normalizedSearch && searchValueAccessor
        ? items.filter((item) => {
            const value = searchValueAccessor(item);
            if (typeof value !== "string") {
              throw new TypeError("DataTable getSearchValue must return a string.");
            }
            return normalizeDataTableSearch(value).includes(normalizedSearch);
          })
        : items;

    return getSortedDataTableItems(
      filteredItems,
      activeSort ?? null,
      getSortValue,
    );
  }, [
    activeSort,
    getSearchValue,
    getSortValue,
    items,
    normalizedSearch,
    searchValueAccessor,
    searchable,
  ]);

  const renderedRows =
    isLoading || isError
      ? []
      : visibleItems.map((item) => {
          const cells = renderCell(item);
          if (
            !Array.isArray(cells) ||
            cells.length !== header.length ||
            header.some((_, index) => !(index in cells))
          ) {
            throw new RangeError(
              "DataTable renderCell must return one value for each header.",
            );
          }
          return cells;
        });

  const changeSort = (columnIndex: number) => {
    if (!isSortingEnabled) return;

    let nextSort: DataTableSortState | null;
    if (activeSort?.columnIndex !== columnIndex) {
      nextSort = { columnIndex, direction: "asc" };
    } else if (activeSort.direction === "asc") {
      nextSort = { columnIndex, direction: "desc" };
    } else {
      nextSort = null;
    }

    if (!isSortControlled) setUncontrolledSort(nextSort);
    onSortChange?.(nextSort);
    setRequestedPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setRequestedPage(1);
  };

  const retry = () => {
    setRequestState({ key: requestKey, status: "loading", error: null });
    setRetryCount((count) => count + 1);
  };

  const tableLoadingContent: ReactNode = loadingContent ?? "Loading…";
  const errorMessage = getErrorMessage(requestState.error);

  return (
    <div
      {...divProps}
      className={cn("puzzle-data-table", className)}
      style={style}
      data-loading={isLoading || undefined}
    >
      <div
        className={cn(
          "puzzle-data-table__viewport",
          maxHeight !== undefined && "puzzle-data-table__viewport--bounded",
        )}
        style={maxHeight === undefined ? undefined : { maxHeight }}
      >
        <table
          className="puzzle-data-table__table"
          aria-busy={isLoading}
        >
          <colgroup>
            {header.map((_, index) => {
              const size = columnSizes?.[index];
              return (
                <col
                  key={index}
                  style={
                    typeof size === "number"
                      ? { width: `${size}px` }
                      : undefined
                  }
                />
              );
            })}
          </colgroup>
          <thead>
            <tr>
              {header.map((heading, columnIndex) => {
                const direction =
                  activeSort?.columnIndex === columnIndex
                    ? activeSort.direction
                    : null;
                return (
                  <th
                    key={columnIndex}
                    scope="col"
                    aria-sort={
                      direction === "asc"
                        ? "ascending"
                        : direction === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {isSortingEnabled ? (
                      <button
                        type="button"
                        className="puzzle-data-table__sort"
                        onClick={() => changeSort(columnIndex)}
                      >
                        <span>{heading}</span>
                        <span
                          className="puzzle-data-table__sort-indicator"
                          aria-hidden="true"
                        >
                          {direction === "asc"
                            ? "↑"
                            : direction === "desc"
                              ? "↓"
                              : "↕"}
                        </span>
                      </button>
                    ) : (
                      heading
                    )}
                  </th>
                );
              })}
            </tr>
            {searchable && (
              <tr className="puzzle-data-table__search-row">
                <td colSpan={header.length}>
                  <TextInput
                    className="puzzle-data-table__search"
                    aria-label="Search table"
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                  />
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={header.length}>
                  <div className="puzzle-data-table__status" role="status">
                    {tableLoadingContent}
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={header.length}>
                  <div className="puzzle-data-table__error" role="alert">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      className="puzzle-data-table__retry"
                      onClick={retry}
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : visibleItems.length === 0 ? (
              <tr>
                <td colSpan={header.length}>
                  <div className="puzzle-data-table__empty">{noContent}</div>
                </td>
              </tr>
            ) : (
              visibleItems.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {renderedRows[rowIndex]!.map((cell, columnIndex) => (
                    <td key={columnIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {itemsPerPage !== undefined && (
            <tfoot>
              <tr>
                <td colSpan={header.length}>
                  <Pagination
                    totalPages={pageCount}
                    page={currentPage}
                    onPageChange={setRequestedPage}
                    aria-label="Table pagination"
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export { DataTable };
