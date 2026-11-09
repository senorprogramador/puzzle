import type { PaginationItem } from "./pagination.types";

const normalizeCount = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

const getPaginationItems = (
  totalPages: number,
  currentPage: number,
  boundaryCount = 1,
  siblingCount = 1,
): PaginationItem[] => {
  const total = normalizeCount(totalPages);
  const boundaries = normalizeCount(boundaryCount);
  const siblings = normalizeCount(siblingCount);

  if (total === 0) return [];

  const page = Math.min(Math.max(1, normalizeCount(currentPage)), total);

  if (total <= boundaries * 2 + siblings * 2 + 3) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page",
      page: index + 1,
    }));
  }

  const visiblePages = new Set<number>();

  for (let index = 1; index <= Math.min(boundaries, total); index += 1) {
    visiblePages.add(index);
  }

  for (
    let index = Math.max(1, total - boundaries + 1);
    index <= total;
    index += 1
  ) {
    visiblePages.add(index);
  }

  for (
    let index = Math.max(1, page - siblings);
    index <= Math.min(total, page + siblings);
    index += 1
  ) {
    visiblePages.add(index);
  }

  if (page - siblings <= boundaries + 1) {
    visiblePages.add(boundaries + siblings + 1);
  }

  if (page + siblings >= total - boundaries - 1) {
    visiblePages.add(total - boundaries - siblings);
  }

  const pages = [...visiblePages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  pages.forEach((current, index) => {
    if (index === 0) {
      items.push({ type: "page", page: current });
      return;
    }

    const previous = pages[index - 1]!;
    const difference = current - previous;

    if (difference === 2) {
      items.push({
        type: "page",
        page: previous + 1,
      });
    } else if (difference > 2) {
      items.push({
        type: "ellipsis",
        position: index === 1 ? "start" : "end",
      });
    }

    items.push({
      type: "page",
      page: current,
    });
  });

  return items;
};

const normalizePage = (page: number, totalPages: number) => {
  const total = normalizeCount(totalPages);

  if (total === 0) return 0;

  const normalized = Number.isFinite(page) ? Math.floor(page) : 1;

  return Math.min(Math.max(1, normalized), total);
};

export { getPaginationItems, normalizePage };
