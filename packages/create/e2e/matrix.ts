import { isFullStackFramework } from "../src/constants";
import type {
  AuthDatabase,
  Framework,
  ProjectConfiguration,
} from "../src/types";

export type Scaffold = {
  /** Unique, kebab-case name used for the project directory and test titles. */
  id: string;
  framework: Framework;
  tailwind: boolean;
  auth: boolean;
  database?: AuthDatabase;
};

const authVariants = (
  framework: Framework,
): { auth: boolean; database?: AuthDatabase }[] => [
  { auth: false },
  ...(isFullStackFramework(framework)
    ? (["mongodb", "d1", "custom"] as const).map((database) => ({
        auth: true,
        database,
      }))
    : [{ auth: true }]),
];

/**
 * Every combination of options the create CLI prompts for. The package
 * manager is detected from the invoking command, so the suite uses Bun.
 */
export const getScaffolds = (framework: Framework): Scaffold[] =>
  authVariants(framework).flatMap(({ auth, database }) =>
    [false, true].map((tailwind) => ({
      id: [
        framework,
        auth ? `auth-${database ?? "client"}` : "no-auth",
        tailwind ? "tailwind" : "css",
      ].join("-"),
      framework,
      tailwind,
      auth,
      ...(database ? { database } : {}),
    })),
  );

/**
 * Keeps scaffolds whose id contains one of the comma-separated values in
 * PUZZLE_E2E_FILTER, for example "tanstack-auth-d1,react-no-auth".
 */
export const selectScaffolds = (scaffolds: Scaffold[]) => {
  const filters = (process.env.PUZZLE_E2E_FILTER ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return filters.length === 0
    ? scaffolds
    : scaffolds.filter(({ id }) =>
        filters.some((filter) => id.includes(filter)),
      );
};

export const toProjectConfiguration = (
  scaffold: Scaffold,
): ProjectConfiguration => ({
  projectName: scaffold.id,
  framework: scaffold.framework,
  styling: scaffold.tailwind ? "tailwind" : "none",
  auth: scaffold.auth,
  ...(scaffold.database ? { database: scaffold.database } : {}),
  packageManager: "bun",
});
