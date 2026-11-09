import type { AuthServer } from "../server";

export type NextAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};
