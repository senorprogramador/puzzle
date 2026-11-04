import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/components/actions/button/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/components/actions/button/"!</div>;
}
