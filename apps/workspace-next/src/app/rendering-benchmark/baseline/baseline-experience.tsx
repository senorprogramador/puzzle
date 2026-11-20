"use client";

import {
  BENCHMARK_SECTION_COUNT,
  BenchmarkCriticalContent,
  BenchmarkLongSection,
} from "../benchmark-content";
import BenchmarkDataTable from "../benchmark-panels";

export const BaselineExperience = () => (
  <>
    <BenchmarkCriticalContent />
    <div data-testid="benchmark-long-page">
      {Array.from({ length: BENCHMARK_SECTION_COUNT }, (_, index) => (
        <BenchmarkLongSection key={index} index={index} />
      ))}
    </div>
    <section
      id="benchmark-data-table"
      aria-labelledby="benchmark-table-heading"
    >
      <h2 id="benchmark-table-heading">Interactive project dataset</h2>
      <BenchmarkDataTable />
    </section>
  </>
);
