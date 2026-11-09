export type StorageCapabilities = {
  readonly transactions: boolean;
  readonly atomicBatch: boolean;
  readonly conditionalWrites: boolean;
  readonly uniqueConstraints: boolean;
  readonly upsert: boolean;
};

export type StorageCapability = keyof StorageCapabilities;
