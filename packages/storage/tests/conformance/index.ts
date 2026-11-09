import { runAtomicBatchConformance } from "./atomic-batch.conformance";
import { runCapabilityConformance } from "./capabilities.conformance";
import { runConcurrencyConformance } from "./concurrency.conformance";
import { runConstraintConformance } from "./constraints.conformance";
import { runCrudConformance } from "./crud.conformance";
import { runPaginationConformance } from "./pagination.conformance";
import { runSerializationConformance } from "./serialization.conformance";
import type {
  ConformanceFixture,
  MigrationConformanceFixture,
} from "./storage-adapter.fixture";
import { runMigrationConformance } from "./migrations.conformance";

export const runStorageAdapterConformance = (fixture: ConformanceFixture) => {
  runCapabilityConformance(fixture.createAdapter);
  runCrudConformance(fixture.createAdapter, fixture.reset);
  runSerializationConformance(fixture.createAdapter, fixture.reset);
  runPaginationConformance(fixture.createAdapter, fixture.reset);
  runConcurrencyConformance(fixture.createAdapter, fixture.reset);
  runConstraintConformance(fixture.createAdapter, fixture.reset);
  runAtomicBatchConformance(fixture.createAdapter, fixture.reset);
};

export const runStorageMigrationConformance = (
  fixture: MigrationConformanceFixture,
) => {
  runMigrationConformance(fixture.createMigrationAdapter, fixture.reset);
};
