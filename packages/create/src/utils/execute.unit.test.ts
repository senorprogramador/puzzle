import { describe, expect, it } from "vitest";

import { runCommand } from "./execute";

describe("runCommand", () => {
  it("passes credentials over stdin without shell interpolation", async () => {
    const input = JSON.stringify({ password: "Quotes '$\\ and unicode \u00e9" });

    await expect(runCommand(process.execPath, [
      "-e",
      `let input = ""; process.stdin.setEncoding("utf8"); process.stdin.on("data", chunk => input += chunk); process.stdin.on("end", () => process.exit(input === ${JSON.stringify(input)} ? 0 : 1));`,
    ], { input })).resolves.toBeUndefined();
  });

  it("reports seed process failures without including stdin credentials", async () => {
    await expect(runCommand(process.execPath, ["-e", "process.stdin.resume(); process.stdin.on('end', () => process.exit(7));"], {
      input: "private bootstrap password",
    })).rejects.toThrow("exited with code 7");
  });
});
