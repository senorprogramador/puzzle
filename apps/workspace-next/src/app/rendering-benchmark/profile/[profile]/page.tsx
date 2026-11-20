import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BenchmarkShell } from "../../benchmark-shell";
import { BenchmarkCriticalContent } from "../../benchmark-content";
import { ProfileExperience } from "../profile-experience";

type BenchmarkProfile = "conservative" | "balanced" | "aggressive" | "custom";

const isBenchmarkProfile = (value: string): value is BenchmarkProfile =>
  value === "conservative" ||
  value === "balanced" ||
  value === "aggressive" ||
  value === "custom";

export const metadata: Metadata = {
  title: "Rendering optimization benchmark",
  description:
    "Compare server-rendered React content and an interactive project table.",
};

type RenderingBenchmarkProfilePageProps = Readonly<{
  params: Promise<{ profile: string }>;
}>;

const RenderingBenchmarkProfilePage = async ({
  params,
}: RenderingBenchmarkProfilePageProps) => {
  const { profile } = await params;
  if (!isBenchmarkProfile(profile)) notFound();

  return (
    <BenchmarkShell scenario={profile}>
      <ProfileExperience profile={profile}>
        <BenchmarkCriticalContent />
      </ProfileExperience>
    </BenchmarkShell>
  );
};

export default RenderingBenchmarkProfilePage;
