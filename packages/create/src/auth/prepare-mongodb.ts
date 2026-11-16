import { execFileSync } from "node:child_process";

import * as p from "@clack/prompts";

import type { CommandRunner } from "../types";
import { runCommand } from "../utils/execute";

export type RequestMongoReset = (volumes: string[]) => Promise<boolean>;

const promptMongoReset: RequestMongoReset = async (volumes) => {
  p.log.warn(
    `An earlier project left MongoDB volumes behind: ${volumes.join(", ")}. Resetting permanently deletes all database data and accounts.`,
  );
  const confirmed = await p.confirm({
    message: "Delete these MongoDB volumes and create a fresh database?",
    initialValue: false,
  });
  return !p.isCancel(confirmed) && confirmed;
};

export const prepareMongoDB = async (
  directory: string,
  runner: CommandRunner = runCommand,
  requestReset: RequestMongoReset = promptMongoReset,
): Promise<boolean> => {
  const output = (args: string[]) =>
    execFileSync("docker", args, {
      cwd: directory,
      encoding: "utf8",
      timeout: 120_000,
    }).trim();

  const config = JSON.parse(output(["compose", "config", "--format", "json"])) as {
    name?: string;
    volumes?: Record<string, { name?: string; external?: boolean }>;
  };
  if (typeof config.name !== "string" || !config.name) {
    throw new Error("Cannot determine the MongoDB Compose project.");
  }
  const project = config.name;
  const names = ["mongodb-data", "mongodb-config"].map((key) => {
    const volume = config.volumes?.[key];
    if (typeof volume?.name !== "string" || !volume.name || volume.external) {
      throw new Error(`Cannot safely reset MongoDB volume "${key}".`);
    }
    return volume.name;
  });
  const existing = output([
    "volume", "ls",
    "--filter", `label=com.docker.compose.project=${project}`,
    "--format", "{{.Name}}",
  ]).split(/\r?\n/);
  const volumes = names.filter((name) => existing.includes(name));

  if (volumes.length === 0) {
    return true;
  }

  const checkConsumers = () => {
    for (const volume of volumes) {
      const consumers = output([
        "ps", "--all", "--filter", `volume=${volume}`,
        "--format", '{{.ID}} {{.Label "com.docker.compose.project"}} {{.Label "com.docker.compose.service"}}',
      ]);
      if (consumers && consumers.split(/\r?\n/).some((line) => {
        const [, owner, service] = line.split(" ");
        return owner !== project || service !== "mongodb";
      })) {
        throw new Error(
          `MongoDB volume "${volume}" is used by another service or project. No volumes were deleted.`,
        );
      }
    }
  };

  checkConsumers();
  if (!await requestReset(volumes)) {
    return false;
  }
  checkConsumers();

  await runner("docker", ["compose", "rm", "--stop", "--force", "mongodb"], {
    cwd: directory,
  });
  await runner("docker", ["volume", "rm", ...volumes], { cwd: directory });
  p.log.success("Previous MongoDB volumes deleted. A fresh database will be created.");
  return true;
};
