import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
  TanStackDeferredBoundary,
  TanStackFoldBoundary,
  TanStackFoldProvider,
} from "@puzzle-ui/ui/tanstack/client";
import {
  TanStackSsrBoundary,
  TanStackStaticBoundary,
} from "@puzzle-ui/ui/tanstack/server";
import type { TanStackDeferredComponentLoader } from "@puzzle-ui/ui/tanstack/shared";

type EmptyProps = Record<string, never>;

const optimizationProfileConfigurations = {
  conservative: { profile: "conservative" },
  balanced: { profile: "balanced" },
  aggressive: { profile: "aggressive" },
  custom: {
    profile: "custom",
    optimization: {
      rootMargin: "250px 0px",
      proximityThreshold: 0.25,
      prefetch: true,
      prefetchBudget: 2,
      resourceConcurrency: 2,
      maxConcurrentPrefetch: 1,
      adaptiveScheduling: false,
    },
  },
} as const;
const balancedProfileConfiguration = optimizationProfileConfigurations.balanced;

const getRenderingContent = createServerFn({ method: "GET" }).handler(
  async () => ({
    hero: "Server-rendered rendering test hero",
    staticContent: "Static content remains available without JavaScript.",
    ssrContent: "SSR-preserved rendering content.",
    serverOnlyMarker: "TANSTACK_SERVER_ONLY_RENDERING_SENTINEL",
  }),
);

const LazyGallery = lazy(() =>
  import("../components/rendering/deferred-gallery"),
);
const LazyStreamedContent = lazy(async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 1_000));
  return import("../components/rendering/streamed-content");
});

const loadDeferredMap: TanStackDeferredComponentLoader<EmptyProps> = async (
  signal,
) => {
  if (signal.aborted) throw signal.reason;
  const response = await fetch("/favicon.ico?rendering-map-resource", {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Map resource request failed with status ${response.status}.`);
  }
  return import("../components/rendering/deferred-map");
};

const RenderingPage = () => {
  const { hero, staticContent, ssrContent } = Route.useLoaderData();
  const [hydrated, setHydrated] = useState(false);
  const [failureRequested, setFailureRequested] = useState(false);
  const [mapRequested, setMapRequested] = useState(false);
  const failedLoadAttempts = useRef(0);
  const loadFailure = useCallback<
    TanStackDeferredComponentLoader<EmptyProps>
  >(async (signal) => {
    if (signal.aborted) throw signal.reason;

    failedLoadAttempts.current += 1;
    if (failedLoadAttempts.current === 1) {
      throw new Error("Simulated deferred resource failure");
    }
    return import("../components/rendering/deferred-gallery");
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <TanStackFoldProvider
      config={balancedProfileConfiguration}
      visibility={{ rootMargin: "0px" }}
    >
      <>
      <main data-testid="rendering-main-content">
        <h1 data-testid="rendering-hero">{hero}</h1>
        <TanStackStaticBoundary interactiveChildren="none">
          <p data-testid="rendering-static-content">{staticContent}</p>
        </TanStackStaticBoundary>
        <TanStackSsrBoundary
          resources={[
            { type: "image", url: "/favicon.ico", priority: "critical" },
          ]}
        >
          <p data-testid="rendering-ssr-content">{ssrContent}</p>
        </TanStackSsrBoundary>
        <Suspense
          fallback={
            <p role="status" data-testid="streaming-fallback">
              Loading streamed server content…
            </p>
          }
        >
          <LazyStreamedContent />
        </Suspense>
        {Array.from({ length: 16 }, (_, index) => (
          <section
            key={index}
            data-testid={`rendering-scroll-section-${index + 1}`}
          >
            <h2>Long page section {index + 1}</h2>
            <p>Server-rendered content keeps the page useful without JavaScript.</p>
          </section>
        ))}
        <section
          aria-labelledby="rendering-testimonials-heading"
          data-testid="rendering-testimonials"
        >
          <h2 id="rendering-testimonials-heading">Testimonials</h2>
          <blockquote>
            <p>Server-rendered content remains available while enhancements load.</p>
            <cite>Puzzle rendering test fixture</cite>
          </blockquote>
        </section>
        <section data-testid="rendering-client-boundaries">
          <p data-testid="rendering-hydrated" data-hydrated={hydrated}>
            Client boundary hydrated: {String(hydrated)}
          </p>
          <TanStackFoldBoundary
            mode="ssr"
            strategy="eager"
            id="server-content-slot"
          >
            <TanStackFoldBoundary
              mode="deferred"
              strategy="nearby"
              rootMargin="300px 0px"
              id="deferred-gallery"
              data-testid="deferred-gallery"
              fallback={
                <p role="status" data-testid="gallery-boundary-fallback">
                  Gallery will load when this section is visible.
                </p>
              }
            >
              <LazyGallery />
            </TanStackFoldBoundary>
          </TanStackFoldBoundary>
        </section>
        <section data-testid="deferred-map-container">
          <button type="button" onClick={() => setMapRequested(true)}>
            Load interactive map
          </button>
          <TanStackDeferredBoundary
            strategy="manual"
            active={mapRequested}
            rootMargin="0px"
            load={loadDeferredMap}
            componentProps={{}}
            fallback={
              <p role="status" data-testid="map-boundary-fallback">
                Map loads when this section is visible.
              </p>
            }
            loadingFallback={
              <p role="status" data-testid="map-loading">
                Loading interactive map…
              </p>
            }
            errorFallback={(_error, retry) => (
              <div role="alert" data-testid="map-error">
                <p>Interactive map could not be loaded.</p>
                <button type="button" onClick={retry}>
                  Retry map loading
                </button>
              </div>
            )}
            aspectRatio="16 / 9"
          />
        </section>
        <section>
          <button
            type="button"
            onClick={() => setFailureRequested(true)}
          >
            Trigger deferred load error
          </button>
          <TanStackDeferredBoundary
            strategy="manual"
            active={failureRequested}
            load={loadFailure}
            componentProps={{}}
            fallback={<p>Deferred error scenario is idle.</p>}
            loadingFallback={<p role="status">Loading error scenario…</p>}
            errorFallback={(error, retry) => (
              <div role="alert" data-testid="deferred-load-error">
                <p>
                  {error instanceof Error ? error.message : "Loading failed."}
                </p>
                <output data-testid="deferred-load-attempts">
                  {failedLoadAttempts.current}
                </output>
                <button type="button" onClick={retry}>
                  Retry failing load
                </button>
              </div>
            )}
          />
        </section>
        <section data-testid="optimization-profile-matrix">
          {Object.entries(optimizationProfileConfigurations).map(
            ([profile, profileConfiguration]) => (
              <TanStackFoldProvider
                key={profile}
                config={profileConfiguration}
              >
                <TanStackFoldBoundary
                  id={`optimization-profile-${profile}`}
                  data-testid={`optimization-profile-${profile}`}
                >
                  <p data-testid={`optimization-profile-content-${profile}`}>
                    {profile} profile SSR content
                  </p>
                </TanStackFoldBoundary>
                {profile === "aggressive" ? (
                  <TanStackFoldBoundary
                    id="optimization-profile-critical"
                    componentHints={{ role: "hero" }}
                    fallback={<p>Critical content fallback</p>}
                  >
                    <p data-testid="optimization-profile-critical">
                      Critical hero SSR content
                    </p>
                  </TanStackFoldBoundary>
                ) : null}
              </TanStackFoldProvider>
            ),
          )}
        </section>
        <nav aria-label="Rendering test navigation">
          <Link to="/rendering/target">Open rendering navigation target</Link>
          <Link to="/rendering/error">Open rendering error scenario</Link>
          <Link to="/">Leave rendering test</Link>
        </nav>
        <Outlet />
      </main>
      <footer data-testid="rendering-footer">
        <p>Rendering integration test footer.</p>
      </footer>
      </>
    </TanStackFoldProvider>
  );
};

export const Route = createFileRoute("/rendering")({
  loader: () => getRenderingContent(),
  component: RenderingPage,
});
