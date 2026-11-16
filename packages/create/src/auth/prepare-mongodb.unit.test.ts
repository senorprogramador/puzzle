import { execFileSync } from "node:child_process";

import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prepareMongoDB } from "./prepare-mongodb";

const confirm = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
vi.mock("@clack/prompts", () => ({
  log: { warn: vi.fn(), success: vi.fn() },
  confirm,
  isCancel: (value: unknown) => typeof value === "symbol",
}));

describe("prepareMongoDB", () => {
  const directory = "/projects/my-app";
  const data = "my-app_mongodb-data";
  const config = "my-app_mongodb-config";
  const runner = vi.fn().mockResolvedValue(undefined);
  const requestReset = vi.fn().mockResolvedValue(true);
  let existing: string;
  let consumers: string;
  let external: boolean;

  beforeEach(() => {
    existing = `${data}\n${config}\nmy-app_unrelated`;
    consumers = "abc123 my-app mongodb";
    external = false;
    runner.mockReset().mockResolvedValue(undefined);
    requestReset.mockReset().mockResolvedValue(true);
    vi.mocked(execFileSync).mockImplementation((_command, args) => {
      if (args?.[0] === "compose") {
        return JSON.stringify({
          name: "my-app",
          volumes: {
            "mongodb-data": { name: data, external },
            "mongodb-config": { name: config },
          },
        });
      }
      return args?.[0] === "volume" ? existing : consumers;
    });
  });

  it("does not prompt or reset when there are no previous MongoDB volumes", async () => {
    existing = "my-app_unrelated";
    expect(await prepareMongoDB(directory, runner, requestReset)).toBe(true);
    expect(requestReset).not.toHaveBeenCalled();
    expect(runner).not.toHaveBeenCalled();
  });

  it("resets only existing MongoDB volumes after confirmation", async () => {
    expect(await prepareMongoDB(directory, runner, requestReset)).toBe(true);
    expect(requestReset).toHaveBeenCalledWith([data, config]);
    expect(runner.mock.calls).toEqual([
      ["docker", ["compose", "rm", "--stop", "--force", "mongodb"], { cwd: directory }],
      ["docker", ["volume", "rm", data, config], { cwd: directory }],
    ]);
    expect(execFileSync).toHaveBeenCalledWith(
      "docker",
      expect.arrayContaining(["label=com.docker.compose.project=my-app"]),
      expect.objectContaining({ cwd: directory }),
    );
  });

  it("handles a partially remaining set of volumes", async () => {
    existing = data;
    consumers = "";
    await prepareMongoDB(directory, runner, requestReset);
    expect(requestReset).toHaveBeenCalledWith([data]);
    expect(runner).toHaveBeenLastCalledWith(
      "docker", ["volume", "rm", data], { cwd: directory },
    );
  });

  it("preserves everything when confirmation is declined", async () => {
    requestReset.mockResolvedValue(false);
    expect(await prepareMongoDB(directory, runner, requestReset)).toBe(false);
    expect(runner).not.toHaveBeenCalled();
  });

  it.each([false, Symbol("cancel")])("defaults to preserving data on refusal or cancellation (%s)", async (answer) => {
    confirm.mockResolvedValue(answer);
    expect(await prepareMongoDB(directory, runner)).toBe(false);
    expect(p.confirm).toHaveBeenCalledWith(expect.objectContaining({ initialValue: false }));
    expect(p.log.warn).toHaveBeenCalledWith(expect.stringContaining("permanently deletes"));
    expect(runner).not.toHaveBeenCalled();
  });

  it.each(["abc123 other-project mongodb", "abc123 my-app other-service", "abc123  "])(
    "refuses volumes shared with other consumers (%s)",
    async (consumer) => {
      consumers = consumer;
      await expect(prepareMongoDB(directory, runner, requestReset))
        .rejects.toThrow("used by another service or project");
      expect(requestReset).not.toHaveBeenCalled();
      expect(runner).not.toHaveBeenCalled();
    },
  );

  it("rechecks consumers after confirmation", async () => {
    requestReset.mockImplementation(async () => {
      consumers = "abc123 other-project mongodb";
      return true;
    });
    await expect(prepareMongoDB(directory, runner, requestReset))
      .rejects.toThrow("used by another service or project");
    expect(runner).not.toHaveBeenCalled();
  });

  it("refuses external volumes", async () => {
    external = true;
    await expect(prepareMongoDB(directory, runner, requestReset))
      .rejects.toThrow("Cannot safely reset");
    expect(runner).not.toHaveBeenCalled();
  });

  it("reports Docker discovery errors without attempting a reset", async () => {
    vi.mocked(execFileSync).mockImplementation(() => {
      throw new Error("Docker is unavailable");
    });
    await expect(prepareMongoDB(directory, runner, requestReset))
      .rejects.toThrow("Docker is unavailable");
    expect(runner).not.toHaveBeenCalled();
  });

  it("does not remove volumes if stopping the service fails", async () => {
    runner.mockRejectedValue(new Error("Cannot stop MongoDB"));
    await expect(prepareMongoDB(directory, runner, requestReset))
      .rejects.toThrow("Cannot stop MongoDB");
    expect(runner).toHaveBeenCalledTimes(1);
  });
});
