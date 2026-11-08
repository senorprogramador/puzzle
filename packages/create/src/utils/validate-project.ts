import { access } from "node:fs/promises";

import path from "node:path";

const validateProjectDirectory = async (
  directory: string,
  cwd = process.cwd(),
): Promise<string> => {
  const root = path.resolve(cwd);
  const target = path.resolve(root, directory);

  if (target === root || !target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid project directory.");
  }

  try {
    await access(target);

    throw new Error(
      `The directory "${directory}" already exists. Choose another name.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw error;
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return target;
    }

    throw error;
  }
};

export { validateProjectDirectory };
