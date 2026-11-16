import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getProjectOptions } from "./prompts";
import { detectPackageManager } from "./utils/detect-package-manager";

vi.mock("@clack/prompts", () => ({
  intro: vi.fn(),
  text: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
  isCancel: vi.fn(),
  cancel: vi.fn(),
}));

vi.mock("./utils/detect-package-manager", () => ({
  detectPackageManager: vi.fn(() => "bun"),
}));

describe("getProjectOptions", () => {
  beforeEach(() => {
    vi.mocked(p.isCancel).mockReturnValue(false);
    vi.mocked(p.text).mockResolvedValue("My Awesome App");
    vi.mocked(p.select).mockResolvedValue("next");
    vi.mocked(p.confirm)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    vi.mocked(detectPackageManager).mockReturnValue("bun");
  });

  it("applies the project-name defaulting, framework, and package-manager choices", async () => {
    expect(await getProjectOptions()).toEqual({
      name: "my-awesome-app",
      directory: "my-awesome-app",
      framework: "next",
      packageManager: "bun",
      tailwind: true,
      auth: false,
    });
    expect(p.text).toHaveBeenCalledWith(
      expect.objectContaining({ placeholder: "my-awesome-app" }),
    );
    expect(p.confirm).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ initialValue: true }),
    );
    expect(p.confirm).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ initialValue: false }),
    );
  });

  it("asks for a database only when Auth is enabled on a full-stack framework", async () => {
    vi.mocked(p.select).mockResolvedValueOnce("react-router").mockResolvedValueOnce("d1");
    vi.mocked(p.confirm)
      .mockReset()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    expect(await getProjectOptions()).toMatchObject({
      framework: "react-router",
      tailwind: false,
      auth: true,
      database: "d1",
    });
    expect(p.select).toHaveBeenCalledTimes(2);
  });

  it("omits a database choice for basic React Auth", async () => {
    vi.mocked(p.select).mockResolvedValue("react");
    vi.mocked(p.confirm)
      .mockReset()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    expect(await getProjectOptions()).toMatchObject({
      framework: "react",
      auth: true,
    });
    expect(await getProjectOptions()).not.toHaveProperty("database");
  });

  it.each(["name", "framework", "tailwind", "auth", "database"] as const)(
    "returns null when the user cancels at %s",
    async (step) => {
      const cancelAt = {
        name: 1,
        framework: 2,
        tailwind: 3,
        auth: 4,
        database: 5,
      }[step];
      vi.mocked(p.select).mockReset().mockResolvedValue("next");
      vi.mocked(p.confirm)
        .mockReset()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);
      vi.mocked(p.isCancel).mockImplementation((value) => {
        const callNumber = vi.mocked(p.isCancel).mock.calls.length;
        return callNumber === cancelAt;
      });
      if (step === "database") {
        vi.mocked(p.confirm).mockReset().mockResolvedValueOnce(true).mockResolvedValueOnce(true);
      }

      expect(await getProjectOptions()).toBeNull();
    },
  );
});
