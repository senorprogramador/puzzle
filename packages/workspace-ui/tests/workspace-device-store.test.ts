import { describe, expect, it } from "bun:test";

import {
  deleteLocalEntity,
  mergeLocalEntities,
  upsertLocalEntity,
} from "../src/workspace-device-store";

type Project = { readonly id: string; readonly name: string };

describe("workspace device storage", () => {
  it("merges local additions and edits while retaining new database records", () => {
    const merged = mergeLocalEntities<Project>(
      [
        { id: "project-a", name: "Original A" },
        { id: "project-b", name: "Database B" },
      ],
      {
        upserts: [
          { id: "project-a", name: "Local A" },
          { id: "project-c", name: "Local C" },
        ],
        deletedIds: [],
      },
    );

    expect(merged).toEqual([
      { id: "project-a", name: "Local A" },
      { id: "project-b", name: "Database B" },
      { id: "project-c", name: "Local C" },
    ]);
  });

  it("keeps local deletions from reappearing in a fresh database seed", () => {
    const merged = mergeLocalEntities<Project>(
      [
        { id: "project-a", name: "Database A" },
        { id: "project-b", name: "Database B" },
      ],
      { upserts: [], deletedIds: ["project-b"] },
    );

    expect(merged).toEqual([{ id: "project-a", name: "Database A" }]);
  });

  it("replaces repeated local edits and allows an edited item to be restored", () => {
    const edited = upsertLocalEntity<Project>(
      { upserts: [{ id: "project-a", name: "First edit" }], deletedIds: [] },
      { id: "project-a", name: "Second edit" },
    );
    const deleted = deleteLocalEntity(edited, "project-a");
    const restored = upsertLocalEntity(
      deleted,
      { id: "project-a", name: "Restored" },
    );

    expect(restored).toEqual({
      upserts: [{ id: "project-a", name: "Restored" }],
      deletedIds: [],
    });
  });

  it("records deletion once and removes any pending local upsert", () => {
    const deleted = deleteLocalEntity(
      {
        upserts: [{ id: "project-a", name: "Local A" }],
        deletedIds: ["project-a"],
      },
      "project-a",
    );

    expect(deleted).toEqual({ upserts: [], deletedIds: ["project-a"] });
  });
});
