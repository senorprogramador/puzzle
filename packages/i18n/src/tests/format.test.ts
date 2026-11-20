import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDate,
  formatList,
  formatNumber,
  formatRelativeTime,
} from "../format";

describe("Intl formatting helpers", () => {
  it("formats numbers, currencies, dates, relative time, and lists by locale", () => {
    expect(formatNumber(1234.5, "de-DE")).toBe("1.234,5");
    expect(formatCurrency(1234.5, "en-US", "USD")).toBe("$1,234.50");
    expect(
      formatDate(new Date("2020-01-02T00:00:00.000Z"), "en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    ).toBe("2020");
    expect(
      formatRelativeTime(-1, "day", "en", { numeric: "auto" }),
    ).toBe("yesterday");
    expect(formatList(["a", "b"], "en")).toBe("a and b");
  });
});
