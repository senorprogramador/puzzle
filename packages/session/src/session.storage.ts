import type { StorageAdapter, StorageCollection } from "@puzzle-ui/storage";

import type {
  SessionDataRecord,
  SessionStorageRecord,
} from "./types/session.types";

export const SESSION_COLLECTION = "sessions";
export const SESSION_DATA_COLLECTION = "session_data";

export const sessionCollection: StorageCollection<SessionStorageRecord> = {
  name: SESSION_COLLECTION,
  indexes: [
    {
      name: "token_hash_unique",
      fields: ["tokenHash"],
      unique: true,
    },
    {
      name: "user_id",
      fields: ["userId"],
    },
    {
      name: "expires_at",
      fields: ["expiresAt"],
    },
    {
      name: "revoked_at",
      fields: ["revokedAt"],
    },
  ],
};

export const sessionDataCollection: StorageCollection<SessionDataRecord> = {
  name: SESSION_DATA_COLLECTION,
  indexes: [
    {
      name: "owner_namespace_key",
      fields: ["ownerId", "namespace", "key"],
      unique: true,
    },
    {
      name: "expires_at",
      fields: ["expiresAt"],
    },
  ],
};

export const initializeSessionStorage = async (
  storage: StorageAdapter,
): Promise<void> => {
  if (
    !storage.capabilities.uniqueConstraints ||
    !storage.capabilities.conditionalWrites ||
    !storage.capabilities.atomicBatch
  ) {
    throw new Error(
      "Session storage requires unique constraints, conditional writes and atomic batches.",
    );
  }

  await storage.registerCollection(sessionCollection);
  await storage.registerCollection(sessionDataCollection);
};
