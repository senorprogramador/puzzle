try {
  // Loads `.env` without overriding variables set by your host.
  process.loadEnvFile();
} catch {
  // No `.env` file: variables come from the environment.
}

/**
 * Reads a server-only variable from `process.env`.
 */
export const getEnvironmentVariable = (name: string): string | undefined =>
  process.env[name] || undefined;
