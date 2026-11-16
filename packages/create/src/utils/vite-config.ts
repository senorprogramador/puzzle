/**
 * Prepends a plugin call to the `plugins` array of a Vite config while keeping
 * the array's existing inline or multiline layout.
 */
const prependVitePlugin = (config: string, plugin: string) =>
  config.replace(
    /plugins:\s*\[(\s*)/,
    (_match, whitespace: string) =>
      `plugins: [${whitespace}${plugin},${whitespace || " "}`,
  );

export { prependVitePlugin };
