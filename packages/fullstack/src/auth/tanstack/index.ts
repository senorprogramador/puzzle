import type { AuthServer } from "../server";

export type TanStackAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};
