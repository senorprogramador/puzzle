#!/usr/bin/env node

import * as p from "@clack/prompts";

import { getProjectOptions } from "./prompts";

import { createProject } from "./create-project";

const main = async (): Promise<void> => {
  const options = await getProjectOptions();

  if (!options) {
    p.cancel("Project creation cancelled.");
    return;
  }

  await createProject(options);
};

main().catch((error: unknown) => {
  p.log.error(error instanceof Error ? error.message : String(error));

  process.exitCode = 1;
});
