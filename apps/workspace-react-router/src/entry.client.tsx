import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { routes } from "./routes";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing the React Router application root.");
}

const router = createBrowserRouter(routes);

hydrateRoot(
  root,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
