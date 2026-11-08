import { describe, expect, it } from "vitest";

import {
  filterCommands,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  getNextEnabledIndex,
  normalizeCommandText,
} from "./command.utils";

import type { CommandItem } from "./command.types";

const commands: CommandItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "settings",
    label: "Settings",
    disabled: true,
  },
  {
    id: "profile",
    label: "Profile",
  },
];

describe("normalizeCommandText", () => {
  it("normalizes case", () => {
    expect(normalizeCommandText("DASHBOARD")).toBe("dashboard");
  });

  it("removes diacritics", () => {
    expect(normalizeCommandText("Éléments")).toBe("elements");
  });

  it("trims whitespace", () => {
    expect(normalizeCommandText("  hello  ")).toBe("hello");
  });
});

describe("filterCommands", () => {
  it("returns all commands for an empty query", () => {
    expect(filterCommands(commands, "")).toEqual(commands);
  });

  it("matches labels case-insensitively", () => {
    expect(filterCommands(commands, "DASH")).toEqual([commands[0]]);
  });

  it("matches descriptions", () => {
    const items: CommandItem[] = [
      {
        id: "search",
        label: "Search",
        description: "Find documents",
      },
    ];

    expect(filterCommands(items, "documents")).toEqual(items);
  });

  it("matches keywords", () => {
    const items: CommandItem[] = [
      {
        id: "search",
        label: "Search",
        keywords: ["lookup", "find"],
      },
    ];

    expect(filterCommands(items, "lookup")).toEqual(items);
  });

  it("matches groups", () => {
    const items: CommandItem[] = [
      {
        id: "settings",
        label: "Preferences",
        group: "Configuration",
      },
    ];

    expect(filterCommands(items, "configuration")).toEqual(items);
  });

  it("matches multiple query terms", () => {
    const items: CommandItem[] = [
      {
        id: "a",
        label: "Open settings",
      },
      {
        id: "b",
        label: "Open profile",
      },
    ];

    expect(filterCommands(items, "open profile")).toEqual([items[1]]);
  });

  it("matches normalized diacritics", () => {
    const items: CommandItem[] = [
      {
        id: "a",
        label: "Éléments",
      },
    ];

    expect(filterCommands(items, "elements")).toEqual(items);
  });
});

describe("getNextEnabledIndex", () => {
  it("moves forward", () => {
    expect(getNextEnabledIndex(commands, -1, 1)).toBe(0);
  });

  it("skips disabled commands", () => {
    expect(getNextEnabledIndex(commands, 0, 1)).toBe(2);
  });

  it("skips disabled commands backwards", () => {
    expect(getNextEnabledIndex(commands, 2, -1)).toBe(0);
  });

  it("loops to the beginning", () => {
    expect(getNextEnabledIndex(commands, 2, 1)).toBe(0);
  });

  it("loops to the end", () => {
    expect(getNextEnabledIndex(commands, 0, -1)).toBe(2);
  });

  it("does not loop at the end when loop is false", () => {
    expect(getNextEnabledIndex(commands, 2, 1, false)).toBe(2);
  });

  it("does not loop at the beginning when loop is false", () => {
    expect(getNextEnabledIndex(commands, 0, -1, false)).toBe(0);
  });

  it("returns -1 for an empty list", () => {
    expect(getNextEnabledIndex([], -1, 1)).toBe(-1);
  });

  it("returns -1 when every command is disabled", () => {
    expect(
      getNextEnabledIndex(
        [
          {
            id: "a",
            label: "A",
            disabled: true,
          },
          {
            id: "b",
            label: "B",
            disabled: true,
          },
        ],
        -1,
        1,
      ),
    ).toBe(-1);
  });
});

describe("findFirstEnabledIndex", () => {
  it("returns the first enabled command index", () => {
    expect(findFirstEnabledIndex(commands)).toBe(0);
  });

  it("skips disabled commands", () => {
    expect(
      findFirstEnabledIndex([
        {
          id: "a",
          label: "A",
          disabled: true,
        },
        {
          id: "b",
          label: "B",
        },
      ]),
    ).toBe(1);
  });

  it("returns -1 when no commands are enabled", () => {
    expect(
      findFirstEnabledIndex([
        {
          id: "a",
          label: "A",
          disabled: true,
        },
      ]),
    ).toBe(-1);
  });
});

describe("findLastEnabledIndex", () => {
  it("returns the last enabled command index", () => {
    expect(findLastEnabledIndex(commands)).toBe(2);
  });

  it("skips disabled commands", () => {
    expect(
      findLastEnabledIndex([
        {
          id: "a",
          label: "A",
        },
        {
          id: "b",
          label: "B",
          disabled: true,
        },
      ]),
    ).toBe(0);
  });

  it("returns -1 when no commands are enabled", () => {
    expect(
      findLastEnabledIndex([
        {
          id: "a",
          label: "A",
          disabled: true,
        },
      ]),
    ).toBe(-1);
  });
});
