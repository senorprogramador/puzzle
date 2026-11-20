"use client";

import { DataTable } from "@puzzle-ui/ui";

type BenchmarkRecord = Readonly<{
  project: string;
  owner: string;
  stage: string;
  updated: string;
}>;

const records: BenchmarkRecord[] = Array.from({ length: 256 }, (_, index) => ({
  project: `Project ${String(index + 1).padStart(3, "0")}`,
  owner: `Team ${String((index % 16) + 1).padStart(2, "0")}`,
  stage: ["Planning", "In progress", "Review", "Complete"][index % 4]!,
  updated: `2026-${String((index % 12) + 1).padStart(2, "0")}-15`,
}));

const requestRecords = async (start: number, end: number) =>
  records.slice(start, end);

const renderRecord = (record: BenchmarkRecord) => [
  record.project,
  record.owner,
  record.stage,
  record.updated,
];

const getSortValue = (record: BenchmarkRecord, columnIndex: number) => {
  switch (columnIndex) {
    case 0:
      return record.project;
    case 1:
      return record.owner;
    case 2:
      return record.stage;
    case 3:
      return record.updated;
    default:
      return null;
  }
};

const getSearchValue = (record: BenchmarkRecord) =>
  `${record.project} ${record.owner} ${record.stage} ${record.updated}`;

const BenchmarkDataTable = () => (
  <div data-testid="benchmark-data-table-loaded">
    <DataTable
      aria-label="Rendering benchmark projects"
      data-testid="benchmark-data-table"
      numberOfItems={records.length}
      itemsPerPage={16}
      header={["Project", "Owner", "Stage", "Last updated"]}
      initialItems={records.slice(0, 16)}
      requestItems={requestRecords}
      searchable
      searchPlaceholder="Search benchmark records"
      getSearchValue={getSearchValue}
      defaultSort={{ columnIndex: 0, direction: "asc" }}
      getSortValue={getSortValue}
      renderCell={renderRecord}
    />
  </div>
);

export default BenchmarkDataTable;
