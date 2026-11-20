import { createFileRoute } from "@tanstack/react-router";

const RenderingErrorScenario = () => {
  throw new Error("Intentional TanStack rendering route error");
};

export const Route = createFileRoute("/rendering/error")({
  component: RenderingErrorScenario,
  errorComponent: ({ error, reset }) => (
    <section>
      <p role="alert" data-testid="tanstack-route-error">
        {error instanceof Error
          ? error.message
          : "Intentional TanStack rendering route error"}
      </p>
      <button type="button" onClick={reset}>
        Retry rendering route
      </button>
    </section>
  ),
});
