"use client";

import {
  TanStackDeferredBoundary,
  TanStackFoldBoundary,
  TanStackFoldProvider,
  useFoldOptimization,
  useFoldState,
  type TanStackDeferredComponentLoader,
} from "@puzzle-ui/ui/tanstack/client";
import type { ReactNode } from "react";

import {
  BENCHMARK_SECTION_COUNT,
  BenchmarkLongSection,
} from "./benchmark-content";

type BenchmarkProfile = "conservative" | "balanced" | "aggressive" | "custom";
type EmptyProps = Record<string, never>;

const profileConfigurations = {
  conservative: { profile: "conservative" },
  balanced: { profile: "balanced" },
  aggressive: { profile: "aggressive" },
  custom: {
    profile: "custom",
    optimization: {
      rootMargin: "300px 0px",
      prefetch: false,
      contentVisibility: true,
      adaptiveScheduling: false,
      intrinsicSizing: "metadata",
      deferredLoadingBehavior: "on-activation",
    },
  },
} as const;

const loadBenchmarkDataTable: TanStackDeferredComponentLoader<EmptyProps> =
  () => import("./benchmark-panels");

type BenchmarkProfileSettingsProps = Readonly<{
  profile: BenchmarkProfile;
}>;

const BenchmarkProfileSettings = ({
  profile,
}: BenchmarkProfileSettingsProps) => {
  const optimization = useFoldOptimization();
  const deferredTableState = useFoldState("benchmark-data-table-boundary");

  return (
    <output
      hidden
      data-testid="benchmark-profile-settings"
      data-profile={profile}
      data-root-margin={optimization.rootMargin}
      data-prefetch={String(optimization.prefetch)}
      data-adaptive-scheduling={String(optimization.adaptiveScheduling)}
      data-content-visibility={String(optimization.contentVisibility)}
      data-intrinsic-sizing={optimization.intrinsicSizing}
      data-deferred-loading={optimization.deferredLoadingBehavior}
      data-fold-state={deferredTableState.state}
      data-fold-visibility={deferredTableState.visibility}
      data-fold-activated={String(deferredTableState.isActivated)}
    />
  );
};

type BenchmarkProfileExperienceProps = Readonly<{
  profile: BenchmarkProfile;
  children: ReactNode;
}>;

export const BenchmarkProfileExperience = ({
  profile,
  children,
}: BenchmarkProfileExperienceProps) => (
  <TanStackFoldProvider config={profileConfigurations[profile]}>
    <BenchmarkProfileSettings profile={profile} />
    <TanStackFoldBoundary
      id="benchmark-critical-content"
      componentHints={{ role: "hero", seo: true }}
    >
      {children}
    </TanStackFoldBoundary>
    <TanStackFoldBoundary
      id="benchmark-many-boundaries-root"
      mode="ssr"
      strategy="nearby"
      componentHints={{
        role: "gallery",
        dimensions: {
          width: 960,
          height: BENCHMARK_SECTION_COUNT * 160,
        },
      }}
    >
      <div data-testid="benchmark-long-page">
        {Array.from({ length: BENCHMARK_SECTION_COUNT }, (_, index) => (
          <TanStackFoldBoundary
            key={index}
            id={`benchmark-boundary-${index}`}
            parentId="benchmark-many-boundaries-root"
            mode="ssr"
            strategy="nearby"
            data-testid={`benchmark-boundary-${index}`}
            componentHints={{
              role: "testimonials",
              dimensions: { width: 960, height: 160 },
            }}
          >
            <BenchmarkLongSection index={index} />
          </TanStackFoldBoundary>
        ))}
      </div>
    </TanStackFoldBoundary>
    <section
      id="benchmark-data-table"
      aria-labelledby="benchmark-table-heading"
    >
      <h2 id="benchmark-table-heading">Interactive project dataset</h2>
      <TanStackFoldBoundary
        id="benchmark-table-root"
        mode="ssr"
        strategy="eager"
        componentHints={{
          role: "gallery",
          dimensions: { width: 960, height: 960 },
        }}
      >
        <TanStackDeferredBoundary
          id="benchmark-data-table-boundary"
          parentId="benchmark-table-root"
          load={loadBenchmarkDataTable}
          componentProps={{}}
          minBlockSize="60rem"
          fallback={
            <p data-testid="benchmark-table-fallback">
              The interactive dataset loads near the viewport. The server
              summary above is always available.
            </p>
          }
          loadingFallback={
            <p role="status" data-testid="benchmark-table-loading">
              Loading interactive project data…
            </p>
          }
        />
      </TanStackFoldBoundary>
    </section>
  </TanStackFoldProvider>
);

export { type BenchmarkProfile };
