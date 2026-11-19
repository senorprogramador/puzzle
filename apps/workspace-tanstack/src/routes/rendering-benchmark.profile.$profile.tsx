import { createFileRoute } from "@tanstack/react-router";

import { BenchmarkCriticalContent } from "../components/rendering/benchmark-content";
import { BenchmarkShell } from "../components/rendering/benchmark-shell";
import {
  BenchmarkProfileExperience,
  type BenchmarkProfile,
} from "../components/rendering/benchmark-profile";

const profiles = [
  "conservative",
  "balanced",
  "aggressive",
  "custom",
] as const satisfies readonly BenchmarkProfile[];

const isBenchmarkProfile = (value: string): value is BenchmarkProfile =>
  profiles.some((profile) => profile === value);

const RenderingBenchmarkProfilePage = () => {
  const { profile } = Route.useParams();
  if (!isBenchmarkProfile(profile)) {
    return (
      <main>
        <h1>Unknown rendering profile</h1>
        <p>Choose conservative, balanced, aggressive, or custom.</p>
      </main>
    );
  }

  return (
    <BenchmarkShell scenario={profile}>
      <BenchmarkProfileExperience profile={profile}>
        <BenchmarkCriticalContent />
      </BenchmarkProfileExperience>
    </BenchmarkShell>
  );
};

export const Route = createFileRoute("/rendering-benchmark/profile/$profile")({
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
  component: RenderingBenchmarkProfilePage,
});
