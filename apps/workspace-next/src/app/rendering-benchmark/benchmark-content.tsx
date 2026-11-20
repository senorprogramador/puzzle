const BENCHMARK_SECTION_COUNT = 24;

const BenchmarkCriticalContent = () => (
  <section
    id="benchmark-critical-content"
    data-testid="benchmark-critical-content"
    aria-labelledby="benchmark-critical-heading"
  >
    <h2 id="benchmark-critical-heading">Server-rendered overview</h2>
    <p>
      This summary is important content and remains available in server HTML
      for every rendering profile, including when JavaScript is disabled.
    </p>
    <img
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' fill='%23d4d4d8'/%3E%3C/svg%3E"
      width={120}
      height={80}
      alt="A neutral chart preview for the rendering benchmark"
    />
  </section>
);

const BenchmarkLongSection = ({ index }: Readonly<{ index: number }>) => (
  <section
    id={`benchmark-section-${index}`}
    data-testid={`benchmark-section-${index}`}
    aria-labelledby={`benchmark-section-heading-${index}`}
    style={{ minBlockSize: "10rem" }}
  >
    <h2 id={`benchmark-section-heading-${index}`}>
      Long-page section {index + 1}
    </h2>
    <p>
      Server-rendered project guidance remains readable while interactive
      controls are initialized. Section {index + 1} uses the same content in
      every benchmark scenario.
    </p>
  </section>
);

export { BENCHMARK_SECTION_COUNT, BenchmarkCriticalContent, BenchmarkLongSection };
