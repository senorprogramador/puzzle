import { spawn } from "node:child_process";

import type { CommandRunner } from "../types";

const runCommand: CommandRunner = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      stdio: options.stdio ?? "inherit",
      shell: false,
      env: process.env,
    });

    child.once("error", reject);

    child.once("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `${command} terminated with signal ${signal}`
            : `${command} exited with code ${code ?? "unknown"}`,
        ),
      );
    });
  });

export { runCommand };
