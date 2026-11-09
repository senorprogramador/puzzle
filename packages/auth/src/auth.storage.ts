import type {
  StorageAdapter,
  StorageCollection,
  StorageRecord,
} from "@puzzle-ui/storage";

import type { AuthUser } from "./types/user.types";
import type { PasswordCredentialStorageRecord } from "./types/credential.types";

export const AUTH_USER_COLLECTION = "auth_users";
export const AUTH_CREDENTIAL_COLLECTION = "auth_credentials";

export type AuthUserStorageRecord = AuthUser &
  StorageRecord & {
    readonly normalizedEmail: string;
  };

export const authUserCollection: StorageCollection<AuthUserStorageRecord> = {
  name: AUTH_USER_COLLECTION,
  indexes: [
    {
      name: "normalized_email_unique",
      fields: ["normalizedEmail"],
      unique: true,
    },
  ],
};

export const authCredentialCollection: StorageCollection<PasswordCredentialStorageRecord> =
  {
    name: AUTH_CREDENTIAL_COLLECTION,
    indexes: [
      {
        name: "user_kind_unique",
        fields: ["userId", "kind"],
        unique: true,
      },
      {
        name: "user_id",
        fields: ["userId"],
      },
    ],
  };

export type InitializeAuthStorageOptions = {
  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
};

export const initializeAuthStorage = async (
  storage: StorageAdapter,
  options: InitializeAuthStorageOptions = {},
): Promise<void> => {
  if (
    !storage.capabilities.uniqueConstraints ||
    !storage.capabilities.atomicBatch
  ) {
    throw new Error(
      "Authentication storage requires unique constraints and atomic batches.",
    );
  }

  await storage.registerCollection({
    ...authUserCollection,
    name: options.usersCollection ?? AUTH_USER_COLLECTION,
  });

  await storage.registerCollection({
    ...authCredentialCollection,
    name: options.credentialsCollection ?? AUTH_CREDENTIAL_COLLECTION,
  });
};
