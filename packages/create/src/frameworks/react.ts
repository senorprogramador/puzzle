import { mkdir, writeFile } from "node:fs/promises";

import path from "node:path";

import type { FrameworkGenerator } from "../types";

const createReactProject: FrameworkGenerator = async (
  directory,
  _packageManager,
  _runner,
) => {
  await mkdir(path.join(directory, "src"), {
    recursive: true,
  });

  const packageJson = {
    name: path.basename(directory),
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc --noEmit -p tsconfig.app.json && vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@types/node": "latest",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "latest",
      typescript: "latest",
      vite: "latest",
    },
  };

  const files: Record<string, string> = {
    "package.json": JSON.stringify(packageJson, null, 2),

    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Puzzle App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    "tsconfig.json": JSON.stringify(
      {
        files: [],
        references: [
          { path: "./tsconfig.app.json" },
          { path: "./tsconfig.node.json" },
        ],
      },
      null,
      2,
    ),

    "tsconfig.app.json": JSON.stringify(
      {
        compilerOptions: {
          tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
          target: "ES2022",
          useDefineForClassFields: true,
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          verbatimModuleSyntax: true,
          moduleDetection: "force",
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          types: ["vite/client"],
        },
        include: ["src"],
      },
      null,
      2,
    ),

    "tsconfig.node.json": JSON.stringify(
      {
        compilerOptions: {
          tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
          target: "ES2023",
          lib: ["ES2023"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          verbatimModuleSyntax: true,
          moduleDetection: "force",
          noEmit: true,
          strict: true,
        },
        include: ["vite.config.ts"],
      },
      null,
      2,
    ),

    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`,

    "src/main.tsx": "",
    "src/App.tsx": "",
    "src/index.css": `* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family: var(--puzzle-font-family-body, sans-serif);
}`,
  };

  await Promise.all(
    Object.entries(files).map(([file, content]) =>
      writeFile(path.join(directory, file), content, "utf8"),
    ),
  );
};

export { createReactProject };
