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

const getInstallArguments = (
  packageManager: PackageManager,
  packages: string[],
) => {
  if (packageManager === "npm") {
    return ["install", "--save-dev", ...packages];
  }

  if (packageManager === "yarn") {
    return ["add", "--dev", ...packages];
  }

  return ["add", "-D", ...packages];
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
  const args = getInstallArguments(packageManager, packages);

  await runner(packageManager, args, {
    cwd: directory,
  });
};

export { installTailwind };
