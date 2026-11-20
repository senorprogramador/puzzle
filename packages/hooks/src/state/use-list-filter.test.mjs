import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it } from "vitest";
import { useListFilter } from "./use-list-filter";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const items = [
  { id: "slack", name: "Slack", category: "Messaging" },
  { id: "linear", name: "Linear", category: "Planning" },
  { id: "mail", name: "Mail", category: "Messaging" },
];

let renderer;
let api;

const Harness = (options) => {
  api = useListFilter(options);
  return createElement("div");
};

const mount = (options) => {
  act(() => {
    renderer = create(createElement(Harness, options));
  });
  return renderer;
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
});

describe("useListFilter", () => {
  const options = {
    items,
    getSearchText: (item) => item.name,
    getCategory: (item) => item.category,
  };

  it("returns unique categories in item order", () => {
    mount(options);

    expect(api.categories).toEqual(["Messaging", "Planning"]);
    expect(api.filteredItems).toEqual(items);
  });

  it("trims and case-folds search text and filters by category", () => {
    mount(options);

    act(() => {
      api.setQuery("  LINE ");
      api.setSelectedCategory("Planning");
    });

    expect(api.filteredItems.map((item) => item.id)).toEqual(["linear"]);
  });

  it("returns every item while disabled and reapplies retained filters when enabled", () => {
    const disabledOptions = { ...options, enabled: false };
    mount(disabledOptions);

    act(() => api.setQuery("missing"));
    expect(api.filteredItems).toEqual(items);

    act(() => {
      renderer.update(
        createElement(Harness, { ...disabledOptions, enabled: true }),
      );
    });
    expect(api.filteredItems).toEqual([]);
  });
});
