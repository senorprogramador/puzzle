/**
 * Reads a server-only variable. Next.js loads `.env` into `process.env`.
 */
export const getEnvironmentVariable = (name: string): string | undefined =>
  process.env[name] || undefined;
