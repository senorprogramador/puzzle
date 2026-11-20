import { describe, expect, it } from "vitest";

import { parseAiArguments } from "./cli";

describe("parseAiArguments", () => {
  it("parses package, agent, dry-run, and workspace options", () => {
    expect(
      parseAiArguments([
        "init",
        "--agents",
        "copilot,cursor",
        "--packages",
        "@puzzle-ui/ui,@puzzle-ui/theme",
        "--dry-run",
        "--cwd",
        "apps/web",
      ]),
    ).toEqual({
      command: "init",
      agents: ["copilot", "cursor"],
      packages: ["@puzzle-ui/ui", "@puzzle-ui/theme"],
      dryRun: true,
      yes: false,
      nonInteractive: false,
      cwd: "apps/web",
    });
  });

  it.each([
    [["--help"], { help: true }],
    [["update", "--yes"], {
      command: "update",
      dryRun: false,
      yes: true,
      nonInteractive: true,
    }],
  ])("parses %j", (args, expected) => {
    expect(parseAiArguments(args as string[])).toMatchObject(expected);
  });

  it.each([
    [["unknown"], /Expected "init", "update", or "check"/],
    [["init", "--agents"], /requires a comma-separated list/],
    [["init", "--agents", "copilot,copilot"], /duplicate-free/],
    [["init", "--agents", "unsupported"], /Unknown AI agent/],
    [["check", "--dry-run"], /not valid with "ai check"/],
    [["init", "--cwd"], /requires a directory path/],
  ])("rejects invalid arguments %j", (args, message) => {
    expect(() => parseAiArguments(args as string[])).toThrow(message);
  });
});
