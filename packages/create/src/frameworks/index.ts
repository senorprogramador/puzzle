import { createNextProject } from "./next";
import { createTanStackProject } from "./tanstack";
import { createReactRouterProject } from "./react-router";
import { createReactProject } from "./react";

import type { Framework, FrameworkGenerator } from "../types";

const frameworkGenerators: Record<Framework, FrameworkGenerator> = {
  next: createNextProject,
  tanstack: createTanStackProject,
  "react-router": createReactRouterProject,
  react: createReactProject,
};

export {
  createNextProject,
  createTanStackProject,
  createReactRouterProject,
  createReactProject,
  frameworkGenerators,
};
