export type {
  StorageScalar,
  StorageRecord,
  StorageCollectionName,
  StorageField,
  StorageCollectionOptions,
  StorageCollection,
  StorageSchema,
  StorageIndex,
} from "./types/collection.types";

export type {
  StorageComparison,
  StorageWhere,
  StorageOrder,
  StorageQuery,
  StorageCursor,
  StorageCursorQuery,
  StoragePage,
} from "./types/query.types";

export type {
  StorageCapabilities,
  StorageCapability,
  StorageCapabilityReport,
} from "./types/capabilities.types";

export { DEFAULT_STORAGE_CAPABILITIES } from "./types/capabilities.types";

export type {
  StorageInsert,
  StorageUpdate,
  StorageCondition,
  StorageBatchOperation,
  StorageBatchResult,
  StorageAdapterOptions,
  StorageAdapter,
} from "./types/adapter.types";

export type {
  StorageMigrationContext,
  StorageMigrationOperation,
  StorageMigration,
  StorageMigrationStatus,
  StorageMigrationRecord,
  StorageMigrationResult,
  StorageMigrationOptions,
  StorageMigrationAdapter,
} from "./types/migration.types";

export type {
  StorageSchemaRegistry,
  StorageIndexDefinition,
  StorageSchemaAdapter,
} from "./types/schema.types";

export {
  StorageError,
  StorageCapabilityError,
  StorageConflictError,
  StorageDuplicateError,
  StorageValidationError,
  StorageAtomicityError,
} from "./errors/storage.errors";

export { validateQuery, validateWhere } from "./utils/query.utils";
