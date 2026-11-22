import { describe, expect, it } from "bun:test";

import { D1StorageAdapter } from "../src";
import type { D1DatabaseLike } from "../src/d1.types";

const database = {} as D1DatabaseLike;

describe("D1 capabilities", () => {
  it("reports the guarantees and TTL limitation documented for D1", () => {
    const adapter = new D1StorageAdapter({ database });
    const report = adapter.getCapabilities();

    expect(report.capabilities).toEqual({
      transactions: true,
      atomicBatch: true,
      conditionalWrites: true,
      uniqueConstraints: true,
      upsert: true,
      cursorPagination: true,
      migrations: true,
      ttlIndexes: false,
    });
    expect(report.limitations).toContain(
      "D1 does not provide native TTL indexes. Expiration cleanup must be handled by an application or scheduled job.",
    );
  });
});
