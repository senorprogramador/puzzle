import type { StorageRecord } from "@puzzle-ui/storage";

import type { PasswordHash } from "../providers/provider.types";

export type PasswordCredentialStorageRecord = StorageRecord & {
  readonly userId: string;
  readonly kind: "password";
  readonly passwordHash: PasswordHash;
  readonly passwordUpdatedAt: Date;
  readonly revokedAt: Date | null;
};
