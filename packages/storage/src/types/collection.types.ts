export type StorageCollection =
  | "users"
  | "credentials"
  | "externalAccounts"
  | "sessions"
  | "verificationTokens"
  | "mfaFactors"
  | "recoveryCodes";

export type StorageRecord = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
