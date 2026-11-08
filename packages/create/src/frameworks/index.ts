import { createNextProject } from "./next";
import { createTanStackProject } from "./tanstack";
import { createReactProject } from "./react";

import type { Framework, FrameworkGenerator } from "../types";

const frameworkGenerators: Record<Framework, FrameworkGenerator> = {
  next: createNextProject,
  tanstack: createTanStackProject,
  react: createReactProject,
};

export {
  createNextProject,
  createTanStackProject,
  createReactProject,
  frameworkGenerators,
};
