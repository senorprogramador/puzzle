#!/usr/bin/env node

import { runI18nCli } from "./index";

void runI18nCli(process.argv.slice(2)).then((exitCode) => {
  process.exitCode = exitCode;
}, (error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
