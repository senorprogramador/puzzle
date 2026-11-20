"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import {
  NextDeferredBoundary,
  NextFoldBoundary,
  NextFoldProvider,
  type NextDeferredComponentLoader,
} from "@puzzle-ui/ui/next/client";

const DeferredGallery = dynamic(() => import("./deferred-gallery"), {
  loading: () => (
    <p role="status" data-testid="gallery-loading">
      Loading gallery…
    </p>
  ),
});

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

type RenderingClientBoundariesProps = Readonly<{
  children: ReactNode;
}>;

export const RenderingClientBoundaries = ({
  children,
}: RenderingClientBoundariesProps) => {
  const [hydrated, setHydrated] = useState(false);
  const [failureRequested, setFailureRequested] = useState(false);
  const [mapRequested, setMapRequested] = useState(false);
  const failedLoadAttempts = useRef(0);
  const loadFailure = useCallback<
    NextDeferredComponentLoader<EmptyProps>
  >(async (signal) => {
    if (signal.aborted) throw signal.reason;

    failedLoadAttempts.current += 1;
    if (failedLoadAttempts.current === 1) {
      throw new Error("Simulated deferred resource failure");
    }
    return import("./deferred-gallery");
  }, []);
  const loadDeferredMap = useCallback<
    NextDeferredComponentLoader<EmptyProps>
  >(async (signal) => {
    if (signal.aborted) throw signal.reason;
    const response = await fetch("/favicon.ico?rendering-map-resource", {
      signal,
    });
    if (!response.ok) {
      throw new Error(`Map resource request failed with status ${response.status}.`);
    }
    return import("./deferred-map");
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <NextFoldProvider
      config={balancedProfileConfiguration}
      visibility={{ rootMargin: "0px" }}
    >
      <section data-testid="rendering-client-boundaries">
        <p data-testid="rendering-hydrated" data-hydrated={hydrated}>
          Client boundary hydrated: {String(hydrated)}
        </p>
        <NextFoldBoundary mode="ssr" strategy="eager" id="server-component-slot">
          {children}
          <NextFoldBoundary
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
            <DeferredGallery />
          </NextFoldBoundary>
        </NextFoldBoundary>
        <section data-testid="deferred-map-container">
          <button type="button" onClick={() => setMapRequested(true)}>
            Load interactive map
          </button>
          <NextDeferredBoundary
            strategy="manual"
            active={mapRequested}
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
        <section data-testid="optimization-profile-matrix">
          {Object.entries(optimizationProfileConfigurations).map(
            ([profile, profileConfiguration]) => (
            <NextFoldProvider key={profile} config={profileConfiguration}>
              <NextFoldBoundary
                id={`optimization-profile-${profile}`}
                data-testid={`optimization-profile-${profile}`}
              >
                <p data-testid={`optimization-profile-content-${profile}`}>
                  {profile} profile SSR content
                </p>
              </NextFoldBoundary>
              {profile === "aggressive" ? (
                <NextFoldBoundary
                  id="optimization-profile-critical"
                  componentHints={{ role: "hero" }}
                  fallback={<p>Critical content fallback</p>}
                >
                  <p data-testid="optimization-profile-critical">
                    Critical hero SSR content
                  </p>
                </NextFoldBoundary>
              ) : null}
            </NextFoldProvider>
            ),
          )}
        </section>
      </section>
      <section>
        <button
          type="button"
          onClick={() => setFailureRequested(true)}
        >
          Trigger deferred load error
        </button>
        <NextDeferredBoundary
          strategy="manual"
          active={failureRequested}
          load={loadFailure}
          componentProps={{}}
          fallback={<p>Deferred error scenario is idle.</p>}
          loadingFallback={<p role="status">Loading error scenario…</p>}
          errorFallback={(error, retry) => (
            <div role="alert" data-testid="deferred-load-error">
              <p>{error instanceof Error ? error.message : "Loading failed."}</p>
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
    </NextFoldProvider>
  );
};
