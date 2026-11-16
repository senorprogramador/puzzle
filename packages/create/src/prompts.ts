import * as p from "@clack/prompts";

import { AUTH_DATABASES, FRAMEWORKS, isFullStackFramework } from "./constants";

import type { AuthDatabase, Framework, ProjectOptions } from "./types";

import { toKebabCase } from "./utils/kebab-case";

import { detectPackageManager } from "./utils/detect-package-manager";

const getProjectOptions = async (): Promise<ProjectOptions | null> => {
  p.intro("Create a Puzzle application");

  const name = await p.text({
    message: "What is the name of your project?",
    placeholder: "my-awesome-app",
    validate: (value) => {
      if (!value?.trim()) {
        return "Project name is required.";
      }

      if (!toKebabCase(value)) {
        return "Please enter a valid project name.";
      }
    },
  });

  if (p.isCancel(name)) {
    return null;
  }

  const directory = toKebabCase(name);

  const framework = await p.select({
    message: "Which framework would you like to use?",
    options: FRAMEWORKS.map((item) => ({
      value: item.value,
      label: item.label,
      hint: item.hint,
    })),
  });

  if (p.isCancel(framework)) {
    return null;
  }

  const tailwind = await p.confirm({
    message: "Would you like to install Tailwind CSS?",
    initialValue: true,
  });

  if (p.isCancel(tailwind)) {
    p.cancel("Project creation cancelled.");
    return null;
  }

  const auth = await p.confirm({
    message: "Would you like to add Puzzle Auth?",
    initialValue: false,
  });

  if (p.isCancel(auth)) {
    p.cancel("Project creation cancelled.");
    return null;
  }

  let database: AuthDatabase | undefined;

  if (auth && isFullStackFramework(framework as Framework)) {
    const selectedDatabase = await p.select({
      message: "Which database should Puzzle Auth use?",
      options: AUTH_DATABASES.map((item) => ({
        value: item.value,
        label: item.label,
        hint: item.hint,
      })),
    });

    if (p.isCancel(selectedDatabase)) {
      p.cancel("Project creation cancelled.");
      return null;
    }

    database = selectedDatabase as AuthDatabase;
  }

  return {
    name: directory,
    directory,
    framework: framework as Framework,
    packageManager: detectPackageManager(),
    tailwind,
    auth,
    ...(database ? { database } : {}),
  };
};

export { getProjectOptions };
