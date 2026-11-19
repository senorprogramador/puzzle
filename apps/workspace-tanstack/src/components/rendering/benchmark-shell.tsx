import type { ReactNode } from "react";

type BenchmarkShellProps = Readonly<{
  scenario: string;
  children: ReactNode;
}>;

export const BenchmarkShell = ({ scenario, children }: BenchmarkShellProps) => (
  <>
    <header>
      <a href="/">Puzzle workspace</a>
    </header>
    <main data-testid="rendering-benchmark" data-scenario={scenario}>
      <h1>Rendering optimization benchmark</h1>
      <p data-testid="benchmark-hero">
        Compare normal React rendering with Puzzle rendering profiles using
        the same server-rendered content and interactive dataset.
      </p>
      <nav aria-label="Benchmark navigation">
        <a href="#benchmark-critical-content">Server-rendered overview</a>
        <a href="#benchmark-data-table">Interactive data table</a>
      </nav>
      {children}
    </main>
    <footer>
      <p>Rendering benchmark fixture.</p>
    </footer>
  </>
);
