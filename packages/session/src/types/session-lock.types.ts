import type { StorageRecord } from "@puzzle-ui/storage";

export type SessionUserLockRecord = StorageRecord & {
  readonly userId: string;
};
