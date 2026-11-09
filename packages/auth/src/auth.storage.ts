import type {
  StorageAdapter,
  StorageCollection,
  StorageRecord,
} from "@puzzle-ui/storage";

import type { AuthUser } from "./types/user.types";
import type { PasswordCredentialStorageRecord } from "./types/credential.types";
import type {
  AuthActionTokenStorageRecord,
  AuthAuditEventStorageRecord,
  AuthRateLimitStorageRecord,
} from "./types/auth-lifecycle.types";

export const AUTH_USER_COLLECTION = "auth_users";
export const AUTH_CREDENTIAL_COLLECTION = "auth_credentials";
export const AUTH_ACTION_TOKEN_COLLECTION = "auth_action_tokens";
export const AUTH_AUDIT_COLLECTION = "auth_audit_events";
export const AUTH_RATE_LIMIT_COLLECTION = "auth_rate_limits";

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

export const authActionTokenCollection: StorageCollection<AuthActionTokenStorageRecord> =
  {
    name: AUTH_ACTION_TOKEN_COLLECTION,
    indexes: [
      {
        name: "token_hash_unique",
        fields: ["tokenHash"],
        unique: true,
      },
      {
        name: "user_purpose",
        fields: ["userId", "purpose"],
      },
      {
        name: "token_expiration",
        fields: ["expiresAt"],
      },
    ],
  };

export const authAuditCollection: StorageCollection<AuthAuditEventStorageRecord> =
  {
    name: AUTH_AUDIT_COLLECTION,
    indexes: [
      {
        name: "user_created",
        fields: ["userId", "createdAt"],
      },
      {
        name: "action_created",
        fields: ["action", "createdAt"],
      },
    ],
  };

export const authRateLimitCollection: StorageCollection<AuthRateLimitStorageRecord> =
  {
    name: AUTH_RATE_LIMIT_COLLECTION,
    indexes: [
      {
        name: "rate_limit_reset",
        fields: ["resetAt"],
      },
    ],
  };

export type InitializeAuthStorageOptions = {
  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
  readonly actionTokensCollection?: string;
  readonly auditCollection?: string;
  readonly rateLimitsCollection?: string;
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

  await storage.registerCollection({
    ...authActionTokenCollection,
    name: options.actionTokensCollection ?? AUTH_ACTION_TOKEN_COLLECTION,
  });

  await storage.registerCollection({
    ...authAuditCollection,
    name: options.auditCollection ?? AUTH_AUDIT_COLLECTION,
  });

  await storage.registerCollection({
    ...authRateLimitCollection,
    name: options.rateLimitsCollection ?? AUTH_RATE_LIMIT_COLLECTION,
  });
};
