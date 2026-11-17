import { spawnSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const compose = (args, stdio = "pipe") => {
  const result = spawnSync("docker", ["compose", ...args], {
    stdio,
    encoding: "utf8",
    timeout: 120_000,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
};

const started = compose(["up", "--detach"], "inherit");

if (started.status !== 0) {
  process.exit(started.status ?? 1);
}

const deadline = Date.now() + 120_000;
let output = "";

while (Date.now() < deadline) {
  const result = compose([
    "exec", "-T", "-e", "PUZZLE_MONGODB_SETUP=1", "mongodb",
    "mongosh", "--quiet", "--file", "/opt/puzzle/mongodb/check.js",
  ]);

  if (result.status === 0) {
    console.log("MongoDB is ready. Existing passwords and data were preserved.");
    process.exit(0);
  }

  output = [result.stdout, result.stderr].filter(Boolean).join("\n");

  if (result.status === 2) {
    break;
  }

  await setTimeout(2_000);
}

console.error(output);
console.error("MongoDB setup failed. Check docker compose logs mongodb and make sure .env matches the existing database. Shell variables override Compose's .env values. No volumes were deleted.");
process.exit(1);
