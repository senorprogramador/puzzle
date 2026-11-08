import type { CommandRunner, Framework, PackageManager } from "../types";

const getTailwindPackages = (framework: Framework) => {
  if (framework === "next") {
    return [
      "tailwindcss@latest",
      "@tailwindcss/postcss@latest",
      "postcss@latest",
    ];
  }

  return ["tailwindcss@latest", "@tailwindcss/vite@latest"];
};

const installTailwind = async ({
  directory,
  framework,
  packageManager,
  runner,
}: {
  directory: string;
  framework: Framework;
  packageManager: PackageManager;
  runner: CommandRunner;
}) => {
  const packages = getTailwindPackages(framework);

  if (packageManager === "bun") {
    await runner("bun", ["add", "-d", ...packages], { cwd: directory });

    return;
  }

  await runner("npm", ["install", "--save-dev", ...packages], {
    cwd: directory,
  });
};

export { installTailwind };
