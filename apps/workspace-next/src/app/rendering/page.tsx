import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import {
  NextSsrBoundary,
  NextStaticBoundary,
} from "@puzzle-ui/ui/next/server";

import { RenderingClientBoundaries } from "./rendering-client";
import { RenderingServerContent } from "./server-content";

export const metadata: Metadata = {
  title: "Rendering adapter integration",
};

const StreamedServerContent = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 300));
  return <RenderingServerContent label="streamed" />;
};

const RenderingPage = async () => {
  await headers();

  return (
    <>
      <main data-testid="rendering-main-content">
        <h1 data-testid="rendering-hero">Server-rendered rendering test hero</h1>
        <NextStaticBoundary interactiveChildren="none">
          <RenderingServerContent label="static" />
        </NextStaticBoundary>
        <NextSsrBoundary
          resources={[
            { type: "image", url: "/favicon.ico", priority: "critical" },
          ]}
        >
          <RenderingServerContent label="ssr" />
        </NextSsrBoundary>
        <Suspense
          fallback={
            <p role="status" data-testid="streaming-fallback">
              Loading streamed server content…
            </p>
          }
        >
          <StreamedServerContent />
        </Suspense>
        {Array.from({ length: 16 }, (_, index) => (
          <section
            key={index}
            data-testid={`rendering-scroll-section-${index + 1}`}
          >
            <h2>Long page section {index + 1}</h2>
            <p>
              Server-rendered content keeps the page useful without JavaScript.
            </p>
          </section>
        ))}
        <section
          aria-labelledby="rendering-testimonials-heading"
          data-testid="rendering-testimonials"
        >
          <h2 id="rendering-testimonials-heading">Testimonials</h2>
          <blockquote>
            <p>
              Server-rendered content remains available while enhancements load.
            </p>
            <cite>Puzzle rendering test fixture</cite>
          </blockquote>
        </section>
        <RenderingClientBoundaries>
          <RenderingServerContent label="client-slot" />
        </RenderingClientBoundaries>
        <nav aria-label="Rendering test navigation">
          <Link href="/rendering/target">Open rendering navigation target</Link>
          <Link href="/rendering/error">Open rendering error scenario</Link>
        </nav>
      </main>
      <footer data-testid="rendering-footer">
        <p>Rendering integration test footer.</p>
      </footer>
    </>
  );
};

export default RenderingPage;
