export type StorageCapabilities = {
  readonly transactions: boolean;
  readonly atomicBatch: boolean;
  readonly conditionalWrites: boolean;
  readonly uniqueConstraints: boolean;
  readonly upsert: boolean;
  readonly cursorPagination: boolean;
  readonly migrations: boolean;
  readonly ttlIndexes: boolean;
};

export type StorageCapability = keyof StorageCapabilities;

export type StorageCapabilityReport = {
  readonly capabilities: StorageCapabilities;
  readonly limitations?: readonly string[];
};

export const DEFAULT_STORAGE_CAPABILITIES: StorageCapabilities = {
  transactions: false,
  atomicBatch: false,
  conditionalWrites: false,
  uniqueConstraints: false,
  upsert: false,
  cursorPagination: false,
  migrations: false,
  ttlIndexes: false,
};
