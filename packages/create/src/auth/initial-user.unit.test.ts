import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { promptInitialUser } from "./initial-user";

vi.mock("@clack/prompts", () => ({
  log: { info: vi.fn() },
  text: vi.fn(),
  password: vi.fn(),
  isCancel: vi.fn(),
}));

describe("promptInitialUser", () => {
  beforeEach(() => {
    vi.mocked(p.text).mockResolvedValue(" Owner@Example.com ");
    vi.mocked(p.password).mockResolvedValue("long enough password");
    vi.mocked(p.isCancel).mockReturnValue(false);
  });

  it("normalizes the email and preserves the exact masked password", async () => {
    const password = "Quotes '$\\ and unicode \u00e9";
    vi.mocked(p.password).mockResolvedValue(password);

    expect(await promptInitialUser()).toEqual({
      email: "owner@example.com",
      password,
    });
    expect(p.password).toHaveBeenCalledTimes(2);
    expect(p.log.info).not.toHaveBeenCalledWith(expect.stringContaining(password));
  });

  it("validates email, password length, and confirmation", async () => {
    await promptInitialUser();
    const email = vi.mocked(p.text).mock.calls[0]![0].validate!;
    const password = vi.mocked(p.password).mock.calls[0]![0].validate!;
    const confirmation = vi.mocked(p.password).mock.calls[1]![0].validate!;

    if (typeof email !== "function" || typeof password !== "function" || typeof confirmation !== "function") {
      throw new Error("Expected callback validators.");
    }

    expect(email("not-an-email")).toBeTruthy();
    expect(email(`${"x".repeat(243)}@example.com`)).toBeTruthy();
    expect(email("owner@example.com")).toBeUndefined();
    expect(password("short")).toBeTruthy();
    expect(password("\u00e9".repeat(12))).toBeUndefined();
    expect(password("x".repeat(1025))).toBeTruthy();
    expect(confirmation("different password")).toBeTruthy();
    expect(confirmation("long enough password")).toBeUndefined();
  });

  it.each(["email", "password", "confirmation"])("handles cancellation at %s", async (step) => {
    if (step === "email") {
      vi.mocked(p.isCancel).mockReturnValueOnce(true);
    } else if (step === "password") {
      vi.mocked(p.isCancel).mockReturnValueOnce(false).mockReturnValueOnce(true);
    } else {
      vi.mocked(p.isCancel)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
    }

    expect(await promptInitialUser()).toBeNull();
  });
});
