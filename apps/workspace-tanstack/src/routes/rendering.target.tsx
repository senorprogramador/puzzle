import { createFileRoute } from "@tanstack/react-router";

import { TanStackStaticBoundary } from "@puzzle-ui/ui/tanstack/server";

const RenderingNavigationTarget = () => (
  <section>
    <TanStackStaticBoundary interactiveChildren="none">
      <h1 data-testid="rendering-navigation-target">
        Rendering navigation target
      </h1>
    </TanStackStaticBoundary>
  </section>
);

export const Route = createFileRoute("/rendering/target")({
  component: RenderingNavigationTarget,
});
