import { describe, expect, it } from "vitest";

import { getAlertSemantics } from "./alert.utils";

describe("getAlertSemantics", () => {
  it.each([
    ["success", "status", "polite"],
    ["info", "status", "polite"],
    ["warning", "alert", "assertive"],
    ["error", "alert", "assertive"],
  ] as const)(
    "maps %s severity to role=%s and aria-live=%s",
    (severity, role, ariaLive) => {
      expect(getAlertSemantics(severity)).toEqual({
        role,
        ariaLive,
      });
    },
  );
});
