import { describe, expect, it } from "bun:test";
import type { StorageAdapter } from "../../src";

export const runCapabilityConformance = (
  createAdapter: () => Promise<StorageAdapter>,
) => {
  describe("capability conformance", () => {
    it("returns capabilities consistently", async () => {
      const adapter = await createAdapter();
      const report = adapter.getCapabilities();

      expect(report.capabilities).toEqual(adapter.capabilities);
    });

    it("reports all required capability flags as booleans", async () => {
      const adapter = await createAdapter();
      const capabilities = adapter.getCapabilities().capabilities;

      for (const value of Object.values(capabilities)) {
        expect(typeof value).toBe("boolean");
      }
    });

    it("does not advertise atomicBatch without transaction guarantees", async () => {
      const adapter = await createAdapter();

      if (adapter.capabilities.atomicBatch) {
        expect(adapter.capabilities.transactions).toBe(true);
      }
    });
  });
};
