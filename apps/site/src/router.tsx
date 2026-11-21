import { createRouter, Link } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    const recoveryKey = "puzzle:vite-preload-error";
    const failedResource = event.payload.message;

    if (window.sessionStorage.getItem(recoveryKey) === failedResource) return;

    window.sessionStorage.setItem(recoveryKey, failedResource);
    event.preventDefault();
    window.location.reload();
  });
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
          <Link to="/">Go home</Link>
        </div>
      );
    },
  });

  return router;
}
