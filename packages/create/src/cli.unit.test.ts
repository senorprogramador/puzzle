import { Readable } from "node:stream";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProjectConfiguration } from "./types";

import { createProject } from "./create-project";
import { getProjectConfiguration } from "./prompts";
import { parseCliArguments, runCli } from "./cli";

vi.mock("./create-project", () => ({
  createProject: vi.fn(),
}));

vi.mock("./prompts", () => ({
  getProjectConfiguration: vi.fn(),
}));

const configuration: ProjectConfiguration = {
  projectName: "Automation App",
  framework: "next",
  styling: "tailwind",
  auth: true,
  database: "custom",
  packageManager: "bun",
};

describe("parseCliArguments", () => {
  it("keeps no-argument execution interactive", () => {
    expect(parseCliArguments([])).toEqual({ mode: "interactive" });
  });

  it("supports help and configuration modes", () => {
    expect(parseCliArguments(["--help"])).toEqual({ mode: "help" });
    expect(
      parseCliArguments(["--config", "puzzle.json", "--dry-run"]),
    ).toMatchObject({
      mode: "configuration",
      configPath: "puzzle.json",
      dryRun: true,
    });
  });

  it.each([
    [["--config"], /requires a file path/],
    [["--validate"], /"--config" option is required/],
    [["--config", "puzzle.json", "--validate", "--dry-run"], /cannot be used together/],
    [["--unknown"], /Unknown option/],
  ])("rejects invalid arguments %j", (args, message) => {
    expect(() => parseCliArguments(args)).toThrow(message);
  });
});

describe("runCli", () => {
  let cwd: string;
  let configPath: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-cli-"));
    configPath = path.join(cwd, "puzzle.config.json");
    await writeConfiguration(configuration);
    vi.mocked(createProject).mockReset().mockResolvedValue(true);
    vi.mocked(getProjectConfiguration).mockReset();
  });

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true });
  });

  const writeConfiguration = async (value: ProjectConfiguration) => {
    await writeFile(configPath, JSON.stringify(value));
  };

  it("validates a configuration without generating files", async () => {
    const write = vi.fn();

    await runCli(["--config", configPath, "--validate"], { cwd, write });

    expect(write).toHaveBeenCalledWith(
      'Configuration is valid for next project "automation-app".',
    );
    expect(createProject).not.toHaveBeenCalled();
    await expect(rm(path.join(cwd, "automation-app"))).rejects.toThrow();
  });

  it("dry-runs without creating the target directory or invoking project setup", async () => {
    const write = vi.fn();

    await runCli(["--config", configPath, "--dry-run"], { cwd, write });

    expect(write).toHaveBeenCalledWith(
      'Would create "automation-app" using next, tailwind styling, and Puzzle Auth with custom.',
    );
    expect(createProject).not.toHaveBeenCalled();
    await expect(rm(path.join(cwd, "automation-app"))).rejects.toThrow();
  });

  it("rejects an existing project directory before generation", async () => {
    await mkdir(path.join(cwd, "automation-app"));

    await expect(
      runCli(["--config", configPath, "--dry-run"], { cwd }),
    ).rejects.toThrow("already exists");
    expect(createProject).not.toHaveBeenCalled();
  });

  it("uses the same normalized model for interactive and config execution", async () => {
    const runner = vi.fn();
    const write = vi.fn();
    vi.mocked(getProjectConfiguration).mockResolvedValue(configuration);

    await runCli([], { cwd, runner });
    const interactiveOptions = vi.mocked(createProject).mock.calls[0]![0];

    vi.mocked(createProject).mockClear();
    await runCli(["--config", configPath], { cwd, runner, write });
    const configuredOptions = vi.mocked(createProject).mock.calls[0]![0];

    expect(configuredOptions).toEqual(interactiveOptions);
  });

  it("requires credentials via stdin only for MongoDB and D1 Auth", async () => {
    const d1Configuration = { ...configuration, database: "d1" as const };
    await writeConfiguration(d1Configuration);

    await expect(runCli(["--config", configPath], { cwd })).rejects.toThrow(
      "requires an initial Auth user",
    );
    expect(createProject).not.toHaveBeenCalled();

    const initialUser = {
      email: " Owner@Example.com ",
      password: "Initial 'quoted' $password\\",
    };
    await runCli(
      ["--config", configPath, "--credentials-stdin"],
      {
        cwd,
        stdin: Readable.from([JSON.stringify(initialUser)]),
      },
    );

    expect(createProject).toHaveBeenCalledWith(
      expect.objectContaining({ database: "d1" }),
      expect.objectContaining({
        initialUser: {
          email: "owner@example.com",
          password: initialUser.password,
        },
      }),
    );
  });

  it("fails safely when non-interactive MongoDB setup would require a volume reset", async () => {
    await writeConfiguration({ ...configuration, database: "mongodb" });
    vi.mocked(createProject).mockResolvedValue(false);

    await expect(
      runCli(
        ["--config", configPath, "--credentials-stdin"],
        {
          cwd,
          stdin: Readable.from([
            JSON.stringify({
              email: "owner@example.com",
              password: "Initial 'quoted' $password\\",
            }),
          ]),
        },
      ),
    ).rejects.toThrow("Existing MongoDB volumes were preserved");

    const context = vi.mocked(createProject).mock.calls[0]![1]!;
    await expect(context.requestMongoReset?.([])).resolves.toBe(false);
  });

  it("rejects credentials passed to validation or dry-run modes", () => {
    expect(() =>
      parseCliArguments([
        "--config",
        "puzzle.json",
        "--validate",
        "--credentials-stdin",
      ]),
    ).toThrow("--credentials-stdin");
  });

  it("prints usage without prompting", async () => {
    const write = vi.fn();

    await runCli(["--help"], { cwd, write });

    expect(write).toHaveBeenCalledWith(expect.stringContaining("--credentials-stdin"));
    expect(getProjectConfiguration).not.toHaveBeenCalled();
    expect(createProject).not.toHaveBeenCalled();
  });
});
