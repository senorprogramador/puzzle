import { describe, expect, it } from "bun:test";
import {
  StorageValidationError,
  type StorageRecord,
} from "@puzzle-ui/storage";

import { MemoryStorageAdapter } from "./helpers/memory-storage-adapter";

type Preference = StorageRecord & {
  readonly key: string;
  readonly value: string;
};

describe("media test Storage adapter ID semantics", () => {
  it("generates IDs and preserves identity and metadata on upsert", async () => {
    const adapter = new MemoryStorageAdapter();
    await adapter.registerCollection<Preference>({ name: "preferences" });
    const createdAt = new Date("2020-01-02T03:04:05.000Z");
    const updatedAt = new Date("2021-02-03T04:05:06.000Z");
    const inserted = await adapter.insert<Preference>("preferences", {
      key: "theme",
      value: "dark",
      createdAt,
      updatedAt,
      revision: 3,
    });

    const updated = await adapter.upsert<Preference>(
      "preferences",
      { where: { key: { operator: "eq", value: "theme" } } },
      {
        key: "theme",
        value: "light",
        createdAt: new Date("1990-01-01T00:00:00.000Z"),
        updatedAt: new Date("1991-01-01T00:00:00.000Z"),
        revision: 99,
      },
    );

    expect(inserted.id).toBeTruthy();
    expect(updated.id).toBe(inserted.id);
    expect(updated.createdAt).toEqual(createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
    expect(updated.revision).toBe(4);
    expect(updated.value).toBe("light");

    await expect(
      adapter.upsert<Preference>(
        "preferences",
        { where: { key: { operator: "eq", value: "theme" } } },
        { id: "replacement-id", key: "theme", value: "dark" },
      ),
    ).rejects.toBeInstanceOf(StorageValidationError);
  });
});
