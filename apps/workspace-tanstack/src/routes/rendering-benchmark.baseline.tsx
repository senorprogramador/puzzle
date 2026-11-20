import { createFileRoute } from "@tanstack/react-router";

import {
  BENCHMARK_SECTION_COUNT,
  BenchmarkCriticalContent,
  BenchmarkLongSection,
} from "../components/rendering/benchmark-content";
import { BenchmarkShell } from "../components/rendering/benchmark-shell";
import BenchmarkDataTable from "../components/rendering/benchmark-panels";

const RenderingBenchmarkBaselinePage = () => (
  <BenchmarkShell scenario="baseline">
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
  </BenchmarkShell>
);

export const Route = createFileRoute("/rendering-benchmark/baseline")({
  head: () => ({
    meta: [
      { title: "Rendering optimization benchmark" },
      {
        name: "description",
        content:
          "Compare server-rendered React content and an interactive project table.",
      },
    ],
  }),
  component: RenderingBenchmarkBaselinePage,
});
