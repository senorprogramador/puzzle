import { vi } from "vitest";

// The CLI's spinners and messages would interleave between parallel suites.
vi.mock("@clack/prompts", () => ({
  spinner: () => ({ start() {}, stop() {}, error() {}, message() {} }),
  log: { success() {}, info() {}, warn() {}, error() {}, step() {} },
  outro() {},
}));
