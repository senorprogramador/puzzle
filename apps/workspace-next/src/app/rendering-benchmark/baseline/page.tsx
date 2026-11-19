import type { Metadata } from "next";

import { BenchmarkShell } from "../benchmark-shell";
import { BaselineExperience } from "./baseline-experience";

export const metadata: Metadata = {
  title: "Rendering optimization benchmark",
  description:
    "Compare server-rendered React content and an interactive project table.",
};

const RenderingBenchmarkBaselinePage = () => (
  <BenchmarkShell scenario="baseline">
    <BaselineExperience />
  </BenchmarkShell>
);

export default RenderingBenchmarkBaselinePage;
