"use client";

import { useMemo, useState } from "react";

type UseListFilterOptions<T> = {
  items: readonly T[];
  getSearchText: (item: T) => string;
  getCategory?: (item: T) => string | undefined;
  enabled?: boolean;
};

type UseListFilterReturn<T> = {
  query: string;
  setQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  filteredItems: readonly T[];
};

const useListFilter = <T,>({
  items,
  getSearchText,
  getCategory,
  enabled = true,
}: UseListFilterOptions<T>): UseListFilterReturn<T> => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = useMemo(() => {
    if (!getCategory) {
      return [];
    }

    return [
      ...new Set(
        items.flatMap((item) => {
          const category = getCategory(item);
          return category ? [category] : [];
        }),
      ),
    ];
  }, [getCategory, items]);
  const filteredItems = useMemo(() => {
    if (!enabled) {
      return items;
    }

    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const category = getCategory?.(item);
      const matchesCategory =
        !getCategory ||
        selectedCategory === "" ||
        category === selectedCategory;
      const matchesQuery =
        normalizedQuery === "" ||
        getSearchText(item).toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [
    enabled,
    getCategory,
    getSearchText,
    items,
    query,
    selectedCategory,
  ]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredItems,
  };
};

export {
  useListFilter,
  type UseListFilterOptions,
  type UseListFilterReturn,
};
