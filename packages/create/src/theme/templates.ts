const nextProviders = `"use client";

import type { ReactNode } from "react";

import { Theme } from "@puzzle-ui/theme";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => (
  <Theme theme="system">
    {children}
  </Theme>
);

export { Providers };
`;

const nextLayout = `import "./globals.css";

import type { ReactNode } from "react";

import { Providers } from "./providers";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <Providers>
        {children}
      </Providers>
    </body>
  </html>
);

export default RootLayout;
`;

const nextPage = `"use client";
import { Button } from "@puzzle-ui/ui";

const HomePage = () => (
  <main style={{ padding: "2rem" }}>
    <h1>Welcome to Puzzle</h1>
    <p>Your new Puzzle application is ready.</p>

    <Button onClick={() => console.log("Hello, Puzzle!")}>
      Get started
    </Button>
  </main>
);

export default HomePage;
`;

const tanstackRootRoute = `import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Theme } from "@puzzle-ui/theme";

const RootComponent = () => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <Theme theme="system">
        <Outlet />
      </Theme>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  component: RootComponent,
});
`;

const tanstackIndexRoute = `import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@puzzle-ui/ui";

const HomePage = () => (
  <main style={{ padding: "2rem" }}>
    <h1>Welcome to Puzzle</h1>
    <p>Your new Puzzle application is ready.</p>

    <Button onClick={() => console.log("Hello, Puzzle!")}>
      Get started
    </Button>
  </main>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
`;

const reactMain = `import React from "react";
import ReactDOM from "react-dom/client";

import { Theme } from "@puzzle-ui/theme";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Theme theme="system">
      <App />
    </Theme>
  </React.StrictMode>,
);
`;

const reactApp = `import { Button } from "@puzzle-ui/ui";

const App = () => (
  <main style={{ padding: "2rem" }}>
    <h1>Welcome to Puzzle</h1>
    <p>Your new Puzzle application is ready.</p>

    <Button onClick={() => console.log("Hello, Puzzle!")}>
      Get started
    </Button>
  </main>
);

export default App;
`;

const themeTemplates = {
  next: {
    "src/app/providers.tsx": nextProviders,
    "src/app/layout.tsx": nextLayout,
    "src/app/page.tsx": nextPage,
  },
  tanstack: {
    "src/routes/__root.tsx": tanstackRootRoute,
    "src/routes/index.tsx": tanstackIndexRoute,
  },
  react: {
    "src/main.tsx": reactMain,
    "src/App.tsx": reactApp,
  },
} as const;

export {
  nextProviders,
  nextLayout,
  nextPage,
  tanstackRootRoute,
  tanstackIndexRoute,
  reactMain,
  reactApp,
  themeTemplates,
};
