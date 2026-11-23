import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";

const getLockPath = (repositoryRoot: string) =>
  join(repositoryRoot, ".tutorial-studio", "render.lock");

export const isTutorialRenderActive = async (repositoryRoot: string) => {
  let contents: string;
  try {
    contents = await readFile(getLockPath(repositoryRoot), "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }
    throw error;
  }

  let processId: unknown;
  try {
    const lock = JSON.parse(contents) as { processId?: unknown };
    processId = lock.processId;
  } catch {
    return true;
  }
  if (!Number.isInteger(processId) || typeof processId !== "number") {
    return true;
  }
  try {
    process.kill(processId, 0);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ESRCH") {
      return false;
    }
    if (error instanceof Error && "code" in error && error.code === "EPERM") {
      return true;
    }
    throw error;
  }
};

export const waitForTutorialRender = async (
  repositoryRoot: string,
  timeoutMs: number,
  onWait: () => void,
) => {
  const startedAt = Date.now();
  while (await isTutorialRenderActive(repositoryRoot)) {
    if (Date.now() - startedAt >= timeoutMs) {
      throw new Error(
        `A tutorial render is still active after ${timeoutMs}ms. Retry when it finishes or increase renderWaitTimeoutMs.`,
      );
    }
    onWait();
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
};

export const withTutorialRenderLock = async <T>(
  repositoryRoot: string,
  task: () => Promise<T>,
) => {
  const lockPath = getLockPath(repositoryRoot);
  await mkdir(dirname(lockPath), { recursive: true });
  const file = await open(lockPath, "wx").catch((error: unknown) => {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
      throw new Error(
        `Another tutorial render holds ${lockPath}. If the previous render crashed, verify that it has stopped before removing this lock file.`,
      );
    }
    throw error;
  });
  try {
    await file.writeFile(
      JSON.stringify({
        processId: process.pid,
        startedAt: new Date().toISOString(),
      }),
    );
    return await task();
  } finally {
    await file.close();
    await unlink(lockPath).catch((error: unknown) => {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
        throw error;
      }
    });
  }
};
