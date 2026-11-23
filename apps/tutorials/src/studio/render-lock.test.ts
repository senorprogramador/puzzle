import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "bun:test";
import {
  isTutorialRenderActive,
  withTutorialRenderLock,
} from "./render-lock";

let temporaryRoot: string | undefined;

afterEach(async () => {
  if (temporaryRoot) {
    await rm(temporaryRoot, { recursive: true, force: true });
    temporaryRoot = undefined;
  }
});

describe("tutorial render resource lock", () => {
  it("signals active rendering and releases the lock after completion", async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), "tutorial-render-lock-"));
    await withTutorialRenderLock(temporaryRoot, async () => {
      expect(await isTutorialRenderActive(temporaryRoot as string)).toBe(true);
    });
    expect(await isTutorialRenderActive(temporaryRoot)).toBe(false);
  });

  it("rejects a second render while a lock is held", async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), "tutorial-render-lock-"));
    await withTutorialRenderLock(temporaryRoot, async () => {
      await expect(
        withTutorialRenderLock(temporaryRoot as string, async () => undefined),
      ).rejects.toThrow("Another tutorial render holds");
    });
  });
});
