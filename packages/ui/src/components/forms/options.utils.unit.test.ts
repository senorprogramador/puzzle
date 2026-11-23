import { describe, expect, it } from "vitest";

import { findEnabledOptionIndex, groupOptions } from "./options.utils";

describe("groupOptions", () => {
  it("preserves group order and original option indexes", () => {
    const options = [
      { id: "apple", group: "Fruit" },
      { id: "carrot" },
      { id: "pear", group: "Fruit" },
      { id: "broccoli", group: "Vegetables" },
    ];

    expect(groupOptions(options)).toEqual([
      {
        label: "Fruit",
        options: [
          { option: options[0], index: 0 },
          { option: options[2], index: 2 },
        ],
      },
      { label: null, options: [{ option: options[1], index: 1 }] },
      {
        label: "Vegetables",
        options: [{ option: options[3], index: 3 }],
      },
    ]);
  });
});

describe("findEnabledOptionIndex", () => {
  const options = [
    { disabled: true },
    { disabled: false },
    { disabled: true },
    { disabled: false },
  ];

  it("skips disabled options and respects non-wrapping bounds", () => {
    expect(findEnabledOptionIndex(options, -1, 1, false)).toBe(1);
    expect(findEnabledOptionIndex(options, 4, -1, false)).toBe(3);
    expect(findEnabledOptionIndex(options, 3, 1, false)).toBe(-1);
  });

  it("wraps around while skipping disabled options", () => {
    expect(findEnabledOptionIndex(options, 3, 1)).toBe(1);
    expect(findEnabledOptionIndex(options, 0, -1)).toBe(3);
  });

  it("returns no index for empty or fully disabled options", () => {
    expect(findEnabledOptionIndex([], -1, 1)).toBe(-1);
    expect(
      findEnabledOptionIndex([{ disabled: true }, { disabled: true }], -1, 1),
    ).toBe(-1);
  });
});
