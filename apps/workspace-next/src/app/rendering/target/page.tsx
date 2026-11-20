import { NextStaticBoundary } from "@puzzle-ui/ui/next/server";

const RenderingNavigationTarget = () => (
  <main>
    <NextStaticBoundary interactiveChildren="none">
      <h1 data-testid="rendering-navigation-target">
        Rendering navigation target
      </h1>
    </NextStaticBoundary>
  </main>
);

export default RenderingNavigationTarget;
