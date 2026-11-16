import { spawn, type ChildProcess } from "node:child_process";

export type RunOptions = {
  cwd: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
};

const OUTPUT_LIMIT = 12_000;

/**
 * The environment for generated projects, without the variables Vitest sets.
 * NODE_ENV=test would, for example, make Vite emit development JSX.
 */
const projectEnvironment = (env: NodeJS.ProcessEnv = {}) => {
  const environment: NodeJS.ProcessEnv = { ...process.env };

  for (const key of Object.keys(environment)) {
    if (key === "NODE_ENV" || key === "TEST" || key.startsWith("VITEST")) {
      delete environment[key];
    }
  }

  return { ...environment, ...env };
};

const tail = (output: string) =>
  output.length > OUTPUT_LIMIT ? `…${output.slice(-OUTPUT_LIMIT)}` : output;

/**
 * Runs a command and resolves with its combined output. Rejects with the
 * output included, so failures in generated projects are easy to diagnose.
 */
export const run = (
  command: string,
  args: string[],
  { cwd, env, input }: RunOptions,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: projectEnvironment(env),
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
    });
    let output = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.once("error", reject);
    if (input !== undefined) {
      child.stdin?.on("error", reject);
      child.stdin?.end(input);
    }
    child.once("close", (code, signal) => {
      if (code === 0) {
        resolve(output);
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed in ${cwd} (${signal ?? `exit code ${code}`}):\n${tail(output)}`,
        ),
      );
    });
  });

export type Server = {
  url: string;
  output: () => string;
  stop: () => Promise<void>;
};

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const exited = (child: ChildProcess) =>
  child.exitCode !== null || child.signalCode !== null;

/**
 * Starts a long-running server in its own process group and waits until it
 * answers HTTP requests on the given port.
 */
export const startServer = async (
  command: string,
  args: string[],
  {
    cwd,
    env,
    port,
    timeout = 120_000,
  }: RunOptions & {
    port: number;
    timeout?: number;
  },
): Promise<Server> => {
  const child = spawn(command, args, {
    cwd,
    env: projectEnvironment(env),
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let output = "";

  child.stdout?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });

  const stop = async () => {
    if (exited(child) || child.pid === undefined) {
      return;
    }

    const closed = new Promise((resolve) => child.once("close", resolve));

    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      return;
    }

    const result = await Promise.race([
      closed,
      delay(10_000).then(() => "timeout"),
    ]);

    if (result === "timeout") {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        // Already gone.
      }
    }
  };

  const url = `http://localhost:${port}`;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (exited(child)) {
      throw new Error(
        `${command} ${args.join(" ")} exited before serving ${url}:\n${tail(output)}`,
      );
    }

    try {
      await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });

      return { url, output: () => output, stop };
    } catch {
      await delay(500);
    }
  }

  await stop();

  throw new Error(
    `${command} ${args.join(" ")} did not serve ${url}:\n${tail(output)}`,
  );
};
