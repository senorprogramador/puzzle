#!/usr/bin/env node

import * as p from "@clack/prompts";

import { runCli } from "./cli";

runCli().catch((error: unknown) => {
  p.log.error(error instanceof Error ? error.message : String(error));

  process.exitCode = 1;
});
